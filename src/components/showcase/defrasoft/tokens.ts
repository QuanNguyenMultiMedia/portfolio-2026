// Defrasoft's system as its repo ships it: web/src/styles/tokens.css and web/design.md.
import type { KitSystem } from "../system";

export const defrasoft: KitSystem = {
  palette: [
    { group: "Paper & Ink", swatches: [
      { name: "canvas", value: "#FAF9F5" }, { name: "canvas-dim", value: "#ECE9E1" }, { name: "ink-secondary", value: "#494B57" }, { name: "ink", value: "#121316" },
    ] },
    { group: "Brand field", swatches: [
      { name: "fog", value: "#CFD8DC" }, { name: "mist", value: "#9FB3C8" }, { name: "cobalt", value: "#2355F6", note: "rare accent" }, { name: "emerald", value: "#047857" },
    ] },
    { group: "Chapter washes", swatches: [
      { name: "summary", value: "#DCE4FF" }, { name: "tracker", value: "#D4EBE0" }, { name: "happ", value: "#DDE6EF" },
    ] },
  ],
  type: [
    { role: "T3 · fitted to “defragment”", family: "Funnel Display 600", font: "var(--df-display)", sample: "defragment", size: "clamp(3.5rem, 8vw, 8rem)", tracking: "-0.03em", weight: 600 },
    { role: "T2 · ÷ 2.58", family: "Funnel Display 600", font: "var(--df-display)", sample: "Restoring order.", size: "clamp(1.75rem, 3.1vw, 3.1rem)", tracking: "-0.02em", weight: 600 },
    { role: "T0 · body", family: "LT Superior", font: "var(--df-sans)", sample: "Our name comes from defragment, which means restoring order.", size: "1.0625rem" },
    { role: "Label", family: "LT Superior 500", font: "var(--df-sans)", sample: "Summary AI · 360 Tracker · Happy VPN", size: "0.875rem", weight: 500 },
  ],
  space: [
    { name: "s0 · t0×¼", value: "4px" }, { name: "s1 · t0×½", value: "8px" }, { name: "s2 · t0", value: "16px" }, { name: "s3 · t0×2", value: "32px" },
    { name: "s4 · t0×3.5", value: "56px" }, { name: "s5 · t0×6", value: "96px" }, { name: "s6 · t0×14", value: "224px" },
  ],
  radii: [{ name: "full", value: "999px", note: "controls, icons" }, { name: "2xl", value: "16px", note: "cards" }, { name: "md", value: "6px" }],
};
