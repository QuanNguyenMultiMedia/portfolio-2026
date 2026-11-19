"use client";
// The cursor and the magnets. One square of ink follows the pointer on a spring (riso.css .cursor). Parts marked
// [data-magnetic] (a strength 0..1, default 0.35) lean toward the pointer while it is near them and spring home
// when it leaves; over one, the cursor opens into a plate the size of the part and travels with it. Over any
// other link or button it swells. Everything is written straight to style in one rAF loop that sleeps once
// settled (no React state per frame). Fine pointers only, and not under reduced motion: the native cursor stays.
// Client boundary: pointer listeners and the loop; renders a single decorative node.
import { useEffect, useRef } from "react";

const ENABLED = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const FOLLOW = { k: 520, c: 34 }; // the cursor: quick, no overshoot to speak of
const MAGNET = { k: 200, c: 16 }; // the parts: a softer spring with a little give
const PAD = 8; // px the plate stands proud of the part
const REACH = 0.45; // how far past the part's edge (in its own half-size) the pull keeps hold
const MAX = 18; // px: the furthest a part leans
const DOT = 10; // px: the cursor's own size (riso.css)
const LINK = "a[href], button:not(:disabled), [role='tab'], summary, label[for]";

type S = { x: number; v: number };
const spring = (s: S, to: number, k: number, c: number, dt: number) => {
  s.v += (-k * (s.x - to) - c * s.v) * dt;
  s.x += s.v * dt;
};

type Magnet = { el: HTMLElement; x: S; y: S; tx: number; ty: number };

export default function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    const mq = window.matchMedia(ENABLED);
    const root = document.documentElement;
    const px: S = { x: -100, v: 0 }, py: S = { x: -100, v: 0 };
    const sx: S = { x: 1, v: 0 }, sy: S = { x: 1, v: 0 };
    const magnets = new Map<HTMLElement, Magnet>();
    let pointer = { x: -100, y: -100 };
    let hot: HTMLElement | null = null; // the magnet the pointer holds
    let link = false; // over an ordinary way in
    let raf = 0, last = 0;

    const magnetOf = (el: HTMLElement) => {
      let m = magnets.get(el);
      if (!m) { m = { el, x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, tx: 0, ty: 0 }; magnets.set(el, m); }
      return m;
    };
    // the part's box without its own lean
    const boxOf = (m: Magnet) => {
      const r = m.el.getBoundingClientRect();
      return { cx: r.left + r.width / 2 - m.x.x, cy: r.top + r.height / 2 - m.y.x, w: r.width, h: r.height };
    };

    const frame = (t: number) => {
      const dt = Math.min(0.033, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      let tx = pointer.x, ty = pointer.y, tsx = link ? 2.8 : 1, tsy = tsx;

      if (hot) {
        const m = magnetOf(hot);
        const b = boxOf(m);
        const dx = pointer.x - b.cx, dy = pointer.y - b.cy;
        // let go once the pointer is well clear of the part
        if (Math.abs(dx) > b.w / 2 * (1 + REACH) + PAD || Math.abs(dy) > b.h / 2 * (1 + REACH) + PAD) hot = null;
        else {
          const s = parseFloat(hot.dataset.magnetic || "") || 0.35;
          m.tx = Math.max(-MAX, Math.min(MAX, dx * s));
          m.ty = Math.max(-MAX, Math.min(MAX, dy * s));
          // the plate: centred on the leaning part, a touch further toward the pointer, sized to it
          tx = b.cx + m.x.x + dx * 0.12;
          ty = b.cy + m.y.x + dy * 0.12;
          tsx = (b.w + PAD * 2) / DOT;
          tsy = (b.h + PAD * 2) / DOT;
        }
      }

      spring(px, tx, FOLLOW.k, FOLLOW.c, dt);
      spring(py, ty, FOLLOW.k, FOLLOW.c, dt);
      spring(sx, tsx, FOLLOW.k * 0.6, FOLLOW.c * 0.8, dt);
      spring(sy, tsy, FOLLOW.k * 0.6, FOLLOW.c * 0.8, dt);
      dot.style.transform = `translate3d(${px.x.toFixed(2)}px,${py.x.toFixed(2)}px,0) scale(${sx.x.toFixed(3)},${sy.x.toFixed(3)})`;

      let moving =
        Math.abs(px.x - tx) + Math.abs(py.x - ty) > 0.1 || Math.abs(px.v) + Math.abs(py.v) > 0.1 ||
        Math.abs(sx.x - tsx) + Math.abs(sy.x - tsy) > 0.001 || Math.abs(sx.v) + Math.abs(sy.v) > 0.01;

      for (const m of magnets.values()) {
        if (m.el !== hot) { m.tx = 0; m.ty = 0; }
        spring(m.x, m.tx, MAGNET.k, MAGNET.c, dt);
        spring(m.y, m.ty, MAGNET.k, MAGNET.c, dt);
        const rest = m.el !== hot && Math.abs(m.x.x) + Math.abs(m.y.x) < 0.05 && Math.abs(m.x.v) + Math.abs(m.y.v) < 0.05;
        if (rest) { m.el.style.removeProperty("translate"); magnets.delete(m.el); continue; }
        m.el.style.translate = `${m.x.x.toFixed(2)}px ${m.y.x.toFixed(2)}px`;
        moving = true;
      }

      raf = moving ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!dot.hasAttribute("data-on")) {
        // first sight: start where the pointer is, no fly-in from the corner
        px.x = e.clientX; py.x = e.clientY;
        dot.setAttribute("data-on", "");
      }
      pointer = { x: e.clientX, y: e.clientY };
      const t = e.target instanceof Element ? e.target : null;
      const mag = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (mag) hot = mag;
      link = !mag && !!t?.closest(LINK);
      wake();
    };
    const onLeave = () => { dot.removeAttribute("data-on"); hot = null; link = false; wake(); };
    const onDown = () => { sx.v -= 14; sy.v -= 14; wake(); }; // a press: the plate gives under it

    const on = () => {
      root.classList.add("has-cursor");
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    };
    const off = () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf); raf = 0; last = 0;
      for (const m of magnets.values()) m.el.style.removeProperty("translate");
      magnets.clear();
      hot = null;
      dot.removeAttribute("data-on");
    };
    const sync = () => (mq.matches ? on() : off());
    sync();
    mq.addEventListener("change", sync);
    return () => { mq.removeEventListener("change", sync); off(); };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden />;
}
