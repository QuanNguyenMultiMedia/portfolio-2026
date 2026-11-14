"use client";
// Endless CSS loops (a phone screen scrolling, the wall drifting) keep the compositor committing every frame
// even off screen. This marks the element `.is-offscreen` while it is out of view; CSS pauses its loops there.
import { useEffect, type RefObject } from "react";

export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-offscreen");
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-offscreen", !e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
