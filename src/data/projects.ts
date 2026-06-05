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
        type: "deliverable-breakdown",
        number: "02",
        title: "Kinetic Typography Showcase",
        description:
          "Experimental typography sequences where Vietnamese letterforms are treated as physical spatial objects.\n\nDesigned for maximum narrative readability and high visual impact, these typographic systems represent how language can become an active visual protagonist in video branding.",
        images: [IMAGES.STARRY_NIGHT, IMAGES.GREAT_WAVE, IMAGES.COMPOSITION_8],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    year: "2025",
    category: "UI Motion & Brand Design",
    id: "PRJ_002",
    client: "Herond Labs",
    role: "Junior Motion Designer & Generalist",
    services: [
      "Gesture-Mapping Specs",
      "Web3 User Onboarding",
      "Asset Motion Kits",
      "Explainer Videos",
    ],
    colors: ["#0a0a0a", "#333333", "#666666"],
    description:
      "My full-time work as a junior design generalist at Herond Labs, a Web3 tech lab building the on-ramp between Web2 power browsers to Web3 discovery.",
    coverImage: IMAGES.GIRL_WITH_PEARL_EARRING,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "Working in-house at Herond Labs allowed me to explore the intersection of Web3 capability and Web2 design systems. My focus was designing the motion patterns for Herond Browser, an all-in-one privacy browser with integrated crypto wallets.\n\nThe objective was to make advanced privacy mechanics feel approachable, fluid, and premium. Design coordinates were conformed to high aesthetic standards to respect the users' workflow and cognitive load.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Gesture-Mapping & Tab Transitions",
        description:
          "Designed the fluid tab-switching dynamics, workspace transition animations, and wallet verification gesture states.\n\nEvery interface transition is mathematically calculated using custom spring physics, reducing user perceived latencies and layout shifts.",
        images: [
          IMAGES.THE_KISS,
          IMAGES.GIRL_WITH_PEARL_EARRING,
          IMAGES.AMERICAN_GOTHIC,
        ],
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Web3 Discovery Onboarding",
        description:
          "Built a gamified onboarding experience to guide Web2 users into the Web3 space.\n\nFeatures micro-animations for private key generation, network selection cards, and interactive wallet creation states.",
        images: [IMAGES.LIBERTY_LEADING, IMAGES.THE_SCREAM, IMAGES.TOWER_OF_BABEL],
      },
      {
        type: "deliverable-breakdown",
        number: "03",
        title: "Marketing Motion Templates",
        description:
          "Created a modular motion asset kit and video templates for social channels, allowing our communications team to output cohesive visual materials rapidly while preserving core branding characteristics.\n\nAll variables were documented in detailed system specs.",
        images: [IMAGES.COMPOSITION_8, IMAGES.GREAT_WAVE, IMAGES.STARRY_NIGHT],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Defrasoft",
    slug: "defrasoft",
    year: "2025",
    category: "SaaS Brand & Motion System",
    id: "PRJ_003",
    client: "Defrasoft Corp",
    role: "Lead Brand & Motion System Designer",
    services: [
      "SaaS Design Systems",
      "Interactive Analytics",
      "Dark Mode Branding",
      "Motion Standards",
    ],
    colors: ["#065f46", "#059669", "#34d399"],
    description:
      "Complete visual identity and motion system for Defrasoft — a B2B SaaS analytics platform. From logo construction to product UI animation across the entire ecosystem.",
    coverImage: IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "Defrasoft required a cohesive identity and interface motion system to launch their B2B SaaS analytics platform.\n\nWe designed a motion guidelines booklet and implemented real-time dashboard visualization dynamics, helping corporate clients interact with complex data streams without friction. Standard margins and responsive behaviors were built directly into the foundations.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Grid-Aligned Component Motion",
        description:
          "Established a strict component layout and transition hierarchy.\n\nEvery tooltip fade, side panel slide, and table row insertion follows the same spatial geometry and duration curves, establishing a coherent UX signature.",
        images: [
          IMAGES.SUNDAY_ON_LA_GRANDE_JATTE,
          IMAGES.WATER_LILIES,
          IMAGES.BIRTH_OF_VENUS,
        ],
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Dynamic Data Visualizations",
        description:
          "Interactive animated states for analytics graphs, line charts, and live system monitoring dials.\n\nThe graphs animate dynamically based on incoming node inputs, showing state transformations in real-time.",
        images: [IMAGES.SCHOOL_OF_ATHENS, IMAGES.CREATION_OF_ADAM, IMAGES.MONA_LISA],
      },
      {
        type: "deliverable-breakdown",
        number: "03",
        title: "Edge-Lit Dark Mode Thematics",
        description:
          "Designed the dark-mode layout parameters.\n\nInjected high-blur glassmorphic panels and razor-thin border highlights to provide high depth contrast and clear technical visual hierarchies under dim ambient lighting.",
        images: [IMAGES.LAS_MENINAS, IMAGES.MONA_LISA, IMAGES.WATER_LILIES],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Z Cung Viet",
    slug: "z-cung-viet",
    year: "2023",
    category: "Motion Identity",
    id: "PRJ_004",
    client: "Z Cũng Viết Platform",
    role: "Creative Director & Lead Animator",
    services: [
      "Brand Identity Films",
      "Kinetic Typography",
      "Storyboard Production",
      "Social Strategy",
    ],
    colors: ["#ae2012", "#9b2226", "#370617"],
    description:
      "Brand film and motion identity for 'Z Cũng Viết' — a creative writing platform redefining how Vietnamese youth engage with literature and self-expression through short-form video.",
    coverImage: IMAGES.WANDERER,
    screens: [
      {
        type: "zine-cover",
      },
      {
        type: "editorial-text",
        content:
          "'Z Cũng Viết' is a creative writing community that empowers youth self-expression.\n\nWe built a typographic-first kinetic motion identity for their launch campaign, where the unique characters and shapes of the Vietnamese language are elevated to main visual elements in a series of social brand films. This strategy allowed the brand content to pierce through fast mobile social feeds.",
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Kinetic Typography Systems",
        description:
          "Constructed a custom typographical animation engine for the brand films.\n\nBy treating Vietnamese accents, hooks, and letterforms as independent physical objects, we created a high-impact, rhythmic editorial animation sequence.",
        images: [IMAGES.WANDERER, IMAGES.STARRY_NIGHT, IMAGES.GREAT_WAVE],
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Narrative Concept Storyboards",
        description:
          "Developed and produced storyboards that balanced narrative pacing, prose reading speed, and high-contrast visuals.\n\nThe resulting compositions deliver high message retention across fast-scrolling mobile social feeds.",
        images: [IMAGES.TOWER_OF_BABEL, IMAGES.COMPOSITION_8, IMAGES.NIGHT_WATCH],
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
