"use client";
// Full-length films, screened one at a time with their sound: the monitor holds the film that is up, the
// programme beside it lists every film with its running time; choosing one cues it, and a film that ends hands
// over to the next. Nothing plays until asked (these carry sound), so reduced motion needs no other path.
import { useState } from "react";
import { mediaMeta } from "@/data/workMedia";
import { Head, pad2, type SectionProps } from "./kit";

const tc = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Screening({ screen, isMobile, ink, n }: SectionProps) {
  const films = screen.items ?? [];
  const [at, setAt] = useState(0);
  // once a film has been chosen, the next one cued starts on its own
  const [rolling, setRolling] = useState(false);
  const cur = films[at];

  const cue = (i: number) => {
    setRolling(true);
    setAt(i);
  };

  const monitor = (
    <div className="relative w-full aspect-video bg-[var(--ink-black-print)]">
      <video
        key={cur.src}
        src={cur.src}
        poster={mediaMeta(cur.src)?.poster}
        controls
        playsInline
        preload="metadata"
        autoPlay={rolling}
        onEnded={() => at < films.length - 1 && cue(at + 1)}
        aria-label={cur.label}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );

  const programme = (
    <ol className="m-0 p-0 list-none flex flex-col" aria-label={`${screen.title ?? "Films"}: programme`}>
      {films.map((f, i) => (
        <li key={f.src} className="border-b border-primary/15 last:border-b-0">
          <button
            type="button"
            onClick={() => cue(i)}
            aria-current={i === at ? "true" : undefined}
            className={`wk-row w-full text-left flex items-baseline gap-3 py-2 cursor-pointer transition-opacity duration-200 ${
              i === at ? "opacity-100" : "opacity-55 hover:opacity-100"
            }`}
          >
            <span className="wk-cap wk-num w-[2ch] flex-shrink-0">{pad2(i + 1)}</span>
            <span className="wk-cap flex-1">{f.label}</span>
            <span className="wk-cap wk-num">{tc(mediaMeta(f.src)?.d)}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {monitor}
        {programme}
      </div>
    );
  }
  return (
    <div className="h-full py-12 pb-24 flex items-center gap-[var(--s-6)]">
      <div className="wk-in" style={{ width: "min(56vw, calc((100vh - 13rem) * 1.7778))" }}>
        {monitor}
      </div>
      <div className="flex flex-col gap-[var(--s-4)] w-[clamp(15rem,19vw,23rem)] flex-shrink-0">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {programme}
      </div>
    </div>
  );
}
