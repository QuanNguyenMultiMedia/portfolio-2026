export interface Project {
  title: string;
  slug: string;
  year: string;
  category: string;
  id: string;
  description: string;
  coverImage?: string;
  /** Looping cover footage; coverImage stays its still poster for listings. */
  coverVideo?: string;
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
    /**
     * deliverable-breakdown arrangement, picked per content:
     * wall (default): text column + balanced lanes, for mixed ratios.
     * feature: one hero piece at full height, the rest as a smaller wall after it.
     * grid: title band on top, a contact sheet of `rows` rows below, for uniform sets.
     * sets: text column + clusters of `sets[i]` items (first tall, rest stacked), for one
     *   creative cut into several formats.
     */
    layout?: "wall" | "feature" | "grid" | "sets";
    rows?: number;
    sets?: number[];
    // Deliverables properties
    number?: string;
  }[];
  colors: string[];
  /**
   * How the name prints on the cover and outro spreads (MainTitle.aep project comps): the fountain the name is
   * inked in, the spot ink the deck overprints it with, and whether the name stands as columns of letters.
   * Names are riso.css tokens (--fountain-*, .ink-*).
   */
  print?: {
    fountain: "mint" | "herond" | "azure" | "electric" | "tide";
    deck: "ink-violet" | "ink-blue" | "ink-indigo" | "ink-orange" | "ink-coral" | "ink-rose";
    stack?: boolean;
  };
}

export const projects: Project[] = [
  {
    title: "2026 Reel",
    slug: "2026-reel",
    print: { fountain: "electric", deck: "ink-coral" },
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
    coverImage: "/media/showreel.jpg",
    coverVideo: "/media/showreel.mp4",
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
        layout: "feature",
        description:
          "A sequence of UI micro-interactions showing gesture-based responses, fluid page transitions, and responsive spring animations.\n\nThe focus was to prove that interface motion can feel as tactile and responsive as physical hardware click triggers.",
        images: [
          "/works/2026-reel/ui-herond-logoteaser-draft7.mp4",
          "/works/2026-reel/ui-mobilenewconcept-eng-1920x1080.mp4",
          "/works/2026-reel/ui-teaser.mp4",
          "/works/2026-reel/ui-grouptab.mp4",
          "/works/2026-reel/ui-20262901-lockyourfocus-pinyourtab.mp4",
          "/works/2026-reel/ui-shield.mp4",
          "/works/2026-reel/ui-anonymode-sound.mp4",
          "/works/2026-reel/ui-wallet.mp4",
          "/works/2026-reel/ui-20260424-chromiumupdateannouncement-2.mp4",
          "/works/2026-reel/ui-20262605-herondpointlaunch-v3.mp4"
        ],
      },
      {
        type: "timeline-sequence",
        title: "Kinetic Typography Showcase",
        description:
          "Experimental typography sequences where Vietnamese letterforms are treated as physical spatial objects.\n\nDesigned for maximum narrative readability and high visual impact, these typographic systems represent how language can become an active visual protagonist in video branding.",
        images: [
          "/works/2026-reel/type-rebrand.mp4",
          "/works/2026-reel/type-20260514-repositioningexplainer-final.mp4",
          "/works/2026-reel/type-logo.mp4",
          "/works/2026-reel/type-ai.mp4",
          "/works/2026-reel/type-relay.mp4",
          "/works/2026-reel/type-20260415-herondpointlaunchteaser-new-v5.mp4",
          "/works/2026-reel/type-20260309-walletcreativeads-part1-6.mp4",
          "/works/2026-reel/type-final-comp-1.mp4",
          "/works/2026-reel/type-markdao-tgs-final-highres.mp4"
        ],
      },
      {
        type: "zine-outro",
      },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    print: { fountain: "herond", deck: "ink-blue", stack: true },
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
    coverImage: "/works/herond-browser/ui-film.webp",
    coverVideo: "/works/herond-browser/ui-film.mp4",
    screens: [
      {
        type: "zine-cover"
      },
      {
        type: "editorial-text",
        content: "Herond was rebranding when I joined — new visual direction, tight timelines, a lot of ground to cover. I sat across motion, 3D, front-end, and day-to-day marketing creative. Not because the role was defined that way, but because that's what was needed."
      },
      {
        type: "video",
        src: "/works/herond-browser/ui-film.mp4",
        title: "UI Film",
        description: "Hero animation showcase for the landing page. Built to work as both a cinematic product showcase and a functional UI explainer, taking the project from storyboard to final render."
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "UI Film Breakdown",
        layout: "feature",
        description: "We had to work with a constantly changing UI - so locking it down in Blender is a no-no.\n\nInstead, my process was animating an SVG layer in AE and ran it as an mp4 on a plane in Blender. That way, if any UI elements change, I only need to re-export the video texture instead of replacing Blender objects.",
        images: [
          "/works/herond-browser/x-assembly-frame-2.mp4",
          "/works/herond-browser/onboarding-fadein.mp4",
          "/works/herond-browser/onboarding-1.webp",
          "/works/herond-browser/onboarding-2.webp",
          "/works/herond-browser/onboarding-3.webp",
          "/works/herond-browser/onboarding-4.webp"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Landing Page Mini Animations",
        description: "While creating the UI Film, I’d realized the cleaned up Browser Home Page UI imported from Figma could serve as a recurring After Effects rig - which enabled me to delivered these mini animations for the landing page to demo the key features.",
        images: [
          "/works/herond-browser/onboarding-home-search.mp4",
          "/works/herond-browser/onboarding-parallax.mp4",
          "/works/herond-browser/onboarding-drag-tab.mp4",
          "/works/herond-browser/onboarding-pin-tab.mp4",
          "/works/herond-browser/mini-grouptab-newlogo.mp4",
          "/works/herond-browser/mini-adblock.mp4",
          "/works/herond-browser/mini-incognito.mp4",
          "/works/herond-browser/mini-tab-wallet-prepped.mp4",
          "/works/herond-browser/mini-walletsidebar.mp4",
          "/works/herond-browser/mini-open.mp4",
          "/works/herond-browser/mini-create-wallet.mp4",
          "/works/herond-browser/mini-buy.mp4",
          "/works/herond-browser/mini-send-buy.mp4",
          "/works/herond-browser/mini-swap.mp4"
        ]
      },
      {
        type: "split-gallery",
        title: "Herond Point Orb",
        description: "The Orb sits at the centre of Herond's rewards system. I took it from ideation to final look solo, ensuring it felt rewarding while remaining coherent with a brand that was still being defined. Hover over the frames on the right to see the design progression from rough sketch to final 3D look.",
        images: [
          "/works/herond-browser/x-overlord-herond-point-draft-3-1-88-686.webp",
          "/works/herond-browser/orb-1.webp",
          "/works/herond-browser/orb-2.webp",
          "/works/herond-browser/orb-8.webp",
          "/works/herond-browser/orb-9.webp",
          "/works/herond-browser/orb-3.webp",
          "/works/herond-browser/orb-4.webp",
          "/works/herond-browser/orb-5.webp",
          "/works/herond-browser/orb-7.webp",
          "/works/herond-browser/x-herondpointcon-transparency-4.webp",
          "/works/herond-browser/orb-10.webp",
          "/works/herond-browser/orb-6.webp",
          "/works/herond-browser/orb-11.webp",
          "/works/herond-browser/x-orb-composited-000.webp"
        ]
      },
      {
        type: "interactive-preview",
        title: "AI Agent Interface",
        description: "When Herond moved toward an agentic model, I built out an interface concept: an R3F orb with a full state machine, optimised for web performance, using AI tools throughout the workflow.",
        src: "/works/herond-browser/agent.mp4"
      },
      {
        type: "deliverable-breakdown",
        number: "03",
        title: "Herond Point Rewards",
        layout: "grid",
        rows: 3,
        description: "The Herond Point system also had missions for users to accomplish. I was tasked with creating something people would want to share upon completing their mission. Thematically speaking, these all aim to communicate a space/astronomy theme that support the Herond Point Orb.\n\nSince we aimed to introduce new rewards by the season, each medal is created with scalability in mind. I standardized each setup into reusable materials and layouts that lives in the Blender Asset Library, making iterations a breeze.",
        images: [
          "/works/herond-browser/x-00-originals-telegram.webp",
          "/works/herond-browser/x-00-originals-discord.webp",
          "/works/herond-browser/x-00-originals-firstswap.webp",
          "/works/herond-browser/x-00-originals-firstclaim.webp",
          "/works/herond-browser/x-00-originals-7days.webp",
          "/works/herond-browser/badge-firstspin.webp",
          "/works/herond-browser/x-00-originals-7tickets.webp",
          "/works/herond-browser/x-00-originals-14days.webp",
          "/works/herond-browser/badge-walletpioneer.webp",
          "/works/herond-browser/x-00-originals-newcomer.webp",
          "/works/herond-browser/badge-pioneer.webp",
          "/works/herond-browser/x-00-originals-active.webp",
          "/works/herond-browser/badge-30days.webp",
          "/works/herond-browser/badge-earlyexplorer.webp",
          "/works/herond-browser/badge-megawinner.webp",
          "/works/herond-browser/orb-12.mp4",
          "/works/herond-browser/x-2026-port-stat-hpointorb-bts-new.mp4"
        ]
      },
      {
        type: "timeline-sequence",
        title: "Day-to-day & Other Contributions",
        description: "Social motion for Growth and photography for Internal Comms under high-volume, fast-turnaround conditions. Also contributed reusable motion assets during the rebrand, an Adobe CC → Figma workflow for UI animations, a Blender rendering/WebM export script, and Rive/Lottie in-app animations built alongside the UI/UX team.",
        images: [
          "/works/herond-browser/day-shield.mp4",
          "/works/herond-browser/day-shortads-stayworryfree-1920x1080.mp4",
          "/works/herond-browser/day-shortads-stopfightingforyourcontent-1920x1080.mp4",
          "/works/herond-browser/day-peace.mp4",
          "/works/herond-browser/day-shortads-peaceandquiet-1080x1080-3.mp4",
          "/works/herond-browser/day-herondcreativeads3-aiwallet-1920x1080-1.mp4",
          "/works/herond-browser/x-herond-gifs-ex-20260202-newlayout-walletcrosschain.mp4",
          "/works/herond-browser/x-herond-gifs-ex-herondproductlayerre-education-v3.mp4",
          "/works/herond-browser/x-herond-gifs-ex-20260429-newaibrowser-v4.mp4",
          "/works/herond-browser/x-herond-gifs-ex-20260511-thenewaibrowserthatleadsyourway.mp4"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "04",
        title: "Photography",
        layout: "feature",
        description: "When we needed to launch a gift box the team designed, I rose to the occasion with my love for photography. I also did media for most of the internal communications events.",
        images: [
          "/works/herond-browser/day-dscf6402.webp",
          "/works/herond-browser/day-dscf6390.webp",
          "/works/herond-browser/day-christmas.webp",
          "/works/herond-browser/day-dscf7785.webp",
          "/works/herond-browser/day-dscf7675.webp",
          "/works/herond-browser/day-hackathon.webp"
        ]
      },
      {
        type: "zine-outro"
      },
    ],
  },
  {
    title: "Defrasoft",
    slug: "defrasoft",
    print: { fountain: "mint", deck: "ink-violet" },
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
    coverImage: "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.webp",
    coverVideo: "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4",
    screens: [
      {
        type: "zine-cover"
      },
      {
        type: "editorial-text",
        content: "Defrasoft published and monetised mobile apps. I was the only designer across five products, handling ASO design, performance ads, AI UGC, and Rive/Lottie in-app animations.\n\nThe work here was less about craft per piece and more about judgment at volume — knowing when something was good enough to ship and when it needed another pass."
      },
      {
        type: "video",
        src: "/media/defrasoft-ads.mp4",
        title: "Performance Ad Campaign Film",
        description: "High-energy performance ad built for paid acquisition channels, designed to hook attention immediately and drive downloads."
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Motion Graphic Ads",
        layout: "grid",
        rows: 2,
        description: "In my time there, I helped the team translate static Figma designs to intuitive app interactions for ads, driving all video advertisement efforts and balancing quality with speed and volume.",
        images: [
          "/works/defrasoft/ad-angle1-vert-withcta.mp4",
          "/works/defrasoft/ad-voicenote-ua-angle2-vertical-1.mp4",
          "/works/defrasoft/ad-voicenote-ua-angle3-vert.mp4",
          "/works/defrasoft/ad-hidefiles.mp4",
          "/works/defrasoft/ad-databackup.mp4",
          "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4",
          "/works/defrasoft/ad-vertical.mp4",
          "/works/defrasoft/x-apppub-gifs-ex-vertical-1.mp4",
          "/works/defrasoft/x-apppub-gifs-ex-vertical-6.mp4",
          "/works/defrasoft/ad-familyguardian-partnertracking.mp4",
          "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-001.mp4",
          "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-002.mp4",
          "/works/defrasoft/ad-360tracker-featurevideo-886x19.mp4"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Performance Ads",
        layout: "sets",
        sets: [3, 3, 3, 3],
        description: "The work here was less about craft per piece and more about judgment at volume — knowing when something was good enough to ship and when it needed another pass.",
        images: [
          "/works/defrasoft/voicenotes-common_vert.webp",
          "/works/defrasoft/x-angle-1-common-common-sqr.webp",
          "/works/defrasoft/x-angle-1-common-common-hor.webp",
          "/works/defrasoft/voicenotes-business_vert.webp",
          "/works/defrasoft/x-angle-2-busine-business-sqr.webp",
          "/works/defrasoft/x-angle-2-busine-business-hor.webp",
          "/works/defrasoft/x-angle-3-studen-students-vert.webp",
          "/works/defrasoft/x-angle-3-studen-students-sqr.webp",
          "/works/defrasoft/x-angle-3-studen-students-hor.webp",
          "/works/defrasoft/voicenotes-home_vert.webp",
          "/works/defrasoft/x-angle-4-chores-home-sqr.webp",
          "/works/defrasoft/x-angle-4-chores-home-hor.webp",
          "/works/defrasoft/x-ua-ad5-memorie-artboard-1.webp",
          "/works/defrasoft/x-ua-ad7-acciden-artboard-3.webp",
          "/works/defrasoft/x-databackup-students.webp",
          "/works/defrasoft/x-english-dedup-tech-savvy.webp",
          "/works/defrasoft/x-ua-ad6-hidepho-artboard-2.webp",
          "/works/defrasoft/x-hide-students.webp",
          "/works/defrasoft/x-english-angle1-vert.webp",
          "/works/defrasoft/x-english-angle3-vert.webp"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "03",
        title: "App Store Creatives",
        layout: "grid",
        rows: 1,
        description: "Designed within device frames for app store optimization.",
        images: [
          "/works/defrasoft/x-overlord-pixel-7-pro-light-mode-373-4.webp",
          "/works/defrasoft/aso.webp",
          "/works/defrasoft/aso-phone-42.webp",
          "/works/defrasoft/aso-phone-43.webp",
          "/works/defrasoft/aso-phone-6finals.webp"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "04",
        title: "AI UGC",
        layout: "grid",
        rows: 2,
        description: "These talking head shots were generated with Google Veo 3.1 as soon as it became feasible at scale to do so. I used Claude to come up with the hooks and plugged those into Google Flow.",
        images: [
          "/works/defrasoft/x-ai-this-app-modegear-202512150916-tz3yc.mp4",
          "/works/defrasoft/x-ai-if-you-have-202512150913-7fsh1.mp4",
          "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-opu.mp4",
          "/works/defrasoft/ugc.mp4",
          "/works/defrasoft/ugc-you-dmshe.mp4",
          "/works/defrasoft/ugc-didnt-kkzb9.mp4",
          "/works/defrasoft/x-ai-dont-tell-the-202512091619-vjvw3.mp4",
          "/works/defrasoft/x-ai-download.mp4",
          "/works/defrasoft/x-ai-dm-20251120140617-001.mp4",
          "/works/defrasoft/x-ai-37cbe297-caae-4705-8006-54ff1212f3b0.mp4",
          "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-194.mp4",
          "/works/defrasoft/x-ai-0ad4aa3b-9721-4943-abb4-964a3c8c0b4f.mp4",
          "/works/defrasoft/x-ai-0ba69811-fef2-40b6-9fe7-29a605f8bf3f.mp4"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "05",
        title: "Rive & Lottie Animations",
        layout: "feature",
        description: "Built for light file sizes and clean developer handoff. State logic was part of the design, not an afterthought. Animations are optimized for mobile performance and responsive rendering.",
        images: [
          "/works/defrasoft/voicely-onboarding.mp4",
          "/works/defrasoft/rive-full.mp4",
          "/works/defrasoft/rive-states.mp4"
        ]
      },
      {
        type: "zine-outro"
      },
    ],
  },
  {
    title: "Z Cũng Viết",
    slug: "z-cung-viet",
    print: { fountain: "azure", deck: "ink-orange" },
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
    coverImage: "/works/z-cung-viet/photo.webp",
    screens: [
      {
        type: "zine-cover"
      },
      {
        type: "editorial-text",
        content: "Z Cũng Viết was a social communication campaign making the case for writing as a tool for mental health. I led brand design, creative direction, and media production end-to-end — wrote the brief, then executed against it.\n\nIt's the project where I had the most creative ownership, and probably the one that best reflects how I think about design when no one's handed me a direction."
      },
      {
        type: "deliverable-breakdown",
        number: "01",
        title: "Brand Identity",
        layout: "feature",
        description: "Full visual language designed from scratch. Incorporates logo variations, a curated tech-luxe color palette, and bespoke typography systems to elevate the campaign's visual presence, giving it ample room first.",
        images: [
          "/works/z-cung-viet/brand-book.webp",
          "/works/z-cung-viet/collaborators.webp",
          "/works/z-cung-viet/mockup-2.webp",
          "/works/z-cung-viet/apparel.webp",
          "/works/z-cung-viet/nametag.webp",
          "/works/z-cung-viet/vongtay.webp",
          "/works/z-cung-viet/photo-2.webp"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Social Media & Event Materials",
        description: "On the daily, I produced social media posts that communicated brand messages and engaged with the audience through simple but effective prompting and conditioning to encourage writing.",
        images: [
          "/works/z-cung-viet/mockup-3.webp",
          "/works/z-cung-viet/faq.webp",
          "/works/z-cung-viet/poster.webp",
          "/works/z-cung-viet/brand-mark.webp",
          "/works/z-cung-viet/event-poster.mp4"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "03",
        title: "Motion Graphics",
        description: "These motion graphics were created to cement the brand in the creation of these episodes.\n\nPlus, we were making long-form documentary/interview format content, so it’s essential to keep the audience engaged with fun beats such as these. As with all things, these were made with scalability and utility in mind, so they’re fully mogrt compatible.",
        images: [
          "/works/z-cung-viet/intro-hori.mp4",
          "/works/z-cung-viet/khoa.mp4",
          "/works/z-cung-viet/don.mp4",
          "/works/z-cung-viet/linh.mp4",
          "/works/z-cung-viet/write-time.mp4"
        ]
      },
      {
        type: "deliverable-breakdown",
        number: "04",
        title: "Media Production",
        layout: "feature",
        description: "I was responsible for camera operation, lighting, and audioworks. To be honest it’s a pretty small set on a smaller budget, but playing these roles gave me hands-on experience knowing exactly what works for post production.\n\nI handled posts, too. Building an offline, then an online, then color works, to a final cut for each of the episodes.",
        images: [
          "/works/z-cung-viet/production-recap.mp4",
          "/works/z-cung-viet/recap-2.mp4",
          "/works/z-cung-viet/photo.webp"
        ]
      },
      {
        type: "zine-outro"
      },
    ],
  },
  {
    title: "Select Freelance Work",
    slug: "select-freelance-work",
    print: { fountain: "tide", deck: "ink-indigo" },
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
    coverImage: "/works/select-freelance-work/freightos.webp",
    coverVideo: "/works/select-freelance-work/freightos.mp4",
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
        layout: "feature",
        description:
          "High-production-value video narratives produced to introduce products, explain technical protocols, and launch campaigns.\n\nCombining vector illustration with high-speed keyframe layouts to keep structural elements readable and visually striking.",
        images: [
          "/works/select-freelance-work/freightos.mp4",
          "/works/select-freelance-work/freightos-10.mp4",
          "/works/select-freelance-work/ship-happens.mp4",
          "/works/select-freelance-work/storyflow.mp4",
          "/works/select-freelance-work/storyflow-2.mp4",
          "/works/select-freelance-work/mb-explainer.mp4"
        ],
      },
      {
        type: "deliverable-breakdown",
        number: "02",
        title: "Social Content & UI Interaction Kits",
        layout: "grid",
        rows: 2,
        description:
          "Short-form advertising campaigns and high-fidelity product UI mockups.\n\nClean, modern, responsive layouts designed specifically to capture attention and improve engagement rates on all screen aspect ratios.",
        images: [
          "/works/select-freelance-work/squarepeg.mp4",
          "/works/select-freelance-work/cover.mp4",
          "/works/select-freelance-work/dobeedo-4.mp4",
          "/works/select-freelance-work/dobeedo-6.mp4",
          "/works/select-freelance-work/dobeedo-7.mp4",
          "/works/select-freelance-work/monthly-spend.mp4"
        ],
      },
      {
        type: "zine-outro",
      },
    ],
  },
];
