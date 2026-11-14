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
import { afterLoadIdle, isPhone } from "@/lib/gpu";
import { WARP, WARP_TOTAL, destKey, holdWarp, motionBus, type WarpDir } from "@/lib/warp";

const COUNT = 260;
const FAR = 11000;
const NEAR = 200;
const FOCUS = 1000;
const CRUISE = 100; // world units / s on contacts (the old contacts drift)
const SURGE = 14000; // world units / s at warp peak
const RUN_GAIN = 6; // world units per px of camera travel on home
const TRAIL_FADE = 0.18; // per-frame fade of the previous frame: the trail length

const A_STEPS = 10; // alpha levels the stars are batched into (0..0.7)
type Bucket = { accent: boolean; a: number; size: number; trail: number[]; dot: number[]; used: boolean };
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
  const arriveRef = useRef<() => void>(() => {});
  const pathname = usePathname();
  // a route change (warp or not) settles the field's presence for the new route
  useEffect(() => { holdWarp(); arriveRef.current(); wakeRef.current(); }, [pathname]);

  // the canvas context is a GPU command buffer (~100 ms of main thread to create): it waits for load and an idle
  // slot (lib/gpu), so it never lands in hydration; the field fades in through its presence ramp anyway
  useEffect(() => {
    const start = () => {
      const canvas = ref.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

      const stars: Star[] = Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        z: -Math.random() * (FAR - NEAR) - NEAR,
        accent: Math.random() < 0.28,
      }));

      let w = 0, h = 0;
      const resize = () => {
        const dpr = isPhone() ? 1 : Math.min(window.devicePixelRatio || 1, 2); // 1x on phones: a full-screen 2x canvas is 4x the fill
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        stars.forEach((s) => { s.px = undefined; });
      };
      resize();

      let base = "", accent = "";
      const readInks = () => {
        const css = getComputedStyle(document.documentElement);
        base = css.getPropertyValue("--foreground").trim();
        accent = css.getPropertyValue("--tech-blue-light").trim();
      };
      readInks();

      let raf = 0, last = 0, frame = 0;
      const buckets = new Map<number, Bucket>();
      let pulseT0 = -1e9, dir: WarpDir = "fwd";
      // the surge holds at full travel until the new route has rendered (a slow fetch no longer lands the page
      // after the stars have already settled); HOLD_MAX caps the wait
      let awaiting = false;
      const HOLD_MAX = 1600;
      const PLATEAU_END = WARP.exit + WARP.travel;
      arriveRef.current = () => {
        if (!awaiting) return;
        awaiting = false;
        const t = performance.now() - pulseT0;
        if (t > PLATEAU_END) pulseT0 = performance.now() - PLATEAU_END;
      };
      let presence = 0;

      const restHere = () => {
        const k = destKey(location.pathname);
        return k === "" || k === "contacts";
      };

      // phones draw the field at 30 fps (a full-screen 2D pass each frame was most of a phone's contacts budget);
      // the trail fade is per elapsed time, so the streaks keep their length at either rate
      const minStep = isPhone() ? 1000 / 30 - 2 : 0;
      const draw = (now: number) => {
        raf = 0;
        if (document.hidden) return;
        if (last && now - last < minStep) { raf = requestAnimationFrame(draw); return; }
        const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
        last = now;
        if (++frame % 60 === 0) readInks();

        let tp = now - pulseT0;
        if (awaiting && tp > PLATEAU_END) {
          if (tp < PLATEAU_END + HOLD_MAX) tp = PLATEAU_END;
          else awaiting = false;
        }
        const pulse = reduce.matches ? 0 : envelope(tp / WARP_TOTAL);
        const k = destKey(location.pathname);
        const cruise = k === "contacts" && !reduce.matches ? CRUISE : 0;
        const run = k === "" && !reduce.matches ? motionBus.runVelocity * RUN_GAIN : 0;
        const speed = cruise + run + pulse * SURGE * (dir === "back" ? -1 : 1);

        const target = restHere() ? 1 : pulse;
        presence += (target - presence) * Math.min(1, dt * 6);

        // fade the previous frame toward transparent: that residue is the trail
        ctx.globalCompositeOperation = "destination-out";
        const fade = TRAIL_FADE + (1 - Math.min(1, Math.abs(speed) / 2000)) * 0.5; // per 60 fps frame
        ctx.fillStyle = `rgba(0,0,0,${reduce.matches ? 1 : (1 - Math.pow(1 - fade, dt * 60)).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";

        const cx = w / 2, cy = h / 2;
        const dz = speed * dt;
        // stars batch by ink, alpha step and width step into a handful of paths: one stroke/fill per bucket, not
        // one per star (260 state changes and draw calls a frame were most of a phone's frame on contacts)
        buckets.forEach((b) => { b.used = false; b.trail.length = 0; b.dot.length = 0; });
        for (const s of stars) {
          s.z += dz;
          let wrapped = false;
          if (s.z > -NEAR) { s.z -= FAR - NEAR; wrapped = true; }
          else if (s.z < -FAR) { s.z += FAR - NEAR; wrapped = true; }
          const sc = FOCUS / -s.z;
          const x = s.x * sc + cx, y = s.y * sc + cy;
          if (wrapped || x < -100 || x > w + 100 || y < -100 || y > h + 100) { s.px = undefined; continue; }
          const size = Math.max(0.3, Math.min(2.8, 1.35 * sc));
          const fog = 1 - -s.z / FAR;
          const nearFade = Math.max(0, Math.min(1, (-s.z - 50) / 150));
          const a = Math.min(0.55, 0.6 * fog * nearFade) * presence * (s.accent ? 1.25 : 0.85);
          if (a <= 0.01) { s.px = undefined; continue; }
          const ai = Math.min(A_STEPS, Math.round(a * A_STEPS / 0.7)), si = Math.round(size * 4);
          const key = (s.accent ? 1 : 0) + ai * 2 + si * 64;
          let b = buckets.get(key);
          if (!b) { b = { accent: s.accent, a: (ai * 0.7) / A_STEPS, size: si / 4, trail: [], dot: [], used: false }; buckets.set(key, b); }
          b.used = true;
          if (s.px !== undefined && s.py !== undefined && Math.hypot(x - s.px, y - s.py) < 300) b.trail.push(s.px, s.py, x, y);
          else b.dot.push(x, y);
          s.px = x; s.py = y;
        }
        ctx.lineCap = "round";
        buckets.forEach((b) => {
          if (!b.used || b.a <= 0) return;
          const col = b.accent ? accent : base;
          ctx.globalAlpha = b.a;
          if (b.trail.length) {
            ctx.strokeStyle = col; ctx.lineWidth = b.size * 2;
            ctx.beginPath();
            for (let i = 0; i < b.trail.length; i += 4) { ctx.moveTo(b.trail[i], b.trail[i + 1]); ctx.lineTo(b.trail[i + 2], b.trail[i + 3]); }
            ctx.stroke();
          }
          if (b.dot.length) {
            ctx.fillStyle = col;
            ctx.beginPath();
            for (let i = 0; i < b.dot.length; i += 2) { ctx.moveTo(b.dot[i] + b.size, b.dot[i + 1]); ctx.arc(b.dot[i], b.dot[i + 1], b.size, 0, Math.PI * 2); }
            ctx.fill();
          }
        });
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
        awaiting = true;
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
    };
    let dispose: (() => void) | undefined;
    const cancel = afterLoadIdle(() => { dispose = start(); });
    return () => { cancel(); dispose?.(); };
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
