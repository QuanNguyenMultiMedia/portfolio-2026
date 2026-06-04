/**
 * Design & Motion System
 */

// ─── Internals ───────────────────────────────────────────────────────────────

const BASE_DELAY = 0.05;
const STAGGER = 0.05;

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeSharp: [number, number, number, number] = [0.23, 1, 0.32, 1];

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

// ─── Typography — Semantic Visual Roles ──────────────────────────────────────

export const t = {
  mainHeroTitle:     "text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] 3xl:text-[8.5rem] 4xl:text-[11.0rem] font-display uppercase font-[800] leading-[0.75] tracking-[-0.02em]",
  heroTagline:     "text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] 3xl:text-[1.875rem] 4xl:text-[2.25rem] font-display normal-case font-[300] leading-[1.625] tracking-[-0.02em] opacity-90 italic",
  sectionHeaderDisplay:     "text-[1.875rem] md:text-[3rem] lg:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[6.5rem] font-display uppercase font-[700] leading-[0.85] tracking-[-0.02em]",
  pageTitle:     "text-[1.5rem] md:text-[2.25rem] lg:text-[3rem] 3xl:text-[3.75rem] 4xl:text-[4.5rem] font-display uppercase font-[700] leading-[1] tracking-[-0.02em]",
  workItemName:     "text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] 3xl:text-[1.875rem] 4xl:text-[2.25rem] font-display font-bold normal-case font-[700] leading-[0.85] tracking-[-0.02em]",
  takesTitle:     "text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] 3xl:text-[1.875rem] 4xl:text-[2.25rem] font-display font-bold normal-case font-[700] leading-[0.85] tracking-[-0.02em]",
  playItemName:     "text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] 3xl:text-[1.875rem] 4xl:text-[2.25rem] font-display font-bold normal-case font-[700] leading-[0.85] tracking-[-0.02em]",
  navItemLabel:     "text-[0.75rem] md:text-[0.875rem] lg:text-[1rem] 3xl:text-[1rem] 4xl:text-[1.125rem] font-display uppercase font-[500] leading-[1.2] tracking-[0.05em]",
  monoEyebrow:     "text-[0.563rem] md:text-[0.563rem] lg:text-[0.563rem] 3xl:text-[0.688rem] 4xl:text-[0.75rem] font-mono uppercase text-tech-blue font-[700] leading-[1.2] tracking-[0.4em] opacity-60",
  bodyProse:     "text-[0.813rem] md:text-[0.875rem] lg:text-[1rem] 3xl:text-[1.125rem] 4xl:text-[1.25rem] font-light normal-case font-[300] leading-[1.75] opacity-70",
  metaDataLabel:     "text-[0.5rem] md:text-[0.5rem] lg:text-[0.5rem] 3xl:text-[0.625rem] 4xl:text-[0.75rem] font-mono uppercase font-[400] leading-[1.2] tracking-[0.2em] opacity-30",
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
  slideIn: (index = 0) => ({ ...entrance, transition: { duration: 0.85, ease, delay: BASE_DELAY + index * STAGGER } }),
  headerSlideIn: { ...entrance, transition: { duration: 0.85, ease, delay: 0 } },
  fade:    { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.85, ease } },
  scaleIn: { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.85, ease } },
};
