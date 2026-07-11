import { IMAGES } from "./images";

export interface Project {
  title: string;
  slug: string;
  year: string;
  category: string;
  id: string;
  description: string;
  coverImage?: string;
  client?: string;
  role?: string;
  services?: string[];
  screens: {
    type:
      | "hero"
      | "image"
      | "details"
      | "video"
      | "bento"
      | "zine-cover"
      | "editorial-text"
      | "split-gallery"
      | "bento-moodboard"
      | "interactive-preview"
      | "timeline-sequence"
      | "deliverable-breakdown"
      | "zine-outro";
    // Standard properties
    title?: string;
    subtitle?: string;
    description?: string;
    src?: string;
    images?: string[];
    caption?: string;
    content?: string;
    layout?: "classic" | "split" | "masonry";
    // Deliverables properties
    number?: string;
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
    client: "Self / Herond Labs",
    role: "Motion & Creative Director",
    services: [
      "UI Motion Compilation",
      "Kinetic Typography",
      "Video Editing",
      "Sound Design",
    ],
    colors: ["#0029ff", "#1e40af", "#3b82f6"],
    description:
      "Works I love from the past year, mainly from my time as an inhouse creative for Herond Labs",
    coverImage: IMAGES.WANDERER,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "This showreel compiles my favorite pieces of motion design and UI interaction guidelines created during the past year. It serves as a visual testament to my obsession with structural movement and purpose-driven kinetic choreography.\n\nEvery frame represents a conscious decision to balance editorial whitespace with fast, high-impact motion. The goal was to build digital movements that respect physical laws, even when fully simulated in browser environments.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "UI Interaction Compilation",
        description:
          "A sequence of UI micro-interactions showing gesture-based responses, fluid page transitions, and responsive spring animations.\n\nThe focus was to prove that interface motion can feel as tactile and responsive as physical hardware click triggers.",
        images: [IMAGES.NIGHT_WATCH, IMAGES.WANDERER, IMAGES.THE_KISS],
      },
      {
        type: "timeline-sequence",
        title: "Kinetic Typography Showcase",
        description:
          "Experimental typography sequences where Vietnamese letterforms are treated as physical spatial objects.\n\nDesigned for maximum narrative readability and high visual impact, these typographic systems represent how language can become an active visual protagonist in video branding.",
        images: [IMAGES.STARRY_NIGHT, IMAGES.GREAT_WAVE, IMAGES.COMPOSITION_8, IMAGES.WANDERER],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    year: "2024–present",
    category: "UI Motion & Brand Design",
    id: "PRJ_002",
    client: "Herond Labs",
    role: "Multimedia Marketing & Motion Designer",
    services: [
      "Motion Design",
      "3D Modeling",
      "Front-End Concepts",
      "ASO & Campaign Creative",
    ],
    colors: ["#0a0a0a", "#333333", "#666666"],
    description:
      "Rebranding, motion assets, 3D systems, interactive front-end concepts, and day-to-day creative during Herond's transition to an agentic rewards-focused browser model.",
    coverImage: IMAGES.GIRL_WITH_PEARL_EARRING,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "Herond was rebranding when I joined — new visual direction, tight timelines, a lot of ground to cover. I sat across motion, 3D, front-end, and day-to-day marketing creative. Not because the role was defined that way, but because that's what was needed.",
      },
      {
        type: "video",
        src: "QsmDlpOu6qngxWa01dJlOHgkMb01YoYcxra5G1V3Xsq300",
        title: "UI Film",
        description:
          "Hero animation showcase for the landing page. Built to work as both a cinematic product showcase and a functional UI explainer, taking the project from storyboard to final render.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Onboarding Renders",
        description:
          "High-fidelity static renders created for the app's onboarding flow, maintaining visual styling under a unified direction.",
        images: [IMAGES.NIGHT_WATCH, IMAGES.WANDERER, IMAGES.THE_KISS],
      },
      {
        type: "split-gallery",
        title: "Herond Point Orb",
        description:
          "The Orb sits at the centre of Herond's rewards system. I took it from ideation to final look solo, ensuring it felt rewarding while remaining coherent with a brand that was still being defined. Hover over the frames on the right to see the design progression from rough sketch to final 3D look.",
        images: [IMAGES.STARRY_NIGHT, IMAGES.GREAT_WAVE, IMAGES.COMPOSITION_8],
      },
      {
        type: "interactive-preview",
        title: "AI Agent Interface",
        description:
          "When Herond moved toward an agentic model, I built out an interface concept: an R3F orb with a full state machine, optimised for web performance, using AI tools throughout the workflow.",
        src: IMAGES.THE_SCREAM,
      },
      {
        type: "timeline-sequence",
        title: "Day-to-day & Other Contributions",
        description:
          "Social motion for Growth and photography for Internal Comms under high-volume, fast-turnaround conditions. Also contributed reusable motion assets during the rebrand, an Adobe CC → Figma workflow for UI animations, a Blender rendering/WebM export script, and Rive/Lottie in-app animations built alongside the UI/UX team.",
        images: [
          IMAGES.LIBERTY_LEADING,
          IMAGES.THE_SCREAM,
          IMAGES.TOWER_OF_BABEL,
          IMAGES.NIGHT_WATCH,
        ],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Defrasoft",
    slug: "defrasoft",
    year: "2024–present",
    category: "Performance Creative",
    id: "PRJ_003",
    client: "Herond Labs Venture",
    role: "Performance Creative",
    services: [
      "ASO Design",
      "Performance Ads",
      "AI UGC Direction",
      "Rive/Lottie Animation",
    ],
    colors: ["#065f46", "#059669", "#34d399"],
    description:
      "ASO design, paid channel performance ads, AI UGC content generation, and lightweight in-app motion across five mobile applications.",
    coverImage: IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "Defrasoft published and monetised mobile apps. I was the only designer across five products, handling ASO design, performance ads, AI UGC, and Rive/Lottie in-app animations.\n\nThe work here was less about craft per piece and more about judgment at volume — knowing when something was good enough to ship and when it needed another pass.",
      },
      {
        type: "video",
        src: "QsmDlpOu6qngxWa01dJlOHgkMb01YoYcxra5G1V3Xsq300",
        title: "Performance Ad Campaign Film",
        description:
          "High-energy performance ad built for paid acquisition channels, designed to hook attention immediately and drive downloads.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Rive & Lottie Animations",
        description:
          "Built for light file sizes and clean developer handoff. State logic was part of the design, not an afterthought. Animations are optimized for mobile performance and responsive rendering.",
        images: [
          IMAGES.WATER_LILIES,
          IMAGES.BIRTH_OF_VENUS,
          IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
        ],
      },
      {
        type: "bento-moodboard",
        title: "AI UGC & App Store Creatives",
        description:
          "High-volume creative for paid channels and app stores. Directed and generated AI-driven user-generated content alongside traditional ad formats, designed within device frames for app store optimization.",
        images: [
          IMAGES.LAS_MENINAS,
          IMAGES.MONA_LISA,
          IMAGES.WATER_LILIES,
        ],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Z Cũng Viết",
    slug: "z-cung-viet",
    year: "2023",
    category: "Design Lead",
    id: "PRJ_004",
    client: "Graduation Capstone",
    role: "Design Lead",
    services: [
      "Brand Design",
      "Creative Direction",
      "Media Production",
      "Campaign Design",
    ],
    colors: ["#ae2012", "#9b2226", "#370617"],
    description:
      "End-to-end creative direction, brand identity, campaign motion design, and photography for a social communication campaign promoting writing as a tool for mental health.",
    coverImage: IMAGES.WANDERER,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "bento-moodboard",
        title: "Brand Board & Identity Spread",
        description:
          "Full visual language designed from scratch. Incorporates logo variations, a curated tech-luxe color palette, and bespoke typography systems to elevate the campaign's visual presence, giving it ample room first.",
        images: [IMAGES.LAS_MENINAS, IMAGES.MONA_LISA, IMAGES.WATER_LILIES],
      },
      {
        type: "editorial-text",
        content:
          "Z Cũng Viết was a social communication campaign making the case for writing as a tool for mental health. I led brand design, creative direction, and media production end-to-end — wrote the brief, then executed against it.\n\nIt's the project where I had the most creative ownership, and probably the one that best reflects how I think about design when no one's handed me a direction.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Motion & Media",
        description:
          "Campaign motion graphics and photography assets. Full-width motion design pieces combined with campaign photography optimized for storytelling and narrative engagement.",
        images: [IMAGES.WANDERER, IMAGES.STARRY_NIGHT, IMAGES.GREAT_WAVE],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Select Freelance Work",
    slug: "select-freelance-work",
    year: "2020 – Present",
    category: "Motion Commissions",
    id: "PRJ_005",
    client: "Various Clients (Upwork Enterprise)",
    role: "Freelance Motion Designer",
    services: [
      "Explainers & Ad Campaigns",
      "Social Content Systems",
      "Dynamic Typography",
      "Interactive UI Mockups",
    ],
    colors: ["#005f73", "#0a9396", "#94d2bd"],
    description:
      "A curated selection of freelance projects spanning motion design, explainer videos, social media campaigns, and brand films for clients across industries and continents.",
    coverImage: IMAGES.GIRL_WITH_PEARL_EARRING,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "A curated selection of client commissions spanning different continents and sectors.\n\nRanging from global supply-chain giants (Freightos) to creative studios (Storyflow) and design tool teams, the common thread is creating high-fidelity, structural motion sequences that simplify complex messages and respect brand guidelines.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Explainers & Brand Campaign Films",
        description:
          "High-production-value video narratives produced to introduce products, explain technical protocols, and launch campaigns.\n\nCombining vector illustration with high-speed keyframe layouts to keep structural elements readable and visually striking.",
        images: [
          IMAGES.GIRL_WITH_PEARL_EARRING,
          IMAGES.THE_KISS,
          IMAGES.AMERICAN_GOTHIC,
        ],
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Social Content & UI Interaction Kits",
        description:
          "Short-form advertising campaigns and high-fidelity product UI mockups.\n\nClean, modern, responsive layouts designed specifically to capture attention and improve engagement rates on all screen aspect ratios.",
        images: [
          IMAGES.LIBERTY_LEADING,
          IMAGES.THE_SCREAM,
          IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
        ],
      },
      {
        type: "zine-outro",
      },
    ],
  },
];
