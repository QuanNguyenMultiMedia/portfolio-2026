"use client";

import { useEffect, useRef } from "react";

export default function MuxPlayerWrapper({
  playbackId,
  className,
  onVideoReady,
}: {
  playbackId: string;
  className?: string;
  onVideoReady?: (el: HTMLElement) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVideoReadyRef = useRef(onVideoReady);

  useEffect(() => {
    onVideoReadyRef.current = onVideoReady;
  }, [onVideoReady]);

  useEffect(() => {
    import("@mux/mux-video").then(() => {
      if (!containerRef.current) return;
      
      let el = containerRef.current.querySelector("mux-video") as HTMLElement;
      if (el && el.getAttribute("playback-id") === playbackId) {
        return;
      }

      containerRef.current.innerHTML = "";
      el = document.createElement("mux-video");
      el.setAttribute("stream-type", "on-demand");
      el.setAttribute("playback-id", playbackId);
      el.setAttribute("loop", "");
      el.setAttribute("muted", "");
      el.setAttribute("playsinline", "");
      el.setAttribute("preload", "auto");
      el.setAttribute("disable-tracking", "true");
      el.setAttribute("disable-cookies", "true");
      el.className = className ?? "";
      containerRef.current.appendChild(el);
      onVideoReadyRef.current?.(el);
    });
  }, [playbackId, className]);

  return <div ref={containerRef} className="w-full h-full animate-fade-in" />;
}
