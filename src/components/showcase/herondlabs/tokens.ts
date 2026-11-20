// Herond Labs' system as its repo ships it: src/styles/tokens.css, generated from brand/tokens/herond-labs.tokens.json.
import type { KitSystem } from "../system";

export const herondlabs: KitSystem = {
  palette: [
    { group: "Ground", swatches: [
      { name: "paper", value: "#FAF7F5" }, { name: "card", value: "#FFFFFF" }, { name: "border", value: "#E4DCDA" }, { name: "ink", value: "#160502" },
    ] },
    { group: "Ember · one moment a page", swatches: [
      { name: "ember-100", value: "#FDE9CE" }, { name: "ember-300", value: "#F9BB6A" }, { name: "ember-500", value: "#F7941D", note: "plane only" }, { name: "ember-800", value: "#A35A00", note: "text, 4.90:1" },
    ] },
    { group: "Ink ramp", swatches: [
      { name: "ink-400", value: "#A89A93" }, { name: "ink-600", value: "#5C4C45" }, { name: "ink-700", value: "#3E2F29" }, { name: "ink-900", value: "#1E100C" },
    ] },
    { group: "Data", swatches: [
      { name: "dataviz-2", value: "#C2410C" }, { name: "dataviz-3", value: "#A16207" }, { name: "dataviz-4", value: "#0F766E" }, { name: "dataviz-5", value: "#6D28D9" },
    ] },
  ],
  type: [
    { role: "Cover · 120", family: "Inter 700", font: "var(--hl-sans)", sample: "Herond Labs", size: "clamp(3.5rem, 7vw, 7.5rem)", tracking: "-0.061em", weight: 700 },
    { role: "Title · 45", family: "Inter 700", font: "var(--hl-sans)", sample: "Herond Browser", size: "clamp(1.75rem, 3vw, 2.8rem)", weight: 700 },
    { role: "Accent", family: "Newsreader", font: "var(--hl-serif)", sample: "We build, ship & support *our own* live products.", size: "clamp(1.75rem, 3vw, 2.8rem)", weight: 300 },
    { role: "Body · 19", family: "Inter", font: "var(--hl-sans)", sample: "Product engineering teams for startups and SMEs shipping mission-critical software.", size: "1.1875rem" },
    { role: "Annotation · 13", family: "IBM Plex Mono 500", font: "var(--hl-mono)", sample: "HEROND BROWSER: DESKTOP, IN PRODUCTION", size: "0.8125rem", tracking: "0.06em", weight: 500 },
  ],
  space: [
    { name: "xxs", value: "4px" }, { name: "xs", value: "8px" }, { name: "sm", value: "12px" }, { name: "md", value: "16px" },
    { name: "lg", value: "24px" }, { name: "xl", value: "32px" }, { name: "2xl", value: "40px" }, { name: "3xl", value: "56px" },
    { name: "section", value: "120px" },
  ],
  radii: [{ name: "every corner", value: "0", note: "no exceptions" }],
};
