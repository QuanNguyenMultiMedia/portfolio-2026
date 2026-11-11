"use client";
// Client commissions as an index: each client's name set large with what the work was, and its pieces shown
// on a stage beside the list. Pointing at a name (or focusing it) puts that client's work on the stage; the
// stage keeps one size, so the spread never shifts. On phones each name opens its own work under it.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Head, Plate, Rail, pad2, aspectOf, type SectionProps } from "./kit";
import type { MediaItem } from "@/data/projects";

/** a contents list elsewhere on the page names a client: the ledger comes into view with that client's work up */
export const LEDGER_OPEN = "wk-ledger-open";
const NONE: NonNullable<SectionProps["screen"]["groups"]> = [];

/** Fit a client's pieces into the stage box: one row, or two when one would leave them small. */
function Stage({ items, w, h }: { items: MediaItem[]; w: number; h: number }) {
  const gap = 12;
  const run = items.reduce((s, x) => s + aspectOf(x.src), 0);
  const one = Math.min(h, (w - gap * (items.length - 1)) / run);
  const half = Math.ceil(items.length / 2);
  const runs = [items.slice(0, half), items.slice(half)];
  const two = Math.min((h - gap) / 2, ...runs.map((r) => (w - gap * (r.length - 1)) / r.reduce((s, x) => s + aspectOf(x.src), 0)));
  const rows = items.length > 1 && two > one * 1.15 ? runs : [items];
  const ph = rows.length === 2 ? two : one;
  return (
    <div className="w-full h-full flex flex-col items-start justify-center" style={{ gap }}>
      {rows.map((r, ri) => (
        <div key={ri} className="flex" style={{ gap }}>
          {r.map((x) => (
            <Plate key={x.src} src={x.src} size={{ h: `${ph}px` }} sizes="30vw" alt={x.label} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Ledger({ screen, isMobile, ink, n }: SectionProps) {
  const entries = screen.groups ?? NONE;
  const [at, setAt] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const open = (e: Event) => {
      const i = entries.findIndex((x) => x.label === (e as CustomEvent<string>).detail);
      if (i < 0) return;
      setAt(i);
      root.current?.closest("section")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", inline: "start", block: "start" });
    };
    window.addEventListener(LEDGER_OPEN, open);
    return () => window.removeEventListener(LEDGER_OPEN, open);
  }, [entries]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const name = (e: (typeof entries)[number], i: number) => (
    <span className="flex items-baseline gap-[var(--s-3)]">
      <span className="wk-cap wk-num w-[2ch]">{pad2(i + 1)}</span>
      <span className="font-display text-[length:var(--t-list)] leading-[1]">{e.label}</span>
      {e.note && <span className="wk-cap italic">{e.note}</span>}
    </span>
  );

  if (isMobile) {
    return (
      <div ref={root} className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <ul className="flex flex-col">
          {entries.map((e, i) => (
            <li key={e.label} className="border-b border-primary/25">
              <button
                type="button"
                aria-expanded={at === i}
                onClick={() => setAt(at === i ? -1 : i)}
                className="wk-in w-full py-4 flex justify-between items-baseline gap-3 cursor-pointer"
              >
                {name(e, i)}
                <span aria-hidden className="font-display text-2xl transition-transform duration-500" style={{ transform: at === i ? "rotate(45deg)" : "none" }}>
                  +
                </span>
              </button>
              {at === i && (
                <div className="pb-5">
                  <Rail items={e.items} captions={false} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const cur = entries[Math.max(at, 0)];
  return (
    <div ref={root} className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <ul role="tablist" aria-orientation="vertical" aria-label={screen.title} className="flex flex-col gap-[var(--s-2)] self-center w-max">
        {entries.map((e, i) => (
          <li key={e.label} role="presentation" className="wk-in" style={{ "--i": i } as CSSProperties}>
            <button
              type="button"
              role="tab"
              aria-selected={at === i}
              aria-controls="ledger-stage"
              onPointerEnter={(ev) => ev.pointerType === "mouse" && setAt(i)}
              onFocus={() => setAt(i)}
              onClick={() => setAt(i)}
              className="wk-row py-1 cursor-pointer"
            >
              {name(e, i)}
            </button>
          </li>
        ))}
      </ul>
      <div id="ledger-stage" role="tabpanel" ref={box} className="wk-in w-[52vw] h-[68vh] self-center relative">
        {dim.w > 0 &&
          entries.map((e, i) => (
            <div key={e.label} className="wk-swap absolute inset-0" style={{ opacity: i === at ? 1 : 0, visibility: i === at ? "visible" : "hidden" }}>
              <Stage items={e.items} w={dim.w} h={dim.h} />
            </div>
          ))}
        <span className="sr-only" aria-live="polite">
          {cur?.label}
        </span>
      </div>
    </div>
  );
}
