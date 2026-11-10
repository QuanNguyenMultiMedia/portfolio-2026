"use client";
// A product line: each product as its icon, its name, and its home screen, side by side, so the apps the
// rest of the page sells are met first.
import type { CSSProperties } from "react";
import { Head, Plate, type SectionProps } from "./kit";
import { t } from "@/lib/designSystem";

export default function Roster({ screen, isMobile, ink, n }: SectionProps) {
  const apps = screen.groups ?? [];
  const hasHead = !!(screen.title || screen.description);

  return (
    <div className={isMobile ? "w-full flex flex-col gap-[var(--s-5)]" : "h-full py-16 pb-24 flex items-center gap-[var(--s-6)]"}>
      {hasHead && <Head screen={screen} ink={ink} n={n} variant={isMobile ? "stack" : "column"} />}
      <ul className={isMobile ? "grid grid-cols-2 gap-x-3 gap-y-[var(--s-4)]" : "flex items-end gap-[var(--s-5)] self-center"}>
        {apps.map((app, i) => {
          const [icon, home] = app.items;
          return (
            <li key={app.label} className="wk-in flex flex-col gap-3" style={{ "--i": i } as CSSProperties}>
              <div className="flex items-center gap-3">
                {icon && <Plate src={icon.src} size={{ h: isMobile ? "2.75rem" : "clamp(2.75rem,6vh,4rem)" }} sizes="64px" alt="" className="!p-0.5" />}
                <span className={`${t.navItemLabel} max-w-[14ch]`}>{app.label}</span>
              </div>
              {home && <Plate src={home.src} size={isMobile ? { w: "100%" } : { h: "58vh" }} sizes={isMobile ? "45vw" : "14vw"} alt={`${app.label}: home screen`} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
