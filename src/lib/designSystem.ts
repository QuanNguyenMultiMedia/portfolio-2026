/**
 * Design & Motion System
 */

// ─── Internals ───────────────────────────────────────────────────────────────

const BASE_DELAY = 0.05;
const STAGGER = 0.05;

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeSharp: [number, number, number, number] = [0.23, 1, 0.32, 1];

const entrance = { 
  initial: { opacity: 0, x: 0, y: 18, filter: "blur(6px)" }, 
  animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" } 
};

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  bg:           "bg-background text-foreground",
  surface:      "bg-surface",
  surfaceGlass: "bg-surface border-t border-primary", // glass retired: a printed field under a hairline rule
  textMuted:    "text-foreground", // ink prints solid (MainTitle.aep): hierarchy is size and face, never a paler tint
  textDisabled: "text-foreground line-through",
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
  // Riso Run roles (docs/design.md §3): Junicode speaks, Product Sans explains. Fluid sizes mirror riso.css --t-*.
  mainHeroTitle:        "font-display font-[400] text-[clamp(4.5rem,19vw,22rem)] leading-[0.85] tracking-[-0.02em]",
  heroTagline:          "font-sans font-[400] text-[clamp(1.25rem,2.6vw,2.6rem)] leading-[1.05] tracking-[-0.03em]",
  sectionHeaderDisplay: "font-display font-[400] text-[clamp(3rem,10vw,11rem)] leading-[0.88] tracking-[-0.015em]",
  pageTitle:            "font-display font-[400] text-[clamp(2.5rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.015em]",
  cardTitle:            "font-display font-[400] text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[0.95] tracking-[-0.01em]",
  navItemLabel:         "font-sans font-[400] text-[clamp(0.85rem,0.9vw,1rem)] leading-[1.2] tracking-[-0.01em]",
  monoEyebrow:          "font-sans font-[700] text-[clamp(0.75rem,0.8vw,0.9rem)] leading-[1.2] tracking-[0.02em] text-tech-blue",
  bodyProse:            "font-sans font-[400] text-[clamp(0.95rem,1.25vw,1.25rem)] leading-[1.35] tracking-[-0.005em]",
  metaDataLabel:        "font-sans italic font-[400] text-[clamp(0.8rem,0.85vw,0.95rem)] leading-[1.3]",
};

// ─── Layout ──────────────────────────────────────────────────────────────────

export const layout = {
  page:       "pb-32 pr-8 md:pr-24 lg:pr-32 3xl:pb-48 3xl:pr-48 4xl:pb-64 4xl:pr-64",
  detail:     "pt-36 pb-28 px-10 md:pr-48 3xl:pt-48 3xl:pb-36 3xl:px-20 3xl:pr-64 4xl:pt-60 4xl:pb-48 4xl:px-32 4xl:pr-80",
  gridSm:     "grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-12 md:gap-16 3xl:gap-20 4xl:gap-28",
  gridMd:     "grid grid-cols-1 md:grid-cols-12 gap-x-10 3xl:gap-x-18 4xl:gap-x-26 gap-y-28 md:gap-y-40 relative",
  listRow:    "group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 3xl:gap-20 4xl:gap-28 items-center py-10 md:py-16 3xl:py-24 4xl:py-32 transition-all duration-700",
  editorial:  "grid grid-cols-12 gap-x-8",
  mediaCol:   "col-span-4 col-start-2 3xl:col-span-5 3xl:col-start-2 4xl:col-span-6 4xl:col-start-2",
  textCol:    "col-span-4 col-start-8 3xl:col-span-5 3xl:col-start-7 4xl:col-span-5 4xl:col-start-7",
};

// ─── UI elements ─────────────────────────────────────────────────────────────

export const ui = {
  card:        "border border-primary/10 bg-surface/30 p-2.5 3xl:p-4 4xl:p-6 transition-colors duration-500 group-hover:border-primary/30",
  cardFooter:  "border-x border-b border-primary/10 bg-surface/10 px-6 py-5 3xl:px-8 3xl:py-7 4xl:px-10 4xl:py-9 transition-colors duration-500 group-hover:border-primary/30 flex justify-between items-center",
  img:         "w-full h-full object-cover mix-blend-multiply group-hover:scale-[1.03] transition-all duration-700 ease-(--ease-editorial-sharp)",
  imgFade:     "object-cover mix-blend-multiply transition-all duration-700 ease-(--ease-editorial) opacity-90 group-hover:opacity-100",
  arrow:       "opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500 ease-(--ease-editorial-sharp)",
  backButton:  "fixed top-16 left-16 md:top-24 md:left-24 3xl:top-32 3xl:left-32 4xl:top-40 4xl:left-40 z-50",
  hudKey:      "rounded-none border border-foreground/30 font-sans transition-colors",
  hudKeyActive: "rounded-none border border-foreground bg-foreground text-background",
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
