"use client";
// Client leaf: one renderer for a works-page media src. Video srcs loop muted and play only
// while on screen; under reduced motion they hold their poster. Stills go through next/image.
// Always object-contain: work is scaled to fit its frame, never cropped.
import { useEffect, useRef } from "react";
import Image from "next/image";
import { mediaMeta, isVideoSrc } from "@/data/workMedia";

export const mediaAspect = (src: string, fallback = 16 / 10) => {
  const m = mediaMeta(src);
  return m ? m.w / m.h : fallback;
};

export default function WorkMedia({
  src,
  alt = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const video = isVideoSrc(src);
  const meta = mediaMeta(src);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const fitClass = "object-contain";

  if (video) {
    return (
      <video
        ref={ref}
        src={src}
        poster={meta?.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`absolute inset-0 w-full h-full ${fitClass} ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${fitClass} ${className}`}
    />
  );
}
