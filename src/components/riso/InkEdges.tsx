"use client";
// Roughen Edges for all type, ported from MainTitle.aep: every text layer carries Roughen Edges (border 2.4,
// scale 11, complexity 2), linked in 12.End to one master on "Adjustment Layer 7", so the bleed is one global
// setting in board pixels, not a share of each font size. The boards are 2800 px wide, so one filter serves
// the page, scaled by viewport / 2800. Display words keep their own stack (BlurMap), which roughens too.
// riso.css applies url(#ink-edges) to text blocks; this only keeps the filter's lengths in step with the viewport.
import { useEffect, useRef } from "react";

const BOARD = 2800;
const BORDER = 2.4;
const SCALE = 11;

export default function InkEdges() {
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const fit = () => {
      const s = window.innerWidth / BOARD;
      turb.current?.setAttribute("baseFrequency", String(1 / (SCALE * s)));
      // both axes displace independently, so the border spreads in quadrature
      disp.current?.setAttribute("scale", String(BORDER * Math.SQRT2 * s));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <svg className="sr-only" aria-hidden focusable="false">
      <filter id="ink-edges" x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence ref={turb} type="fractalNoise" baseFrequency={1 / (SCALE * 0.57)} numOctaves={2} seed={11} result="n" />
        <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale={BORDER * Math.SQRT2 * 0.57} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
