"use client";
// Work at volume where no single piece carries the spread: one screen, one winding path. The path enters at
// the top-left, runs across, turns, runs back, turns, and leaves at the bottom-right; every piece rides it
// stacked on the last, unframed and upright, flowing slowly along so the batch reads as a stream. Pointing at (or focusing) a
// piece stops the flow and pushes that piece up out of the stack so the whole of it shows, its neighbours
// parting around it. Pieces share one area, so a 1.91:1 banner and a 9:16 story weigh the same. Positions
// are written straight to the DOM each frame; the loop sleeps offscreen and in a hidden tab. Under reduced
// motion the stream holds still and a piece lifts without travel. Phones get the plain rail.
import { useEffect, useRef, type CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { Head, Rail, aspectOf, type SectionProps } from "./kit";
import type { MediaItem } from "@/data/projects";

/** a section's pieces: its items, or every cut of its tables (each src once), named by line and axis */
function piecesOf(screen: SectionProps["screen"]): MediaItem[] {
  if (screen.items?.length) return screen.items;
  const seen = new Set<string>();
  const out: MediaItem[] = [];
  for (const tb of screen.tables ?? [])
    for (const l of tb.lines)
      l.cells.forEach((src, r) => {
        if (!src || seen.has(src)) return;
        seen.add(src);
        out.push({ src, label: `${l.label} · ${tb.axis[r]}` });
      });
  return out;
}

// The path through the sheet, in sheet fractions: in off the top-left, three runs joined by two turns, out
// off the bottom-right. Both ends sit past the trim so a piece wraps from one to the other unseen.
const PATH: [number, number][] = [
  [-0.06, -0.08], [0.05, 0.07], [0.2, 0.11], [0.42, 0.1], [0.66, 0.08], [0.84, 0.09], [0.93, 0.15],
  [0.92, 0.27], [0.8, 0.34], [0.58, 0.36], [0.34, 0.35], [0.18, 0.37], [0.1, 0.45], [0.13, 0.53],
  [0.24, 0.58], [0.48, 0.6], [0.7, 0.6], [0.86, 0.66], [0.97, 0.84], [1.06, 1.08],
];
const SAMPLES = 720;
const LIFT = 1.45; // scale of a lifted piece
const EASE = 0.14; // per-frame approach of lift and flow (exponential)
const FLOW = 0.0045; // path lengths per second
const ENTER = 1600; // ms: the stream pouring in

/** Catmull-Rom through PATH, sampled to a lookup of points and running length (px) */
function trace(w: number, h: number) {
  const pts = PATH.map(([x, y]) => [x * w, y * h]);
  const xs = new Float32Array(SAMPLES + 1);
  const ys = new Float32Array(SAMPLES + 1);
  const len = new Float32Array(SAMPLES + 1);
  const segs = pts.length - 1;
  for (let k = 0; k <= SAMPLES; k++) {
    const f = (k / SAMPLES) * segs;
    const i = Math.min(Math.floor(f), segs - 1);
    const u = f - i;
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, segs)];
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    xs[k] = cr(p0[0], p1[0], p2[0], p3[0]);
    ys[k] = cr(p0[1], p1[1], p2[1], p3[1]);
    len[k] = k ? len[k - 1] + Math.hypot(xs[k] - xs[k - 1], ys[k] - ys[k - 1]) : 0;
  }
  return { xs, ys, len, total: len[SAMPLES] };
}

export default function Trail({ screen, isMobile, ink, n }: SectionProps) {
  const items = piecesOf(screen);
  const count = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const caption = useRef<HTMLParagraphElement>(null);
  const active = useRef(-1);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const focused = useRef(-1);
  // a big batch packs tight and small; a dozen gets room to be seen
  const area = count > 24 ? 12 : 17; // vh: the side of the square every piece's area matches

  useEffect(() => {
    const el = stage.current;
    if (!el || isMobile) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pieces = piecesOf(screen);
    const lift = new Float32Array(count);
    // where each piece rests on the path this frame (before parting and lift), and where it is drawn
    const rx = new Float32Array(count), ry = new Float32Array(count), rz = new Float32Array(count);
    const dx = new Float32Array(count), dy = new Float32Array(count);
    const hw = new Float32Array(count), hh = new Float32Array(count); // half sizes, px
    const measure = () =>
      cards.current.forEach((c, i) => {
        if (!c) return;
        hw[i] = c.offsetWidth / 2;
        hh[i] = c.offsetHeight / 2;
      });
    const seed = Array.from(screen.title ?? "").reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) / 9973;

    let path = trace(el.clientWidth, el.clientHeight);
    let h = el.clientHeight;
    const ro = new ResizeObserver(() => {
      path = trace(el.clientWidth, el.clientHeight);
      h = el.clientHeight;
      measure();
    });
    ro.observe(el);

    // point and heading at running length s (px)
    const at = (s: number) => {
      const { xs, ys, len } = path;
      let lo = 0, hi = SAMPLES;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (len[mid] < s) lo = mid;
        else hi = mid;
      }
      const span = len[hi] - len[lo] || 1;
      const u = (s - len[lo]) / span;
      return { x: xs[lo] + (xs[hi] - xs[lo]) * u, y: ys[lo] + (ys[hi] - ys[lo]) * u };
    };

    let raf = 0;
    let visible = false;
    let born = -1;
    let last = 0;
    let flow = 0; // path fraction the stream has travelled
    let speed = 1; // eases to 0 while the pointer is on the sheet
    let t = 0;
    let missSince = 0; // when the pointer last left every piece

    // Which piece the pointer means, read off where pieces REST, not where they are drawn: parting and lift move
    // pieces under a still pointer, and reading those back is what made the choice flicker. The lifted piece
    // keeps the pointer while it is anywhere over its enlarged print; otherwise the topmost resting piece under
    // it wins; over bare paper the lift lets go after a beat, so crossing a gap between pieces does not drop it.
    const pick = (now: number) => {
      if (focused.current >= 0) return focused.current;
      const p = pointer.current;
      if (!p) return -1;
      const a = active.current;
      if (a >= 0 && Math.abs(p.x - dx[a]) <= hw[a] * LIFT && Math.abs(p.y - dy[a]) <= hh[a] * LIFT) return a;
      let best = -1;
      for (let i = 0; i < count; i++)
        if (Math.abs(p.x - rx[i]) <= hw[i] && Math.abs(p.y - ry[i]) <= hh[i] && (best < 0 || rz[i] > rz[best])) best = i;
      if (best >= 0) {
        missSince = 0;
        return best;
      }
      if (!missSince) missSince = now;
      return now - missSince > 160 ? -1 : a;
    };
    const show = (i: number) => {
      if (i === active.current) return;
      active.current = i;
      if (caption.current) caption.current.textContent = i >= 0 ? (pieces[i].label ?? "") : "";
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (born < 0) born = now;
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      if (!hw[0]) measure();
      show(pick(now));
      const a = active.current;
      const k = reduce ? 1 : 1 - Math.pow(1 - EASE, dt / 16);
      if (!reduce) {
        speed += ((pointer.current || a >= 0 ? 0 : 1) - speed) * k;
        flow += (FLOW * dt * speed) / 1000;
        t += (dt * speed) / 1000;
      }
      const total = path.total;
      const step = 1 / count;
      const enter = reduce ? 1 : 1 - Math.pow(1 - Math.min((now - born) / ENTER, 1), 3);

      for (let i = 0; i < count; i++) {
        const c = cards.current[i];
        if (!c) continue;
        lift[i] += ((i === a ? 1 : 0) - lift[i]) * k;
        const L = lift[i];
        // the run pours in from the path's head on arrival, then flows (wrapping off-sheet)
        const rest = (((i + 0.5) * step + flow) % 1) * enter;
        let f = rest;
        // neighbours part around the lifted piece, along the path
        if (a >= 0 && i !== a) {
          let d = i - a;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          f += Math.sign(d) * Math.exp(-Math.abs(d) / 1.6) * lift[a] * ((h * 0.11) / total);
        }
        // a slow swell off the path, so it breathes rather than runs on rails
        const swell = (g: number) => Math.sin(g * 37 + t * 0.9 + seed * 6) * h * 0.012;
        const r0 = at(rest * total);
        rx[i] = r0.x;
        ry[i] = r0.y + swell(rest);
        rz[i] = rest;
        const p = at(((f % 1) + 1) % 1 * total);
        const s = 0.96 + 0.04 * Math.sin(f * 23 + t) + (LIFT - 1) * L;
        dx[i] = p.x;
        dy[i] = p.y + swell(f) * (1 - L) - L * h * 0.03;
        c.style.transform = `translate3d(${dx[i].toFixed(1)}px, ${dy[i].toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        c.style.opacity = "1";
        // later along the path prints over earlier; the lifted piece over all
        c.style.zIndex = `${i === a ? 2000 : L > 0.02 ? 1999 : Math.floor(rest * 1000)}`;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      wake();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", wake);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [screen, isMobile, count]);

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-4)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        <Rail items={items} captions={items.some((x) => x.label)} />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-full overflow-hidden">
      <div className="absolute left-12 md:left-24 3xl:left-40 4xl:left-48 bottom-24 z-[2100] pointer-events-none">
        <Head screen={screen} ink={ink} n={n}>
          <p ref={caption} aria-live="polite" className="wk-cap m-0 min-h-[1.25em] text-foreground" />
        </Head>
      </div>
      <div
        ref={stage}
        className="absolute inset-0"
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          pointer.current = { x: e.clientX - b.left, y: e.clientY - b.top };
        }}
        onPointerLeave={() => {
          pointer.current = null;
        }}
      >
        <ul className="m-0 p-0 list-none" aria-label={screen.title}>
          {items.map((x, i) => {
            const a = aspectOf(x.src);
            const hv = area / Math.sqrt(a);
            return (
              <li
                key={x.src}
                ref={(node) => {
                  cards.current[i] = node;
                }}
                tabIndex={0}
                aria-label={x.label}
                className="wk-trail-card absolute left-0 top-0"
                style={{ height: `${hv.toFixed(2)}vh`, width: `${(hv * a).toFixed(2)}vh`, opacity: 0 } as CSSProperties}
                onFocus={() => {
                  focused.current = i;
                }}
                onBlur={() => {
                  focused.current = -1;
                }}
              >
                {/* eager: placed by transform each frame, which lazy loading never sees arrive (pieces stayed blank) */}
                <WorkMedia src={x.src} alt={x.label} sizes="14vw" eager />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
