"use client";
// The project's info board, as the AE Info boards set it: a hairline, the role as the sans lead, the intro in
// the text face, a cut-out collage of the work beside it, and the chapters in the display serif, each a way
// into its part of the page. The chapters take one of the three settings the boards use:
//   band   (10.HerondLabs_Info)  a black band across the foot, the names stepping right, inked along a ramp
//   column (04.Defrasoft_info)   a fountain column down the right edge, the names in paper, ragged
//   board  (07.Zcungviet_Info 2) the whole board black, the names scattered on staggered baselines
//   intro  (02. Intro)           the copy on a fountain plate, a contents list under a rule: the page's own index
import type { CSSProperties } from "react";
import WorkMedia from "@/components/WorkMedia";
import Fountain from "@/components/riso/Fountain";
import { LEDGER_OPEN } from "./Ledger";
import { aspectOf, type Screen } from "./kit";
import type { Project } from "@/data/projects";
import { t } from "@/lib/designSystem";

export const chapterId = (c: string) => `ch-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** where each collage piece sits, as on the boards: one lead piece, the rest tucked around it */
const SPOTS: CSSProperties[] = [
  { left: "22%", top: "16%", width: "64%", zIndex: 1 },
  { left: "6%", top: "8%", width: "26%", zIndex: 2 },
  { left: "74%", top: "0%", width: "22%", zIndex: 3 },
  { left: "0%", top: "58%", width: "24%", zIndex: 3 },
  { left: "70%", top: "62%", width: "26%", zIndex: 2 },
];

/** a product line, as 04.Defrasoft_info lays it: the home screens fanned across, the app icons in a row under them */
const LINE: CSSProperties[] = [
  { left: "0%", top: "10%", width: "25%", zIndex: 1 },
  { left: "24%", top: "2%", width: "25%", zIndex: 2 },
  { left: "48%", top: "6%", width: "25%", zIndex: 3 },
  { left: "72%", top: "14%", width: "25%", zIndex: 2 },
  { left: "3%", top: "74%", width: "17%", zIndex: 4 },
  { left: "29%", top: "74%", width: "17%", zIndex: 4 },
  { left: "55%", top: "74%", width: "17%", zIndex: 4 },
  { left: "81%", top: "74%", width: "17%", zIndex: 4 },
];

function Collage({ items, className = "" }: { items: NonNullable<Screen["extras"]>; className?: string }) {
  if (items.length === 1)
    return (
      <div className={`wk-in relative ${className}`} style={{ aspectRatio: `${aspectOf(items[0].src)}`, "--i": 3 } as CSSProperties}>
        <WorkMedia src={items[0].src} alt={items[0].label ?? ""} sizes="40vw" />
      </div>
    );
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "1.15" }}>
      {items.slice(0, (items.length > SPOTS.length ? LINE : SPOTS).length).map((x, i) => (
        <div key={x.src} className="wk-in absolute" style={{ ...(items.length > SPOTS.length ? LINE : SPOTS)[i], aspectRatio: `${aspectOf(x.src)}`, "--i": 3 + i } as CSSProperties}>
          <WorkMedia src={x.src} alt={x.label ?? ""} sizes="30vw" />
        </div>
      ))}
    </div>
  );
}

export default function Info({
  screen,
  project,
  isMobile,
  opened,
}: {
  screen: Screen;
  project: Project;
  isMobile: boolean;
  /** the chapters some section on the page opens; a chapter with none is set but not linked */
  opened: string[];
}) {
  const setting = screen.info ?? "band";
  const ramp = project.print?.ramp;
  const chapters = screen.chapters ?? [];
  const ink = (k: number) =>
    setting === "band" && ramp
      ? `color-mix(in oklab, ${ramp[0]} ${100 - (k * 100) / Math.max(1, chapters.length - 1)}%, ${ramp[1]})`
      : "var(--wk-board-ink)";

  const copy = (
    <div className="flex flex-col gap-[var(--s-4)]">
      <hr className={`rule wk-in ${setting === "board" ? "border-[var(--wk-board-ink)]" : ""}`} />
      {screen.lead && (
        <p className="wk-in t-lead m-0" style={{ "--i": 1 } as CSSProperties}>
          {screen.lead.split("\n").map((l, k) => (
            <span key={k} className="block">{l}</span>
          ))}
        </p>
      )}
      <div className={`wk-in ${t.bodyProse} space-y-[var(--s-2)] max-w-[44ch]`} style={{ "--i": 2 } as CSSProperties}>
        {(screen.content ?? "").split("\n\n").map((p, k) => (
          <p key={k}>{p}</p>
        ))}
      </div>
    </div>
  );

  const list = chapters.length > 0 && (
    <nav aria-label={`${project.title}: parts`}>
      <ol
        className={`m-0 p-0 list-none ${
          setting === "board" && !isMobile
            ? "grid grid-cols-4 items-end gap-x-[var(--s-4)]"
            : setting === "column"
              ? "flex flex-col gap-[var(--s-3)]" // 04.Defrasoft_info leaves a blank line between the names
              : "flex flex-col"
        }`}
      >
        {chapters.map((c, k) => {
          const step: CSSProperties =
            setting === "band"
              ? { marginInlineStart: isMobile ? `${k * 1.5}ch` : `${k * 16}%` }
              : setting === "column"
                ? { marginInlineStart: k % 2 ? "auto" : 0, textAlign: k % 2 ? "end" : "start" }
                : isMobile
                  ? { marginInlineStart: `${(k % 3) * 1.5}ch` }
                  : // the staggered baseline takes room in the flow, so a raised name never rides up over the billboard
                    { paddingBottom: k % 2 ? "calc(min(var(--t-display-col), 7.5vh) * 0.9)" : 0 };
          const cls = `inline-block font-display leading-[0.92] ${
            setting === "column" && !isMobile
              ? "text-[length:min(var(--t-display-col),8vh)]"
              : setting === "board" && !isMobile
                ? "text-[length:min(var(--t-display-col),7.5vh)]"
                : "text-[length:var(--t-display-col)]"
          } ${
            setting === "band" && !isMobile ? "whitespace-nowrap" : setting === "board" && !isMobile ? "" : "max-w-[12ch]"
          } ${opened.includes(c) ? "wk-row" : ""}`;
          return (
            <li key={c} className="wk-in" style={{ "--i": 4 + k, ...step } as CSSProperties}>
              {opened.includes(c) ? (
                <a
                  href={`#${chapterId(c)}`}
                  onClick={(e) => {
                    const to = document.getElementById(chapterId(c));
                    if (!to) return;
                    e.preventDefault();
                    to.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", inline: "start", block: "start" });
                  }}
                  className={cls}
                  style={{ color: ink(k) }}
                >
                  {c}
                </a>
              ) : (
                <span className={cls} style={{ color: ink(k) }}>
                  {c}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const collage = screen.extras && screen.extras.length > 0 && (
    <div className="relative w-full">
      <Collage items={screen.extras} className="w-full" />
      {screen.note && <p className={`wk-in ${t.bodyProse} italic m-0 mt-[var(--s-2)] max-w-[24ch] ml-auto`}>{screen.note}</p>}
    </div>
  );

  if (setting === "intro") {
    // 02. Intro: the copy printed on the ink plate, the contents set small in the serif under a rule. On a page
    // with no chapters the contents are the page's own index (the ledger's names); choosing one opens it there.
    const names = chapters.length > 0 ? chapters : (project.screens.find((x) => x.type === "ledger")?.groups ?? []).map((g) => g.label);
    const paras = (screen.content ?? "").split("\n\n");
    return (
      <div
        className={isMobile ? "w-full flex flex-col gap-[var(--s-6)] py-[var(--s-4)]" : "w-[100vw] h-full grid grid-cols-12 gap-x-[var(--s-5)] items-center px-[var(--s-6)] pt-12 pb-24"}
      >
        <div className={`wk-in relative ${isMobile ? "" : "col-start-2 col-span-6"}`}>
          <Fountain className="!absolute inset-0 w-full h-full" />
          <div className={`relative p-[var(--s-5)] font-sans text-[length:var(--t-deck)] leading-[1.15] tracking-[-0.01em] space-y-[1em] text-[var(--ink-black-print)]`}>
            {paras.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </div>
        {names.length > 0 && (
          <nav aria-label={`${project.title}: ${screen.title ?? "contents"}`} className={`flex flex-col items-center text-center ${isMobile ? "" : "col-start-8 col-span-4"}`}>
            {screen.title && <h2 className="wk-in font-display font-normal m-0 text-[length:var(--t-display-col)] leading-[1]" style={{ "--i": 1 } as CSSProperties}>{screen.title}</h2>}
            <hr className="rule wk-in w-full mt-[var(--s-2)] mb-[var(--s-3)]" style={{ "--i": 2 } as CSSProperties} />
            <ol className="m-0 p-0 list-none flex flex-col items-center">
              {names.map((c, k) => (
                <li key={c} className="wk-in" style={{ "--i": 3 + k } as CSSProperties}>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent(LEDGER_OPEN, { detail: c }))}
                    className="wk-row font-display text-[length:var(--t-list)] leading-[1.05] cursor-pointer"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={`w-full flex flex-col gap-[var(--s-5)] ${setting === "board" ? "wk-board -mx-6 px-6 py-[var(--s-6)]" : ""}`} style={setting === "board" ? { width: "calc(100% + 3rem)" } : undefined}>
        {copy}
        {collage}
        {list && (
          <div
            className={setting === "board" ? "" : "-mx-6 px-6 py-[var(--s-5)]"}
            style={
              setting === "band"
                ? { background: "var(--ink-black-print)", width: "calc(100% + 3rem)" }
                : setting === "column"
                  ? { background: `linear-gradient(180deg, var(--fountain-${project.print?.fountain ?? "mint"}))`, width: "calc(100% + 3rem)" }
                  : undefined
            }
          >
            {list}
          </div>
        )}
      </div>
    );
  }

  if (setting === "column") {
    return (
      <div className="w-[100vw] h-full grid grid-cols-12 text-foreground">
        <div className="col-span-7 h-full min-h-0 pl-[var(--s-6)] pr-[var(--s-5)] pt-16 pb-24 flex flex-col gap-[var(--s-5)]">
          {copy}
          {screen.extras && screen.extras.length > 0 && (
            // the collage takes the height left under the copy; the aside sits beside it, as on the board
            <div className="flex-1 min-h-0 flex items-end gap-[var(--s-4)]">
              <Collage items={screen.extras} className="h-full max-w-[78%]" />
              {screen.note && <p className={`wk-in ${t.bodyProse} italic m-0 max-w-[22ch] self-center`}>{screen.note}</p>}
            </div>
          )}
        </div>
        <div className="col-span-5 h-full px-[var(--s-5)] py-16 pb-24 flex flex-col justify-center" style={{ background: `linear-gradient(180deg, var(--fountain-${project.print?.fountain ?? "mint"}))` }}>
          {list}
        </div>
      </div>
    );
  }
  if (setting === "board") {
    // 07.Zcungviet_Info 2: the role across the top, the billboard with the intro beside it, the chapters along the foot
    return (
      <div className="wk-board w-[100vw] h-full px-[var(--s-6)] pt-14 pb-24 flex flex-col justify-between gap-[var(--s-4)]">
        {screen.lead && (
          <p className="wk-in t-lead m-0">
            {screen.lead.split("\n").map((l, k) => (
              <span key={k} className="block">{l}</span>
            ))}
          </p>
        )}
        <div className="grid grid-cols-12 gap-x-[var(--s-5)] items-center min-h-0">
          {screen.extras?.[0] && (
            <div className="col-span-7 min-h-0 flex">
              <Collage items={screen.extras.slice(0, 1)} className="w-auto h-[26vh]" />
            </div>
          )}
          <div className={`wk-in col-start-9 col-span-4 ${t.bodyProse} space-y-[var(--s-2)]`} style={{ "--i": 2 } as CSSProperties}>
            {(screen.content ?? "").split("\n\n").map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </div>
        {list}
      </div>
    );
  }

  return (
    <div className="w-[100vw] h-full grid grid-rows-[1fr_auto] text-foreground">
      <div className="grid grid-cols-12 gap-x-[var(--s-5)] items-center px-[var(--s-6)] pt-12 pb-[var(--s-5)] min-h-0">
        <div className="col-span-7">{copy}</div>
        {collage && <div className="col-start-8 col-span-5 max-h-full" style={{ maxWidth: "58vh", justifySelf: "center", width: "100%" }}>{collage}</div>}
      </div>
      <div className="px-[var(--s-6)] pt-[var(--s-4)] pb-24" style={{ background: "var(--ink-black-print)" }}>
        {list}
      </div>
    </div>
  );
}
