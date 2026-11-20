"use client";
// The DeName mark rig (herondlabs/dename-landing-page src/rig.tsx), ported. The badge is regenerated from its
// φ construction every render: drag the right edge, bottom edge or corner and only the body grows, the spikes
// keep their size; each slider is an exponent on φ. Trimmed to the stage: no URL state, no file export.
import { useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import {
  BASE_ASPECT, GOLDEN, MASTER, PHI, clampSize, construct, filletCircles, fitUnit, outline, toPath, wordLayout, TONES,
  type Exponents, type Tone,
} from "./mark";
import "./dename.css";

const BASE_H = MASTER.H;
const KNOBS: { key: keyof Exponents; label: string; formula: string }[] = [
  { key: "band", label: "Spike band", formula: "U+M = H₀ / φ^n" },
  { key: "mouth", label: "Mouth", formula: "M = U / φ^n" },
  { key: "depth", label: "Spike depth", formula: "D = W₀ / φ^n" },
  { key: "corner", label: "Corner", formula: "r = M / φ^n" },
  { key: "tip", label: "Tip", formula: "ρ = r / φ^n" },
  { key: "border", label: "Border", formula: "s = M / φ^n" },
];
const PRESETS: { label: string; W: number; H: number }[] = [
  { label: "√5/2", W: BASE_ASPECT, H: 1 },
  { label: "1 : 1", W: 1, H: 1 },
  { label: "φ : 1", W: PHI, H: 1 },
  { label: "4 : 1", W: 4, H: 1 },
  { label: "1 : φ", W: 1, H: PHI },
];
const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

export default function MarkRig() {
  const [s, setS] = useState({ W: BASE_H * BASE_ASPECT, H: BASE_H, unit: BASE_H, e: GOLDEN, grid: true, ghost: false, words: true, tone: "light" as Tone });
  const set = (p: Partial<typeof s>) => setS((o) => ({ ...o, ...p }));
  const c = useMemo(() => construct(s.unit, s.e), [s.unit, s.e]);
  const { W, H } = clampSize(c, s.W, s.H);
  const poly = outline(c, W, H);
  const d = toPath(poly);
  const pad = c.s + 60;
  const L = H - c.U - c.M;

  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ axis: "x" | "y" | "xy"; x: number; y: number; W: number; H: number } | null>(null);
  const toLocal = (e: RPE) => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.current!.getScreenCTM()!.inverse());
    return [p.x, p.y];
  };
  const start = (axis: "x" | "y" | "xy", e: RPE) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const [x, y] = toLocal(e);
    drag.current = { axis, x, y, W, H };
  };
  const move = (e: RPE) => {
    const g = drag.current;
    if (!g) return;
    const [x, y] = toLocal(e);
    set({ W: g.axis !== "y" ? Math.round(g.W + x - g.x) : g.W, H: g.axis !== "x" ? Math.round(g.H + y - g.y) : g.H });
  };

  return (
    <div className="dn-rig">
      <div className={`dn-rig-canvas ${s.tone === "dark" ? "is-paper" : ""}`}>
        <svg
          ref={svg}
          className="absolute inset-0 size-full touch-none select-none"
          viewBox={`${-pad} ${-pad} ${Math.max(W, s.W) + pad * 2} ${Math.max(H, s.H) + pad * 2}`}
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
          role="img"
          aria-label={`DeName mark, ${fmt(W)} by ${fmt(H)}`}
        >
          <path d={d} className="dn-badge" stroke={TONES[s.tone].border} strokeWidth={c.s} strokeLinejoin="round" paintOrder="stroke" />
          {s.words && (
            <g fill={TONES[s.tone].words} fontFamily="DN Coaster Sans">
              {wordLayout(c, W, H).map((t) => (
                <text key={t.text} x={t.x} y={t.y} fontSize={t.size}>{t.text}</text>
              ))}
            </g>
          )}
          {s.ghost && <path d={MASTER.d} transform={`scale(${s.unit / BASE_H})`} className="dn-ghost" strokeWidth={1.5} strokeDasharray="6 4" />}
          {s.grid && (
            <g fill="none" fontFamily="DN Uncut Sans" fontSize={11} className="dn-grid">
              {[0, c.U, c.U + c.M, H].map((y, i) => (
                <line key={"h" + i} x1={-pad / 1.5} x2={W + pad / 1.5} y1={y} y2={y} vectorEffect="non-scaling-stroke" />
              ))}
              {[0, c.D, W / 2, W - c.D, W].map((x, i) => (
                <line key={"v" + i} y1={-pad / 1.5} y2={H + pad / 1.5} x1={x} x2={x} className={i === 2 ? "is-sky" : ""} vectorEffect="non-scaling-stroke" />
              ))}
              <line x1={0} y1={c.U + c.M} x2={W} y2={c.U} className="is-sky" vectorEffect="non-scaling-stroke" />
              {filletCircles(poly).map((f, i) => (
                <circle key={i} cx={f.cx} cy={f.cy} r={f.r} vectorEffect="non-scaling-stroke" />
              ))}
              <rect x={0} y={0} width={c.U + c.M} height={c.U + c.M} className="is-sky" vectorEffect="non-scaling-stroke" />
              <path d={`M0 ${c.U + c.M}A${L} ${L} 0 0 1 ${L} ${H}`} className="is-sky" vectorEffect="non-scaling-stroke" />
              <g className="dn-grid-text">
                <text x={W + pad / 1.5 + 4} y={c.U / 2 + 4}>U {fmt(c.U)}</text>
                <text x={W + pad / 1.5 + 4} y={c.U + c.M / 2 + 4}>M {fmt(c.M)}</text>
                <text x={W + pad / 1.5 + 4} y={c.U + c.M + L / 2 + 4}>L {fmt(L)}</text>
                <text x={c.D / 2} y={-pad / 1.5 - 6} textAnchor="middle">D {fmt(c.D)}</text>
                <text x={W / 2} y={-pad / 1.5 - 6} textAnchor="middle" className="is-sky">gap {fmt(W - 2 * c.D)}</text>
              </g>
            </g>
          )}
          <rect x={W - 6} y={0} width={12} height={H} fill="transparent" className="cursor-ew-resize" onPointerDown={(e) => start("x", e)} />
          <rect x={0} y={H - 6} width={W} height={12} fill="transparent" className="cursor-ns-resize" onPointerDown={(e) => start("y", e)} />
          <circle cx={W} cy={H} r={9} className="dn-handle cursor-nwse-resize" strokeWidth={2} onPointerDown={(e) => start("xy", e)} />
        </svg>
        <p className="dn-readout">{fmt(W)} × {fmt(H)} pt · W/H {fmt(W / H)}</p>
      </div>

      <div className="dn-rig-panel">
        <section className="grid gap-2">
          <h3 className="dn-rig-h">Surface</h3>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className="dn-btn"
                onClick={() => {
                  const h = p.H >= p.W ? BASE_H * PHI : BASE_H;
                  const w = (h * p.W) / p.H;
                  set({ W: w, H: h, unit: fitUnit(w, h) });
                }}
              >
                {p.label}
              </button>
            ))}
            <button type="button" className="dn-btn" onClick={() => set({ unit: fitUnit(W, H) })}>Fit spikes</button>
          </div>
        </section>
        <section className="grid gap-3">
          <div className="flex items-baseline justify-between">
            <h3 className="dn-rig-h">Powers of φ</h3>
            <button type="button" className="dn-link" onClick={() => set({ e: GOLDEN })}>reset</button>
          </div>
          {KNOBS.map((k) => (
            <label key={k.key} className="grid gap-1">
              <span className="flex justify-between gap-3">
                <span>{k.label}</span>
                <span className="dn-formula">{k.formula.replace("n", String(s.e[k.key]))}</span>
              </span>
              <input type="range" min={0} max={6} step={0.25} value={s.e[k.key]} onChange={(ev) => set({ e: { ...s.e, [k.key]: +ev.target.value } })} />
            </label>
          ))}
        </section>
        <section className="grid gap-1.5">
          <h3 className="dn-rig-h">Show</h3>
          <label className="flex items-center gap-2"><input type="checkbox" checked={s.grid} onChange={(e) => set({ grid: e.target.checked })} />Construction</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={s.ghost} onChange={(e) => set({ ghost: e.target.checked })} />Illustrator master</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={s.words} onChange={(e) => set({ words: e.target.checked })} />DENAME / LABS</label>
          <div className="mt-1 flex gap-1.5">
            {(["light", "dark"] as const).map((t) => (
              <button key={t} type="button" aria-pressed={s.tone === t} className="dn-btn" onClick={() => set({ tone: t })}>
                {t === "light" ? "On dark" : "On light"}
              </button>
            ))}
          </div>
        </section>
        <section className="grid gap-2">
          <h3 className="dn-rig-h">Same mark, other surfaces</h3>
          <div className="flex items-end gap-3">
            {[[64, 64], [32, 32], [16, 16], [48, 86]].map(([w, h]) => <Surface key={`${w}x${h}`} w={w} h={h} e={s.e} />)}
          </div>
          <Surface w={240} h={48} e={s.e} />
        </section>
      </div>
    </div>
  );
}

function Surface({ w, h, e }: { w: number; h: number; e: Exponents }) {
  const c = construct(fitUnit(w, h), e);
  const s = clampSize(c, w, h);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${s.W} ${s.H}`} className="shrink-0" aria-hidden>
      <path d={toPath(outline(c, s.W - c.s, s.H - c.s), c.s / 2, c.s / 2)} className="dn-badge dn-badge-paper" strokeWidth={c.s} strokeLinejoin="round" />
    </svg>
  );
}
