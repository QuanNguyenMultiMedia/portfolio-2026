"use client";
// One asset from first draft to final. The stage holds one state at a time; the strip under it is the
// order the work went through: point, focus, or arrow along it to step the asset forward and back. What
// it was built in stands beside (extras), captioned by the section's subtitle.
import { useRef, useState, type KeyboardEvent } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Plate, Rail, pad2, aspectOf, type SectionProps } from "./kit";
import { t } from "@/lib/designSystem";

export default function Evolution({ screen, isMobile, ink, n }: SectionProps) {
  const items = screen.items ?? [];
  const extras = screen.extras ?? [];
  const [at, setAt] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const cur = items[at];

  // the stage is sized by the widest state, so stepping never resizes the spread
  const stageA = Math.max(...items.map((x) => aspectOf(x.src)));

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : at + d;
    if (to === at || to < 0 || to >= items.length) return;
    e.preventDefault();
    setAt(to);
    (strip.current?.children[to] as HTMLElement | undefined)?.focus();
  };

  const stage = (box: React.CSSProperties) => (
    <div className="wk-in wk-plate is-dark p-2 md:p-3" style={{ aspectRatio: `${stageA}`, ...box }}>
      <div className="relative w-full h-full">
        {items.map((x, i) => (
          <div key={x.src} className="wk-swap absolute inset-0" style={{ opacity: i === at ? 1 : 0 }} aria-hidden={i !== at}>
            <WorkMedia src={x.src} alt={i === at ? x.label ?? `${screen.title} ${i + 1}` : ""} sizes={isMobile ? "92vw" : "50vw"} />
          </div>
        ))}
      </div>
    </div>
  );

  const readout = (
    <p className="wk-cap flex gap-3 items-baseline" aria-live="polite">
      <span className="wk-num">
        {pad2(at + 1)} / {pad2(items.length)}
      </span>
      {cur?.label && <span>{cur.label}</span>}
    </p>
  );

  const thumbs = (cls: string) => (
    <div ref={strip} role="toolbar" aria-label={`${screen.title}: draft to final`} onKeyDown={onKey} className={cls}>
      {items.map((x, i) => (
        <button
          key={x.src}
          type="button"
          tabIndex={i === at ? 0 : -1}
          aria-pressed={i === at}
          aria-label={`${pad2(i + 1)}${x.label ? ` ${x.label}` : ""}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && setAt(i)}
          onFocus={() => setAt(i)}
          onClick={() => setAt(i)}
          className={`wk-plate is-dark p-0.5 aspect-square flex-shrink-0 cursor-pointer ${i === at ? "is-active" : ""} ${isMobile ? "h-14" : "h-[clamp(3rem,6.5vh,4.5rem)]"}`}
        >
          <span className="relative block w-full h-full">
            <WorkMedia src={x.src} sizes="72px" />
          </span>
        </button>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <div className="flex flex-col gap-3">
          {stage({ width: "100%" })}
          {readout}
          {thumbs("wk-rail -mx-6 px-6 gap-2 py-1")}
        </div>
        {extras.length > 0 && (
          <div className="flex flex-col gap-3">
            {screen.subtitle && <span className={`${t.navItemLabel} border-b border-primary/25 pb-2`}>{screen.subtitle}</span>}
            <Rail items={extras} captions={false} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <div className="flex flex-col gap-4 self-center">
        {stage({ width: `min(48vw, calc(56vh * ${stageA}))` })}
        <div className="flex items-start justify-between gap-8">
          {thumbs("flex flex-wrap gap-2 max-w-[48vw]")}
          {readout}
        </div>
      </div>
      {extras.length > 0 && (
        <aside className="self-center flex flex-col gap-4 pl-[var(--s-5)] border-l border-primary/25">
          {screen.subtitle && <span className={`wk-in ${t.navItemLabel}`}>{screen.subtitle}</span>}
          {extras.map((x, i) => (
            <div key={x.src} className="wk-in" style={{ "--i": i + 2 } as React.CSSProperties}>
              <Plate src={x.src} size={{ fit: ["30vw", `${(64 - (extras.length - 1) * 3) / extras.length}vh`] }} sizes="30vw" alt={x.label} />
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}
