"use client";
// Home · works & words: five proof frames hung off-grid, each re-printing a different fragment from the case
// studies on its own clock, so the sheet never shows the same spread twice. The testimonials run as one pull
// quote set into the collage, turned by its own counter. Nothing here is a menu: the pieces tease, View Works
// (next sheet) is the way in.
// Videos play only while the frame is on screen; under reduced motion the frames hold their first proofs as
// posters and the quote turns only by hand.
import { useEffect, useRef, useState } from "react";
import { mediaMeta } from "@/data/workMedia";
import type { Testimonial } from "@/data/testimonials";

export interface Proof { src: string; from: string }

// fragments per frame: each frame draws from its own deck so neighbours never collide
const DECKS: Proof[][] = [
  [
    { src: "/works/herond-browser/ui-film.mp4", from: "Herond Browser" },
    { src: "/works/2026-reel/type-rebrand.mp4", from: "2026 Reel" },
    { src: "/works/z-cung-viet/production-recap.mp4", from: "Z Cung Viet" },
  ],
  [
    { src: "/works/defrasoft/ugc.mp4", from: "Defrasoft" },
    { src: "/works/herond-browser/mini-swap.mp4", from: "Herond Browser" },
    { src: "/works/z-cung-viet/write-time.mp4", from: "Z Cung Viet" },
    { src: "/works/select-freelance-work/storyflow.mp4", from: "Storyflow" },
  ],
  [
    { src: "/works/herond-browser/orb-3.webp", from: "Herond Browser" },
    { src: "/works/select-freelance-work/dobeedo-4.mp4", from: "Dobeedo" },
    { src: "/works/defrasoft/voicely-onboarding.mp4", from: "Defrasoft" },
    { src: "/works/select-freelance-work/freightos.mp4", from: "Freightos" },
  ],
  [
    { src: "/works/z-cung-viet/brand-mark.webp", from: "Z Cung Viet" },
    { src: "/works/defrasoft/rive-states.mp4", from: "Defrasoft" },
    { src: "/works/herond-browser/onboarding-parallax.mp4", from: "Herond Browser" },
  ],
  [
    { src: "/works/2026-reel/type-logo.mp4", from: "2026 Reel" },
    { src: "/works/select-freelance-work/monthly-spend.mp4", from: "Select Freelance" },
    { src: "/works/herond-browser/day-peace.mp4", from: "Herond Browser" },
  ],
];
// each frame keeps its own clock (ms), offset so the swaps ripple instead of landing together
const CLOCK = [6200, 7400, 5600, 8100, 6800];
const QUOTE_CLOCK = 7000;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Frame({ deck, clock, slot }: { deck: Proof[]; clock: number; slot: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || reduced() || deck.length < 2) return;
    const id = window.setInterval(() => setK((n) => (n + 1) % deck.length), clock);
    return () => window.clearInterval(id);
  }, [onScreen, clock, deck.length]);

  const p = deck[k];
  const m = mediaMeta(p.src);
  const ar = m ? `${m.w} / ${m.h}` : "4 / 3";

  return (
    <div ref={ref} className={`proof proof-${slot}`}>
      <div className="proof-plate printed" style={{ aspectRatio: ar }}>
        {/* keyed: each swap mounts a fresh print, so the in-animation reruns */}
        <ProofMedia key={p.src} proof={p} play={onScreen} />
      </div>
      <p key={p.src} className="proof-from">{p.from}</p>
    </div>
  );
}

function ProofMedia({ proof, play }: { proof: Proof; play: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  const m = mediaMeta(proof.src);
  const isVideo = m?.video ?? proof.src.endsWith(".mp4");

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    if (play && !reduced()) el.play().catch(() => {});
    else el.pause();
  }, [play]);

  return isVideo ? (
    <video ref={v} className="proof-print" src={proof.src} poster={m?.poster} muted loop playsInline preload="metadata" aria-label={`${proof.from}, work fragment`} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- swapped client-side on a clock; the poster webp is already sized for web
    <img className="proof-print" src={proof.src} alt={`${proof.from}, work fragment`} width={m?.w} height={m?.h} loading="lazy" decoding="async" />
  );
}

export default function ProofDrift({ quotes }: { quotes: Testimonial[] }) {
  const [q, setQ] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || reduced()) return;
    const id = window.setInterval(() => setQ((n) => (n + 1) % quotes.length), QUOTE_CLOCK);
    return () => window.clearInterval(id);
  }, [held, quotes.length]);

  const turn = (d: number) => { setHeld(true); setQ((n) => (n + d + quotes.length) % quotes.length); };
  const cur = quotes[q];

  return (
    <>
      {DECKS.map((deck, i) => <Frame key={i} deck={deck} clock={CLOCK[i]} slot={i + 1} />)}
      <figure className="drift-quote" aria-roledescription="carousel" aria-label="What clients say">
        <blockquote key={cur.brand} className="drift-words"><p>{cur.quote}</p></blockquote>
        <figcaption className="drift-credit">
          <span>{cur.brand}</span>
          <span className="drift-turn">
            <button type="button" onClick={() => turn(-1)} aria-label="Previous testimonial">←</button>
            <span aria-live="polite">{String(q + 1).padStart(2, "0")} / {String(quotes.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => turn(1)} aria-label="Next testimonial">→</button>
          </span>
        </figcaption>
      </figure>
    </>
  );
}
