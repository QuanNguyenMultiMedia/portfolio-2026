"use client";
// Roughen Edges for all type, ported from MainTitle.aep (Roughen Edges, border 2.4, scale 11, complexity 2, one
// master on "Adjustment Layer 7"). The boards are 2800 px wide, so lengths scale by viewport / 2800. On screen the
// board's full border eats counters and serifs of reading sizes, so the bleed is graded by size: headings print at
// half the board border, body and UI text at a fine grain with a tighter tooth. Display words keep their own stack
// (BlurMap). riso.css picks the filter per element; this only keeps the lengths in step with the viewport.
import { useEffect, useRef } from "react";

const BOARD = 2800;
// [id, border (board px), scale (board px)]
const GRADES = [
  ["ink-edges", 1.2, 11],
  ["ink-edges-fine", 0.6, 7],
] as const;

export default function InkEdges() {
  const refs = useRef<(SVGFilterElement | null)[]>([]);

  useEffect(() => {
    const fit = () => {
      const s = window.innerWidth / BOARD;
      GRADES.forEach(([, border, scale], i) => {
        const f = refs.current[i];
        f?.querySelector("feTurbulence")?.setAttribute("baseFrequency", String(1 / (scale * s)));
        // both axes displace independently, so the border spreads in quadrature
        f?.querySelector("feDisplacementMap")?.setAttribute("scale", String(border * Math.SQRT2 * s));
      });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <svg className="sr-only" aria-hidden focusable="false">
      {GRADES.map(([id, border, scale], i) => (
        <filter key={id} ref={(el) => { refs.current[i] = el; }} id={id} x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={1 / (scale * 0.57)} numOctaves={2} seed={11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={border * Math.SQRT2 * 0.57} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </svg>
  );
}
