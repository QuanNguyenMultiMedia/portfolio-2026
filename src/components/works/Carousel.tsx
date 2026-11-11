"use client";
// Portrait ads on a turning ring, as the AE board runs them (GIFs_Carousel in 04.Defrasoft_info_Ads): every
// cut stands on the ring at once, so the batch reads as volume. The ring turns on its own (transform only) and
// holds while pointed at or focused. Under reduced motion, and on phones, the batch lays flat instead.
import type { CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Rail, aspectOf, type SectionProps } from "./kit";

export default function Carousel({ screen, isMobile, ink, n }: SectionProps) {
  const items = screen.items ?? [];
  const count = items.length;
  // ring radius from the card width, so neighbours sit edge to edge with a small gap
  const card = 12; // vw
  const radius = (card / 2 / Math.tan(Math.PI / count)) * 1.12;

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <Rail items={items} />
      </div>
    );
  }
  return (
    <div className="h-full py-12 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <div className="wk-ring-stage relative flex items-center justify-center" style={{ width: `${radius * 2 + card}vw`, height: "100%" }}>
        <ul className="wk-ring relative m-0 p-0 list-none" style={{ width: `${card}vw`, aspectRatio: "9 / 16", "--count": count } as CSSProperties}>
          {items.map((x, i) => (
            <li
              key={x.src}
              className="wk-ring-card absolute inset-0"
              style={{ "--turn": `${(i * 360) / count}deg`, "--radius": `${radius}vw` } as CSSProperties}
            >
              <div className="relative w-full h-full" style={{ aspectRatio: `${aspectOf(x.src)}` }}>
                <WorkMedia src={x.src} alt={x.label} sizes="12vw" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
