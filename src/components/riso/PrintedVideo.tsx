"use client";
// Work footage printed onto the page: muted loop that plays only while its sheet holds the view (useSheetLive),
// holds its poster under reduced motion, with a pause/play control so nothing is inert. The footage fades in once
// its poster (or first frame) has decoded, so a late poster never cuts in over the ground.
import { useEffect, useRef, useState } from "react";
import { useSheetLive } from "@/hooks/useSheetLive";
import { media } from "@/lib/media";

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
  const live = useSheetLive(ref);
  const [ready, setReady] = useState(false);
  const figRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // the reel's HUD: timecode and scrub line written straight to the DOM, per frame only while playing
  useEffect(() => {
    const v = ref.current;
    if (!v || !sound) return;
    let raf = 0;
    const paint = () => {
      const c = v.currentTime || 0, d = v.duration || 1, pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
      if (timeRef.current) timeRef.current.textContent = `00:${pad(c / 60)}:${pad(c % 60)}:${pad((c % 1) * 30)}`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${(c / d).toFixed(4)})`;
    };
    const loop = () => { paint(); raf = v.paused ? 0 : requestAnimationFrame(loop); };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const evs = ["seeked", "timeupdate", "pause"] as const;
    v.addEventListener("play", start);
    evs.forEach((e) => v.addEventListener(e, paint));
    paint();
    return () => { cancelAnimationFrame(raf); v.removeEventListener("play", start); evs.forEach((e) => v.removeEventListener(e, paint)); };
  }, [sound]);

  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = ref.current, el = e.currentTarget;
    if (!v || !v.duration) return;
    el.setPointerCapture(e.pointerId);
    const to = (x: number) => { const r = el.getBoundingClientRect(); v.currentTime = Math.min(1, Math.max(0, (x - r.left) / r.width)) * v.duration; };
    to(e.clientX);
    const move = (ev: PointerEvent) => to(ev.clientX);
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };
  const nudge = (e: React.KeyboardEvent) => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const step = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
    if (!step) return;
    e.preventDefault();
    v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + step));
  };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else figRef.current?.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    const img = new Image();
    const done = () => setReady(true);
    img.onload = done; img.onerror = done;
    img.src = poster;
    if (img.complete) done();
    return () => { img.onload = img.onerror = null; };
  }, [poster]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // reduced motion: never autoplay; the poster holds until the viewer presses play
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (live && !userPaused) v.play().catch(() => {});
    else v.pause();
  }, [live, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}); }
    else { setUserPaused(true); v.pause(); }
  };

  return (
    <figure ref={figRef} className={`printed-video ${className}`} style={{ aspectRatio: aspect }} data-ready={ready ? "" : undefined}>
      <div className="printed" style={{ width: "100%", height: "100%" }}>
        <video
          ref={ref}
          src={media(src)}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          onLoadedData={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
      {sound ? (
        <div className="video-controls video-hud">
          <div className="hud-scrub" role="slider" tabIndex={0} aria-label={`Seek ${label}`} aria-valuemin={0} aria-valuemax={100}
            onPointerDown={scrub} onKeyDown={nudge}>
            <div className="hud-scrub-fill" ref={barRef} />
          </div>
          <div className="hud-row">
            <button type="button" className="video-toggle hud-square" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
              {playing ? "\u2016" : "\u25B6"}
            </button>
            <span className="hud-time">TIME: <span ref={timeRef}>00:00:00:00</span></span>
            <span className="hud-gap" />
            <button type="button" className="video-toggle" onClick={() => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} aria-label={`${muted ? "Unmute" : "Mute"} ${label}`}>
              {muted ? "UNMUTE // AUDIO_OFF" : "MUTE // AUDIO_ON"}
            </button>
            <button type="button" className="video-toggle hud-square" onClick={fullscreen} aria-label={`Toggle fullscreen ${label}`}>{"\u26F6"}</button>
          </div>
        </div>
      ) : (
        <div className="video-controls">
          <button type="button" className="video-toggle" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </figure>
  );
}
