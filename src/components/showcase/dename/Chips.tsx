"use client";
// Shape, from herondlabs/dename-landing-page src/ui.tsx, ported: every button, chip and card on the site takes the
// badge's silhouette from the same construction as the logo. The path is live: hover deepens and sharpens the
// spikes, a press bites, release springs back, all written straight to the DOM each frame.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { construct, clampSize, fitUnit, outline, toPath } from "./mark";
import "./dename.css";

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function Shape({ children, className = "", shape, unit, glass = false, ring, style }: {
  children?: ReactNode; className?: string; shape: string; unit?: number; glass?: boolean; ring?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const live = useRef({ grow: 1, flex: 0 });
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const glassRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef(box);
  useLayoutEffect(() => { boxRef.current = box; });
  const geo = (w: number, h: number, { grow, flex }: { grow: number; flex: number }) => {
    const c1 = construct(Math.min(unit ?? Infinity, fitUnit(w, h)));
    const { W, H } = clampSize(c1, w, h);
    const c = { ...c1, D: Math.max(0.5, Math.min(c1.D * grow * (1 + 0.6 * flex), (W - c1.M) / 2)), rho: c1.rho * Math.max(0.15, 1 - 0.7 * flex) };
    return toPath(outline(c, W, H));
  };
  useEffect(() => {
    const el = ref.current;
    if (!el || still()) return;
    let raf = 0, from = { ...live.current }, to = { ...live.current }, t0 = 0, dur = 1, ease = (x: number) => x;
    const draw = () => {
      const { w, h } = boxRef.current;
      if (!w || !h) return;
      const d = geo(w, h, live.current);
      paths.current.forEach((p) => p?.setAttribute("d", d));
      if (glassRef.current) glassRef.current.style.clipPath = `path('${d}')`;
    };
    const frame = (now: number) => {
      const q = Math.min(1, (now - t0) / dur), e = ease(q);
      live.current = { grow: from.grow + (to.grow - from.grow) * e, flex: from.flex + (to.flex - from.flex) * e };
      draw();
      raf = q < 1 ? requestAnimationFrame(frame) : 0;
    };
    const go = (next: Partial<typeof to>, ms: number, fn: (x: number) => number) => {
      cancelAnimationFrame(raf);
      from = { ...live.current }; to = { ...to, ...next }; t0 = performance.now(); dur = ms; ease = fn;
      raf = requestAnimationFrame(frame);
    };
    const out = (x: number) => 1 - Math.pow(2, -10 * x);
    const back = (x: number) => { const k = 2.2; return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2; };
    // the spikes push out of a flat edge when the piece first comes into view, as they do on the site
    live.current.grow = 0; from.grow = 0; to.grow = 0; draw();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go({ grow: 1 }, 900, back); } });
    io.observe(el);
    const enter = () => go({ flex: 1 }, 520, back);
    const leave = () => go({ flex: 0 }, 700, out);
    const down = () => go({ flex: 1.8 }, 140, out);
    const up = () => go({ flex: el.matches(":hover, :focus-visible") ? 1 : 0 }, 650, back);
    const blur = () => { if (!el.matches(":hover")) leave(); };
    el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("focusin", enter); el.addEventListener("focusout", blur);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      el.removeEventListener("focusin", enter); el.removeEventListener("focusout", blur);
    };
    // geo reads refs only; the effect binds once per element, as on the site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // a render draws the rest shape; frames in flight overwrite it from live.current
  const d = box.w && box.h ? geo(box.w, box.h, { grow: 1, flex: 0 }) : "";
  return (
    <button ref={ref} type="button" className={`relative isolate ${className}`} style={style}>
      {glass && d && <span ref={glassRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-md" style={{ clipPath: `path('${d}')` }} />}
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible" viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} preserveAspectRatio="none">
        {d && <path ref={(p) => { paths.current[0] = p; }} d={d} className={shape} vectorEffect="non-scaling-stroke" />}
      </svg>
      {children}
      {ring && d && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none">
          <path ref={(p) => { paths.current[1] = p; }} d={d} className={`fill-none ${ring}`} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </button>
  );
}

// labels and card copy are the site's own (src/content.ts)
const CHIPS = ["Vision", "What we build", "Reviews", "Careers"];
const CARDS = [
  { title: "Smart Tools & Utilities", body: "Essential apps that simplify daily tasks and boost everyday efficiency." },
  { title: "AI-Driven Solutions", body: "Cutting-edge intelligence that personalizes experiences and automates decisions." },
];

export default function Chips() {
  return (
    <div className="dn-pond" style={{ backgroundImage: "url(/showcase/dename/lily.webp)" }}>
      <div className="dn-chip-row">
        {CHIPS.map((c) => (
          <Shape key={c} className="dn-chip is-glass" shape="dn-fill-glass" ring="dn-ring" glass>{c}</Shape>
        ))}
        <Shape className="dn-chip" shape="dn-fill-chartreuse">Contact</Shape>
      </div>
      <div className="dn-chip-row">
        {CARDS.map((c) => (
          <Shape key={c.title} className="dn-card" shape="dn-fill-glass" ring="dn-ring" glass unit={64}>
            <h4>{c.title}</h4>
            <p>{c.body}</p>
          </Shape>
        ))}
      </div>
    </div>
  );
}
