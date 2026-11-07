"use client";
// Work footage printed onto the page: muted loop that plays only on screen,
// holds its poster under reduced motion, with a pause/play control so nothing is inert.
import { useEffect, useRef, useState } from "react";

export default function PrintedVideo({
  src,
  poster,
  label,
  className = "",
  aspect = "16 / 9",
  sound = false,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  aspect?: string;
  sound?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUserPaused(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}); }
    else { setUserPaused(true); v.pause(); }
  };

  return (
    <figure className={`printed-video ${className}`} style={{ aspectRatio: aspect }}>
      <div className="printed" style={{ width: "100%", height: "100%" }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
      <div className="video-controls">
      {sound ? (
        <button type="button" className="video-toggle" onClick={() => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} aria-label={`${muted ? "Unmute" : "Mute"} ${label}`}>
          {muted ? "Sound on" : "Sound off"}
        </button>
      ) : null}
      <button type="button" className="video-toggle" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
        {playing ? "Pause" : "Play"}
      </button>
      </div>
    </figure>
  );
}
