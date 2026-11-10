"use client";
// Short loops, each named for the one feature or headline it shows, grouped by device or campaign. The group
// is the unit: its name and count head its run, its pieces share one height so a set reads as a set.
import { Head, Lanes, Rail, GroupLabel, aspectOf, offsets, type SectionProps } from "./kit";

export default function Loops({ screen, isMobile, ink, n }: SectionProps) {
  const groups = screen.groups ?? [];

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-5)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-3">
            {groups.length > 1 && <GroupLabel label={g.label} note={g.note} count={g.items.length} />}
            <Rail items={g.items} />
          </div>
        ))}
      </div>
    );
  }

  // groups stand side by side; a group running past ~5 heights folds into two lanes
  const starts = offsets(groups.map((g) => g.items.length));
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      {groups.map((g, gi) => {
        const run = g.items.reduce((s, x) => s + aspectOf(x.src), 0);
        const lanes = run > 5 ? 2 : 1;
        const height = lanes === 2 ? 70 : run < 1.6 ? 56 : 64;
        return (
          <div key={g.label} className="flex-shrink-0 flex flex-col gap-4 self-center">
            {groups.length > 1 && <GroupLabel label={g.label} note={g.note} count={g.items.length} />}
            <Lanes items={g.items} height={height} lanes={lanes} start={starts[gi]} />
          </div>
        );
      })}
    </div>
  );
}
