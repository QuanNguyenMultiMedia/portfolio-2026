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
    images?: string[]; // For bento grids
    caption?: string;
    content?: string;
    layout?: "classic" | "split" | "masonry";
  }[];
  colors: string[];
}

export const projects: Project[] = [
  {
    title: "GOM MEN Identity",
    slug: "gom-men-identity",
    year: "2023",
    category: "Branding",
    id: "PRJ_001",
    colors: ["#001219", "#005f73", "#0a9396"],
    description: "Visual identity design for GOM MEN, focusing on minimalist and modern aesthetics.",
    coverImage: "/projects/gom-men.png",
    screens: [
      {
        type: "bento",
        images: [
          "/projects/gom-men.png",
          "/projects/gom-men.png",
          "/projects/gom-men.png",
          "/projects/gom-men.png"
        ],
        caption: "Exploration of the core identity system."
      },
      {
        type: "image",
        src: "/projects/gom-men.png",
        caption: "01. Logo Construction & Typography",
      },
      {
        type: "details",
        content: "A study in proportions and negative space, ensuring maximum legibility across all physical and digital touchpoints.",
      },
      {
        type: "bento",
        layout: "split",
        images: [
          "/projects/gom-men.png",
          "/projects/gom-men.png"
        ],
        caption: "Brand applications and digital presence."
      }
    ],
  },
  {
    title: "Mơ Làm Ma Lyric",
    slug: "mo-lam-ma-lyric",
    year: "2023",
    category: "Motion",
    id: "PRJ_002",
    colors: ["#94d2bd", "#e9d8a6", "#ee9b00"],
    description: "Animated lyric video for 'Mơ Làm Ma', featuring dynamic typography and atmospheric motion.",
    coverImage: "/projects/mo-lam-ma.png",
    screens: [
      {
        type: "image",
        src: "/projects/mo-lam-ma.png",
        caption: "01. Keyframe Selection",
      },
      {
        type: "bento",
        images: [
          "/projects/mo-lam-ma.png",
          "/projects/mo-lam-ma.png",
          "/projects/mo-lam-ma.png"
        ]
      }
    ],
  },
  {
    title: "SquarePeg UI",
    slug: "squarepeg-ui",
    year: "2024",
    category: "UI Motion",
    id: "PRJ_003",
    colors: ["#ca6702", "#bb3e03", "#ae2012"],
    description: "UI/UX motion design for SquarePeg, enhancing user engagement through fluid transitions.",
    coverImage: "/projects/squarepeg.png",
    screens: [
      {
        type: "image",
        src: "/projects/squarepeg.png",
        caption: "01. Interaction Prototyping",
      },
    ],
  },
  {
    title: "Freightos Stickers",
    slug: "freightos-stickers",
    year: "2023",
    category: "Social Media",
    id: "PRJ_004",
    colors: ["#005f73", "#0a9396", "#94d2bd"],
    description: "Branded animated stickers for Freightos, used across various social platforms.",
    screens: [
      {
        type: "image",
        src: "/projects/gom-men.png", // Fallback for demo
      }
    ],
  },
  {
    title: "2023 Showreel",
    slug: "2023-showreel",
    year: "2023",
    category: "Showreel",
    id: "PRJ_005",
    colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
    description: "A compilation of the best motion design and animation work from 2023.",
    screens: [
      {
        type: "image",
        src: "/projects/mo-lam-ma.png", // Fallback for demo
      }
    ],
  },
  {
    title: "Vietnam Forestation",
    slug: "vietnam-forestation",
    year: "2026",
    category: "3D / GIS",
    id: "PRJ_006",
    colors: ["#065f46", "#059669", "#34d399"],
    description: "Implementing 3D extrusion logic based on GeoJSON project data for environmental tracking.",
    screens: [
      {
        type: "bento",
        images: [
          "/projects/vietnam-forest-1.jpg",
          "/projects/vietnam-forest-1.jpg",
          "/projects/vietnam-forest-1.jpg"
        ],
        caption: "Data mapping and visualization phases."
      },
      {
        type: "image",
        src: "/projects/vietnam-forest-1.jpg",
        caption: "01. Real-time Rendering Implementation",
      },
      {
        type: "details",
        content: "Exploring the boundary between raw environmental data and immersive spatial experiences.",
      },
    ],
  },
];
