"use client";
// True while an element is on screen and, inside the 3D print run, while its sheet is the one the camera holds.
// In the run every sheet sits stacked in the viewport, so an IntersectionObserver alone reports them all as
// visible: PrintRun's run-index names the held sheet, and only that sheet's footage plays.
import { useEffect, useState, type RefObject } from "react";
import { afterCover } from "@/lib/cover";

export function useSheetLive(ref: RefObject<HTMLElement | null>, threshold = 0.2) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sheet = el.closest<HTMLElement>(".sheet");
    const run = sheet?.closest(".run");
    const mine = sheet?.parentElement ? Array.from(sheet.parentElement.children).indexOf(sheet) : -1;
    let seen = false;
    let near = 0;
    // footage waits for the page: the reel sits on the first screen, and starting its download during load
    // costs the first paint on a slow connection. It goes live once the page has loaded and the thread is idle.
    let ready = false;
    let idle = 0;
    // and under the cover (lib/cover) it waits for the cover to be turned: nothing plays unseen behind it
    let offCover = () => {};
    const settle = () => { idle = window.setTimeout(() => { offCover = afterCover(() => { ready = true; update(); }); }, 200); };
    const update = () => setLive(ready && seen && (!run?.classList.contains("is-3d") || near === mine));
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; update(); }, { threshold });
    io.observe(el);
    const onIndex = (e: Event) => { near = (e as CustomEvent<{ i: number }>).detail.i; update(); };
    window.addEventListener("run-index", onIndex);
    return () => {
      io.disconnect();
      window.clearTimeout(idle);
      offCover();
      window.removeEventListener("load", settle);
      window.removeEventListener("run-index", onIndex);
    };
  }, [ref, threshold]);

  return live;
}
