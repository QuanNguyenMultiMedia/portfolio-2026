"use client";
// The site's design system, set from the tokens its repo ships and in its own fonts: palette by family, the type
// voices with their real faces, the space ladder at true size, radii. The sheet wears the kit (kits.css).
import type { CSSProperties } from "react";
import type { KitSystem } from "@/components/showcase/system";
import { dename } from "@/components/showcase/dename/tokens";
import "@/components/showcase/kits.css";
import { type SectionProps } from "./kit";

const SYSTEMS: Partial<Record<NonNullable<SectionProps["screen"]["kit"]>, KitSystem>> = { dename };

const rich = (s: string) => s.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : p));

export default function System({ screen, isMobile }: SectionProps) {
  const sys = screen.kit ? SYSTEMS[screen.kit] : undefined;
  if (!sys) return null;
  return (
    <div
      className={`sc sc-${screen.kit} sc-system ${isMobile ? "flex flex-col gap-12 px-6 py-12" : "h-full flex items-stretch gap-[var(--s-7)] px-[var(--s-6)] py-16"}`}
      style={isMobile ? { width: "calc(100% + 3rem)", marginInline: "-1.5rem" } : undefined}
    >
      <header className="wk-in flex flex-col justify-end gap-[var(--s-3)] flex-shrink-0 w-[clamp(14rem,16vw,20rem)]">
        <span className="sc-label">{screen.chapter}</span>
        <h2 className="sc-title m-0">{screen.title}</h2>
        {screen.description && <p className="sc-body m-0">{screen.description}</p>}
      </header>

      <section aria-label="Type" className="wk-in flex flex-col justify-center gap-[var(--s-5)] flex-shrink-0 w-[min(40rem,80vw)]">
        {sys.type.map((t) => (
          <div key={t.role} className="flex flex-col gap-2 border-t border-current/20 pt-3">
            <span className="sc-label flex justify-between"><span>{t.role}</span><span>{t.family}</span></span>
            <span style={{ fontFamily: t.font, fontSize: t.size, letterSpacing: t.tracking, lineHeight: 1.08, paddingBottom: "0.1em" }}>{rich(t.sample)}</span>
          </div>
        ))}
      </section>

      <section aria-label="Colour" className="wk-in grid content-center gap-[var(--s-4)] flex-shrink-0" style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))" }}>
        {sys.palette.map((g) => (
          <div key={g.group} className="flex flex-col gap-2">
            <span className="sc-label">{g.group}</span>
            <div className="flex">
              {g.swatches.map((s) => (
                <div key={s.name} className="sc-swatch" style={{ "--sw": s.value } as CSSProperties}>
                  <span className="sc-swatch-chip" />
                  <span className="sc-swatch-name">{s.name}</span>
                  <span className="sc-swatch-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section aria-label="Space and radius" className="wk-in flex flex-col justify-center gap-[var(--s-5)] flex-shrink-0 w-[min(22rem,80vw)]">
        <div className="flex flex-col gap-2">
          <span className="sc-label">Space</span>
          {sys.space.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="sc-label w-6">{s.name}</span>
              <span className="sc-bar" style={{ width: s.value }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="sc-label">Radius</span>
          <div className="flex gap-3">
            {sys.radii.map((r) => (
              <div key={r.name} className="flex flex-col gap-1.5">
                <span className="sc-radius" style={{ borderRadius: r.value }} />
                <span className="sc-label">{r.name}{r.note ? ` · ${r.note}` : ""}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
