"use client";
// One template, several instances: the stage plays one instance, the names under it swap which, so the
// template reads as a system (same build, new data). Its siblings (the title, the other formats) stand beside.
import { useState, type CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Plate, Rail, aspectOf, type SectionProps } from "./kit";

export default function Variants({ screen, isMobile, ink, n }: SectionProps) {
  const items = screen.items ?? [];
  const extras = screen.extras ?? [];
  const [at, setAt] = useState(0);
  const a = Math.max(...items.map((x) => aspectOf(x.src)));

  const chips = (
    <div role="group" aria-label={`${screen.title}: instances`} className="wk-in flex flex-wrap gap-x-[var(--s-3)] gap-y-1">
      {items.map((x, i) => (
        <button
          key={x.src}
          type="button"
          aria-pressed={i === at}
          onPointerEnter={(e) => e.pointerType === "mouse" && setAt(i)}
          onFocus={() => setAt(i)}
          onClick={() => setAt(i)}
          className="wk-row wk-cap py-1 cursor-pointer"
        >
          {x.label}
        </button>
      ))}
    </div>
  );

  const stage = (
    <div className="wk-in wk-plate is-dark p-2 md:p-3" style={{ aspectRatio: `${a}`, width: isMobile ? "100%" : `min(46vw, calc(56vh * ${a}))` }}>
      <div className="relative w-full h-full">
        {items.map((x, i) => (
          <div key={x.src} className="wk-swap absolute inset-0" style={{ opacity: i === at ? 1 : 0 }} aria-hidden={i !== at}>
            <WorkMedia src={x.src} alt={i === at ? x.label : ""} sizes={isMobile ? "92vw" : "46vw"} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <div className="flex flex-col gap-3">
          {stage}
          {chips}
        </div>
        {extras.length > 0 && <Rail items={extras} />}
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <div className="flex flex-col gap-4 self-center">
        {stage}
        {chips}
      </div>
      {extras.length > 0 && (
        <div className="flex items-center gap-3 self-center pl-[var(--s-5)] border-l border-primary/25">
          {extras.map((x, i) => (
            <figure key={x.src} className="wk-in m-0 flex flex-col gap-2" style={{ "--i": i + 2 } as CSSProperties}>
              <Plate src={x.src} size={{ fit: ["30vw", "56vh"] }} sizes="30vw" alt={x.label} />
              {x.label && <figcaption className="wk-cap">{x.label}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
