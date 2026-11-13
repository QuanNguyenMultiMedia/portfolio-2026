"use client";

// Client boundary: the garden is one sheet far larger than the screen, and the reader wanders it. The sheet scrolls
// natively on both axes (touch, trackpad, wheel, keyboard focus), and a mouse can take hold of the paper and pull
// it, with a glide on release. The reader lands on the name in the middle, so pieces run off every edge; nothing
// says which way to go. Every kind has its own form, so a reader knows before the click what a piece opens into:
// a take is type under a rule (a page to read), play is a screen (a page to use), a freebie is a tall print (a
// pane), a photo is a bare print (a full view). The bed also holds what is open over it and keeps that in the URL
// (?open=slug) so either can be linked.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GardenEntry } from "@/data/garden";
import FreebiePane from "./FreebiePane";
import PhotoView from "./PhotoView";
import { t, ui, fx, motion as motionTokens } from "@/lib/designSystem";

// Planting: the sheet is a loose lattice of cells (--cell wide, ROW cells tall). Each column hangs at its own
// drop, and a piece's width and its place inside its cell are drawn from its slug: irregular, yet the same on
// every visit, and nothing overlaps. The name takes two cells in the middle. Pieces fill the cells in reading
// order, so tabbing walks the sheet instead of jumping across it.
const ROW = 1.25;
const DROP = [0, 0.34, 0.1, 0.42, 0.18, 0.38, 0.06]; // neighbours differ by under 0.4, so the name's two cells agree
const WIDTH = { takes: [0.8, 0.72], play: [0.9, 0.78], freebies: [0.58, 0.5], photos: [0.5, 0.42] } as const;
const GUTTER = 0.04;
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function plant(entries: GardenEntry[]) {
  const cells = entries.length + 2;
  const cols = Math.max(3, Math.ceil(Math.sqrt(cells * 1.3)));
  const rows = Math.ceil(cells / cols);
  const tr = Math.floor((rows - 1) / 2);
  const tc = Math.floor((cols - 2) / 2);
  const drop = (c: number) => DROP[c % DROP.length];
  let cell = 0;
  const pieces = entries.map((entry) => {
    while (Math.floor(cell / cols) === tr && (cell % cols === tc || cell % cols === tc + 1)) cell++;
    const r = Math.floor(cell / cols);
    const c = cell++ % cols;
    const h = hash(entry.slug);
    const w = WIDTH[entry.kind][h % 2];
    return {
      entry,
      style: {
        "--w": w,
        "--x": c + GUTTER + (1 - w - GUTTER * 2) * (((h >>> 2) % 5) / 4),
        "--y": r * ROW + drop(c) + ((h >>> 5) % 4) * 0.03,
        // the sheet prints outward from the name
        "--i": Math.min(Math.max(Math.abs(r - tr), c < tc ? tc - c : c - tc - 1) + 1, 8),
      } as React.CSSProperties,
    };
  });
  return {
    pieces,
    sheet: { "--cols": cols, "--rows": Math.ceil(cell / cols) * ROW + Math.max(...DROP) } as React.CSSProperties,
    name: { "--x": tc + GUTTER, "--y": tr * ROW + Math.max(drop(tc), drop(tc + 1)), "--w": 2 - GUTTER * 2, "--i": 0 } as React.CSSProperties,
  };
}

const SLOP = 6; // px a held mouse travels before it has the paper and not a link
const GLIDE = 325; // ms: time constant of the glide after a pull
const placed = "absolute left-[calc(var(--cell)*var(--x))] top-[calc(var(--cell)*var(--y))] w-[calc(var(--cell)*var(--w))]";

type Openable = Extract<GardenEntry, { kind: "freebies" | "photos" }>;

export default function GardenBed({ entries, initialOpen, children }: { entries: GardenEntry[]; initialOpen: string | null; children: React.ReactNode }) {
  const [open, setOpen] = useState<Openable | null>(
    () => (entries.find((e) => e.slug === initialOpen && (e.kind === "freebies" || e.kind === "photos")) as Openable) ?? null,
  );
  const sheet = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);

  // the open piece rides in the URL without a navigation, so the route warp never fires for a pane
  useEffect(() => {
    const url = new URL(window.location.href);
    if (open) url.searchParams.set("open", open.slug);
    else url.searchParams.delete("open");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [open]);

  // Escape closes an open piece
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Land on the name. Before hydration the sheet is held there by a mandatory snap on the name (data-settling);
  // here it is centred for certain and the snap let go, so the reader is free to leave.
  useLayoutEffect(() => {
    const el = sheet.current, n = name.current;
    if (!el || !n) return;
    const a = el.getBoundingClientRect(), b = n.getBoundingClientRect();
    el.scrollLeft += b.left + b.width / 2 - (a.left + a.width / 2);
    el.scrollTop += b.top + b.height / 2 - (a.top + a.height / 2);
    el.removeAttribute("data-settling");
  }, []);

  // A mouse pulls the paper. Touch and trackpads already scroll it natively, so only the mouse is handled; the
  // pull starts after SLOP so a plain click still reaches its link. Under reduced motion the paper stops on release.
  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, id = -1, pulling = false;
    let x0 = 0, y0 = 0, lx = 0, ly = 0, lt = 0, vx = 0, vy = 0;
    const rest = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const swallow = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      rest();
      id = e.pointerId;
      pulling = false;
      x0 = lx = e.clientX;
      y0 = ly = e.clientY;
      lt = e.timeStamp;
      vx = vy = 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      if (!pulling) {
        if (Math.hypot(e.clientX - x0, e.clientY - y0) < SLOP) return;
        pulling = true;
        el.setPointerCapture(id);
        el.dataset.pulling = "";
      }
      const dt = Math.max(e.timeStamp - lt, 1);
      const dx = e.clientX - lx, dy = e.clientY - ly;
      vx = vx * 0.6 + (dx / dt) * 0.4;
      vy = vy * 0.6 + (dy / dt) * 0.4;
      el.scrollLeft -= dx;
      el.scrollTop -= dy;
      lx = e.clientX;
      ly = e.clientY;
      lt = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      if (!pulling) return;
      delete el.dataset.pulling;
      // the release of a pull is not a click on whatever lay under it
      el.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => el.removeEventListener("click", swallow, true));
      if (reduce || e.timeStamp - lt > 80) return;
      let last = performance.now();
      const glide = (now: number) => {
        const dt = Math.min(now - last, 64);
        last = now;
        el.scrollLeft -= vx * dt;
        el.scrollTop -= vy * dt;
        const k = Math.exp(-dt / GLIDE);
        vx *= k;
        vy *= k;
        raf = Math.hypot(vx, vy) > 0.02 ? requestAnimationFrame(glide) : 0;
      };
      raf = requestAnimationFrame(glide);
    };
    const hold = (e: DragEvent) => e.preventDefault(); // links and prints are pulled with the paper, never dragged off it
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", rest, { passive: true });
    el.addEventListener("dragstart", hold);
    return () => {
      rest();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", rest);
      el.removeEventListener("dragstart", hold);
    };
  }, []);

  // a piece reached by keyboard is brought to the middle of the screen, not left at its edge
  const follow = (e: React.FocusEvent) => {
    if (!e.target.matches(":focus-visible")) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (e.target.closest("[data-piece]") ?? e.target).scrollIntoView({ block: "center", inline: "center", behavior: reduce ? "auto" : "smooth" });
  };

  const { pieces, sheet: sheetSize, name: namePlace } = plant(entries);

  return (
    <>
      <motion.div
        ref={sheet}
        data-settling=""
        data-lenis-prevent
        inert={!!open}
        onFocus={follow}
        animate={{ opacity: open ? 0.3 : 1, scale: open ? 0.98 : 1 }}
        transition={{ duration: 0.6, ease: fx.easeSharp }}
        className="h-dvh w-full overflow-auto overscroll-contain select-none cursor-grab data-[pulling]:cursor-grabbing data-[settling]:snap-both data-[settling]:snap-mandatory"
      >
        <div className="w-max px-[18vw] py-[26vh]">
          <div
            className="relative [--cell:clamp(19rem,30vw,34rem)] w-[calc(var(--cell)*var(--cols))] h-[calc(var(--cell)*var(--rows))]"
            style={sheetSize}
          >
            <div ref={name} className={`rise snap-center space-y-6 3xl:space-y-8 ${placed}`} style={namePlace}>
              <h1 className={t.sectionHeaderDisplay} data-blurmap="">
                Garden
              </h1>
              {children}
            </div>
            {pieces.map(({ entry, style }) => (
              <div key={entry.slug} data-piece="" className={`rise ${placed}`} style={style}>
                <Piece entry={entry} onOpen={setOpen} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open?.kind === "freebies" && <FreebiePane key="pane" item={open.item} onClose={() => setOpen(null)} />}
        {open?.kind === "photos" && <PhotoView key="photo" entry={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}

const sizes = "(max-width: 1024px) 19rem, 30vw";

function Piece({ entry: e, onOpen }: { entry: GardenEntry; onOpen: (e: Openable) => void }) {
  switch (e.kind) {
    // a page to read: type under a rule, no picture
    case "takes":
      return (
        <Link href={`/garden/${e.slug}`} className="group block border-t border-primary pt-6 3xl:pt-8 space-y-4 3xl:space-y-6">
          <h2 className={`${t.cardTitle} ${motionTokens.skewHover}`}>{e.title}</h2>
          <p className={`${t.bodyProse} opacity-70 group-hover:opacity-100 transition-opacity`}>{e.summary}</p>
        </Link>
      );

    // a page to use: the experiment's screen, straight-edged, its name under it
    case "play":
      return (
        <Link href={`/garden/${e.slug}`} className="group block space-y-5">
          <div className="relative aspect-video overflow-hidden bg-primary/5">
            <Image src={e.image} alt="" fill referrerPolicy="no-referrer" className={ui.img} sizes={sizes} />
          </div>
          <h2 className={`${t.cardTitle} ${motionTokens.skewHover}`}>{e.title}</h2>
        </Link>
      );

    // a pane: a tall print, its name under it
    case "freebies":
      return (
        <button type="button" onClick={() => onOpen(e)} aria-haspopup="dialog" className="group block w-full text-left cursor-pointer space-y-5">
          <motion.div layoutId={`thumb-${e.slug}`} className="relative aspect-[4/5] overflow-hidden bg-primary/5">
            <Image src={e.image} alt="" fill referrerPolicy="no-referrer" className={`${ui.imgFade} mix-blend-print`} sizes={sizes} />
          </motion.div>
          <h2 className={`${t.cardTitle} ${motionTokens.skewHover}`}>{e.title}</h2>
        </button>
      );

    // a full view: the photo alone, no frame, no words
    case "photos":
      return (
        <button type="button" onClick={() => onOpen(e)} aria-haspopup="dialog" aria-label={e.title} className="group block w-full cursor-zoom-in">
          <motion.div layoutId={`photo-${e.slug}`} className="relative aspect-[2/3] overflow-hidden">
            <Image src={e.image} alt={e.title} fill className={`${ui.imgFade} mix-blend-print`} sizes={sizes} />
          </motion.div>
        </button>
      );
  }
}
