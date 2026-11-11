"use client";
// One frame playing a build's stages in order, as the AE breakdown board does (10.HerondLabs_UIFilmBreakdown):
// the 2D UI animation, the raw 3D render it textured, the processed render, each named under the frame while
// it plays, rolling on to the next when it ends. The copy sits on the black board beside it. The stage list
// under the frame cues any stage; under reduced motion the frame holds and plays only when asked. The scene it was
// rendered in stands small under the note.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { mediaMeta } from "@/data/workMedia";
import { Head, Plate, pad2, aspectOf, type SectionProps } from "./kit";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export default function Stages({ screen, isMobile, ink, n }: SectionProps) {
  const stages = screen.items ?? [];
  const [at, setAt] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const cur = stages[at];
  const a = Math.max(...stages.map((s) => aspectOf(s.src)));
  // the scene the frames were rendered from (Blender viewport stills), small under the note
  const scene = (screen.extras ?? []).length > 0 && (
    <div className="grid grid-cols-2 gap-2 w-full">
      {screen.extras!.map((x) => (
        <Plate key={x.src} src={x.src} tone="dark" size={{ w: "100%" }} alt={x.label ?? "Blender scene"} sizes="12vw" />
      ))}
    </div>
  );

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (onScreen) v.play().catch(() => {});
    else v.pause();
  }, [at, onScreen, reduced]);

  const frame = (
    <div ref={box} className="flex flex-col gap-3" style={{ width: isMobile ? "100%" : `min(52vw, calc(62vh * ${a}))` }}>
      <div className="relative w-full bg-[var(--ink-black-print)]" style={{ aspectRatio: `${a}` }}>
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
          onEnded={() => !reduced && setAt((at + 1) % stages.length)}
          aria-label={cur.label}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <ol className="m-0 p-0 list-none flex justify-end gap-[var(--s-3)]" aria-label={`${screen.title}: stages`}>
        {stages.map((s, i) => (
          <li key={s.src}>
            <button
              type="button"
              aria-pressed={i === at}
              onClick={() => setAt(i)}
              className={`wk-row wk-cap cursor-pointer pb-1 transition-opacity duration-300 ${i === at ? "opacity-100" : "opacity-45 hover:opacity-100"}`}
            >
              <span className="wk-num mr-2">{pad2(i + 1)}</span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );

  if (isMobile) {
    return (
      <div className="wk-board w-full -mx-6 px-6 py-[var(--s-6)] flex flex-col gap-[var(--s-5)]" style={{ width: "calc(100% + 3rem)" }}>
        <Head screen={screen} ink={ink} n={n} variant="stack" onDark />
        {frame}
        {scene}
      </div>
    );
  }
  return (
    <div className="wk-board h-full flex items-center gap-[var(--s-6)] px-[var(--s-6)] pb-12">
      <Head screen={screen} ink={ink} n={n} onDark className="self-center !justify-center">
        {scene}
      </Head>
      <div className="wk-in">{frame}</div>
    </div>
  );
}
