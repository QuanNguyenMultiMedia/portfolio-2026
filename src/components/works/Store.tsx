"use client";
// A store page as the store shows it: the listing leads, its screenshot set running inside it where the store
// runs it (the empty band under the install button), swiping past on its own and holding while pointed at.
// Then the same set at full height, edge to edge, in the order a visitor swipes through them.
import type { CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Plate, Rail, aspectOf, type SectionProps } from "./kit";

// where the listing leaves room for its screenshots, in fractions of the listing (measured off the capture)
const BAND = { top: 0.178, height: 0.455, left: 0.075 };

export default function Store({ screen, isMobile, ink, n }: SectionProps) {
  const shots = screen.items ?? [];
  const listing = screen.src;

  const store = listing && (
    <div className="wk-plate p-1 md:p-1.5" style={{ aspectRatio: `${aspectOf(listing)}`, ...(isMobile ? { width: "70vw" } : { height: "76vh" }) }}>
      <div className="relative w-full h-full">
        <WorkMedia src={listing} alt={`${screen.title}: listing`} sizes={isMobile ? "70vw" : "16vw"} />
        {shots.length > 0 && (
          <div
            className="wk-store-band absolute right-0 overflow-hidden"
            style={{ top: `${BAND.top * 100}%`, height: `${BAND.height * 100}%`, left: `${BAND.left * 100}%` }}
          >
            {/* the set twice over, so the run loops without a seam */}
            <div className="wk-store-run flex h-full w-max" style={{ "--n": shots.length } as CSSProperties}>
              {[...shots, ...shots].map((x, i) => (
                <div
                  key={i}
                  className="relative h-full flex-shrink-0 mr-[0.6vh] rounded-[0.6vh] overflow-hidden"
                  style={{ aspectRatio: `${aspectOf(x.src)}` }}
                  aria-hidden={i >= shots.length || undefined}
                >
                  <WorkMedia src={x.src} alt={i < shots.length ? x.label : ""} sizes="8vw" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {store && <div className="wk-in self-center">{store}</div>}
        <Rail items={shots} captions={false} />
      </div>
    );
  }

  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      {store && <div className="wk-in self-center pr-[var(--s-5)] border-r border-primary/25">{store}</div>}
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
