"use client";

import { useEffect, useState, useRef } from "react";
import { useMotionValue, useTransform, motion, MotionValue } from "framer-motion";
import Globe from "@/components/Globe";

interface Testimonial {
  brand: string;
  quote: string;
  author: string;
  role: string;
}

interface MobileTestimonialsProps {
  testimonials: Testimonial[];
}

// True mathematical modulo helper
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* --------------------------------
* Child Component: MobileTestimonialCard
* Isolates useTransform hook calls to avoid hook-in-loop violations
----------------------------------- */
interface MobileTestimonialCardProps {
  test: Testimonial;
  idx: number;
  scrollX: MotionValue<number>;
  spacing: number;
  H: number;
  R: number;
  yCenter: number;
  zCenter: number;
  totalW: number;
  halfW: number;
}

function MobileTestimonialCard({
  test,
  idx,
  scrollX,
  spacing,
  H,
  R,
  yCenter,
  zCenter,
  totalW,
  halfW,
}: MobileTestimonialCardProps) {
  // Apply mathematical wrapping for infinite loop behavior
  const xrel = useTransform(scrollX, (val) => {
    const xbase = (idx * spacing) + val;
    return mod(xbase + halfW, totalW) - halfW;
  });

  // Conforming Circular Arc Math (Y position only)
  const y = useTransform(xrel, (x) => {
    const effectiveX = Math.min(Math.abs(x), H);
    const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
    return yCenter + arc;
  });

  const scale = useTransform(xrel, (x) => {
    return Math.max(0.8, 1 - Math.min(0.2, Math.abs(x) / 1400));
  });

  const cardOpacity = useTransform(xrel, (x) => {
    return Math.max(0.12, 1 - Math.min(0.88, Math.abs(x) / 360));
  });

  return (
    <motion.div
      style={{
        x: xrel,
        y,
        z: zCenter,
        scale,
        opacity: cardOpacity,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -120, // Half of width (240)
        marginTop: -70,  // Half of height (140)
        width: 240,
        minHeight: 140,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      }}
      className="bg-surface/60 backdrop-blur-xl border border-border-neutral/80 p-3.5 text-left shadow-2xl flex flex-col justify-between"
    >
      <div>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-tech-blue font-bold">
          {test.brand}
        </span>
        <p className="text-[10.5px] leading-[1.6] italic text-foreground/80 mt-2 line-clamp-4 font-light">
          &ldquo;{test.quote}&rdquo;
        </p>
      </div>
      <div className="mt-2 border-t border-border-neutral/15 pt-1.5 flex justify-between items-end">
        <div>
          <span className="block font-mono text-[7.5px] tracking-[0.1em] font-bold text-foreground opacity-90 uppercase">
            {test.author}
          </span>
          <span className="block font-mono text-[6.5px] tracking-[0.15em] text-foreground/50 uppercase mt-0.5">
            {test.role}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* --------------------------------
* Parent Component: MobileTestimonials
----------------------------------- */
export default function MobileTestimonials({ testimonials }: MobileTestimonialsProps) {
  const scrollX = useMotionValue(0);
  const isDragging = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(360);

  // 1. Viewport resize tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // 2. Slow continuous autoplay from right to left (pauses on drag)
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (!isDragging.current) {
        scrollX.set(scrollX.get() - 0.7);
      }
      group_tick();
    };
    const group_tick = () => {
      rafId = requestAnimationFrame(tick);
    };
    group_tick();
    return () => cancelAnimationFrame(rafId);
  }, [scrollX]);

  // Geometric configuration
  const spacing = 265; // Card spacing
  const H = viewportWidth / 2 || 180; // Half-screen width
  const bend = 65; // Apex height of arc
  const R = (H * H + bend * bend) / (2 * bend); // Radius of the concentric circle

  const yCenter = -140; // Pulled upwards closer to the top
  const zCenter = -80;  // Pushed back in Z behind the globe
  const totalW = testimonials.length * spacing;
  const halfW = totalW / 2;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* A. Drag Capture Zone */}
      <motion.div
        drag="x"
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDrag={(event, info) => {
          scrollX.set(scrollX.get() + info.delta.x);
        }}
        onDragEnd={() => {
          isDragging.current = false;
        }}
        className="absolute left-0 right-0 top-[22%] bottom-[18%] z-30 cursor-grab active:cursor-grabbing pointer-events-auto bg-transparent"
      />

      {/* B. Orbiting Cards (Preserve 3D, wraps concentric around the top of the globe) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {testimonials.map((test, idx) => (
          <MobileTestimonialCard
            key={test.brand}
            test={test}
            idx={idx}
            scrollX={scrollX}
            spacing={spacing}
            H={H}
            R={R}
            yCenter={yCenter}
            zCenter={zCenter}
            totalW={totalW}
            halfW={halfW}
          />
        ))}
      </div>

      {/* C. Globe (Rendered at center, shifted slightly down) */}
      <div 
        className="absolute left-1/2 top-1/2 pointer-events-auto"
        style={{ transform: "translate3d(0px, 75px, 0px) translate(-50%, -50%)" }}
      >
        <Globe size={240} />
      </div>
    </div>
  );
}
