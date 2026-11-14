"use client";
// Home · the clients' words: one pull quote set beside the freelance work it speaks about, turned by its own
// arrows (no counter: design.md §3). It turns on a clock until the reader takes the arrows; under reduced motion it
// turns only by hand. The quote and its credit are announced as they turn.
import { useEffect, useState } from "react";
import type { Testimonial } from "@/data/testimonials";

const QUOTE_CLOCK = 7000;

export default function ClientWords({ quotes }: { quotes: Testimonial[] }) {
  const [q, setQ] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setQ((n) => (n + 1) % quotes.length), QUOTE_CLOCK);
    return () => window.clearInterval(id);
  }, [held, quotes.length]);

  const turn = (d: number) => { setHeld(true); setQ((n) => (n + d + quotes.length) % quotes.length); };
  const cur = quotes[q];

  return (
    <figure className="words" aria-roledescription="carousel" aria-label="What clients say" aria-live="polite">
      {/* every quote sits in one cell, unseen, so the cell holds the tallest: a turn never resizes the sheet */}
      <div className="words-stage">
        {quotes.map((x) => <p key={x.brand} className="words-quote words-sizer" aria-hidden>{x.quote}</p>)}
        <blockquote key={cur.brand} className="words-quote"><p>{cur.quote}</p></blockquote>
      </div>
      <figcaption className="words-credit">
        <span>{cur.brand}</span>
        <span className="words-turn">
          <button type="button" onClick={() => turn(-1)} aria-label="Previous testimonial">←</button>
          <button type="button" onClick={() => turn(1)} aria-label="Next testimonial">→</button>
        </span>
      </figcaption>
    </figure>
  );
}
