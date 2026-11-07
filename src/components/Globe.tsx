"use client";
// The testimonials globe, printed (design.md §2): cobe draws a neutral dot map; CSS thresholds it to a mask
// (dots black, sphere white), a screened violet layer turns the dots into ink, and the plate multiplies onto
// the page, so only the dots print and the sphere is paper. HCMC is the one marker.
// Spins slowly, drags with inertia; holds still under reduced motion; stops offscreen and in hidden tabs.
import { useEffect, useRef } from "react";
import createGlobe from "cobe";

interface GlobeProps {
  className?: string;
  size?: number;
  /** [lat, lng] the globe opens facing and carries a marker for. */
  focus?: [number, number];
}

const AUTO_SPIN = 0.0022;
const DRAG_DAMPING = 0.92;
const HCMC: [number, number] = [10.82, 106.63];

// cobe's phi/theta for a location facing the camera
const toAngles = ([lat, lng]: [number, number]) => ({
  phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
  theta: ((lat * Math.PI) / 180) * 0.6,
});

export default function Globe({ className = "", size = 520, focus = HCMC }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragX = useRef<number | null>(null);
  const velocity = useRef(0);
  const phi = useRef(toAngles(focus).phi);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { theta } = toAngles(focus);

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: phi.current,
      theta,
      dark: 0,
      diffuse: 0,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0, 0, 0],
      glowColor: [1, 1, 1],
      markers: [{ location: focus, size: 0.07 }],
      context: { alpha: true },
    });

    let frame = 0;
    let onScreen = true;
    const shouldRun = () => onScreen && document.visibilityState === "visible";
    const tick = () => {
      frame = 0;
      if (!shouldRun()) return;
      if (dragX.current === null) {
        velocity.current *= DRAG_DAMPING; // release inertia decays back into the idle spin
        phi.current += (reduceMotion ? 0 : AUTO_SPIN) + velocity.current;
      }
      globe.update({ phi: phi.current });
      frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame && shouldRun()) frame = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; wake(); });
    io.observe(canvas);
    document.addEventListener("visibilitychange", wake);
    globe.update({ phi: phi.current }); // one frame even before it runs, so it's never blank
    canvas.style.opacity = "1";
    wake();
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      globe.destroy();
    };
  }, [size, focus]);

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragX.current === null) return;
    dragX.current = null;
    e.currentTarget.style.cursor = "grab";
  };

  return (
    <div className={`printed-globe ${className}`} style={{ maxWidth: size }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={(e) => {
          dragX.current = e.clientX;
          velocity.current = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerMove={(e) => {
          if (dragX.current === null) return;
          const delta = (e.clientX - dragX.current) / 200;
          dragX.current = e.clientX;
          phi.current += delta;
          velocity.current = delta;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>
  );
}
