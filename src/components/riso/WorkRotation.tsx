"use client";
// Home · the works in rotation: one press sheet that prints each case study in turn, on the same 12-column grid
// as the rest of the run. Each turn reads like the case page's own cover in short: the cover pressed in at its real
// aspect ratio, what it was and for whom, its chapters as ways straight into the case page, and the name printed in
// the project's own fountain under it. The cases' names run along the foot; the held
// one's hairline fills in its deck ink as the turn runs, and the sheet moves on when it is full.
// It turns only while its sheet holds the view; pointing at it or focusing into it holds the turn, the Pause
// control stops it (and the footage), and under reduced motion it never turns on its own.
// Client boundary: the turn, the timer, the footage. Content comes in as props from the home page (server).
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BleedName from "./BleedName";
import { useSheetLive } from "@/hooks/useSheetLive";
import type { Project } from "@/data/projects";

export type RotationPlate = { src: string; poster?: string; w: number; h: number; video: boolean };
export type RotationWork = {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  role: string;
  description: string;
  print: NonNullable<Project["print"]>;
  plates: RotationPlate[];
  contents: { label: string; href?: string }[];
};

const SWIPE = 40; // px of horizontal travel on the cover that turns the sheet

function Plate({ plate, k, play }: { plate: RotationPlate; k: number; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);
  return (
    <div className="rot-plate printed" style={{ "--ar": plate.w / plate.h, "--k": k } as React.CSSProperties}>
      {plate.video ? (
        <video ref={ref} src={plate.src} poster={plate.poster} muted loop playsInline preload="auto" />
      ) : (
        <Image src={plate.src} alt="" width={plate.w} height={plate.h} sizes="(max-width: 640px) 100vw, 58vw" />
      )}
    </div>
  );
}

export default function WorkRotation({ works }: { works: RotationWork[] }) {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; turned: boolean }>({ x: NaN, turned: false });
  const n = works.length;
  const [i, setI] = useState(0);
  const [stopped, setStopped] = useState(false); // the viewer stopped it
  const [held, setHeld] = useState(false); // pointer over the sheet or focus inside it
  const [still, setStill] = useState(false); // reduced motion: turns by hand only
  const live = useSheetLive(root);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = live && !stopped && !held && !still;
  const go = (k: number) => setI(((k % n) + n) % n);
  const w = works[i];

  // the tabs answer the arrow keys as one control (roving focus); W/S stay the run's
  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : d ? (i + d + n) % n : -1;
    if (to < 0) return;
    e.preventDefault();
    go(to);
    tabs.current[to]?.focus();
  };

  return (
    <div
      ref={root}
      className={`rot ${w.print.deck}`}
      data-running={running ? "" : undefined}
      aria-roledescription="carousel"
      aria-label="Selected work"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
    >
      <div
        className="rot-panel"
        id="rot-panel"
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={`${i + 1} of ${n}: ${w.title}`}
        aria-live={running ? "off" : "polite"}
      >
        {/* the cover, pressed in: a second, pointer-only way into the case; a sideways swipe turns the sheet */}
        <Link
          href={`/works/${w.slug}`}
          className="rot-media cue-press"
          data-o=""
          tabIndex={-1}
          aria-hidden
          draggable={false}
          style={{ "--n": w.plates.length, "--o": 0 } as React.CSSProperties}
          onPointerDown={(e) => { swipe.current = { x: e.clientX, turned: false }; }}
          onPointerUp={(e) => {
            const dx = e.clientX - swipe.current.x;
            if (!(Math.abs(dx) >= SWIPE)) return;
            swipe.current.turned = true;
            go(i + (dx < 0 ? 1 : -1));
          }}
          onClickCapture={(e) => {
            // a swipe ends on a click: it turned the sheet, so it doesn't also open the case
            if (swipe.current.turned) { e.preventDefault(); swipe.current.turned = false; }
          }}
        >
          {w.plates.map((p, k) => (
            <Plate key={`${w.slug}-${p.src}`} plate={p} k={k} play={live && !stopped && !still} />
          ))}
        </Link>

        {/* what it was, for whom and when, then its chapters: each opens the case page at it */}
        <div className="rot-side" data-o="" style={{ "--o": 1 } as React.CSSProperties}>
          <div className="rot-side-in" key={w.slug}>
          <p className="rot-desc rot-in" style={{ "--k": 0 } as React.CSSProperties}>{w.description}</p>
          <p className="rot-credit rot-in" style={{ "--k": 1 } as React.CSSProperties}>{w.client}, {w.year}</p>
          <ul className="rot-contents" data-many={w.contents.length > 4 ? "" : undefined}>
            {w.contents.map((c, k) => (
              <li key={c.label} className="rot-in" style={{ "--k": 2 + k } as React.CSSProperties}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </li>
            ))}
          </ul>
          </div>
        </div>

        {/* the name, in the project's own fountain (as its case cover prints it): the way in */}
        <h2 className="rot-name" data-o="" style={{ "--o": 2 } as React.CSSProperties}>
          <Link href={`/works/${w.slug}`} aria-label={w.title}>
            <BleedName key={w.slug} as="div" title={w.title} print={w.print} className="rot-name-in" />
            <span className="view-arrow" aria-hidden>→</span>
          </Link>
        </h2>
      </div>

      {/* the index along the foot: every case by name; the held one's rule fills as its turn runs */}
      <div className="rot-tabs" data-o="" style={{ "--o": 3 } as React.CSSProperties} role="tablist" aria-label="Case studies" onKeyDown={onTabKey}>
        {works.map((x, k) => (
          <button
            key={x.slug}
            ref={(el) => { tabs.current[k] = el; }}
            type="button"
            role="tab"
            className={`rot-tab ${x.print.deck}`}
            aria-selected={k === i}
            aria-controls="rot-panel"
            tabIndex={k === i ? 0 : -1}
            onClick={() => go(k)}
          >
            <span className="rot-bar" aria-hidden onAnimationEnd={k === i ? () => go(i + 1) : undefined} />
            <span className="rot-tab-title">{x.title}</span>
          </button>
        ))}
        {still ? null : (
          <button type="button" className="rot-stop" onClick={() => setStopped((s) => !s)} aria-pressed={stopped}>
            {stopped ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
