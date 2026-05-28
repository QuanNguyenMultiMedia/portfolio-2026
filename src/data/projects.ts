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
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1280px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    screens: [
      {
        type: "bento",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg/1280px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1923_-_Composition_8.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8.jpg",
        ],
        caption: "A cross-section of 2026's motion language.",
      },
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_de_Nachtwacht_%28Rembrandt%29.jpg/1280px-The_Night_Watch_-_de_Nachtwacht_%28Rembrandt%29.jpg",
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
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1280px-1665_Girl_with_a_Pearl_Earring.jpg",
    screens: [
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
        caption: "01. Core Interaction Prototyping",
      },
      {
        type: "bento",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1280px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1280px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/1280px-The_Scream.jpg",
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
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    screens: [
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg",
        caption: "01. Logo Construction & Typography",
      },
      {
        type: "bento",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
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
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez-huge.jpg/1280px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez-huge.jpg",
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
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1280px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    screens: [
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        caption: "01. Brand Film — Keyframe Selection",
      },
      {
        type: "bento",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg/1280px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1923_-_Composition_8.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8.jpg",
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
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1280px-1665_Girl_with_a_Pearl_Earring.jpg",
    screens: [
      {
        type: "bento",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1280px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1280px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1280px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/1280px-The_Scream.jpg",
        ],
        caption: "Selected freelance deliverables — 2020 to present.",
      },
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
        caption: "01. Explainer & Brand Films",
      },
      {
        type: "details",
        content:
          "From Freightos to Upwork Enterprise, each project demanded a unique visual language. The common thread is structural motion design — every animation serves a communication goal.",
      },
      {
        type: "image",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project1.jpg",
        caption: "02. Social Media & Short-Form Campaigns",
      },
    ],
  },
];
