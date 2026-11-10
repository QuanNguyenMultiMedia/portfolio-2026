"use client";
// Portrait ads at volume, the way they ran: one long feed of phone-shaped pieces, broken into each app's run
// under its name. An overview board (the AE board of the whole batch) leads when there is one; the
// feed takes the height left under it.
import type { CSSProperties } from "react";
import { Head, Plate, Rail, GroupLabel, Captioned, aspectOf, type SectionProps } from "./kit";

export default function Feed({ screen, isMobile, ink, n }: SectionProps) {
  const groups = screen.groups ?? [];
  const board = screen.src;

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-5)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {board && <Plate src={board} size={{ w: "100%" }} sizes="100vw" tone="dark" className="wk-in" />}
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-3">
            {groups.length > 1 && <GroupLabel label={g.label} note={g.note} count={g.items.length} />}
            <Rail items={g.items} captions={g.items.some((x) => x.label)} />
          </div>
        ))}
      </div>
    );
  }

  const boardH = board ? `min(22vh, calc(56vw / ${aspectOf(board)}))` : "0px";
  const feedH = `calc(70vh - ${boardH} - ${board ? 2 : 0}rem - 2.5rem)`;
  let k = 0;
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      <div className="flex flex-col gap-8 self-center">
        {board && (
          <div className="wk-in">
            <Plate src={board} size={{ h: boardH }} sizes="60vw" tone="dark" />
          </div>
        )}
        <div className="flex items-start gap-[var(--s-4)]">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-3 flex-shrink-0">
              {groups.length > 1 && (
                <div className="wk-in" style={{ "--i": k } as CSSProperties}>
                  <GroupLabel label={g.label} note={g.note} count={g.items.length} />
                </div>
              )}
              <div className="flex gap-2">
                {g.items.map((x) =>
                  x.label ? (
                    <Captioned key={x.src} item={x} size={{ h: `calc(${feedH} - 1.75rem)` }} sizes="16vw" i={k++} />
                  ) : (
                    <div key={x.src} className="wk-in" style={{ "--i": k++ } as CSSProperties}>
                      <Plate src={x.src} size={{ h: feedH }} sizes="16vw" alt={x.label} />
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
