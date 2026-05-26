export interface Project {
  title: string;
  slug: string;
  year: string;
  category: string;
  id: string;
  description: string;
  coverImage?: string;
  screens: {
    type: "hero" | "image" | "details" | "video" | "bento";
    title?: string;
    subtitle?: string;
    description?: string;
    src?: string;
    images?: string[];
    caption?: string;
    content?: string;
    layout?: "classic" | "split" | "masonry";
  }[];
  colors: string[];
}

export const projects: Project[] = [
  {
    title: "2026 Reel",
    slug: "2026-reel",
    year: "2026",
    category: "Showreel",
    id: "PRJ_001",
    colors: ["#0029ff", "#1e40af", "#3b82f6"],
    description:
      "A curated showcase of the year's most impactful motion design, branding, and creative engineering work. Every frame selected for narrative momentum and technical craft.",
    coverImage: "/assets/hero-visual.png",
    screens: [
      {
        type: "bento",
        images: [
          "/projects/squarepeg.png",
          "/projects/mo-lam-ma.png",
          "/projects/squarepeg.png",
          "/projects/gom-men.png",
        ],
        caption: "A cross-section of 2026's motion language.",
      },
      {
        type: "image",
        src: "/projects/mo-lam-ma.png",
        caption: "01. Motion Design Compilation",
      },
      {
        type: "details",
        content:
          "A tightly edited sequence that moves from brand identity systems to UI motion, with each transition serving the arc of the year's creative evolution.",
      },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    year: "2025",
    category: "UI Motion",
    id: "PRJ_002",
    colors: ["#0a0a0a", "#333333", "#666666"],
    description:
      "Motion design system and UI animation for Herond Browser — a privacy-first web browser reimagining the browsing experience through fluid, purpose-driven micro-interactions.",
    coverImage: "/projects/squarepeg.png",
    screens: [
      {
        type: "image",
        src: "/projects/squarepeg.png",
        caption: "01. Core Interaction Prototyping",
      },
      {
        type: "bento",
        images: [
          "/projects/squarepeg.png",
          "/projects/squarepeg.png",
          "/projects/squarepeg.png",
        ],
        caption: "Gesture mapping and transition logic.",
      },
      {
        type: "details",
        content:
          "Every micro-interaction in Herond Browser was designed to feel structural rather than ornamental — tab switches that respect spatial memory, scroll physics that mirror natural hand inertia.",
      },
    ],
  },
  {
    title: "Defrasoft",
    slug: "defrasoft",
    year: "2025",
    category: "Branding",
    id: "PRJ_003",
    colors: ["#065f46", "#059669", "#34d399"],
    description:
      "Complete visual identity and motion system for Defrasoft — a B2B SaaS analytics platform. From logo construction to product UI animation across the entire ecosystem.",
    coverImage: "/projects/gom-men.png",
    screens: [
      {
        type: "image",
        src: "/projects/gom-men.png",
        caption: "01. Logo Construction & Typography",
      },
      {
        type: "bento",
        images: [
          "/projects/gom-men.png",
          "/projects/gom-men.png",
          "/projects/gom-men.png",
        ],
        caption: "Brand applications across digital surfaces.",
      },
      {
        type: "details",
        content:
          "A modular identity system built on a disciplined grid. Every component — from data visualization charts to loading states — follows the same spatial logic.",
      },
      {
        type: "bento",
        layout: "split",
        images: ["/projects/gom-men.png", "/projects/gom-men.png"],
        caption: "Dashboard animation studies.",
      },
    ],
  },
  {
    title: "Z Cung Viet",
    slug: "z-cung-viet",
    year: "2023",
    category: "Motion",
    id: "PRJ_004",
    colors: ["#ae2012", "#9b2226", "#370617"],
    description:
      "Brand film and motion identity for 'Z Cũng Viết' — a creative writing platform redefining how Vietnamese youth engage with literature and self-expression through short-form video.",
    coverImage: "/projects/mo-lam-ma.png",
    screens: [
      {
        type: "image",
        src: "/projects/mo-lam-ma.png",
        caption: "01. Brand Film — Keyframe Selection",
      },
      {
        type: "bento",
        images: [
          "/projects/mo-lam-ma.png",
          "/projects/mo-lam-ma.png",
          "/projects/mo-lam-ma.png",
        ],
        caption: "Typography-driven narrative sequences.",
      },
      {
        type: "details",
        content:
          "A typographic-first approach where Vietnamese letterforms become cinematic protagonists. The challenge was balancing editorial readability with motion intensity.",
      },
    ],
  },
  {
    title: "Select Freelance Work",
    slug: "select-freelance-work",
    year: "2020 – Present",
    category: "Motion",
    id: "PRJ_005",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
    description:
      "A curated selection of freelance projects spanning motion design, explainer videos, social media campaigns, and brand films for clients across industries and continents.",
    coverImage: "/projects/squarepeg.png",
    screens: [
      {
        type: "bento",
        images: [
          "/projects/squarepeg.png",
          "/projects/mo-lam-ma.png",
          "/projects/gom-men.png",
          "/projects/squarepeg.png",
        ],
        caption: "Selected freelance deliverables — 2020 to present.",
      },
      {
        type: "image",
        src: "/projects/squarepeg.png",
        caption: "01. Explainer & Brand Films",
      },
      {
        type: "details",
        content:
          "From Freightos to Upwork Enterprise, each project demanded a unique visual language. The common thread is structural motion design — every animation serves a communication goal.",
      },
      {
        type: "image",
        src: "/projects/mo-lam-ma.png",
        caption: "02. Social Media & Short-Form Campaigns",
      },
    ],
  },
];
