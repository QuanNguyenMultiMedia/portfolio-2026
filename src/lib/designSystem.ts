/**
 * Design & Motion System Configuration
 * A consolidated, semantic single-source-of-truth style guide.
 */

// Shared UI patterns
const hoverSlant = "transition-transform duration-300 origin-left inline-block group-hover:skew-x-[-10deg]";

export const designSystem = {
  // Brand color utilities mapping custom properties to Tailwind classes
  colors: {
    bg: "bg-background text-foreground",
    primary: "text-primary",
    accent: "text-tech-blue",
    border: "border-border-neutral",
    surface: "bg-surface",
    surfaceGlass: "bg-surface/30 backdrop-blur-md border border-border-neutral",
  },

  // Spacing & Layout presets (Paddings, Margins, Grid scales)
  spacing: {
    pagePadding: "pb-64 pr-8 md:pr-48 3xl:pb-80 3xl:pr-64 4xl:pb-[24rem] 4xl:pr-80",
    headerSpacing: "mb-16 space-y-4 3xl:space-y-6",
    headerMargin: "mb-24 md:mb-32 3xl:mb-40",
    staggeredIndent: "md:pl-32 3xl:pl-48 4xl:pl-64",

    // Grids scaled by size
    gridSmall: "grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-12 md:gap-16 3xl:gap-20 4xl:gap-28",
    gridMedium: "grid grid-cols-1 md:grid-cols-12 gap-x-12 3xl:gap-x-20 4xl:gap-x-28 gap-y-32 md:gap-y-48 relative",
    
    // Lists & rows
    listContainer: "flex flex-col gap-0 border-t border-primary/5",
    listRow: "group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 3xl:gap-24 4xl:gap-32 items-center border-b border-primary/5 py-16 md:py-32 3xl:py-48 4xl:py-64 transition-all duration-700",
  },

  // Typography scale based on importance/scale
  typography: {
    pageHeaderTitle: "text-4xl md:text-8xl font-display uppercase leading-none tracking-tighter",
    pageHeroTitle: "text-5xl md:text-8xl 3xl:text-9xl 4xl:text-[10rem] font-display uppercase tracking-tighter leading-[0.85]",
    sectionSubtitle: "font-mono text-[9px] 3xl:text-xs 4xl:text-sm tracking-[0.4em] text-tech-blue font-bold uppercase",

    // Standard title hierarchy
    titleLarge: `text-4xl md:text-7xl lg:text-8xl 3xl:text-[5.5rem] 4xl:text-[7rem] font-display uppercase leading-none tracking-tighter ${hoverSlant}`,
    titleMedium: `text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-7xl font-display uppercase tracking-tighter leading-[0.85] text-primary font-bold ${hoverSlant}`,
    titleSmall: `font-display text-lg md:text-xl 3xl:text-2xl 4xl:text-3xl uppercase tracking-wider ${hoverSlant}`,

    // Metadata, Labels and Body Copy
    meta: "text-[10px] 3xl:text-xs 4xl:text-sm font-mono tracking-widest uppercase opacity-20 group-hover:opacity-60 transition-opacity",
    tag: "text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-40 group-hover:opacity-70",
    body: "text-body max-w-[576px] 3xl:max-w-[800px] 3xl:text-xl 4xl:max-w-[1000px] 4xl:text-2xl line-clamp-2 group-hover:opacity-100 transition-opacity",
    bodyStatic: "text-base md:text-lg 3xl:text-xl 4xl:text-2xl font-light leading-relaxed opacity-70",
  },

  // UI framing & visual feedback components
  components: {
    // Frames & Cards
    frameThumbnailSmall: "border border-primary/10 bg-surface/30 p-2.5 3xl:p-4 4xl:p-6 transition-colors duration-500 group-hover:border-primary/30",
    frameThumbnailMedium: "relative aspect-[4/5] overflow-hidden bg-primary/5 border border-primary/5 mb-4",
    frameDetailsSmall: "border-x border-b border-primary/10 bg-surface/10 px-6 py-5 3xl:px-8 3xl:py-7 4xl:px-10 4xl:py-9 transition-colors duration-500 group-hover:border-primary/30 flex justify-between items-center",
    
    // Images
    imgThumbnailSmall: "w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-[0.23,1,0.32,1]",
    imgThumbnailMedium: "object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100",

    // Micro-interactions
    arrowLarge: "text-2xl 3xl:text-4xl 4xl:text-5xl opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500",
    arrowSmall: "text-xl 3xl:text-2xl 4xl:text-3xl opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500 ease-[0.23,1,0.32,1]",
  }
};

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Shared Framer Motion states
const entranceBase = {
  initial: { opacity: 0, x: 32, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" }
};

// Motion system presets for entry transitions
export const motionSystem = {
  ease: premiumEase,
  duration: 0.85,
  
  variants: {
    // Dynamic staggered item entrance
    slideIn: (index: number = 0) => ({
      ...entranceBase,
      transition: {
        duration: 0.85,
        ease: premiumEase,
        delay: 0.05 + index * 0.05,
      }
    }),
    
    // Header entrance
    headerSlideIn: {
      ...entranceBase,
      transition: {
        duration: 0.85,
        ease: premiumEase,
        delay: 0,
      }
    },

    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.85, ease: premiumEase }
    },

    scaleIn: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.85, ease: premiumEase }
    }
  }
};
