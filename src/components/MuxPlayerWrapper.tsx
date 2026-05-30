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

  // Intercept and silence non-fatal Hls.js/Mux buffer update logs to avoid Next.js dev overlay triggers
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const msg = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
      if (
        msg.includes("getErrorFromHlsErrorData") ||
        msg.includes("hls.js") ||
        msg.includes("BufferController") ||
        msg.includes("onSBUpdateError")
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

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
      customElements.whenDefined("mux-video").then(() => {
        if (el) {
          onVideoReadyRef.current?.(el);
        }
      });
    });
  }, [playbackId, className]);

  return <div ref={containerRef} className="w-full h-full animate-fade-in" />;
}
