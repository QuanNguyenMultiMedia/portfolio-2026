"use client";
// A set ringed around its centre piece, as the AE rewards board lays the medals around the special cast
// (10.2. HerondPointRewards). The ring opens at the top left and runs clockwise in the data's order (bronze,
// then silver, then gold), so the tiers read as arcs. The board splits its copy across two corners, so the
// note does too; the asset-library recording (board 3) stands with the note it proves. Pointing at or focusing a medal lifts it and names it in the centre.
import { useState, type CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Kicker, Plate, aspectOf, type SectionProps } from "./kit";
import { t } from "@/lib/designSystem";

export default function Orbit({ screen, isMobile, ink, n }: SectionProps) {
  const ring = screen.items ?? [];
  const [hot, setHot] = useState<number | null>(null);
  const paras = (screen.description ?? "").split("\n\n").filter(Boolean);
  const N = ring.length;
  // an open ring: a gap at the bottom where the centre piece's plinth stands, as on the board
  const start = -0.62 * Math.PI;
  const sweep = 1.72 * Math.PI;

  const board = (size: string) => (
    <div className="relative flex-shrink-0 aspect-square" style={{ width: size }}>
      {ring.map((m, i) => {
        const th = start + (sweep * i) / (N - 1);
        const x = 50 + 41 * Math.cos(th - Math.PI / 2);
        const y = 50 + 41 * Math.sin(th - Math.PI / 2);
        return (
          <button
            key={m.src}
            type="button"
            aria-label={m.label}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            className="wk-in absolute w-[15%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-500 ease-[var(--ease-print)] hover:scale-[1.12] focus-visible:scale-[1.12]"
            style={{ left: `${x}%`, top: `${y}%`, aspectRatio: `${aspectOf(m.src)}`, "--i": i } as CSSProperties}
          >
            <span className="relative block w-full h-full">
              <WorkMedia src={m.src} alt="" sizes="12vw" />
            </span>
          </button>
        );
      })}
      {screen.src && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] flex flex-col items-center gap-[var(--s-2)]">
          <div className="relative w-full" style={{ aspectRatio: `${aspectOf(screen.src)}` }}>
            <WorkMedia src={screen.src} alt={screen.title ?? ""} sizes="30vw" />
          </div>
          <p className="wk-cap text-center h-[1.25em] m-0" aria-live="polite">
            {hot !== null ? ring[hot].label : ""}
          </p>
        </div>
      )}
    </div>
  );

  // as on the board: the brief and its theme top right, the build note bottom left
  const top = paras.slice(0, Math.max(1, paras.length - 1));
  const foot = paras.length > 1 ? paras.slice(-1) : [];
  const proof = (sizes: string) =>
    screen.extras?.map((x) => (
      <figure key={x.src} className="wk-in m-0 flex flex-col gap-2">
        <Plate src={x.src} size={{ w: "100%" }} alt={x.label} sizes={sizes} />
        {x.label && <figcaption className={`${t.bodyProse} opacity-70 max-w-[38ch]`}>{x.label}</figcaption>}
      </figure>
    ));

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" paras={top} />
        {board("100%")}
        {foot.length > 0 && <div className={`${t.bodyProse} space-y-[var(--s-2)]`}>{foot.map((p, i) => <p key={i}>{p}</p>)}</div>}
        {proof("100vw")}
      </div>
    );
  }
  // the ring takes the sheet's height; the two notes sit at its opposite corners
  return (
    <div className="h-full py-12 pb-24 grid grid-cols-[auto_auto_auto] gap-x-[var(--s-5)] items-stretch">
      <div className="flex flex-col justify-end w-[clamp(15rem,19vw,23rem)]">
        {foot.length > 0 && (
          <div className={`wk-in ${t.bodyProse} text-foreground space-y-[var(--s-2)] max-w-[38ch]`}>
            {foot.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
      </div>
      <div className="self-center">{board("min(80vh, 46vw)")}</div>
      <div className="flex flex-col justify-between gap-[var(--s-5)] w-[clamp(15rem,19vw,23rem)] pt-[var(--s-4)]">
        <div className="flex flex-col gap-[var(--s-3)]">
          <Kicker screen={screen} ink={ink} n={n} />
          <div className={`wk-in ${t.bodyProse} text-foreground space-y-[var(--s-2)] max-w-[38ch]`}>
            {top.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="flex flex-col gap-[var(--s-3)]">{proof("22vw")}</div>
      </div>
    </div>
  );
}
