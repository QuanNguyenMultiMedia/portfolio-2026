"use client";
// The cover: MainTitle.aep › 01.Title printed as the portfolio's front cover, shown over home on the first visit of
// a session (the layout's head script marks html[data-cover] before first paint; lib/cover). Paper, the mint
// fountain board inset by the board margin, and the comp's lockup: "a motion + design portfolio", the divider,
// "by", the name in three overprinting lines.
// The plate comes first: the board holds bare paper until the fountain shader has its first frame up (or has given
// way to the CSS ramp), and only then does anything print: the plate rolls on, the lockup settles in. The divider is
// the loader: it draws to the page's real progress (the plate, fonts, the reel poster, window load).
// One click anywhere on the cover opens it (or the hint, Enter, Space, ← or Escape). It opens as a cover does: hinged
// on its spine, the free edge lifting toward the reader and over, once, on the house curve. Partway through the turn
// the first spread starts printing (html[data-cover] lifts, cover-open fires). Scrolling stays held from the first
// frame until the hero has printed in (html[data-lock], Lenis stopped, wheel and touch swallowed).
// Client boundary: focus (a modal <dialog>), the scroll hold and the turn. Per-frame writes go straight to style.
// Reduced motion: the cover fades instead of turning; the print-in is a fade.
import { useEffect, useRef, useState } from "react";
import { fx } from "@/lib/designSystem";
import { COVER_ATTR, COVER_EVENT, COVER_KEY, LOCK_ATTR } from "@/lib/cover";
import Fountain from "./Fountain";
import "@/styles/book.css";

const PRINT_AT = 0.35; // share of the turn at which the first spread starts printing, while the cover swings clear
const MIN_PRINT = 1500; // ms after the plate is down: the lockup's own print-in plays out before the hint arrives
const PLATE_WAIT = 4500; // ms: no shader frame by then (no WebGL, a stalled GPU): print on the CSS ramp
const GIVE_UP = 7000; // ms after the plate: ready whatever is still loading
const TURN_MS = 1000; // --t-cover-turn
const TURN_DEG = 100; // past edge-on: the leaf is gone (backface hidden) before the curve settles
const HERO_SETTLE = 900; // ms after the cover is gone: the hero's parts print in before scrolling is handed back

// the house curve (designSystem fx.ease), solved for x → y
function bezier([x1, y1, x2, y2]: readonly number[]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx_ = (t: number) => ((ax * t + bx) * t + cx) * t;
  const fy = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= (fx_(t) - x) / d;
    }
    return fy(Math.min(1, Math.max(0, t)));
  };
}
const easeTurn = bezier(fx.easeSharp);

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { lenis?: LenisLike }).lenis;

export default function Book({ poster }: { poster: string }) {
  const [shown, setShown] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const dialog = dialogRef.current, leaf = leafRef.current, rule = ruleRef.current;
    if (!root.hasAttribute(COVER_ATTR) || !dialog || !leaf || !rule) { setShown(false); return; }
    // the server sent it open (non-modal) so it paints before hydration; reopen it modal: focus held, page inert
    try { dialog.close(); dialog.showModal(); } catch { /* already modal */ }
    dialog.setAttribute("data-held", ""); // from here the cover stays up until it is turned, gate or no gate
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- the scroll hold: from the first frame until the hero has printed ----
    window.scrollTo(0, 0);
    root.setAttribute(LOCK_ATTR, "");
    lenis()?.stop();
    const swallow = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const opts = { capture: true, passive: false } as const;
    window.addEventListener("wheel", swallow, opts);
    window.addEventListener("touchmove", swallow, opts);
    let released = false, releaseTimer = 0;
    const release = () => {
      if (released) return;
      released = true;
      root.removeAttribute(LOCK_ATTR);
      window.removeEventListener("wheel", swallow, opts);
      window.removeEventListener("touchmove", swallow, opts);
      lenis()?.start();
    };

    let turn = 0, raf = 0, printed = false, done = false, ready = false, plated = false;

    const write = (t: number) => {
      turn = t;
      if (reduce) leaf.style.opacity = (1 - t).toFixed(3);
      else {
        leaf.style.transform = `rotateY(${(-TURN_DEG * t).toFixed(2)}deg)`;
        // BlurMap's compound blur samples its map in the page plane: off-plane it smears, so the name prints with
        // its roughen only while it turns (book.css)
        leaf.toggleAttribute("data-turning", t > 0.02);
      }
      if (!printed && t >= PRINT_AT) print();
    };
    const print = () => {
      printed = true;
      root.removeAttribute(COVER_ATTR);
      window.dispatchEvent(new Event(COVER_EVENT));
      try { sessionStorage.setItem(COVER_KEY, "1"); } catch { /* storage off: the cover shows again next visit */ }
    };
    const finish = () => {
      done = true;
      dialog.close();
      setShown(false);
      releaseTimer = window.setTimeout(release, reduce ? 250 : HERO_SETTLE);
    };
    const open = () => {
      if (done || turn > 0) return;
      const ms = reduce ? 260 : TURN_MS, t0 = performance.now();
      const ease = reduce ? (x: number) => x : easeTurn;
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        write(ease(k));
        if (k < 1) raf = requestAnimationFrame(step);
        else finish();
      };
      write(0.0001);
      raf = requestAnimationFrame(step);
    };

    // ---- the plate first: nothing prints until the shader has a frame up ----
    const plate = leaf.querySelector<HTMLElement>(".book-plate");
    const t0 = performance.now();
    let plateAt = t0;
    const onPlate = () => {
      if (plated) return;
      plated = true;
      plateAt = performance.now();
      dialog.setAttribute("data-plate", "");
      arrive();
      giveUp = window.setTimeout(becomeReady, GIVE_UP);
    };
    const watch = new MutationObserver(() => {
      if (plate?.hasAttribute("data-live") || plate?.hasAttribute("data-fallback")) onPlate();
    });
    if (plate) watch.observe(plate, { attributes: true, attributeFilter: ["data-live", "data-fallback"] });
    const plateWait = window.setTimeout(onPlate, PLATE_WAIT);
    let giveUp = 0;

    // ---- the loader: the divider draws to what has actually arrived ----
    let got = 0;
    const parts = 4;
    const arrive = () => {
      got++;
      rule.style.transform = `scaleX(${(got / parts).toFixed(3)})`;
      if (got >= parts && plated) window.setTimeout(becomeReady, Math.max(0, MIN_PRINT - (performance.now() - plateAt)));
    };
    const becomeReady = () => {
      if (ready || done || !plated) return;
      ready = true;
      rule.style.transform = "scaleX(1)";
      dialog.setAttribute("data-ready", "");
    };
    let loaded = false;
    const onLoad = () => { if (!loaded) { loaded = true; arrive(); } };
    (document.fonts?.ready ?? Promise.resolve()).then(arrive, arrive);
    const img = new Image();
    img.src = poster;
    img.decode().then(arrive, arrive);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    // ---- the way in: one click anywhere, or the keys ----
    const click = (e: MouseEvent) => { if (e.button === 0) open(); };
    const cancel = (e: Event) => { e.preventDefault(); open(); };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    };
    leaf.addEventListener("click", click);
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.clearTimeout(plateWait);
      window.clearTimeout(giveUp);
      window.clearTimeout(releaseTimer);
      window.removeEventListener("load", onLoad);
      leaf.removeEventListener("click", click);
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("keydown", key);
      release();
      // leaving mid-turn (a route change): never strand the first spread under a held gate
      if (!printed) root.removeAttribute(COVER_ATTR);
    };
  }, [poster]);

  if (!shown) return null;
  return (
    <dialog ref={dialogRef} className="book" open aria-labelledby="book-name" data-lenis-prevent="">
      <div ref={leafRef} className="book-leaf">
        <div className="book-front">
          <div className="book-board">
            <Fountain className="book-plate" params={{ cursor: 1 }} eager />
            <div className="book-lockup">
              <p className="book-line" style={{ "--o": 0 } as React.CSSProperties}>a motion + design<br />portfolio</p>
              <span className="book-rule" aria-hidden><span ref={ruleRef} /></span>
              <p className="book-by" style={{ "--o": 1 } as React.CSSProperties}>by</p>
              <p id="book-name" className="book-name" data-blurmap="">
                <span style={{ "--o": 2 } as React.CSSProperties}>NGUYEN</span>
                <span style={{ "--o": 3 } as React.CSSProperties}>MINH</span>
                <span style={{ "--o": 4 } as React.CSSProperties}>QUÂN</span>
              </p>
            </div>
            <button type="button" className="book-turn">
              Open <span className="book-turn-arrow" aria-hidden>→</span>
            </button>
          </div>
          <div className="riso-tooth book-tooth" aria-hidden />
        </div>
      </div>
    </dialog>
  );
}
