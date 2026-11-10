"use client";
// An asset pack laid out as specimens: one cell each, all the same size, the asset contained in it and named
// under it. When the pack was built with a second setup (another lighting rig), a switch swaps every asset
// that has one; assets without a variant hold still, so the change reads as the rig, not the set.
import { useState, type CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Lanes, Rail, pad2, type SectionProps } from "./kit";

export default function Library({ screen, isMobile, ink, n }: SectionProps) {
  const items = screen.items ?? [];
  const extras = screen.extras ?? [];
  const labels = screen.variantLabels;
  const [alt, setAlt] = useState(false);
  const rows = items.length > 8 ? 3 : items.length > 4 ? 2 : 1;
  const cols = Math.ceil(items.length / rows);

  const toggle = labels && (
    <div role="group" aria-label="Setup" className="wk-in flex gap-[var(--s-3)]">
      {labels.map((l, i) => (
        <button key={l} type="button" aria-pressed={alt === (i === 1)} onClick={() => setAlt(i === 1)} className="wk-row wk-cap py-1 cursor-pointer">
          {l}
        </button>
      ))}
    </div>
  );

  const cell = (x: (typeof items)[number], i: number, size: string) => (
    <figure key={x.src} className="wk-in m-0 flex flex-col gap-2 group" style={{ "--i": i } as CSSProperties}>
      <div className={`wk-plate p-[6%] aspect-square ${x.tone === "dark" ? "is-dark" : ""}`} style={{ width: size }}>
        <div className="relative w-full h-full transition-transform duration-700 ease-[var(--ease-print)] group-hover:scale-[1.04]">
          <div className="wk-swap absolute inset-0" style={{ opacity: alt && x.variant ? 0 : 1 }}>
            <WorkMedia src={x.src} alt={x.label} sizes={isMobile ? "30vw" : "14vw"} />
          </div>
          {x.variant && (
            <div className="wk-swap absolute inset-0" style={{ opacity: alt ? 1 : 0 }} aria-hidden={!alt}>
              <WorkMedia src={x.variant} alt="" sizes={isMobile ? "30vw" : "14vw"} />
            </div>
          )}
        </div>
      </div>
      {x.label && (
        <figcaption className="wk-cap flex gap-2" style={{ width: size }}>
          <span className="wk-num">{pad2(i + 1)}</span>
          <span>{x.label}</span>
          {x.variant && <span aria-label="has a variant">·</span>}
        </figcaption>
      )}
    </figure>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack">
          {toggle}
        </Head>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4">{items.map((x, i) => cell(x, i, "100%"))}</div>
        {extras.length > 0 && <Rail items={extras} captions={false} />}
      </div>
    );
  }

  // the grid fills the sheet's height: rows × (cell + caption) inside ~66vh
  const cellH = `calc((66vh - ${(rows - 1) * 1.25}rem) / ${rows} - 1.75rem)`;
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n}>
        {toggle}
      </Head>
      <div className="grid gap-x-3 gap-y-5 self-center" style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}>
        {items.map((x, i) => cell(x, i, cellH))}
      </div>
      {extras.length > 0 && <Lanes items={extras} height={70} captions={false} start={items.length} />}
    </div>
  );
}
