"use client";
// Home · works & words: eight proof frames hung on the grid, each re-printing a different fragment from the case
// studies on its own clock, so the sheet never shows the same spread twice. The hang itself re-arranges on a
// slower clock (three compositions, one feature frame each): every frame glides to its new bay on the house
// curve (a native FLIP on the Web Animations API, transform only), so a re-hang reads as the wall being
// re-pinned, never as a jump. The testimonials run as one pull
// quote set into the collage, turned by its own counter. Nothing here is a menu: the pieces tease, View Works
// (next sheet) is the way in.
// Videos play only while the frame is on screen; under reduced motion the frames hold their first proofs as
// posters and the quote turns only by hand.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fx } from "@/lib/designSystem";
import { mediaMeta } from "@/data/workMedia";
import type { Testimonial } from "@/data/testimonials";

export interface Proof { src: string; from: string }

// fragments per frame: each frame draws from its own deck so neighbours never collide
const DECKS: Proof[][] = [
  [
    // the feature deck: landscape, full-colour pieces only (a pale clip vanishes into the paper at this size)
    { src: "/works/herond-browser/ui-film.mp4", from: "Herond Browser" },
    { src: "/works/z-cung-viet/production-recap.mp4", from: "Z Cung Viet" },
    { src: "/works/2026-reel/ui-mobilenewconcept-eng-1920x1080.mp4", from: "2026 Reel" },
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
  [
    { src: "/works/2026-reel/ui-shield.mp4", from: "2026 Reel" },
    { src: "/works/defrasoft/ad-hidefiles.mp4", from: "Defrasoft" },
    { src: "/works/2026-reel/type-relay.mp4", from: "2026 Reel" },
  ],
  [
    { src: "/works/2026-reel/ui-wallet.mp4", from: "2026 Reel" },
    { src: "/works/2026-reel/type-ai.mp4", from: "2026 Reel" },
    { src: "/works/defrasoft/ad-databackup.mp4", from: "Defrasoft" },
  ],
  [
    { src: "/works/2026-reel/ui-grouptab.mp4", from: "2026 Reel" },
    { src: "/works/2026-reel/type-final-comp-1.mp4", from: "2026 Reel" },
    { src: "/works/defrasoft/rive-full.mp4", from: "Defrasoft" },
  ],
];
// each frame keeps its own clock (ms), offset so the swaps ripple instead of landing together
const CLOCK = [6200, 7400, 5600, 8100, 6800, 7900, 5900, 8600];
// the wall re-hangs on its own, slower clock: three compositions (home.css [data-hang])
const HANGS = 3;
const HANG_CLOCK = 15000;
// the re-pin: a long, soft glide so eight frames moving at once still read as one gesture
const REHANG_MS = 1400;
const REHANG_EASE = `cubic-bezier(${fx.ease.join(",")})`;
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

  return (
    // outer box: the grid bay (and PrintRun's depth layer); inner: the print, which glides between bays
    <div ref={ref} className={`proof proof-${slot}`}>
      <div className="proof-hang">
        <div className="proof-plate">
          {/* keyed: each swap mounts a fresh print, so the in-animation reruns */}
          <ProofMedia key={p.src} proof={p} play={onScreen} />
        </div>
        <p key={p.src} className="proof-from">{p.from}</p>
      </div>
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
    <video ref={v} className="proof-print" src={proof.src} poster={m?.poster} muted loop playsInline preload="none" aria-label={`${proof.from}, work fragment`} />
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

  // re-hang the wall while it is on screen; PrintRun re-measures its depth layers once the frames land
  const [hang, setHang] = useState(0);
  const [wallOn, setWallOn] = useState(false);
  const wall = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const sheet = wall.current?.closest(".drift");
    if (!sheet) return;
    const io = new IntersectionObserver(([e]) => setWallOn(e.isIntersecting), { threshold: 0.5 });
    io.observe(sheet);
    return () => io.disconnect();
  }, []);
  // FLIP: read every print's box, re-hang, read again, then play each one from its old box to the new
  useLayoutEffect(() => {
    const sheet = wall.current?.closest<HTMLElement>(".drift");
    if (!sheet) return;
    const prints = Array.from(sheet.querySelectorAll<HTMLElement>(".proof-hang"));
    const before = prints.map((el) => el.getBoundingClientRect());
    sheet.dataset.hang = String(hang);
    if (reduced()) return;
    prints.forEach((el, i) => {
      const a = before[i], b = el.getBoundingClientRect();
      if (!b.width || !b.height || (Math.abs(a.left - b.left) < 1 && Math.abs(a.top - b.top) < 1 && Math.abs(a.width - b.width) < 1)) return;
      // centre to centre, one uniform scale: a print never squashes on the way
      const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
      const k = Math.min(a.width / b.width, a.height / b.height);
      el.animate(
        [{ transform: `translate3d(${dx}px,${dy}px,0) scale(${k})` }, { transform: "none" }],
        { duration: REHANG_MS, easing: REHANG_EASE, delay: i * 40 }, // a ripple across the wall, not a lockstep
      );
    });
    const t = window.setTimeout(() => window.dispatchEvent(new Event("run-measure")), REHANG_MS + 400);
    return () => window.clearTimeout(t);
  }, [hang]);
  useEffect(() => {
    if (!wallOn || reduced()) return;
    const id = window.setInterval(() => setHang((h) => (h + 1) % HANGS), HANG_CLOCK);
    return () => window.clearInterval(id);
  }, [wallOn]);

  const turn = (d: number) => { setHeld(true); setQ((n) => (n + d + quotes.length) % quotes.length); };
  const cur = quotes[q];

  return (
    <>
      <span ref={wall} hidden />
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
