"use client";
// Route warp streaks. A fixed canvas that is empty at rest: a navigation fires one velocity pulse
// (lib/warp.ts "warp" event) and points in a 3D field stream past the camera along the jump's heading,
// drawn as short streaks whose length follows the speed. Two ink plates (blue, rose) print each streak
// a hair off register (≤3px at peak), the only riso trace, and only while moving.
// Reduced motion: never draws. Hidden tab: no frames. The loop stops itself when the pulse ends.
// Client boundary: mounted once in layout.tsx, outside the view-transition slot (its own transition name).
import { useEffect, useRef } from "react";
import { WARP, WARP_TOTAL, type Heading, type WarpDir } from "@/lib/warp";

const COUNT = 150;
const SPREAD = 1600; // world half-width of the field
const FAR = 2400; // world depth
const FOCAL = 520;
const PEAK = 90; // world units per frame at peak speed
const OFFSET = 3; // px plate misregister at peak

type P = { x: number; y: number; z: number };

// speed envelope over the pulse: ease up through the exit, hold briefly, ease down into the arrival
function envelope(t: number) {
  const a = WARP.exit / WARP_TOTAL, b = (WARP.exit + WARP.travel) / WARP_TOTAL;
  if (t <= 0 || t >= 1) return 0;
  if (t < a) { const u = t / a; return u * u * u; }
  if (t < b) return 1;
  const u = (t - b) / (1 - b);
  return 1 - (1 - Math.pow(1 - u, 3));
}

export default function WarpField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 2 * SPREAD,
      y: (Math.random() - 0.5) * 2 * SPREAD,
      z: Math.random() * FAR + 1,
    }));
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const css = getComputedStyle(document.documentElement);
    const ink = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;
    const plateA = ink("--ink-blue", "currentColor");
    const plateB = ink("--ink-rose", "currentColor");

    let raf = 0, t0 = 0, dir: WarpDir = "fwd", hd: Heading = { x: 0, y: 0 };

    const draw = (now: number) => {
      const t = (now - t0) / WARP_TOTAL;
      const v = envelope(t);
      ctx.clearRect(0, 0, w, h);
      if (t >= 1 || document.hidden) { raf = 0; return; }
      const sgn = dir === "back" ? -1 : 1;
      const step = PEAK * v * sgn;
      // the vanishing point leans toward the heading, so each route pair travels its own way
      const cx = w / 2 + hd.x * 0.25 * w, cy = h / 2 + hd.y * 0.25 * h;
      const off = OFFSET * v;
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.min(1, v * 1.4) * 0.38;
      for (const plate of [plateA, plateB]) {
        const o = plate === plateA ? -off : off;
        ctx.strokeStyle = plate;
        ctx.beginPath();
        for (const p of pts) {
          const z1 = p.z, z0 = p.z + step * 2.2; // tail sits where the point was a little earlier
          if (z1 <= 1 || z0 <= 1) continue;
          const x1 = cx + (p.x / z1) * FOCAL, y1 = cy + (p.y / z1) * FOCAL;
          const x0 = cx + (p.x / z0) * FOCAL, y0 = cy + (p.y / z0) * FOCAL;
          ctx.moveTo(x0 + o, y0); ctx.lineTo(x1 + o, y1);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (const p of pts) {
        p.z -= step;
        if (p.z < 1) p.z += FAR;
        else if (p.z > FAR) p.z -= FAR;
      }
      raf = requestAnimationFrame(draw);
    };

    const onWarp = (e: Event) => {
      if (reduce.matches) return;
      const d = (e as CustomEvent<{ dir: WarpDir; heading: Heading }>).detail;
      dir = d?.dir ?? "fwd";
      hd = d?.heading ?? { x: 0, y: 0 };
      t0 = performance.now();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("warp", onWarp);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("warp", onWarp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="warp-field"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, viewTransitionName: "warp-field" }}
    />
  );
}
