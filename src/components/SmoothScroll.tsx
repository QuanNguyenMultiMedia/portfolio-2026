"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1 - Math.pow(1 - t, 3)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Waypoints for gentle snap (must match page.tsx waypoints)
    const snapWaypoints = [0, 0.15, 0.35, 0.55, 0.90];
    const SNAP_THRESHOLD = 0.03;
    const IDLE_MS = 150;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    lenis.on("scroll", (l) => {
      if (isSnapping) return;
      if (idleTimer) clearTimeout(idleTimer);

      idleTimer = setTimeout(() => {
        const progress = l.animatedScroll / l.dimensions.limit.y;
        const velocity = Math.abs(l.velocity);

        // Only snap when scroll has truly settled
        if (velocity > 0.3) return;

        const nearest = snapWaypoints.reduce((prev, curr) =>
          Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev,
        );

        if (Math.abs(nearest - progress) < SNAP_THRESHOLD) {
          isSnapping = true;
          const snapTarget = nearest * l.dimensions.limit.y;
          lenis.scrollTo(snapTarget, { duration: 0.35, easing: (t) => t * (2 - t) });
          setTimeout(() => { isSnapping = false; }, 450);
        }
      }, IDLE_MS);
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
