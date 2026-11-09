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

    // The loop runs only while Lenis has something to animate: an always-on rAF made the browser service a full
    // frame (style, animations, paint) every vsync even at rest. Input (virtual-scroll) and scrollTo wake it;
    // it sleeps once Lenis reports it is no longer smooth-scrolling.
    // Lenis advances by the time since its last tick: a tick after a sleep would land the whole scroll in one
    // step, so the first tick after waking is dated one frame back.
    let rafId = 0, asleep = true;
    function raf(time: number) {
      rafId = 0;
      if (document.visibilityState !== "visible") { asleep = true; return; }
      if (asleep) { lenis.time = time - 1000 / 60; asleep = false; }
      lenis.raf(time);
      if (lenis.isScrolling === "smooth") rafId = requestAnimationFrame(raf);
      else asleep = true;
    }
    const wake = () => { if (!rafId) rafId = requestAnimationFrame(raf); };
    const scrollTo = lenis.scrollTo.bind(lenis);
    lenis.scrollTo = (...args: Parameters<Lenis["scrollTo"]>) => { scrollTo(...args); wake(); };
    const offInput = lenis.on("virtual-scroll", wake);
    wake();

    const handleVisibilityChange = () => { if (document.visibilityState === "visible") wake(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      offInput();
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
