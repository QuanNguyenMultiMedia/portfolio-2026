/** One piece of work inside a section. `label` names it from the asset itself (its on-screen headline, its
 * filename, its format); `variant` is the same asset under another setup (a second lighting rig); `tone`
 * picks the mat a transparent asset sits on. */
export interface MediaItem {
  src: string;
  label?: string;
  variant?: string;
  tone?: "light" | "dark";
}

/** Items that belong together: one app's ads, one client's commissions, one step of a process. */
export interface MediaGroup {
  label: string;
  note?: string;
  items: MediaItem[];
}

/** One creative (a line) cut along an axis (formats, audiences): cells follow `axis`, null where no cut exists. */
export interface MediaTable {
  /** what the axis is (Formats, Audiences) */
  title: string;
  axis: string[];
  lines: { label: string; cells: (string | null)[] }[];
}

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
      | "video"
      | "zine-cover"
      | "editorial-text"
      | "interactive-preview"
      | "deliverable-breakdown"
      | "zine-outro"
      // Purpose modules (src/components/works): each is shaped by what its media is.
      | "process" // behind the scenes → what it produced: ordered steps (groups)
      | "loops" // short feature or ad loops, named, grouped by device or campaign (groups)
      | "evolution" // one asset from first draft to final (items, in order), BTS beside it (extras)
      | "library" // an asset pack: specimens, each with an optional variant (items)
      | "matrix" // one creative cut into formats or audiences (tables)
      | "feed" // portrait ads at volume, by app (groups), led by an overview board (src)
      | "store" // a store listing (src) and its screenshot set (items)
      | "roster" // a product line: each product's icon and home screen (groups)
      | "ledger" // client commissions: an index of names, each opening its work (groups)
      | "timeline" // a reel's cuts on an edit track, sized by running time (items)
      | "variants"; // one template, several instances (items), with its siblings (extras)
    // Standard properties
    title?: string;
    /** evolution: names what its extras are (where it was built) */
    subtitle?: string;
    description?: string;
    src?: string;
    images?: string[];
    content?: string;
    /** deliverable-breakdown: `feature` stands the first piece at full height, the rest as lanes after it */
    layout?: "wall" | "feature";
    items?: MediaItem[];
    groups?: MediaGroup[];
    tables?: MediaTable[];
    extras?: MediaItem[];
    /** library: what the two setups are called when items carry a variant */
    variantLabels?: [string, string];
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
      { type: "zine-cover" },
      {
        type: "editorial-text",
        content:
          "This showreel compiles my favorite pieces of motion design and UI interaction guidelines created during the past year. It serves as a visual testament to my obsession with structural movement and purpose-driven kinetic choreography.\n\nEvery frame represents a conscious decision to balance editorial whitespace with fast, high-impact motion. The goal was to build digital movements that respect physical laws, even when fully simulated in browser environments.",
      },
      // the reel itself: the cuts below are its sources
      { type: "video", src: "/media/showreel.mp4" },
      {
        type: "timeline",
        title: "UI Interaction Compilation",
        description:
          "A sequence of UI micro-interactions showing gesture-based responses, fluid page transitions, and responsive spring animations.\n\nThe focus was to prove that interface motion can feel as tactile and responsive as physical hardware click triggers.",
        items: [
          { src: "/works/2026-reel/ui-herond-logoteaser-draft7.mp4", label: "Logo teaser" },
          { src: "/works/2026-reel/ui-mobilenewconcept-eng-1920x1080.mp4", label: "New interface, mobile" },
          { src: "/works/2026-reel/ui-teaser.mp4", label: "Teaser" },
          { src: "/works/2026-reel/ui-grouptab.mp4", label: "Group tabs" },
          { src: "/works/2026-reel/ui-20262901-lockyourfocus-pinyourtab.mp4", label: "Pin your tabs" },
          { src: "/works/2026-reel/ui-shield.mp4", label: "Shield" },
          { src: "/works/2026-reel/ui-anonymode-sound.mp4", label: "Anonymous mode" },
          { src: "/works/2026-reel/ui-wallet.mp4", label: "Wallet" },
          { src: "/works/2026-reel/ui-20260424-chromiumupdateannouncement-2.mp4", label: "Chromium update" },
          { src: "/works/2026-reel/ui-20262605-herondpointlaunch-v3.mp4", label: "Herond Point launch" },
        ],
      },
      {
        type: "timeline",
        title: "Kinetic Typography Showcase",
        description:
          "Experimental typography sequences where Vietnamese letterforms are treated as physical spatial objects.\n\nDesigned for maximum narrative readability and high visual impact, these typographic systems represent how language can become an active visual protagonist in video branding.",
        items: [
          { src: "/works/2026-reel/type-rebrand.mp4", label: "Rebrand" },
          { src: "/works/2026-reel/type-20260514-repositioningexplainer-final.mp4", label: "Repositioning explainer" },
          { src: "/works/2026-reel/type-logo.mp4", label: "Logo" },
          { src: "/works/2026-reel/type-ai.mp4", label: "AI" },
          { src: "/works/2026-reel/type-relay.mp4", label: "Herond × Relay" },
          { src: "/works/2026-reel/type-20260415-herondpointlaunchteaser-new-v5.mp4", label: "Herond Point teaser" },
          { src: "/works/2026-reel/type-20260309-walletcreativeads-part1-6.mp4", label: "Wallet ad" },
          { src: "/works/2026-reel/type-final-comp-1.mp4", label: "Light sweep" },
          { src: "/works/2026-reel/type-markdao-tgs-final-highres.mp4", label: "Planted forest ecosystem" },
        ],
      },
      { type: "zine-outro" },
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
      { type: "zine-cover" },
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
      // the film's UI is a video texture on a plane (the frame), regraded stills from it, then the onboarding they shipped in
      {
        type: "process",
        title: "UI Film Breakdown",
        description: "We had to work with a constantly changing UI - so locking it down in Blender is a no-no.\n\nInstead, my process was animating an SVG layer in AE and ran it as an mp4 on a plane in Blender. That way, if any UI elements change, I only need to re-export the video texture instead of replacing Blender objects.\n\nStills from the UI Film, exported in extra high definition and color corrected to be re-used in the app's onboarding flow.",
        groups: [
          { label: "The film", items: [{ src: "/works/herond-browser/x-assembly-frame-2.mp4" }] },
          {
            label: "Stills, regraded",
            items: [
              { src: "/works/herond-browser/onboarding-1.webp" },
              { src: "/works/herond-browser/onboarding-2.webp" },
              { src: "/works/herond-browser/onboarding-3.webp" },
              { src: "/works/herond-browser/onboarding-4.webp" },
            ],
          },
          { label: "Onboarding", items: [{ src: "/works/herond-browser/onboarding-fadein.mp4" }] },
        ],
      },
      // desktop features for the landing page (Behance: "created for the marketing landing page")
      {
        type: "loops",
        title: "Landing Page Mini Animations",
        description: "While creating the UI Film, I’d realized the cleaned up Browser Home Page UI imported from Figma could serve as a recurring After Effects rig - which enabled me to delivered these mini animations for the landing page to demo the key features.",
        groups: [
          {
            label: "Desktop",
            items: [
              { src: "/works/herond-browser/onboarding-home-search.mp4", label: "Search" },
              { src: "/works/herond-browser/onboarding-parallax.mp4", label: "Parallax wallpaper" },
              { src: "/works/herond-browser/onboarding-drag-tab.mp4", label: "Drag tab" },
              { src: "/works/herond-browser/onboarding-pin-tab.mp4", label: "Pin tab" },
              { src: "/works/herond-browser/mini-grouptab-newlogo.mp4", label: "Group tabs" },
              { src: "/works/herond-browser/mini-adblock.mp4", label: "Ad block" },
              { src: "/works/herond-browser/mini-incognito.mp4", label: "Incognito" },
              { src: "/works/herond-browser/mini-tab-wallet-prepped.mp4", label: "Wallet tab" },
            ],
          },
        ],
      },
      // the wallet's phone flows, cut as inputs for a longer ad (Behance caption)
      {
        type: "loops",
        title: "Herond Wallet",
        description: "These short animated sequences were my input for a longer motion graphic ads, in charge by another person.\n\nThis is Herond Wallet, one of the flagship features of Herond Browser.",
        groups: [
          {
            label: "Mobile",
            items: [
              { src: "/works/herond-browser/mini-open.mp4", label: "Open" },
              { src: "/works/herond-browser/mini-create-wallet.mp4", label: "Create wallet" },
              { src: "/works/herond-browser/mini-buy.mp4", label: "Buy" },
              { src: "/works/herond-browser/mini-send-buy.mp4", label: "Select network" },
              { src: "/works/herond-browser/mini-swap.mp4", label: "Swap" },
              { src: "/works/herond-browser/mini-walletsidebar.mp4", label: "Sidebar" },
            ],
          },
        ],
      },
      // draft to final in order; the Blender captures are how it was built, so they stand beside
      {
        type: "evolution",
        title: "Herond Point Orb",
        subtitle: "In Blender",
        description: "The Orb sits at the centre of Herond's rewards system. I took it from ideation to final look solo, ensuring it felt rewarding while remaining coherent with a brand that was still being defined. Step through the strip under the frame to see the design progression from rough sketch to final 3D look.",
        items: [
          { src: "/works/herond-browser/x-overlord-herond-point-draft-3-1-88-686.webp", label: "Draft" },
          { src: "/works/herond-browser/orb-1.webp" },
          { src: "/works/herond-browser/orb-2.webp" },
          { src: "/works/herond-browser/orb-8.webp" },
          { src: "/works/herond-browser/orb-9.webp" },
          { src: "/works/herond-browser/orb-3.webp" },
          { src: "/works/herond-browser/orb-4.webp" },
          { src: "/works/herond-browser/orb-5.webp" },
          { src: "/works/herond-browser/orb-7.webp" },
          { src: "/works/herond-browser/x-herondpointcon-transparency-4.webp" },
          { src: "/works/herond-browser/orb-10.webp" },
          { src: "/works/herond-browser/orb-6.webp" },
          { src: "/works/herond-browser/orb-11.webp" },
          { src: "/works/herond-browser/x-orb-composited-000.webp", label: "Final" },
        ],
        extras: [
          { src: "/works/herond-browser/orb-12.mp4" },
          { src: "/works/herond-browser/x-2026-port-stat-hpointorb-bts-new.mp4" },
        ],
      },
      {
        type: "interactive-preview",
        title: "AI Agent Interface",
        description: "When Herond moved toward an agentic model, I built out an interface concept: an R3F orb with a full state machine, optimised for web performance, using AI tools throughout the workflow.",
        src: "/works/herond-browser/agent.mp4"
      },
      // the medal library, bronze to gold to the special casts; seven medals were also rendered under the second rig
      {
        type: "library",
        title: "Herond Point Rewards",
        description: "The Herond Point system also had missions for users to accomplish. I was tasked with creating something people would want to share upon completing their mission. Thematically speaking, these all aim to communicate a space/astronomy theme that support the Herond Point Orb.\n\nSince we aimed to introduce new rewards by the season, each medal is created with scalability in mind. I standardized each setup into reusable materials and layouts that lives in the Blender Asset Library, making iterations a breeze. The kicker is that the lighting system also needed to change between the medals, so that needed to be made an asset too.",
        variantLabels: ["Lighting 1", "Lighting 2"],
        items: [
          { src: "/works/herond-browser/x-00-originals-telegram.webp", label: "Telegram", variant: "/works/herond-browser/x-overlordclone-telegram3.webp" },
          { src: "/works/herond-browser/x-00-originals-discord.webp", label: "Discord", variant: "/works/herond-browser/x-overlordclone-discord3.webp" },
          { src: "/works/herond-browser/x-00-originals-firstswap.webp", label: "First swap" },
          { src: "/works/herond-browser/x-00-originals-firstclaim.webp", label: "First claim" },
          { src: "/works/herond-browser/x-00-originals-7days.webp", label: "7 days" },
          { src: "/works/herond-browser/badge-firstspin.webp", label: "First spin" },
          { src: "/works/herond-browser/x-00-originals-7tickets.webp", label: "7 tickets", variant: "/works/herond-browser/x-overlordclone-lotteryclaim3.webp" },
          { src: "/works/herond-browser/x-00-originals-14days.webp", label: "14 days", variant: "/works/herond-browser/x-overlordclone-14days3.webp" },
          { src: "/works/herond-browser/badge-walletpioneer.webp", label: "Wallet pioneer", variant: "/works/herond-browser/x-overlordclone-walletpioneer3.webp" },
          { src: "/works/herond-browser/x-00-originals-newcomer.webp", label: "Newcomer" },
          { src: "/works/herond-browser/badge-pioneer.webp", label: "Pioneer", variant: "/works/herond-browser/x-overlordclone-tag.webp" },
          { src: "/works/herond-browser/x-00-originals-active.webp", label: "Active" },
          { src: "/works/herond-browser/badge-30days.webp", label: "30 days", variant: "/works/herond-browser/x-overlordclone-30days7.webp" },
          { src: "/works/herond-browser/badge-earlyexplorer.webp", label: "Early explorer" },
          { src: "/works/herond-browser/badge-megawinner.webp", label: "Mega winner" },
        ],
      },
      // social ads by placement: each named by its own headline
      {
        type: "loops",
        title: "Day-to-day & Other Contributions",
        description: "Social motion for Growth and photography for Internal Comms under high-volume, fast-turnaround conditions. Also contributed reusable motion assets during the rebrand, an Adobe CC → Figma workflow for UI animations, a Blender rendering/WebM export script, and Rive/Lottie in-app animations built alongside the UI/UX team.",
        groups: [
          {
            label: "16:9",
            items: [
              { src: "/works/herond-browser/day-shield.mp4", label: "Annoying ads?" },
              { src: "/works/herond-browser/day-shortads-stayworryfree-1920x1080.mp4", label: "Browse ad-free. Stay worry-free." },
              { src: "/works/herond-browser/day-shortads-stopfightingforyourcontent-1920x1080.mp4", label: "Stop fighting for your content" },
              { src: "/works/herond-browser/day-herondcreativeads3-aiwallet-1920x1080-1.mp4", label: "AI wallet" },
              { src: "/works/herond-browser/x-herond-gifs-ex-20260202-newlayout-walletcrosschain.mp4", label: "Move assets across chains" },
              { src: "/works/herond-browser/x-herond-gifs-ex-herondproductlayerre-education-v3.mp4", label: "Herond AI leads your workflow" },
            ],
          },
          {
            label: "1:1",
            items: [
              { src: "/works/herond-browser/day-peace.mp4", label: "Finally, some peace and quiet" },
              { src: "/works/herond-browser/day-shortads-peaceandquiet-1080x1080-3.mp4", label: "Peace and quiet, short" },
              { src: "/works/herond-browser/x-herond-gifs-ex-20260429-newaibrowser-v4.mp4", label: "The new AI browser" },
              { src: "/works/herond-browser/x-herond-gifs-ex-20260511-thenewaibrowserthatleadsyourway.mp4", label: "The new browser that leads your way" },
            ],
          },
        ],
      },
      {
        type: "deliverable-breakdown",
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
      { type: "zine-outro" },
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
      { type: "zine-cover" },
      {
        type: "editorial-text",
        content: "Defrasoft published and monetised mobile apps. I was the only designer across five products, handling ASO design, performance ads, AI UGC, and Rive/Lottie in-app animations.\n\nThe work here was less about craft per piece and more about judgment at volume — knowing when something was good enough to ship and when it needed another pass."
      },
      // the apps everything below sells: icon and home screen of each
      {
        type: "roster",
        groups: [
          { label: "Voice Note AI", items: [{ src: "/works/defrasoft/x-defrasoft-voicenotes-icon.webp" }, { src: "/works/defrasoft/x-defrasoft-voicelynotes-homeui.webp" }] },
          { label: "Recover Deleted Message", items: [{ src: "/works/defrasoft/x-defrasoft-messrecoveryicon.webp" }, { src: "/works/defrasoft/x-defrasoft-messrecovery-homeu.webp" }] },
          { label: "File Recovery", items: [{ src: "/works/defrasoft/x-defrasoft-filerecoveryicon.webp" }, { src: "/works/defrasoft/x-defrasoft-filerecovery-homeui.webp" }] },
          { label: "Family Guardian", items: [{ src: "/works/defrasoft/x-defrasoft-familyguardianappicon.webp" }, { src: "/works/defrasoft/x-defrasoft-familyguardian-homeui.webp" }] },
        ],
      },
      // video ads as they ran: portrait, by app
      {
        type: "feed",
        title: "Motion Graphic Ads",
        description: "In my time there, I helped the team translate static Figma designs to intuitive app interactions for ads, driving all video advertisement efforts and balancing quality with speed and volume.\n\nThe ads would then be deployed on Google Ads. It is my job not just to create, but to also learn from their performance, adapt with new insights, and handle technical areas like changing policies and specification guidelines.",
        groups: [
          {
            label: "Voice Note AI",
            items: [
              { src: "/works/defrasoft/ad-angle1-vert-withcta.mp4" },
              { src: "/works/defrasoft/ad-voicenote-ua-angle2-vertical-1.mp4" },
              { src: "/works/defrasoft/ad-voicenote-ua-angle3-vert.mp4" },
            ],
          },
          {
            label: "Recover Deleted Message",
            items: [
              { src: "/works/defrasoft/ad-vertical.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-1.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-6.mp4" },
              { src: "/works/defrasoft/x-defra-angle1-demo.mp4" },
            ],
          },
          {
            label: "File Recovery",
            items: [
              { src: "/works/defrasoft/ad-hidefiles.mp4" },
              { src: "/works/defrasoft/ad-databackup.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4" },
            ],
          },
          {
            label: "Family Guardian",
            items: [
              { src: "/works/defrasoft/ad-familyguardian-partnertracking.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-001.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-002.mp4" },
            ],
          },
          { label: "360 Tracker", items: [{ src: "/works/defrasoft/ad-360tracker-featurevideo-886x19.mp4" }] },
        ],
      },
      // static ads: each creative across its formats, then concepts across the audiences they were cut for
      {
        type: "matrix",
        title: "Performance Ads",
        description: "The work here was less about craft per piece and more about judgment at volume — knowing when something was good enough to ship and when it needed another pass.",
        tables: [
          {
            title: "Formats",
            axis: ["4:5", "1:1", "1.91:1"],
            lines: [
              { label: "Voice Note / Common", cells: ["/works/defrasoft/voicenotes-common_vert.webp", "/works/defrasoft/x-angle-1-common-common-sqr.webp", "/works/defrasoft/x-angle-1-common-common-hor.webp"] },
              { label: "Voice Note / Business", cells: ["/works/defrasoft/voicenotes-business_vert.webp", "/works/defrasoft/x-angle-2-busine-business-sqr.webp", "/works/defrasoft/x-angle-2-busine-business-hor.webp"] },
              { label: "Voice Note / Students", cells: ["/works/defrasoft/x-angle-3-studen-students-vert.webp", "/works/defrasoft/x-angle-3-studen-students-sqr.webp", "/works/defrasoft/x-angle-3-studen-students-hor.webp"] },
              { label: "Voice Note / Home", cells: ["/works/defrasoft/voicenotes-home_vert.webp", "/works/defrasoft/x-angle-4-chores-home-sqr.webp", "/works/defrasoft/x-angle-4-chores-home-hor.webp"] },
              { label: "Messages / Angle 1", cells: ["/works/defrasoft/x-english-angle1-vert.webp", null, null] },
              { label: "Messages / Angle 2", cells: [null, "/works/defrasoft/x-english-angle2-sq.webp", null] },
              { label: "Messages / Angle 3", cells: ["/works/defrasoft/x-english-angle3-vert.webp", "/works/defrasoft/x-english-angle3-sq.webp", "/works/defrasoft/x-english-angle3-hor.webp"] },
              { label: "Reviver / Memories", cells: ["/works/defrasoft/x-ua-ad5-memorie-artboard-1.webp", "/works/defrasoft/x-ua-ad5-memorie-artboard-1-1.webp", "/works/defrasoft/x-ua-ad5-memorie-artboard-1-2.webp"] },
              { label: "Reviver / Birthday", cells: ["/works/defrasoft/x-birthday-birthday-vertical.webp", "/works/defrasoft/x-birthday-birthday-square.webp", "/works/defrasoft/x-birthday-birthday-hor.webp"] },
              { label: "Reviver / Wedding", cells: ["/works/defrasoft/x-wedding-wedding-vertical.webp", "/works/defrasoft/x-wedding-wedding-square.webp", "/works/defrasoft/x-wedding-wedding-horizontal.webp"] },
              { label: "Reviver / Hide photos", cells: ["/works/defrasoft/x-ua-ad6-hidepho-artboard-2.webp", "/works/defrasoft/x-ua-ad6-hidepho-artboard-2-1.webp", "/works/defrasoft/x-ua-ad6-hidepho-artboard-2-2.webp"] },
              { label: "Reviver / Accident", cells: ["/works/defrasoft/x-ua-ad7-acciden-artboard-3.webp", null, null] },
            ],
          },
          {
            title: "Audiences",
            axis: ["Hide files", "Data backup", "Duplicates"],
            lines: [
              { label: "General", cells: ["/works/defrasoft/x-hide-general.webp", "/works/defrasoft/x-databackup-general.webp", "/works/defrasoft/x-english-dedup-general.webp"] },
              { label: "Students", cells: ["/works/defrasoft/x-hide-students.webp", "/works/defrasoft/x-databackup-students.webp", "/works/defrasoft/x-english-dedup-students.webp"] },
              { label: "Business", cells: ["/works/defrasoft/x-hide-businessusers.webp", "/works/defrasoft/x-databackup-businessusers.webp", null] },
              { label: "Tech-savvy", cells: ["/works/defrasoft/x-hide-tech-savvy.webp", "/works/defrasoft/x-databackup-tech-savvy.webp", "/works/defrasoft/x-english-dedup-tech-savvy.webp"] },
            ],
          },
        ],
      },
      {
        type: "store",
        title: "App Store Creatives",
        description: "Designed within device frames for app store optimization.\n\nA set of Play Store App Preview images I created for Recover Deleted Messages - an app that backs up incoming messages on the notification level so users can have cold hard copies of their conversation even when senders delete their messages.",
        src: "/works/defrasoft/x-overlord-pixel-7-pro-light-mode-373-4.webp",
        items: [
          { src: "/works/defrasoft/aso.webp" },
          { src: "/works/defrasoft/aso-phone-42.webp" },
          { src: "/works/defrasoft/aso-phone-43.webp" },
          { src: "/works/defrasoft/aso-phone-6finals.webp" },
        ],
      },
      // led by the AE board of the batch (media/defrasoft-ads: a strip of these faces)
      {
        type: "feed",
        title: "AI UGC",
        description: "These talking head shots were generated with Google Veo 3.1 as soon as it became feasible at scale to do so. I used Claude to come up with the hooks and plugged those into Google Flow.\n\nI try to lean into the absurdity that AI provide instead of trying to mimic real life. Dude falling from the sky while trying to tell you about a new app? Heck yea.",
        src: "/media/defrasoft-ads.mp4",
        groups: [
          {
            label: "Veo 3.1",
            items: [
              { src: "/works/defrasoft/x-ai-dm-20251120140617-001.mp4" },
              { src: "/works/defrasoft/x-ai-this-app-modegear-202512150916-tz3yc.mp4" },
              { src: "/works/defrasoft/x-ai-if-you-have-202512150913-7fsh1.mp4" },
              { src: "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-opu.mp4" },
              { src: "/works/defrasoft/ugc.mp4" },
              { src: "/works/defrasoft/ugc-you-dmshe.mp4" },
              { src: "/works/defrasoft/ugc-didnt-kkzb9.mp4" },
              { src: "/works/defrasoft/x-ai-dont-tell-the-202512091619-vjvw3.mp4" },
              { src: "/works/defrasoft/x-ai-download.mp4" },
              { src: "/works/defrasoft/x-ai-37cbe297-caae-4705-8006-54ff1212f3b0.mp4" },
              { src: "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-194.mp4" },
              { src: "/works/defrasoft/x-ai-0ad4aa3b-9721-4943-abb4-964a3c8c0b4f.mp4" },
              { src: "/works/defrasoft/x-ai-0ba69811-fef2-40b6-9fe7-29a605f8bf3f.mp4" },
            ],
          },
        ],
      },
      // the editor, its state machine, then the screens they run in
      {
        type: "process",
        title: "Rive & Lottie Animations",
        description: "Built for light file sizes and clean developer handoff. State logic was part of the design, not an afterthought. Animations are optimized for mobile performance and responsive rendering.\n\nIt's not a difficult task, but required close collaboration between me and the devs for each respective app to actually verify how each animation appear and resolve any issues.",
        groups: [
          { label: "Rive", items: [{ src: "/works/defrasoft/rive-full.mp4" }] },
          { label: "States", items: [{ src: "/works/defrasoft/rive-states.mp4" }] },
          {
            label: "In the app",
            items: [
              { src: "/works/defrasoft/voicely-onboarding.mp4" },
              { src: "/works/defrasoft/x-overlord-home-7522-64358.webp" },
              { src: "/works/defrasoft/x-overlord-iap-5-with-anim-1818-28551.webp" },
              { src: "/works/defrasoft/x-overlord-mail-2-2-847-4454.webp" },
            ],
          },
        ],
      },
      { type: "zine-outro" },
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
      { type: "zine-cover" },
      {
        type: "editorial-text",
        content: "Z Cũng Viết was a social communication campaign making the case for writing as a tool for mental health. I led brand design, creative direction, and media production end-to-end — wrote the brief, then executed against it.\n\nIt's the project where I had the most creative ownership, and probably the one that best reflects how I think about design when no one's handed me a direction."
      },
      // the mark in its four inks, the second mark and the pattern; then the identity applied
      {
        type: "library",
        title: "Brand Identity",
        description: "Full visual language designed from scratch. Incorporates logo variations, a curated tech-luxe color palette, and bespoke typography systems to elevate the campaign's visual presence, giving it ample room first.",
        items: [
          { src: "/works/z-cung-viet/x-png-small-asset-182-4x.webp", label: "Orange" },
          { src: "/works/z-cung-viet/x-png-small-asset-181-4x.webp", label: "Navy" },
          { src: "/works/z-cung-viet/x-png-small-asset-179-4x.webp", label: "Black" },
          { src: "/works/z-cung-viet/x-png-small-asset-180-4x.webp", label: "White", tone: "dark" },
          { src: "/works/z-cung-viet/collaborators.webp", label: "Collaborators" },
          { src: "/works/z-cung-viet/cover.mp4", label: "Pattern" },
        ],
        extras: [
          { src: "/works/z-cung-viet/brand-book.webp" },
          { src: "/works/z-cung-viet/mockup-2.webp" },
          { src: "/works/z-cung-viet/apparel.webp" },
        ],
      },
      // the activation day's print and the campaign's out-of-home, led by the animated event poster
      {
        type: "deliverable-breakdown",
        title: "Social Media & Event Materials",
        layout: "feature",
        description: "On the daily, I produced social media posts that communicated brand messages and engaged with the audience through simple but effective prompting and conditioning to encourage writing.\n\nEvent materials I designed and printed for the final activation day.",
        images: [
          "/works/z-cung-viet/event-poster.mp4",
          "/works/z-cung-viet/faq.webp",
          "/works/z-cung-viet/mockup-3.webp",
          "/works/z-cung-viet/poster.webp",
          "/works/z-cung-viet/brand-mark.webp",
          "/works/z-cung-viet/nametag.webp",
          "/works/z-cung-viet/vongtay.webp",
          "/works/z-cung-viet/photo-2.webp"
        ]
      },
      // one lower-third template, three guests; the title and the vertical cut beside it
      {
        type: "variants",
        title: "Motion Graphics",
        description: "These motion graphics were created to cement the brand in the creation of these episodes.\n\nPlus, we were making long-form documentary/interview format content, so it’s essential to keep the audience engaged with fun beats such as these. As with all things, these were made with scalability and utility in mind, so they’re fully mogrt compatible.",
        items: [
          { src: "/works/z-cung-viet/khoa.mp4", label: "Khoa" },
          { src: "/works/z-cung-viet/don.mp4", label: "Don" },
          { src: "/works/z-cung-viet/linh.mp4", label: "Linh" },
        ],
        extras: [
          { src: "/works/z-cung-viet/intro-hori.mp4", label: "Intro" },
          { src: "/works/z-cung-viet/write-time.mp4", label: "Write time" },
        ],
      },
      {
        type: "deliverable-breakdown",
        title: "Media Production",
        layout: "feature",
        description: "I was responsible for camera operation, lighting, and audioworks. To be honest it’s a pretty small set on a smaller budget, but playing these roles gave me hands-on experience knowing exactly what works for post production.\n\nI handled posts, too. Building an offline, then an online, then color works, to a final cut for each of the episodes.",
        images: [
          "/works/z-cung-viet/production-recap.mp4",
          "/works/z-cung-viet/recap-2.mp4",
          "/works/z-cung-viet/photo.webp"
        ]
      },
      { type: "zine-outro" },
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
      { type: "zine-cover" },
      {
        type: "editorial-text",
        content:
          "A curated selection of client commissions spanning different continents and sectors.\n\nRanging from global supply-chain giants (Freightos) to creative studios (Storyflow) and design tool teams, the common thread is creating high-fidelity, structural motion sequences that simplify complex messages and respect brand guidelines.",
      },
      // one row per client, each opening its own work
      {
        type: "ledger",
        title: "Commissions",
        description:
          "High-production-value video narratives produced to introduce products, explain technical protocols, and launch campaigns.\n\nShort-form advertising campaigns and high-fidelity product UI mockups.",
        groups: [
          {
            label: "Freightos",
            note: "Animated stickers",
            items: [
              { src: "/works/select-freelance-work/freightos.mp4" },
              { src: "/works/select-freelance-work/freightos-10.mp4" },
              { src: "/works/select-freelance-work/ship-happens.mp4" },
            ],
          },
          {
            label: "Storyflow",
            note: "Samujana, Koh Samui",
            items: [
              { src: "/works/select-freelance-work/storyflow.mp4" },
              { src: "/works/select-freelance-work/storyflow-2.mp4" },
            ],
          },
          {
            label: "Dobeedo",
            note: "Product UI",
            items: [
              { src: "/works/select-freelance-work/cover.mp4" },
              { src: "/works/select-freelance-work/dobeedo-4.mp4" },
              { src: "/works/select-freelance-work/dobeedo-6.mp4" },
              { src: "/works/select-freelance-work/dobeedo-7.mp4" },
            ],
          },
          { label: "SquarePeg", note: "UI animation", items: [{ src: "/works/select-freelance-work/squarepeg.mp4" }] },
          { label: "MB", note: "Explainer", items: [{ src: "/works/select-freelance-work/mb-explainer.mp4" }] },
          { label: "Monthly Spend", note: "Data story", items: [{ src: "/works/select-freelance-work/monthly-spend.mp4" }] },
        ],
      },
      { type: "zine-outro" },
    ],
  },
];
