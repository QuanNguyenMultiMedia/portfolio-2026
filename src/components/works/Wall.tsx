"use client";
// A dense wall of cuts on black, drifting up, as the AE social board runs them (10.3. HerondSocialMedia).
// Three columns, each cut at its own aspect, each column drifting at its own pace and easing back (transform
// only, measured once per resize); pointing at the wall holds it. On a phone the page's own scroll is the
// drift, so the wall stands still in two columns. Under reduced motion it stands still everywhere.
import { useEffect, useRef, type CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";
import { Head, balance, aspectOf, type SectionProps } from "./kit";

export default function Wall({ screen, isMobile, ink, n }: SectionProps) {
  const cuts = screen.items ?? [];
  const board = useRef<HTMLDivElement>(null);
  const cols = isMobile ? 2 : 3;
  // balance by height (1 / aspect) so the columns end near each other
  const lanes = balance(cuts, (x) => 1 / aspectOf(x.src), cols);
  usePauseOffscreen(board);

  useEffect(() => {
    const el = board.current;
    if (!el || isMobile) return;
    const set = () => {
      const h = el.clientHeight;
      el.querySelectorAll<HTMLElement>(".wk-wall-col").forEach((c) => {
        c.style.setProperty("--drift", `${Math.min(0, h - c.scrollHeight)}px`);
      });
    };
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const grid = (
    <div
      ref={board}
      className={`wk-wall grid gap-[var(--s-2)] ${isMobile ? "is-still grid-cols-2" : "grid-cols-3 h-full overflow-hidden"}`}
      style={isMobile ? undefined : { width: "min(62vw, 120vh)" }}
    >
      {lanes.map((lane, li) => (
        <div key={li} className="wk-wall-col flex flex-col gap-[var(--s-2)]" style={{ "--pace": `${38 + li * 9}s`, "--delay": `${-li * 7}s` } as CSSProperties}>
          {lane.map((c) => (
            <div key={c.src} className="relative w-full" style={{ aspectRatio: `${aspectOf(c.src)}` }}>
              <WorkMedia src={c.src} alt={c.label} sizes={isMobile ? "50vw" : "22vw"} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="wk-board -mx-6 px-6 py-[var(--s-6)] flex flex-col gap-[var(--s-5)]" style={{ width: "calc(100% + 3rem)" }}>
        <Head screen={screen} ink={ink} n={n} variant="stack" onDark />
        {grid}
      </div>
    );
  }
  return (
    <div className="wk-board h-full flex items-stretch gap-[var(--s-6)] px-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} onDark className="pt-12 !pb-24" />
      {grid}
    </div>
  );
}
