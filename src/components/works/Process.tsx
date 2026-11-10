"use client";
// Behind the scenes → what it made. Each group is one step, read left to right (down on phones), joined by
// an arrow: the scene or editor first, the frames it produced, the place they shipped to.
import { Fragment } from "react";
import { Head, Lanes, Rail, pad2, aspectOf, type SectionProps } from "./kit";
import { t } from "@/lib/designSystem";

export default function Process({ screen, isMobile, ink, n }: SectionProps) {
  const steps = screen.groups ?? [];

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-5)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <ol className="flex flex-col gap-[var(--s-5)]">
          {steps.map((s, si) => (
            <li key={s.label} className="wk-in flex flex-col gap-3">
              <span className={`${t.navItemLabel} flex gap-3 border-b border-primary/25 pb-2`}>
                <span className="wk-num">{pad2(si + 1)}</span>
                {s.label}
              </span>
              <Rail items={s.items} captions={false} />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // one height for the whole run, so every step's frames sit on the same line; a step with many frames
  // stacks them in two lanes rather than running away
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <ol className="flex items-center gap-[var(--s-4)]">
        {steps.map((s, si) => {
          const run = s.items.reduce((sum, x) => sum + aspectOf(x.src), 0);
          return (
            <Fragment key={s.label}>
              {si > 0 && (
                <li aria-hidden className="wk-in font-display text-[length:var(--t-list)] text-primary self-center" style={{ "--i": si * 2 } as React.CSSProperties}>
                  →
                </li>
              )}
              <li className="flex flex-col gap-4 self-center">
                <span className={`wk-in ${t.navItemLabel} flex gap-3 border-b border-primary/25 pb-2`} style={{ "--i": si * 2 } as React.CSSProperties}>
                  <span className="wk-num">{pad2(si + 1)}</span>
                  {s.label}
                </span>
                <Lanes items={s.items} height={60} lanes={run > 3.2 && s.items.length > 2 ? 2 : 1} captions={false} start={si * 2} sizes="35vw" />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
