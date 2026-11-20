// DeName's system as its repo ships it (herondlabs/dename-landing-page src/index.css @theme, src/mark.ts).
// Every colour there is sampled from a pin on the moodboard; the pin number is the source.
import type { KitSystem } from "../system";

export const dename: KitSystem = {
  palette: [
    { group: "Ground", swatches: [
      { name: "paper", value: "#edece8", note: "18" }, { name: "mist", value: "#eef1ea", note: "01" },
      { name: "ink", value: "#1a1f17" }, { name: "night", value: "#080808", note: "22" },
    ] },
    { group: "Mark", swatches: [
      { name: "green", value: "#5f9848" }, { name: "forest", value: "#1a3312" }, { name: "chartreuse", value: "#d4f25a", note: "07" },
    ] },
    { group: "Leaf · 01", swatches: [
      { name: "leaf-deep", value: "#334c12" }, { name: "leaf", value: "#4b651b" }, { name: "leaf-light", value: "#a1bb77" }, { name: "leaf-lime", value: "#c0da6c" },
    ] },
    { group: "Lily · 13", swatches: [
      { name: "lily-petal", value: "#ecd3cc" }, { name: "lily-blush", value: "#d9aaa2" }, { name: "lily-pad", value: "#5f6e4c" }, { name: "lily-water", value: "#262e1c" },
    ] },
    { group: "Dawn · 04", swatches: [
      { name: "dawn-sky", value: "#4a6266" }, { name: "dawn-flare", value: "#cfd494" }, { name: "dawn-teal", value: "#4f675d" }, { name: "dawn-sun", value: "#e5c977" },
    ] },
    { group: "Bands · 21", swatches: [
      { name: "band-coral", value: "#d6582c" }, { name: "band-green", value: "#5f9a3f" }, { name: "band-ochre", value: "#c8bf55" }, { name: "band-teal", value: "#23566b" },
    ] },
  ],
  type: [
    { role: "Logotype", family: "Coaster Sans", font: "var(--dn-display)", sample: "DENAME LABS", size: "clamp(2.5rem, 4.5vw, 4.5rem)" },
    { role: "Voice", family: "Paragon", font: "var(--dn-serif)", sample: "Where ideas *scale* into impact.", size: "clamp(2.25rem, 4vw, 4rem)" },
    { role: "Body", family: "Uncut Sans", font: "var(--dn-sans)", sample: "Essential apps that simplify daily tasks and boost everyday efficiency.", size: "1.25rem" },
    { role: "Label", family: "ui-monospace", font: "var(--dn-mono)", sample: "GROWING WITH", size: "0.75rem", tracking: "0.08em" },
  ],
  space: [
    { name: "s1", value: "0.5rem" }, { name: "s2", value: "0.75rem" }, { name: "s3", value: "1rem" },
    { name: "s4", value: "clamp(1.5rem, 1.35rem + 0.6vw, 2rem)" }, { name: "s5", value: "clamp(2rem, 1.7rem + 1.2vw, 3rem)" },
    { name: "s6", value: "clamp(3rem, 2.55rem + 1.9vw, 4.5rem)" }, { name: "s7", value: "clamp(4.5rem, 3.8rem + 3vw, 7rem)" },
    { name: "s8", value: "clamp(6rem, 5rem + 4.3vw, 10rem)" },
  ],
  radii: [
    { name: "mark", value: "0.75rem", note: "M/φ³" }, { name: "frame", value: "1.25rem" }, { name: "glass", value: "1.5rem" },
  ],
};
