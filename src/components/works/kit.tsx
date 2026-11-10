"use client";
// Shared parts of the works sections: the matted plate every piece prints in, the section head, captions,
// and lanes (a run of plates at one height, cut into rows by running width). Every plate takes its media's
// own aspect, so work is scaled, never cropped. Copy comes from projects.ts only.
import type { CSSProperties, ReactNode } from "react";
import WorkMedia, { mediaAspect } from "@/components/WorkMedia";
import type { MediaItem, Project } from "@/data/projects";
import { t } from "@/lib/designSystem";

export type Screen = Project["screens"][number];
export type Ink = NonNullable<Project["print"]>["deck"];
export interface SectionProps {
  screen: Screen;
  isMobile: boolean;
  ink: Ink;
  /** this section's number on the spread, when it carries a head */
  n?: number;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
/** where each run starts in a running count (stagger indices across groups) */
export const offsets = (sizes: number[]) => sizes.map((_, i) => sizes.slice(0, i).reduce((s, x) => s + x, 0));
export const aspectOf = (src: string) => mediaAspect(src);

type Size = { h: string } | { w: string } | { fit: [string, string] };

/** A matted print. `h` sizes by height, `w` by width, `fit` contains it in a w × h box. */
export function Plate({
  src,
  size,
  tone,
  alt = "",
  sizes = "30vw",
  className = "",
  style,
  priority,
}: {
  src: string;
  size?: Size;
  tone?: "light" | "dark";
  alt?: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const a = aspectOf(src);
  const box: CSSProperties = { aspectRatio: `${a}` };
  if (size && "h" in size) box.height = size.h;
  if (size && "w" in size) box.width = size.w;
  if (size && "fit" in size) box.width = `min(${size.fit[0]}, calc(${size.fit[1]} * ${a}))`;
  return (
    <div className={`wk-plate p-1 md:p-1.5 ${tone === "dark" ? "is-dark" : ""} ${className}`} style={{ ...box, ...style }}>
      <div className="relative w-full h-full">
        <WorkMedia src={src} alt={alt} sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}

/** A plate with its name set under it; the caption never changes the plate's size. */
export function Captioned({ item, size, sizes, i = 0, tone }: { item: MediaItem; size: Size; sizes?: string; i?: number; tone?: "light" | "dark" }) {
  return (
    <figure className="wk-in flex-shrink-0 flex flex-col gap-2 m-0" style={{ "--i": i } as CSSProperties}>
      <Plate src={item.src} size={size} sizes={sizes} alt={item.label} tone={tone ?? item.tone} />
      {item.label && (
        <figcaption className="wk-cap flex gap-2">
          <span className="wk-num">{pad2(i + 1)}</span>
          <span>{item.label}</span>
        </figcaption>
      )}
    </figure>
  );
}

/** Section head: the number in the project's spot ink, the title, the copy. `column` stands beside the work on
 * a spread; `stack` heads it on a phone. */
export function Head({
  screen,
  ink,
  n,
  variant = "column",
  className = "",
  children,
}: {
  screen: Screen;
  ink: Ink;
  n?: number;
  variant?: "column" | "stack";
  className?: string;
  children?: ReactNode;
}) {
  const paras = (screen.description ?? "").split("\n\n").filter(Boolean);
  return (
    <header
      className={`wk-in flex flex-col gap-[var(--s-3)] ${
        variant === "column"
          ? "w-[clamp(17rem,22vw,26rem)] flex-shrink-0 self-stretch justify-center pr-[var(--s-5)] border-r border-primary/25"
          : "w-full"
      } ${className}`}
    >
      {n !== undefined && (
        <span aria-hidden className={`plate ${ink} font-display text-[length:var(--t-display-col)] leading-[0.8] self-start`}>
          {pad2(n)}
        </span>
      )}
      {screen.title && <h2 className={`${t.cardTitle} text-primary`}>{screen.title}</h2>}
      {paras.length > 0 && (
        <div className={`${t.bodyProse} text-foreground space-y-[var(--s-2)] max-w-[36ch]`}>
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {children}
    </header>
  );
}

/** Contiguous runs of the data order, cut where each lane's running width is closest to an equal share. */
export function balance<T>(items: T[], aspect: (x: T) => number, laneCount: number) {
  const total = items.reduce((s, x) => s + aspect(x), 0);
  const lanes: T[][] = [[]];
  let run = 0;
  for (const x of items) {
    const share = (total / laneCount) * lanes.length;
    const a = aspect(x);
    if (lanes.length < laneCount && run + a / 2 > share && lanes[lanes.length - 1].length) lanes.push([]);
    lanes[lanes.length - 1].push(x);
    run += a;
  }
  return lanes;
}

/** A run of captioned plates at one height (vh), in one lane or two when one would run past ~5 heights. */
export function Lanes({
  items,
  height,
  lanes,
  start = 0,
  sizes = "25vw",
  captions = true,
}: {
  items: MediaItem[];
  height: number;
  lanes?: number;
  start?: number;
  sizes?: string;
  captions?: boolean;
}) {
  const total = items.reduce((s, x) => s + aspectOf(x.src), 0);
  const count = lanes ?? (total > 5 ? 2 : 1);
  const capRem = captions && items.some((x) => x.label) ? 1.75 : 0;
  const plateH = `calc((${height}vh - ${(count - 1) * 1.25}rem) / ${count} - ${capRem}rem)`;
  let k = start;
  return (
    <div className="flex-shrink-0 flex flex-col justify-center gap-5">
      {balance(items, (x) => aspectOf(x.src), count).map((lane, li) => (
        <div key={li} className="flex items-start gap-3">
          {lane.map((item) =>
            captions ? (
              <Captioned key={item.src} item={item} size={{ h: plateH }} sizes={sizes} i={k++} />
            ) : (
              <div key={item.src} className="wk-in" style={{ "--i": k++ } as CSSProperties}>
                <Plate src={item.src} size={{ h: plateH }} sizes={sizes} alt={item.label} tone={item.tone} />
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/** Phones: a row of work scrolled sideways, snapping piece to piece. Landscape pieces take most of the width,
 * portrait ones a phone-screen's height. */
export function Rail({ items, captions = true, sizes = "80vw" }: { items: MediaItem[]; captions?: boolean; sizes?: string }) {
  return (
    <div className="wk-rail -mx-6 px-6 gap-3 scroll-px-6">
      {items.map((item, i) => {
        const a = aspectOf(item.src);
        const size = a >= 1 ? { w: a > 1.6 ? "84vw" : "76vw" } : { h: `min(62vh, ${Math.round(58 / a)}vw)` };
        return captions ? (
          <Captioned key={item.src} item={item} size={size} sizes={sizes} i={i} />
        ) : (
          <Plate key={item.src} src={item.src} size={size} sizes={sizes} alt={item.label} tone={item.tone} />
        );
      })}
    </div>
  );
}

/** A group's name over its run of work: the label, the count, a hairline the run's width. */
export function GroupLabel({ label, note, count }: { label: string; note?: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-primary/25 pb-2">
      <span className={t.navItemLabel}>
        {label}
        {note && <span className="italic"> / {note}</span>}
      </span>
      {count !== undefined && <span className="wk-cap wk-num">{pad2(count)}</span>}
    </div>
  );
}
