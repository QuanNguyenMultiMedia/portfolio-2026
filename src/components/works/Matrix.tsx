"use client";
// One creative cut along an axis (formats, audiences), as a table: each creative is a column, each cut a row,
// so reading across a row compares creatives in one format and reading down a column is one campaign's set.
// Columns share one width; a row is as tall as its tallest cut, so every format lines up. A cut that was
// never made is an empty frame, said plainly.
import type { CSSProperties } from "react";
import { Head, Plate, aspectOf, offsets, type SectionProps } from "./kit";
import type { MediaTable } from "@/data/projects";

function Table({ table, colW, start }: { table: MediaTable; colW: string; start: number }) {
  // row height in column widths: the tallest cut in that row (1 / aspect)
  const rowK = table.axis.map((_, r) => Math.max(...table.lines.map((l) => (l.cells[r] ? 1 / aspectOf(l.cells[r]!) : 0)), 0.5));
  return (
    <div
      role="table"
      aria-label={table.title}
      className="grid gap-x-3 gap-y-3 flex-shrink-0"
      style={{
        gridTemplateColumns: `max-content repeat(${table.lines.length}, ${colW})`,
        gridTemplateRows: `auto ${rowK.map((k) => `calc(${colW} * ${k.toFixed(4)})`).join(" ")}`,
      }}
    >
      <div role="row" className="contents">
        <span role="columnheader" className="wk-cap self-end pb-1 sticky left-0 bg-background z-[1] pr-2">
          {table.title}
        </span>
        {table.lines.map((l, li) => (
          <span key={l.label} role="columnheader" className="wk-in wk-cap self-end pb-1 border-b border-primary/25" style={{ "--i": start + li } as CSSProperties}>
            {l.label}
          </span>
        ))}
      </div>
      {table.axis.map((ax, r) => (
        <div role="row" key={ax} className="contents">
          <span role="rowheader" className="wk-cap wk-num self-start sticky left-0 bg-background z-[1] pr-2">
            {ax}
          </span>
          {table.lines.map((l, li) => {
            const src = l.cells[r];
            return (
              <div role="cell" key={l.label} className="wk-in self-start" style={{ "--i": start + li } as CSSProperties}>
                {src ? (
                  <Plate src={src} size={{ w: colW }} sizes="18vw" alt={`${l.label}, ${ax}`} />
                ) : (
                  <div className="wk-plate grid place-items-center wk-cap" style={{ width: colW, aspectRatio: "1" }}>
                    <span aria-label="no cut">—</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Matrix({ screen, isMobile, ink, n }: SectionProps) {
  const tables = screen.tables ?? [];
  const height = (tb: MediaTable) =>
    tb.axis.reduce((s, _, r) => s + Math.max(...tb.lines.map((l) => (l.cells[r] ? 1 / aspectOf(l.cells[r]!) : 0)), 0.5), 0);

  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-[var(--s-5)]">
        <Head screen={screen} ink={ink} n={n} variant="stack" />
        {tables.map((tb) => (
          <div key={tb.title} className="overflow-x-auto -mx-6 px-6 [scrollbar-width:none]">
            <Table table={tb} colW="34vw" start={0} />
          </div>
        ))}
      </div>
    );
  }

  // each table's column width is set so its rows fill the sheet's height
  const starts = offsets(tables.map((tb) => tb.lines.length));
  return (
    <div className="h-full py-16 pb-24 flex items-center gap-[var(--s-6)]">
      <Head screen={screen} ink={ink} n={n} />
      {tables.map((tb, ti) => {
        const k = height(tb);
        return (
          <div key={tb.title} className="self-center">
            <Table table={tb} colW={`calc((68vh - 1.5rem - ${tb.axis.length * 0.75}rem) / ${k.toFixed(4)})`} start={starts[ti]} />
          </div>
        );
      })}
    </div>
  );
}
