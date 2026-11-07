"use client";
// Route exit choreography. Intercepts internal link clicks, lifts the page's visible blocks off the sheet in
// reading order (top→bottom, left→right, one stagger step apart), then navigates; the view transition in
// layout.tsx carries the hand-off and the next page runs its own entrance. Animates `scale` and `opacity` only
// (never `transform`), so it composes with whatever transforms a block already has (print run, Framer).
// Back/forward cannot be intercepted; popstate stamps their direction (fwd/back) for the view transition instead.
// Opt-outs: data-no-exit on an element skips it (and its subtree); [data-exit] marks a block explicitly.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WARP, getLastPath, heading, setLastPath, setWarp } from "@/lib/warp";

const BLOCKS = "[data-exit], h1, h2, h3, h4, p, li, figure, img, video, canvas, blockquote, button, a, [class*='card'], .printed";
const MAX = 14; // blocks in flight; the rest leave with the last step
const STEP = 22; // ms between blocks (riso --t-ink-stagger is 75: exits run tighter than entrances)
const DUR = WARP.exit;
const EASE = "cubic-bezier(0.7, 0, 0.84, 0)"; // ease-in: departures accelerate away (mirror of --ease-print)

function pick(root: Element): HTMLElement[] {
  const vh = window.innerHeight, vw = window.innerWidth;
  const seen = new Set<Element>();
  const out: { el: HTMLElement; top: number; left: number }[] = [];
  for (const el of root.querySelectorAll<HTMLElement>(BLOCKS)) {
    if (el.closest("[data-no-exit], nav, [role='dialog']")) continue;
    // outermost block wins: a card leaves as one piece, not as its title then its image
    let p = el.parentElement, nested = false;
    while (p && p !== root) { if (seen.has(p)) { nested = true; break; } p = p.parentElement; }
    if (nested) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
    // sheets the print run holds back in depth (hidden or faded) are not on the press: they do not take a beat
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const sheet = el.closest<HTMLElement>(".sheet");
    if (sheet && (sheet.style.pointerEvents === "none" || sheet.style.visibility === "hidden")) continue; // off the deck
    seen.add(el);
    out.push({ el, top: r.top, left: r.left });
  }
  // reading order, rows bucketed to 48px so a row of cards leaves left to right
  out.sort((a, b) => Math.round(a.top / 48) - Math.round(b.top / 48) || a.left - b.left);
  return out.map((o) => o.el);
}

export default function ExitChoreographer() {
  const router = useRouter();

  useEffect(() => {
    let busy = false;
    const onClick = (e: MouseEvent) => {
      if (busy || document.hidden || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.closest("[data-no-exit]")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;

      const root = document.querySelector("main");
      if (!root) return;
      const els = pick(root);
      if (!els.length) return;
      e.preventDefault();
      e.stopPropagation();
      busy = true;
      const to = url.pathname;
      setWarp("fwd", heading(getLastPath(), to));
      const back = document.documentElement.dataset.warp === "back";

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const anims = els.map((el, i) => {
        const delay = reduce ? 0 : Math.min(i, MAX) * STEP;
        // fwd: blocks come toward the viewer; back: they fall away
        const frames: Keyframe[] = reduce
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, scale: "1" },
              { opacity: 0, scale: back ? "0.96" : "1.04" },
            ];
        return el.animate(frames, { duration: reduce ? 160 : DUR, delay, easing: reduce ? "linear" : EASE, fill: "forwards" });
      });
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href); // fetch the next route while this one leaves, so the swap lands on time
      // navigate as the last block is halfway out, so the hand-off never sits on an empty sheet
      const total = reduce ? 160 : Math.min(els.length - 1, MAX) * STEP + DUR * 0.45;
      window.setTimeout(() => {
        router.push(href);
        setLastPath(to);
        // the old tree unmounts with its animations; release anything that survived (same-layout routes)
        window.setTimeout(() => { anims.forEach((x) => x.cancel()); busy = false; }, 900);
      }, total);
    };
    // warm the route on intent (hover, focus), so the exit never waits on a fetch with the page already bare
    const warmed = new Set<string>();
    const onIntent = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || warmed.has(url.pathname)) return;
      warmed.add(url.pathname);
      router.prefetch(url.pathname + url.search);
    };
    // Back/forward: the Navigation API reports both entry indexes before React renders the new route, so the
    // view transition already knows its direction. Without it (non-Chromium, which also lacks view
    // transitions) popstate falls back to "back".
    type Nav = EventTarget & { currentEntry?: { index: number } };
    type EntryChange = Event & { navigationType?: string; from?: { index: number } };
    const nav = (window as unknown as { navigation?: Nav }).navigation;
    const onEntry = (e: Event) => {
      const ev = e as EntryChange;
      if (ev.navigationType !== "traverse" || !nav?.currentEntry || !ev.from) return;
      setWarp(nav.currentEntry.index < ev.from.index ? "back" : "fwd", heading(getLastPath(), location.pathname));
      setLastPath(location.pathname);
    };
    const onPop = () => {
      if (nav) return;
      setWarp("back", heading(getLastPath(), location.pathname));
      setLastPath(location.pathname);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    window.addEventListener("popstate", onPop);
    nav?.addEventListener("currententrychange", onEntry);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
      window.removeEventListener("popstate", onPop);
      nav?.removeEventListener("currententrychange", onEntry);
    };
  }, [router]);

  return null;
}
