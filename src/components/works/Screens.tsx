"use client";
// In-app screens as the AE board sets them (10.2. HerondPointRewards 2): the long profile screen behind, the
// badge detail card laid over its right side. A screen taller than its phone window scrolls inside it on a
// slow loop (transform only; pointing at it holds it); under reduced motion it holds and scrolls by hand.
// The art those screens carry (extras) sits as a small labelled strip.
import type { CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Kicker, Captioned, aspectOf, type SectionProps } from "./kit";
import { t } from "@/lib/designSystem";

/** a phone window: 9 wide by 19.5 tall */
const WINDOW = 9 / 19.5;

function Phone({ src, label, width, className = "", style }: { src: string; label?: string; width: string; className?: string; style?: CSSProperties }) {
  const a = aspectOf(src);
  const long = a < WINDOW;
  // how far the screen travels, as a share of its own height, to bring its foot into the window
  const travel = long ? 1 - a / WINDOW : 0;
  return (
    <figure className={`wk-in m-0 flex flex-col gap-2 ${className}`} style={{ width, ...style }}>
      <div
        className={`wk-phone relative w-full ${long ? "is-long" : ""}`}
        style={{ aspectRatio: `${long ? WINDOW : a}` }}
        tabIndex={long ? 0 : undefined}
        role={long ? "region" : undefined}
        aria-label={long ? `${label ?? "Screen"}, scrolls` : undefined}
      >
        <div className="wk-phone-scroll w-full" style={{ aspectRatio: `${a}`, "--travel": `${-travel * 100}%` } as CSSProperties}>
          <div className="relative w-full h-full">
            <WorkMedia src={src} alt={label ?? ""} sizes="30vw" />
          </div>
        </div>
      </div>
      {label && <figcaption className="wk-cap">{label}</figcaption>}
    </figure>
  );
}

export default function Screens({ screen, isMobile, ink, n }: SectionProps) {
  const [back, front] = screen.items ?? [];
  const art = screen.extras ?? [];
  const paras = (screen.description ?? "").split("\n\n").filter(Boolean);

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Kicker screen={screen} ink={ink} n={n} />
        {paras.length > 0 && <div className={`${t.bodyProse} space-y-[var(--s-2)]`}>{paras.map((p, i) => <p key={i}>{p}</p>)}</div>}
        <div className="relative w-full flex items-start">
          {back && <Phone src={back.src} label={back.label} width="58%" />}
          {front && <Phone src={front.src} label={front.label} width="52%" className="-ml-[10%] mt-[18%] relative z-10" />}
        </div>
        {art.length > 0 && (
          <div className="wk-rail -mx-6 px-6 gap-3 scroll-px-6">
            {art.map((x, i) => <Captioned key={x.src} item={x} size={{ w: "28vw" }} sizes="28vw" i={i} />)}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="h-full py-12 pb-20 flex items-stretch gap-[var(--s-6)]">
      <div className="flex items-center">
        {back && <Phone src={back.src} label={back.label} width="calc((100vh - 11rem) * 0.4615)" />}
        {front && (
          <Phone
            src={front.src}
            label={front.label}
            width="calc((100vh - 16rem) * 0.485)"
            className="-ml-[8vh] mt-[12vh] relative z-10"
            style={{ "--i": 1 } as CSSProperties}
          />
        )}
      </div>
      <div className="flex flex-col justify-between w-[clamp(15rem,19vw,23rem)] flex-shrink-0">
        <div className="flex flex-col gap-[var(--s-3)]">
          <Kicker screen={screen} ink={ink} n={n} />
          {paras.length > 0 && (
            <div className={`wk-in ${t.bodyProse} space-y-[var(--s-2)] max-w-[38ch]`}>{paras.map((p, i) => <p key={i}>{p}</p>)}</div>
          )}
        </div>
        {art.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {art.map((x, i) => <Captioned key={x.src} item={x} size={{ w: "100%" }} sizes="8vw" i={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
