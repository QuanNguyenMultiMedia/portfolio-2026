"use client";
// A reel and its edit decision list (AE comp "Showreel"): the reel plays in the monitor, and under it the edit
// track lays every cut at its true length, inked by the act it belongs to. The playhead follows the reel
// (a ref and a transform, no re-render per frame); any cut, on the track or in the list, cues the reel there.
// The list names each act once and links it to its project.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { mediaMeta } from "@/data/workMedia";
import { Head, type SectionProps } from "./kit";

type Cut = NonNullable<SectionProps["screen"]["cuts"]>[number];
const NONE: Cut[] = [];
const tc = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Cuts({ screen, isMobile, ink, n }: SectionProps) {
  const src = screen.src!;
  const meta = mediaMeta(src);
  const total = meta?.d ?? 60;
  const cuts = screen.cuts ?? NONE;
  const video = useRef<HTMLVideoElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(0);

  // which cut is up: kept as state only when it changes, so the list can mark it
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const v = video.current;
      if (v && head.current) {
        const t = v.currentTime;
        head.current.style.transform = `translate3d(${(t / total) * 100}cqw,0,0)`;
        let k = 0;
        for (let i = 0; i < cuts.length; i++) if (cuts[i].at <= t) k = i;
        if (k !== last) setNow((last = k));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cuts, total]);

  const cue = (at: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = at + 0.05;
    v.play().catch(() => {});
  };

  const acts = cuts.reduce<{ act: string; href?: string; items: { i: number; at: number; label: string }[] }[]>((out, c, i) => {
    const last = out[out.length - 1];
    if (last && last.act === c.act) last.items.push({ i, at: c.at, label: c.label });
    else out.push({ act: c.act, href: c.href, items: [{ i, at: c.at, label: c.label }] });
    return out;
  }, []);
  const actInk = (act: string) => screen.acts?.find((a) => a.name === act)?.ink ?? "var(--foreground)";

  const monitor = (
    <video
      ref={video}
      src={src}
      poster={meta?.poster}
      controls
      muted
      playsInline
      preload="metadata"
      aria-label={screen.title ?? "Reel"}
      className="w-full h-full object-contain bg-[var(--ink-black-print)]"
    />
  );

  const track = (
    <div className="relative w-full [container-type:inline-size]" aria-label="Edit track">
      <div className="flex h-[var(--s-5)] gap-px">
        {cuts.map((c, i) => {
          const end = cuts[i + 1]?.at ?? total;
          return (
            <button
              key={i}
              type="button"
              onClick={() => cue(c.at)}
              title={`${tc(c.at)} ${c.label}`}
              aria-label={`${tc(c.at)}, ${c.label}`}
              className={`wk-cut h-full cursor-pointer ${i === now ? "is-now" : ""}`}
              style={{ flexGrow: end - c.at, flexBasis: 0, "--cut": actInk(c.act) } as CSSProperties}
            />
          );
        })}
      </div>
      <div ref={head} className="absolute -top-1 -bottom-1 left-0 w-px bg-foreground pointer-events-none will-change-transform" aria-hidden />
    </div>
  );

  const list = (
    <ol className="m-0 p-0 list-none flex flex-col gap-[var(--s-4)]">
      {acts.map((a) => (
        <li key={`${a.act}-${a.items[0].i}`} className="flex flex-col gap-1">
          <span className="wk-cap flex items-center gap-2">
            <span className="inline-block w-2 h-2" style={{ background: actInk(a.act) }} aria-hidden />
            {a.href ? (
              <Link href={a.href} className="wk-row underline-offset-4 hover:underline">{a.act}</Link>
            ) : (
              a.act
            )}
          </span>
          <ol className="m-0 p-0 list-none">
            {a.items.map((c) => (
              <li key={c.i}>
                <button
                  type="button"
                  onClick={() => cue(c.at)}
                  aria-current={c.i === now ? "true" : undefined}
                  className={`wk-row w-full text-left flex gap-3 py-0.5 cursor-pointer transition-opacity duration-200 ${c.i === now ? "opacity-100" : "opacity-55 hover:opacity-100"}`}
                >
                  <span className="wk-cap wk-num w-[5ch] flex-shrink-0">{tc(c.at)}</span>
                  <span className="wk-cap">{c.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <div className="w-full aspect-video">{monitor}</div>
        {track}
        {list}
      </div>
    );
  }
  return (
    <div className="h-full py-12 pb-20 flex items-stretch gap-[var(--s-6)]">
      <div className="flex flex-col justify-center gap-[var(--s-3)]" style={{ width: "min(58vw, calc((100vh - 14rem) * 1.7778))" }}>
        <div className="w-full aspect-video">{monitor}</div>
        {track}
      </div>
      <div className="flex flex-col justify-center gap-[var(--s-4)] w-[clamp(15rem,19vw,23rem)] flex-shrink-0">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <div className="overflow-y-auto max-h-[60vh] pr-2" data-lenis-prevent>{list}</div>
      </div>
    </div>
  );
}
