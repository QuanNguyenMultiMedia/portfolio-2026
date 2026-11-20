"use client";
// The brand field, run by the site's own defrag engine (defrag.ts): a grid of the mark's three pieces (body, bowl,
// 21° stem) that resolve into dots by distance from a focus. D sets how far order has spread; a press moves the focus;
// Assemble replays the entry timeline the site plays under its hero.
import { useEffect, useRef, useState } from "react";
import { drawDefrag, drawDefragAt, tuneDefrag } from "./defrag";
import "./defrasoft.css";

export default function Field() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [d, setD] = useState(0.5);
  const [ink, setInk] = useState(false);
  const [run, setRun] = useState(0);
  const dRef = useRef(d);

  useEffect(() => {
    dRef.current = d;
    tuneDefrag({ D: d });
  }, [d]);

  // size to the box, then play the assemble once (or draw the still when motion is reduced)
  useEffect(() => {
    const c = cv.current!;
    let raf = 0;
    const fit = () => {
      const k = Math.min(devicePixelRatio, 1.5);
      c.width = Math.round(c.clientWidth * k);
      c.height = Math.round(c.clientHeight * k);
      drawDefragAt(c, dRef.current);
    };
    tuneDefrag({ cell: 46, grain: 8 }, { ground: ink ? "dark" : "light", mark: ink ? "paper" : "ink" });
    fit();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t0 = performance.now();
      const tick = (t: number) => {
        const u = (t - t0) / 2400;
        drawDefrag(c, u);
        if (u < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); fit(); });
    ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [ink, run]);

  const redraw = () => { if (cv.current) drawDefragAt(cv.current, dRef.current); };

  return (
    <div className={`df-field ${ink ? "is-ink" : ""}`}>
      <canvas
        ref={cv}
        aria-label="Defrag field. Press to move the focus."
        role="img"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          tuneDefrag({ fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height });
          redraw();
        }}
      />
      <div className="df-bar">
        <label className="df-meta">
          Defrag {Math.round(d * 100)}%
          <input className="df-range" type="range" min={0} max={1} step={0.01} value={d} onChange={(e) => { setD(+e.target.value); tuneDefrag({ D: +e.target.value }); redraw(); }} />
        </label>
        <button type="button" className="df-btn" onClick={() => setRun((n) => n + 1)}>Assemble</button>
        <button type="button" className="df-btn" onClick={() => { tuneDefrag({ seed: Math.floor(Math.random() * 999) + 1 }); redraw(); }}>Reshuffle</button>
        <button type="button" className="df-btn" aria-pressed={ink} onClick={() => setInk((v) => !v)}>Ink ground</button>
      </div>
    </div>
  );
}
