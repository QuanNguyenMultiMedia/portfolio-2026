"use client";
// A component from the site's own code, running in its own system: the section takes the kit's ground, type and
// palette (showcase/<kit>/kit.css), the note beside it says what makes the piece work. The stage owns its pointer
// ([data-play]), so the spread's drag-scroll never fights a slider or a handle.
import { PIECES } from "@/components/showcase/registry";
import "@/components/showcase/kits.css";
import { type SectionProps } from "./kit";

export default function Play({ screen, isMobile }: SectionProps) {
  const Piece = screen.kit && screen.piece ? PIECES[`${screen.kit}/${screen.piece}`] : undefined;
  const paras = (screen.description ?? "").split("\n\n").filter(Boolean);
  const note = (
    <header className="sc-note wk-in flex flex-col gap-[var(--s-3)]">
      {screen.chapter && screen.chapter !== screen.title && <span className="sc-label">{screen.chapter}</span>}
      <h2 className="sc-title m-0">{screen.title}</h2>
      {paras.map((p, i) => (
        <p key={i} className="sc-body m-0">{p}</p>
      ))}
    </header>
  );
  return (
    <div
      className={`sc sc-${screen.kit} ${isMobile ? "w-full flex flex-col gap-[var(--s-4)] px-6 py-12 -mx-6" : "h-full flex items-stretch gap-[var(--s-6)] px-[var(--s-6)] py-16"}`}
      style={isMobile ? { width: "calc(100% + 3rem)" } : undefined}
    >
      {isMobile ? note : <div className="flex flex-col justify-end w-[clamp(16rem,20vw,24rem)] flex-shrink-0">{note}</div>}
      <div
        data-play=""
        data-lenis-prevent=""
        className="sc-stage wk-in relative overflow-hidden"
        style={isMobile ? { height: "78svh", width: "100%" } : { width: "min(66vw, calc((100svh - 8rem) * 1.6))" }}
      >
        {Piece && <Piece />}
      </div>
    </div>
  );
}
