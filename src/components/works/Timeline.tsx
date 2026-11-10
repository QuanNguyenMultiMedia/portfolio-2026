"use client";
// A reel's source cuts, laid on an edit track: each clip is as long as it runs, in the order of the data.
// The monitor plays the selected cut through and rolls on to the next, the playhead crossing its clip on
// the track as it goes. Pointing at a clip, focusing it, or arrowing along the track cues it. Under reduced
// motion nothing rolls: the monitor holds a frame and plays only when asked (native controls).
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { mediaMeta } from "@/data/workMedia";
import { Head, pad2, aspectOf, offsets, type SectionProps } from "./kit";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const tc = (s: number) => `${pad2(Math.floor(s / 60))}:${pad2(Math.floor(s % 60))}`;

export default function Timeline({ screen, isMobile, ink, n }: SectionProps) {
  const clips = (screen.items ?? []).map((x) => ({ ...x, d: mediaMeta(x.src)?.d ?? 8 }));
  const total = clips.reduce((s, c) => s + c.d, 0);
  const [at, setAt] = useState(0);
  const reduced = useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);
  const [onScreen, setOnScreen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cur = clips[at];
  const monitorA = Math.max(...clips.map((c) => aspectOf(c.src)));

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (onScreen) v.play().catch(() => {});
    else v.pause();
  }, [at, onScreen, reduced]);

  const cue = (i: number) => setAt(((i % clips.length) + clips.length) % clips.length);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    cue(at + d);
    (track.current?.children[(at + d + clips.length) % clips.length] as HTMLElement | undefined)?.focus();
  };

  const starts = offsets(clips.map((c) => c.d));

  const monitor = (
    <div className="wk-in wk-plate is-dark p-2 md:p-3" style={{ aspectRatio: `${monitorA}`, width: isMobile ? "100%" : `min(56vw, calc(54vh * ${monitorA}))` }}>
      <video
        ref={video}
        key={cur.src}
        src={cur.src}
        poster={mediaMeta(cur.src)?.poster}
        muted
        playsInline
        preload="metadata"
        controls={reduced}
        autoPlay={!reduced && onScreen}
        onEnded={() => !reduced && cue(at + 1)}
        aria-label={cur.label}
        className="w-full h-full object-contain"
      />
    </div>
  );

  const pxPerS = isMobile ? 9 : undefined;
  const trackEl = (
    <div className="flex flex-col gap-2">
      <div
        ref={track}
        role="toolbar"
        aria-label={`${screen.title}: cuts`}
        onKeyDown={onKey}
        className="flex h-[clamp(2.75rem,7vh,4.5rem)] border-y border-primary/25"
        style={{ width: pxPerS ? `${total * pxPerS}px` : "100%" }}
      >
        {clips.map((c, i) => (
          <button
            key={c.src}
            type="button"
            tabIndex={i === at ? 0 : -1}
            aria-pressed={i === at}
            aria-label={`${pad2(i + 1)} ${c.label ?? ""}, ${Math.round(c.d)} seconds`}
            onPointerEnter={(e) => e.pointerType === "mouse" && cue(i)}
            onFocus={() => cue(i)}
            onClick={() => cue(i)}
            className="wk-clip h-full border-r border-primary/25 last:border-r-0 bg-foreground cursor-pointer"
            style={{ width: `${(c.d / total) * 100}%`, "--d": `${c.d}s` } as CSSProperties}
          >
            {/* the clip's frame at its own aspect, contained in the clip: a strip of the cut, never a crop */}
            <Image src={mediaMeta(c.src)?.poster ?? ""} alt="" fill sizes="120px" className="object-contain opacity-80" />
            <span key={i === at ? `${at}-${c.src}` : c.src} className="wk-head" />
          </button>
        ))}
      </div>
      <div className="relative h-4 wk-cap wk-num" style={{ width: pxPerS ? `${total * pxPerS}px` : "100%" }} aria-hidden>
        {starts.map((s, i) => (
          <span key={i} className="absolute top-0" style={{ left: `${(s / total) * 100}%` }}>
            {i % 2 === 0 || !isMobile ? tc(s) : ""}
          </span>
        ))}
      </div>
    </div>
  );

  const readout = (
    <p className="wk-cap flex gap-3" aria-live="polite">
      <span className="wk-num">
        {pad2(at + 1)} / {pad2(clips.length)}
      </span>
      <span>{cur.label}</span>
      <span className="wk-num">{tc(starts[at])}</span>
    </p>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {monitor}
        {readout}
        <div className="overflow-x-auto -mx-6 px-6 [scrollbar-width:none]">{trackEl}</div>
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <div className="flex flex-col gap-4 self-center" style={{ width: `min(56vw, calc(54vh * ${monitorA}))` }}>
        {monitor}
        {readout}
        <div className="wk-in">{trackEl}</div>
      </div>
    </div>
  );
}
