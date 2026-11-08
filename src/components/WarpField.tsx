"use client";
// One star field for the whole site: trailed dots in a 3D field ahead of the camera (ported from the contacts
// StarField). Three things drive its speed along Z:
//   · contacts: a slow constant cruise (the old contacts spread);
//   · home: the print-run camera's velocity (lib/warp.ts `motionBus.runVelocity`, written by PrintRun), so
//     scrolling the journey streams the stars past;
//   · any route change: one warp pulse ("warp" event) that surges and settles, reversed for Back.
// Stars are visible at rest on home and contacts; elsewhere they appear only for the warp and fade back out.
// Trails come from fading the previous frame to transparent (destination-out), so the aurora behind stays.
// Reduced motion: static dots on home/contacts, no surge. Hidden tab: no frames.
// Client boundary: mounted once in layout.tsx, outside the view-transition slot (own transition name).
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { WARP, WARP_TOTAL, destKey, motionBus, type WarpDir } from "@/lib/warp";

const COUNT = 200;
const FAR = 11000;
const NEAR = 200;
const FOCUS = 1000;
const CRUISE = 100; // world units / s on contacts (the old contacts drift)
const SURGE = 14000; // world units / s at warp peak
const RUN_GAIN = 6; // world units per px of camera travel on home
const TRAIL_FADE = 0.18; // per-frame fade of the previous frame: the trail length

type Star = { x: number; y: number; z: number; accent: boolean; px?: number; py?: number };

function envelope(t: number) {
  const a = WARP.exit / WARP_TOTAL, b = (WARP.exit + WARP.travel) / WARP_TOTAL;
  if (t <= 0 || t >= 1) return 0;
  if (t < a) { const u = t / a; return u * u * u; }
  if (t < b) return 1;
  const u = (t - b) / (1 - b);
  return Math.pow(1 - u, 3);
}

export default function WarpField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<() => void>(() => {});
  const pathname = usePathname();
  // a route change (warp or not) settles the field's presence for the new route
  useEffect(() => { wakeRef.current(); }, [pathname]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 4000,
      y: (Math.random() - 0.5) * 4000,
      z: -Math.random() * (FAR - NEAR) - NEAR,
      accent: Math.random() < 0.2,
    }));

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.forEach((s) => { s.px = undefined; });
    };
    resize();

    let base = "", accent = "";
    const readInks = () => {
      const css = getComputedStyle(document.documentElement);
      base = css.getPropertyValue("--ink-black").trim() || "#313131";
      accent = css.getPropertyValue("--ink-blue").trim() || "#00A8FF";
    };
    readInks();

    let raf = 0, last = 0, frame = 0;
    let pulseT0 = -1e9, dir: WarpDir = "fwd";
    let presence = 0;

    const restHere = () => {
      const k = destKey(location.pathname);
      return k === "" || k === "contacts";
    };

    const draw = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      if (++frame % 60 === 0) readInks();

      const pulse = reduce.matches ? 0 : envelope((now - pulseT0) / WARP_TOTAL);
      const k = destKey(location.pathname);
      const cruise = k === "contacts" && !reduce.matches ? CRUISE : 0;
      const run = k === "" && !reduce.matches ? motionBus.runVelocity * RUN_GAIN : 0;
      const speed = cruise + run + pulse * SURGE * (dir === "back" ? -1 : 1);

      const target = restHere() ? 1 : pulse;
      presence += (target - presence) * Math.min(1, dt * 6);

      // fade the previous frame toward transparent: that residue is the trail
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${reduce.matches ? 1 : TRAIL_FADE + (1 - Math.min(1, Math.abs(speed) / 2000)) * 0.5})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const cx = w / 2, cy = h / 2;
      const dz = speed * dt;
      for (const s of stars) {
        s.z += dz;
        let wrapped = false;
        if (s.z > -NEAR) { s.z -= FAR - NEAR; wrapped = true; }
        else if (s.z < -FAR) { s.z += FAR - NEAR; wrapped = true; }
        const sc = FOCUS / -s.z;
        const x = s.x * sc + cx, y = s.y * sc + cy;
        if (wrapped || x < -100 || x > w + 100 || y < -100 || y > h + 100) { s.px = undefined; continue; }
        const size = Math.max(0.3, Math.min(2.5, 1.2 * sc));
        const fog = 1 - -s.z / FAR;
        const nearFade = Math.max(0, Math.min(1, (-s.z - 50) / 150));
        const a = Math.min(0.4, 0.45 * fog * nearFade) * presence * (s.accent ? 1.2 : 0.8);
        if (a <= 0.01) { s.px = undefined; continue; }
        ctx.globalAlpha = a;
        const col = s.accent ? accent : base;
        if (s.px !== undefined && s.py !== undefined && Math.hypot(x - s.px, y - s.py) < 300) {
          ctx.strokeStyle = col; ctx.lineWidth = size * 2; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(x, y); ctx.stroke();
        } else {
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
        }
        s.px = x; s.py = y;
      }
      ctx.globalAlpha = 1;

      // keep running while anything moves or is still visible; otherwise stop until woken
      const moving = Math.abs(speed) > 0.5 || Math.abs(presence - target) > 0.01;
      if (moving) raf = requestAnimationFrame(draw);
      else last = 0;
    };

    const wake = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(draw); };
    const onWarp = (e: Event) => {
      const d = (e as CustomEvent<{ dir: WarpDir }>).detail;
      dir = d?.dir ?? "fwd";
      pulseT0 = performance.now();
      wake();
    };
    // the home camera moves on scroll; the route can change without a warp (first load, hard links)
    const onScroll = () => wake();
    const onVis = () => { if (!document.hidden) { last = 0; wake(); } };
    const ro = new MutationObserver(() => { readInks(); wake(); });
    ro.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("warp", onWarp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("popstate", wake);
    document.addEventListener("visibilitychange", onVis);
    wakeRef.current = wake;
    wake();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("warp", onWarp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("popstate", wake);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="warp-field"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, viewTransitionName: "warp-field" }}
    />
  );
}
