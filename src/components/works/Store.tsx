"use client";
// A store page as the store shows it: the listing, then its screenshot set run edge to edge at one height,
// in the order a visitor swipes through them.
import type { CSSProperties } from "react";
import { Head, Plate, Rail, type SectionProps } from "./kit";

export default function Store({ screen, isMobile, ink, n }: SectionProps) {
  const shots = screen.items ?? [];
  const listing = screen.src;

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <Rail items={[...(listing ? [{ src: listing }] : []), ...shots]} captions={false} />
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      {listing && (
        <div className="wk-in self-center pr-[var(--s-5)] border-r border-primary/25">
          <Plate src={listing} size={{ h: "70vh" }} sizes="12vw" alt={`${screen.title}: listing`} />
        </div>
      )}
      <div className="flex gap-1.5 self-center">
        {shots.map((x, i) => (
          <div key={x.src} className="wk-in" style={{ "--i": i + 1 } as CSSProperties}>
            <Plate src={x.src} size={{ h: "70vh" }} sizes="22vw" alt={x.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
