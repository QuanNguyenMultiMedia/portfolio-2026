"use client";
// The cover: MainTitle.aep › 01.Title printed as the portfolio's front cover, shown over home on the first visit of
// a session (the layout's head script marks html[data-cover] before first paint; lib/cover). Paper, the mint
// fountain board inset by the board margin, and the comp's lockup: "a motion + design portfolio", the divider,
// "by", the name in three overprinting lines. The divider is the loader: it draws to the page's real progress
// (fonts, the reel poster, window load). The way in is the way into a book: the cover turns on its spine, its free
// edge swinging into the page so the first spread shows from the first degrees. The edge follows the hand (the turn is
// solved through the perspective so the grabbed point stays under the pointer); let go past COMMIT, or flick, and it
// goes over; short of it, it falls back. The hint, Enter, Space, ← or Escape turn it for you.
// Partway through the turn the first spread starts printing (html[data-cover] lifts, cover-open fires).
// Client boundary: pointer, focus (a modal <dialog>) and the turn. Per-frame writes go straight to style (no state).
// Reduced motion: the same gesture and keys, the cover fades instead of turning; the print-in is a fade.
import { useEffect, useRef, useState } from "react";
import { fx } from "@/lib/designSystem";
import { COVER_ATTR, COVER_EVENT, COVER_KEY } from "@/lib/cover";
import Fountain from "./Fountain";
import "@/styles/book.css";

// turn: 0 = shut, 1 = square to the page (90°, edge-on, gone)
const COMMIT = 0.42; // released past this much of the turn, the cover goes over
const FLICK = 0.55; // px/ms leftward at release: a flick turns it from anywhere
const PRINT_AT = 0.35; // the first spread starts printing here, while the cover is still swinging clear
const MIN_PRINT = 1700; // ms: the lockup's own print-in plays out before the cover offers to turn
const GIVE_UP = 7000; // ms: past this the cover is ready whatever is still loading
const PEEL = 0.08; // the lift when it is ready, and under a pointer at the free edge
const TURN_MS = 1100; // --t-cover-turn
const BACK_MS = 600;

// the house curves (designSystem fx), solved for x → y
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
const easePrint = bezier(fx.ease);
const easeBack = bezier(fx.easeSharp);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// where a point x px from the spine lands on screen with the leaf turned by a (radians), under perspective p px
// with the eye on the spine's line (perspective-origin 0 50%)
const project = (x: number, a: number, p: number) => (x * Math.cos(a) * p) / (p + x * Math.sin(a));
const unproject = (X: number, a: number, p: number) => (X * p) / Math.max(1, p * Math.cos(a) - X * Math.sin(a));
// the turn that puts the leaf point x under screen X (project is monotonic in a on [0, π/2])
function solveTurn(x: number, X: number, p: number) {
  if (X >= x) return 0;
  if (X <= 0) return 1;
  let lo = 0, hi = Math.PI / 2;
  for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (project(x, m, p) > X) lo = m; else hi = m; }
  return lo / (Math.PI / 2);
}

export default function Book({ poster }: { poster: string }) {
  const [shown, setShown] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const dialog = dialogRef.current, leaf = leafRef.current, shade = shadeRef.current, rule = ruleRef.current;
    if (!root.hasAttribute(COVER_ATTR) || !dialog || !leaf || !shade || !rule) { setShown(false); return; }
    // the server sent it open (non-modal) so it paints before hydration; reopen it modal: focus held, page inert
    try { dialog.close(); dialog.showModal(); } catch { /* already modal */ }
    dialog.setAttribute("data-held", ""); // from here the cover stays up until it is turned, gate or no gate
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let turn = 0, raf = 0, printed = false, done = false, ready = false;
    let drag: { x: number; grab: number; lx: number; lt: number; v: number; moved: boolean } | null = null;
    const depth = () => parseFloat(getComputedStyle(dialog).perspective) || window.innerWidth * 2.6;

    // one writer for the turn: transform and the shading as it lifts off the paper, or a fade under reduced motion
    const write = (t: number) => {
      turn = t;
      if (reduce) leaf.style.opacity = (1 - t).toFixed(3);
      else {
        leaf.style.transform = `rotateY(${(90 * t).toFixed(2)}deg)`;
        shade.style.opacity = clamp(t * 1.6).toFixed(3);
        // nearly edge-on it is a sliver at the spine: let it go
        leaf.style.opacity = t > 0.8 ? clamp(1 - (t - 0.8) / 0.18).toFixed(3) : "1";
        // BlurMap's compound blur samples its map in the page plane: under the rotation it smears the name to
        // a haze, so past the lift the name prints with its roughen only (book.css)
        leaf.toggleAttribute("data-turning", t > PEEL * 1.5);
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
    };
    const tween = (to: number, ms: number, ease: (x: number) => number, then?: () => void) => {
      cancelAnimationFrame(raf);
      const from = turn, t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        write(from + (to - from) * ease(k));
        if (k < 1) raf = requestAnimationFrame(step);
        else then?.();
      };
      raf = requestAnimationFrame(step);
    };
    const open = () => {
      if (done) return;
      drag = null;
      leaf.removeAttribute("data-drag");
      // a turn already under way keeps its pace: only the rest of it is timed
      tween(1, reduce ? 240 : TURN_MS * (1 - turn * 0.5), reduce ? (x) => x : easePrint, finish);
    };
    const rest = () => tween(0, BACK_MS, easeBack); // let go short of the commit: it falls back onto the page

    // ---- the loader: the divider draws to what has actually arrived ----
    let got = 0;
    const parts = 3;
    const t0 = performance.now();
    const arrive = () => {
      got++;
      rule.style.transform = `scaleX(${(got / parts).toFixed(3)})`;
      if (got === parts) window.setTimeout(becomeReady, Math.max(0, MIN_PRINT - (performance.now() - t0)));
    };
    const becomeReady = () => {
      if (ready || done) return;
      ready = true;
      rule.style.transform = "scaleX(1)";
      dialog.setAttribute("data-ready", "");
      // the cover shows it hinges: a lift at the free edge, then it settles back on the page
      if (!reduce && !drag && turn === 0) tween(PEEL, 520, easePrint, () => { if (!drag && !done) tween(0, 700, easePrint); });
    };
    let loaded = false;
    const onLoad = () => { if (!loaded) { loaded = true; arrive(); } };
    (document.fonts?.ready ?? Promise.resolve()).then(arrive, arrive);
    const img = new Image();
    img.src = poster;
    img.decode().then(arrive, arrive);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const giveUp = window.setTimeout(becomeReady, GIVE_UP);

    // ---- the gesture ----
    const down = (e: PointerEvent) => {
      if (done || e.button > 0 || (e.target as HTMLElement).closest("button")) return;
      cancelAnimationFrame(raf);
      // the leaf point under the finger (unprojected, so a cover caught mid-turn stays where it is)
      const grab = unproject(e.clientX, turn * (Math.PI / 2), depth());
      drag = { x: e.clientX, grab, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
      leaf.setPointerCapture(e.pointerId);
      leaf.setAttribute("data-drag", "");
    };
    const move = (e: PointerEvent) => {
      if (!drag) {
        // a fine pointer near the free edge lifts it a little: the cover answers before it is pulled
        if (!ready || reduce || done || e.pointerType !== "mouse") return;
        const w = leaf.clientWidth;
        const lift = PEEL * clamp((e.clientX / w - 0.72) / 0.28);
        if (Math.abs(lift - turn) > 0.002) tween(lift, 420, easePrint);
        return;
      }
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      const dt = Math.max(1, e.timeStamp - drag.lt);
      drag.v = drag.v * 0.6 + ((e.clientX - drag.lx) / dt) * 0.4;
      drag.lx = e.clientX; drag.lt = e.timeStamp;
      write(solveTurn(drag.grab, e.clientX, depth()));
    };
    const up = () => {
      if (!drag) return;
      const { v, moved } = drag;
      drag = null;
      leaf.removeAttribute("data-drag");
      if (turn > COMMIT || v < -FLICK) open();
      // a tap on the cover lifts its edge and lets it fall: it opens by turning, and shows how
      else if (!moved && !reduce) tween(0.22, 360, easePrint, () => tween(0, 620, easeBack));
      else rest();
    };
    const cancel = (e: Event) => { e.preventDefault(); open(); };
    const key = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") { e.preventDefault(); open(); } };
    leaf.addEventListener("pointerdown", down);
    leaf.addEventListener("pointermove", move);
    leaf.addEventListener("pointerup", up);
    leaf.addEventListener("pointercancel", up);
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("keydown", key);
    const onOpen = () => open();
    window.addEventListener("cover-turn", onOpen);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("cover-turn", onOpen);
      leaf.removeEventListener("pointerdown", down);
      leaf.removeEventListener("pointermove", move);
      leaf.removeEventListener("pointerup", up);
      leaf.removeEventListener("pointercancel", up);
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("keydown", key);
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
            <Fountain className="book-plate" params={{ cursor: 1 }} />
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
            <button type="button" className="book-turn" onClick={() => window.dispatchEvent(new Event("cover-turn"))}>
              <span className="book-turn-arrow" aria-hidden>←</span> Turn the cover
            </button>
          </div>
          <div className="riso-tooth book-tooth" aria-hidden />
          <div ref={shadeRef} className="book-shade" aria-hidden />
        </div>
      </div>
    </dialog>
  );
}
