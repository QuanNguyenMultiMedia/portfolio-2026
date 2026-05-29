import { IMAGES } from "./images";

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
      "Works I love from the past year, mainly from my time as an inhouse creative for Herond Labs",
    coverImage: IMAGES.WANDERER,
    screens: [
      {
        type: "bento",
        images: [
          IMAGES.STARRY_NIGHT,
          IMAGES.GREAT_WAVE,
          IMAGES.TOWER_OF_BABEL,
          IMAGES.COMPOSITION_8,
        ],
        caption: "A cross-section of 2026's motion language.",
      },
      {
        type: "image",
        src: IMAGES.NIGHT_WATCH,
        caption: "01. Motion Design Compilation",
      },
      {
        type: "details",
        content:
          "Works I love from the past year, mainly from my time as an inhouse creative for Herond Labs",
      },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    year: "2025",
    category: "UI motion, Motion Design, Brand Design",
    id: "PRJ_002",
    colors: ["#0a0a0a", "#333333", "#666666"],
    description:
      "My full-time work as a junior design generalist at Herond Labs, a Web3 tech lab building the on-ramp between Web2 power browsers to Web3 discovery.",
    coverImage: IMAGES.GIRL_WITH_PEARL_EARRING,
    screens: [
      {
        type: "image",
        src: IMAGES.THE_KISS,
        caption: "01. Core Interaction Prototyping",
      },
      {
        type: "bento",
        images: [
          IMAGES.AMERICAN_GOTHIC,
          IMAGES.LIBERTY_LEADING,
          IMAGES.THE_SCREAM,
        ],
        caption: "Gesture mapping and transition logic.",
      },
      {
        type: "details",
        content:
          "Branding materials and social media for their flagship product Herond Browser, an all in one starter gateway that provides adblocking, privacy, crypto wallet, and brevity for the web.",
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
    coverImage: IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
    screens: [
      {
        type: "image",
        src: IMAGES.WATER_LILIES,
        caption: "01. Logo Construction & Typography",
      },
      {
        type: "bento",
        images: [
          IMAGES.BIRTH_OF_VENUS,
          IMAGES.SCHOOL_OF_ATHENS,
          IMAGES.CREATION_OF_ADAM,
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
        images: [
          IMAGES.MONA_LISA,
          IMAGES.LAS_MENINAS,
        ],
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
    coverImage: IMAGES.WANDERER,
    screens: [
      {
        type: "image",
        src: IMAGES.STARRY_NIGHT,
        caption: "01. Brand Film — Keyframe Selection",
      },
      {
        type: "bento",
        images: [
          IMAGES.GREAT_WAVE,
          IMAGES.TOWER_OF_BABEL,
          IMAGES.COMPOSITION_8,
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
    coverImage: IMAGES.GIRL_WITH_PEARL_EARRING,
    screens: [
      {
        type: "bento",
        images: [
          IMAGES.THE_KISS,
          IMAGES.AMERICAN_GOTHIC,
          IMAGES.LIBERTY_LEADING,
          IMAGES.THE_SCREAM,
        ],
        caption: "Selected freelance deliverables — 2020 to present.",
      },
      {
        type: "image",
        src: IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
        caption: "01. Explainer & Brand Films",
      },
      {
        type: "details",
        content:
          "From Freightos to Upwork Enterprise, each project demanded a unique visual language. The common thread is structural motion design — every animation serves a communication goal.",
      },
      {
        type: "image",
        src: IMAGES.WATER_LILIES,
        caption: "02. Social Media & Short-Form Campaigns",
      },
    ],
  },
];
