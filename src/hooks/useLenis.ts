"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export interface UseLenisOptions {
  wrapperRef?: React.RefObject<HTMLDivElement | null>;
  contentQuery?: string;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  wheelMultiplier?: number;
  lerp?: number;
  autoAssign?: boolean;
  scrollToTopOnRouteChange?: boolean;
}

export default function useLenis(options: UseLenisOptions = {}) {
  const {
    wrapperRef,
    contentQuery,
    orientation = "vertical",
    gestureOrientation = "vertical",
    wheelMultiplier = 0.75,
    lerp = 0.11,
    autoAssign = true,
    scrollToTopOnRouteChange = false,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // If wrapperRef is provided but not resolved yet, skip this tick
    if (wrapperRef && !wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef?.current || undefined;
    if (wrapper) {
      const computedStyle = window.getComputedStyle(wrapper);
      if (computedStyle.position === "static") {
        wrapper.style.position = "relative";
      }
    }
    const content = wrapper && contentQuery ? (wrapper.querySelector(contentQuery) as HTMLElement) || undefined : undefined;

    const lenis = new Lenis({
      ...(wrapper ? { wrapper } : {}),
      ...(content ? { content } : {}),
      orientation,
      gestureOrientation,
      wheelMultiplier,
      lerp,
      duration: 1.0,
      smoothWheel: true,
      touchMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    // Save vertical instance globally for standard scrolling interaction
    if (orientation === "vertical") {
      (window as any).lenis = lenis;
      (window as any).__lenisInstance = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (orientation === "vertical") {
        delete (window as any).lenis;
        delete (window as any).__lenisInstance;
      }
    };
  }, [wrapperRef, contentQuery, orientation, gestureOrientation, wheelMultiplier, lerp]);

  // Handle route change scroll resets
  useEffect(() => {
    if (scrollToTopOnRouteChange && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, scrollToTopOnRouteChange]);

  return lenisRef;
}
