export interface BreakpointSizes {
  base: number;
  md: number;
  lg: number;
  xl3: number;
  xl4: number;
}

export interface TypographyParams {
  sizes: BreakpointSizes;
  tracking: number;
  weight: number;
  leading: number;
  opacity: number;
}

export interface EditableState {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    techBlue: string;
    borderNeutral: string;
    surface: string;
  };
  spacing: {
    tight: number;
    normal: number;
    wide: number;
    xl: number;
    sectionTop: number;
  };
  typography: Record<string, TypographyParams>;
  motion: {
    ease: { cx1: number; cy1: number; cx2: number; cy2: number };
    easeSharp: { cx1: number; cy1: number; cx2: number; cy2: number };
  };
}

function fmtRem(v: number): string {
  return Number.isInteger(v) && v < 10 ? `${v}` : v < 10 ? v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : v.toFixed(1);
}

export function typeClass(key: string, p: TypographyParams): string {
  const s = p.sizes;
  const isMono = key === "subtitle" || key === "meta";
  const font = isMono ? "font-mono" : key === "body" ? "font-light" : key === "h2" ? "font-bold" : "font-display";
  const upper = ["hero", "display", "h1", "h3", "subtitle", "meta"].includes(key) ? "uppercase" : "";
  const techBlue = key === "subtitle" ? "text-tech-blue" : "";
  const parts = [
    `text-[${fmtRem(s.base)}rem]`,
    `md:text-[${fmtRem(s.md)}rem]`,
    `lg:text-[${fmtRem(s.lg)}rem]`,
    `3xl:text-[${fmtRem(s.xl3)}rem]`,
    `4xl:text-[${fmtRem(s.xl4)}rem]`,
    font,
    upper,
    techBlue,
    `font-[${p.weight}]`,
    `leading-[${fmtRem(p.leading)}]`,
  ];
  if (Math.abs(p.tracking) > 0.001) parts.push(`tracking-[${p.tracking < 0 ? "" : ""}${fmtRem(p.tracking)}em]`);
  if (p.opacity < 0.99) parts.push(`opacity-${Math.round(p.opacity * 100)}`);
  return parts.filter(Boolean).join(" ");
}

export const TYPE_KEYS = ["hero", "display", "h1", "h2", "h3", "subtitle", "body", "meta"];

const INITIAL_TYPOGRAPHY: Record<string, TypographyParams> = {
  hero:     { sizes: { base: 3, md: 4.5, lg: 6.5, xl3: 8.5, xl4: 11 }, tracking: -0.02, weight: 800, leading: 0.75, opacity: 1 },
  display:  { sizes: { base: 1.875, md: 3, lg: 3.75, xl3: 4.5, xl4: 6.5 }, tracking: -0.02, weight: 700, leading: 0.85, opacity: 1 },
  h1:       { sizes: { base: 1.5, md: 2.25, lg: 3, xl3: 3.75, xl4: 4.5 }, tracking: -0.02, weight: 700, leading: 1, opacity: 1 },
  h2:       { sizes: { base: 1.125, md: 1.25, lg: 1.5, xl3: 1.875, xl4: 2.25 }, tracking: -0.02, weight: 700, leading: 0.85, opacity: 1 },
  h3:       { sizes: { base: 0.75, md: 0.875, lg: 1, xl3: 1, xl4: 1.125 }, tracking: 0.05, weight: 500, leading: 1.2, opacity: 1 },
  subtitle: { sizes: { base: 0.5625, md: 0.5625, lg: 0.5625, xl3: 0.6875, xl4: 0.75 }, tracking: 0.4, weight: 700, leading: 1.2, opacity: 0.6 },
  body:     { sizes: { base: 0.8125, md: 0.875, lg: 1, xl3: 1.125, xl4: 1.25 }, tracking: 0, weight: 300, leading: 1.75, opacity: 0.7 },
  meta:     { sizes: { base: 0.5, md: 0.5, lg: 0.5, xl3: 0.625, xl4: 0.75 }, tracking: 0.2, weight: 400, leading: 1.2, opacity: 0.3 },
};

export const DEFAULT_EDITABLE: EditableState = {
  colors: {
    background: "#f5f5f5", foreground: "#111111", primary: "#000000",
    techBlue: "#0029ff", borderNeutral: "rgba(0,0,0,0.08)", surface: "#ffffff",
  },
  spacing: { tight: 24, normal: 48, wide: 112, xl: 140, sectionTop: 96 },
  typography: TYPE_KEYS.reduce((acc, k) => ({ ...acc, [k]: { ...INITIAL_TYPOGRAPHY[k], sizes: { ...INITIAL_TYPOGRAPHY[k].sizes } } }), {} as Record<string, TypographyParams>),
  motion: { ease: { cx1: 0.16, cy1: 1, cx2: 0.3, cy2: 1 }, easeSharp: { cx1: 0.23, cy1: 1, cx2: 0.32, cy2: 1 } },
};

export function generateFileContent(state: EditableState): string {
  const { colors, spacing, motion, typography } = state;

  const typeLines = TYPE_KEYS.map(k => {
    const p = typography[k];
    return `  ${k}:     "${typeClass(k, p)}",`;
  }).join("\n");

  return `/**
 * Design & Motion System
 */

// ─── Internals ───────────────────────────────────────────────────────────────

const BASE_DELAY = 0.05;
const STAGGER = 0.05;

const ease: [number, number, number, number] = [${motion.ease.cx1}, ${motion.ease.cy1}, ${motion.ease.cx2}, ${motion.ease.cy2}];
const easeSharp: [number, number, number, number] = [${motion.easeSharp.cx1}, ${motion.easeSharp.cy1}, ${motion.easeSharp.cx2}, ${motion.easeSharp.cy2}];

const entrance = { 
  initial: { opacity: 0, x: 32, filter: "blur(8px)" }, 
  animate: { opacity: 1, x: 0, filter: "blur(0px)" } 
};

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  bg:           "bg-background text-foreground",
  surface:      "bg-surface",
  surfaceGlass: "bg-surface/30 backdrop-blur-md border border-border-neutral",
  textMuted:    "text-foreground/60",
  textDisabled: "text-foreground/30",
  accent:       "text-tech-blue border-tech-blue/30",
  borderMuted:  "border-primary/10",
  borderHover:  "group-hover:border-primary/30",
};

// ─── Motion ──────────────────────────────────────────────────────────────────

export const motion = {
  skewHover: "transition-transform duration-300 origin-left inline-block group-hover:skew-x-[-10deg]",
};

// ─── Typography — 8 hierarchy levels ─────────────────────────────────────────

export const t = {
${typeLines}
};

// ─── Layout ──────────────────────────────────────────────────────────────────

export const layout = {
  page:       "pb-32 pr-8 md:pr-24 lg:pr-32 3xl:pb-48 3xl:pr-48 4xl:pb-64 4xl:pr-64",
  detail:     "pt-36 pb-28 px-10 md:pr-48 3xl:pt-48 3xl:pb-36 3xl:px-20 3xl:pr-64 4xl:pt-60 4xl:pb-48 4xl:px-32 4xl:pr-80",
  gridSm:     "grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-12 md:gap-16 3xl:gap-20 4xl:gap-28",
  gridMd:     "grid grid-cols-1 md:grid-cols-12 gap-x-10 3xl:gap-x-18 4xl:gap-x-26 gap-y-28 md:gap-y-40 relative",
  listRow:    "group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 3xl:gap-20 4xl:gap-28 items-center border-b border-primary/5 py-14 md:py-24 3xl:py-36 4xl:py-48 transition-all duration-700",
  editorial:  "grid grid-cols-12 gap-x-8",
  mediaCol:   "col-span-4 col-start-2 3xl:col-span-5 3xl:col-start-2 4xl:col-span-6 4xl:col-start-2",
  textCol:    "col-span-4 col-start-8 3xl:col-span-5 3xl:col-start-7 4xl:col-span-5 4xl:col-start-7",
};

// ─── UI elements ─────────────────────────────────────────────────────────────

export const ui = {
  card:        "border border-primary/10 bg-surface/30 p-2.5 3xl:p-4 4xl:p-6 transition-colors duration-500 group-hover:border-primary/30",
  cardFooter:  "border-x border-b border-primary/10 bg-surface/10 px-6 py-5 3xl:px-8 3xl:py-7 4xl:px-10 4xl:py-9 transition-colors duration-500 group-hover:border-primary/30 flex justify-between items-center",
  img:         "w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-[0.23,1,0.32,1]",
  imgFade:     "object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100",
  arrow:       "opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500 ease-[0.23,1,0.32,1]",
  backButton:  "fixed top-16 left-16 md:top-24 md:left-24 3xl:top-32 3xl:left-32 4xl:top-40 4xl:left-40 z-50",
};

// ─── Motion Presets ──────────────────────────────────────────────────────────

export const fx = {
  ease,
  easeSharp,
  slideIn: (index = 0) => ({ ...entrance, transition: { duration: 0.85, ease, delay: 0.05 + index * 0.05 } }),
  headerSlideIn: { ...entrance, transition: { duration: 0.85, ease, delay: 0 } },
  fade:    { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.85, ease } },
  scaleIn: { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.85, ease } },
};
`;
}
