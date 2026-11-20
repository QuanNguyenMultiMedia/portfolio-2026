"use client";
// BonsaiBlob, from herondlabs/dename-landing-page src/BonsaiBlob.tsx, ported. On the site scroll is its only clock;
// here the reveal plays once on arrival and then belongs to the rail. The tree is cut on a detection lattice
// traced from its own alpha; each cell locks on in hard, halving steps as the wavefront out of the trunk passes it,
// then drifts and zooms its own slice of the picture, a third of the cells at a time.
import { useEffect, useRef, useState } from "react";
import { bonsaiGrid } from "./bonsaiGrid";
import "./dename.css";

const IW = 764, IH = 703, PAD = 260, R = 2;
const base = { x: 400, y: 700 };

type Seg = { x0: number; y0: number; x1: number; y1: number };
const segs: Seg[] = [...bonsaiGrid.lines.matchAll(/M([\d.]+) ([\d.]+)([HV])([\d.]+)/g)].map(([, a, b, k, c]) =>
  k === "H" ? { x0: +a, y0: +b, x1: +c, y1: +b } : { x0: +a, y0: +b, x1: +a, y1: +c });
const rows = [...new Set(segs.filter((s) => s.y0 === s.y1 && s.x1 - s.x0 > 400).map((s) => s.y0))].sort((a, b) => a - b);
const cols = [...new Set(segs.filter((s) => s.x0 === s.x1).map((s) => s.x0))].sort((a, b) => a - b);
const covers = (x: number, y: number) => segs.some((s) => s.x0 === s.x1 && Math.abs(s.x0 - x) < 0.5 && s.y0 <= y && s.y1 >= y);
const cells = rows.slice(0, -1).flatMap((y, r) => cols.slice(0, -1).map((x, c) => ({ x, y, w: cols[c + 1] - x, h: rows[r + 1] - y })))
  .filter((c) => covers(c.x, c.y + c.h / 2) && covers(c.x + c.w, c.y + c.h / 2))
  .map((c, i) => ({ ...c, ph: [i * 2.39, i * 1.71 + 1, i * 0.93 + 2], dir: (i * 2.39) % (Math.PI * 2) }));
const far = Math.max(...cells.map((c) => Math.hypot(c.x + c.w / 2 - base.x, c.y + c.h / 2 - base.y)));
const near = (x: number, y: number) => Math.hypot(x - base.x, y - base.y) / far;
const front = (p: number, d: number, soft = 0.4) => Math.min(1, Math.max(0, (p * (1 + soft) - d) / soft));
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export default function Bonsai() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reveal = useRef(0);
  const [p, setP] = useState(0);
  const held = useRef(false);

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(cv);
    const chartreuse = css.getPropertyValue("--dn-chartreuse").trim();
    const hair = css.getPropertyValue("--dn-mist").trim();
    const img = new Image();
    img.src = "/showcase/dename/bonsai.webp";
    const pad = document.createElement("canvas");
    pad.width = (IW + PAD * 2) * R; pad.height = (IH + PAD * 2) * R;
    let ready = false;
    img.onload = () => { pad.getContext("2d")!.drawImage(img, PAD * R, PAD * R, IW * R, IH * R); ready = true; };
    let k = 1;
    const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); k = cv.width / IW; };
    const ro = new ResizeObserver(size); ro.observe(cv); size();

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      const p = reveal.current;
      if (!ready || p <= 0) return;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      // outside the lattice: the picture uncovered by a disc growing out of the trunk's foot
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, IW, IH); for (const c of cells) ctx.rect(c.x, c.y, c.w, c.h);
      ctx.clip("evenodd"); ctx.beginPath(); ctx.arc(base.x, base.y, p * 1.25 * far * 1.3, 0, Math.PI * 2); ctx.clip();
      ctx.globalAlpha = 0.85; ctx.drawImage(pad, PAD * R, PAD * R, IW * R, IH * R, 0, 0, IW, IH); ctx.restore();
      { const rr = p * 1.25 * far * 1.3, a = Math.max(0, 1 - p * 2.2);
        if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = chartreuse; ctx.lineWidth = (2 + 6 * a) / Math.sqrt(k); ctx.beginPath(); ctx.arc(base.x, base.y, Math.max(rr, 4), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } }
      for (const c of cells) {
        const r = front(p, near(c.x + c.w / 2, c.y + c.h / 2));
        if (r <= 0) continue;
        const q = 1 - Math.floor(r * 5) / 5;
        const throwX = Math.cos(c.dir) * c.w * 0.9 * q * q, throwY = (Math.sin(c.dir) * 0.4 + 0.8) * c.h * q * q;
        const g = still ? 0 : smooth(0.35, 0.85, 0.5 + 0.5 * Math.sin(t * 0.12 + c.ph[0]));
        const s = 1 + g * 0.35 + q * 0.35;
        const dx = g * c.w * 0.28 * Math.sin(t * 0.18 + c.ph[1]) + throwX;
        const dy = g * c.h * 0.2 * Math.cos(t * 0.15 + c.ph[2]) + throwY;
        const sw = c.w / s, sh = c.h / s;
        ctx.globalAlpha = 0.85 * Math.min(1, r * 3);
        ctx.drawImage(pad, (PAD + c.x + (c.w - sw) / 2 + dx) * R, (PAD + c.y + (c.h - sh) / 2 + dy) * R, sw * R, sh * R, c.x, c.y, c.w, c.h);
        ctx.globalAlpha = r < 1 ? 0.95 : 0.4 + 0.25 * g;
        ctx.strokeStyle = hair; ctx.lineWidth = 1 / k; ctx.strokeRect(c.x, c.y, c.w, c.h);
      }
      ctx.strokeStyle = hair; ctx.lineWidth = 1 / k;
      for (const s of segs) {
        if (s.x0 === s.x1 || s.x1 - s.x0 > 400) continue;
        const a = front(p, near((s.x0 + s.x1) / 2, s.y0) + 0.06); if (!a) continue;
        ctx.globalAlpha = 0.55 * a; ctx.beginPath(); ctx.moveTo(s.x0, s.y0); ctx.lineTo(s.x0 + (s.x1 - s.x0) * a, s.y0); ctx.stroke();
      }
      for (const [x, y] of bonsaiGrid.dots) { const a = front(p, near(x, y) + 0.06); if (a) { ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke(); } }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "destination-out";
      const fade = ctx.createLinearGradient(0, IH * 0.55, 0, IH * 0.95); fade.addColorStop(0, "rgba(0,0,0,0)"); fade.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = fade; ctx.fillRect(0, IH * 0.55, IW, IH * 0.45 + 2); ctx.globalCompositeOperation = "source-over";
    };

    // arrival: the reveal runs once (2.4s, decelerating) unless the rail is already in hand
    let raf = 0, on = false, t0 = 0;
    const tick = (ms: number) => {
      if (!held.current && t0 && reveal.current < 1) {
        const q = Math.min(1, (ms - t0) / 2400);
        reveal.current = 1 - Math.pow(1 - q, 3);
        setP(reveal.current);
      }
      draw(ms / 1000);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) {
        on = true;
        if (still && !held.current) { reveal.current = 1; setP(1); }
        if (!t0) t0 = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.4 });
    io.observe(cv);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="dn-tree">
      <div className="dn-tree-stage" style={{ aspectRatio: `${IW} / ${IH}` }}>
        <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
      </div>
      <label className="dn-scrub">
        <span>Reveal</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={p}
          onChange={(e) => { held.current = true; reveal.current = +e.target.value; setP(reveal.current); }}
        />
        <output>{Math.round(p * 100)}</output>
      </label>
    </div>
  );
}
