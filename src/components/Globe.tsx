"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTheme } from "next-themes";

interface GlobeProps {
  className?: string;
  size?: number;
}

export default function Globe({ className = "", size = 400 }: GlobeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light"; // Default to dark mode if undefined

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionStart = useRef<number>(0);
  const phi = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = size;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const options = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3, // Slight downward tilt to showcase the Northern hemisphere/markers
      dark: isDark ? 1 : 0, // Dynamic dark/light sphere body fill
      diffuse: 0,
      mapSamples: 15000,
      mapBrightness: 10, // Higher brightness for landmasses
      // Contrast colors for land dots: light blue in dark mode, dark blue/gray in light mode
      baseColor: (isDark ? [1.0, 1.0, 1.0] : [245 / 255, 245 / 255, 245 / 255]) as [number, number, number],
      markerColor: [0.0, 0.9, 1.0] as [number, number, number],   // Bright cyan markers
      glowColor: [1, 1, 1] as [number, number, number],      // Faint glow removed completely
      markers: [],
      context: { alpha: true },
    };

    const globe = createGlobe(canvasRef.current, options);

    let animationFrameId: number;
    const tick = () => {
      if (pointerInteracting.current === null) {
        phi.current += 0.005; // Slow auto-rotation when not dragging
      }
      globe.update({
        phi: phi.current,
        width: width * 2,
        height: width * 2,
      });
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);

    return () => {
      globe.destroy();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
    };
  }, [size, isDark]);

  return (
    <div
      className={`relative mx-auto aspect-square w-full select-none ${className}`}
      style={{ maxWidth: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          pointerInteractionStart.current = phi.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            phi.current = pointerInteractionStart.current - delta / 200;
          }
        }}
        className="h-full w-full opacity-0 transition-opacity duration-500 ease-in-out"
        style={{ cursor: "grab", contain: "layout paint size", background: "var(--background)", borderRadius: "50%" }}
      />
    </div>
  );
}
