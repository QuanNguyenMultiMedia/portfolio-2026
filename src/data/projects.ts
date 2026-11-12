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
      | "ledger" // client commissions: an index of names, each opening its work (groups)
      | "variants" // one template, several instances (items), with its siblings (extras)
      | "stages" // one frame playing a build's stages in order (items, labelled), on a dark board
      | "orbit" // a set ringed around its centre piece (src), as on the AE rewards board (items)
      | "screens" // in-app screens (items), long ones scrolled inside the phone, with the art they carry (extras)
      | "wall" // a dense wall of cuts on black, drifting, as on the AE social board (items)
      | "cuts" // a reel and its edit decision list: every cut at its timecode, by act (src, cuts)
      | "carousel" // portrait ads on a turning ring, as on the AE carousel board (items)
      | "screening" // full-length films with their sound, one monitor and a programme (items)
      | "trail"; // work at volume on one stacked, snaking trail; hover lifts a piece whole (items, or tables flattened)
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
    /** editorial-text: the role, set as the sans lead (AE Info boards) */
    lead?: string;
    /** editorial-text: how the chapters are set, after the AE Info boards (band 10, column 04, board 07) */
    info?: "band" | "column" | "board" | "intro";
    /** editorial-text: the aside set by the collage (04.Defrasoft_info) */
    note?: string;
    /** editorial-text: the project's chapters, set as the serif list (AE Info boards) */
    chapters?: string[];
    /** the chapter a section belongs to, carried as its running label */
    chapter?: string;
    /** cuts: the reel's edit decision list (AE Showreel comp), seconds from the top */
    cuts?: { at: number; label: string; act: string; href?: string }[];
    /** cuts: each act's ink on the edit track (a riso.css ink var) */
    acts?: { name: string; ink: string }[];
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
    /** the two inks the chapter band ramps between (10.HerondLabs_Info: coral to violet) */
    ramp?: [string, string];
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
      // the reel and its edit decision list (AE comp "Showreel"): every cut at its timecode, inked by act
      {
        type: "cuts",
        title: "Edit",
        src: "/media/showreel.mp4",
        acts: [
          { name: "2026 Reel", ink: "var(--foreground)" },
          { name: "Herond Browser", ink: "var(--ink-blue)" },
          { name: "Freelance", ink: "var(--ink-indigo)" },
          { name: "Defrasoft", ink: "var(--ink-violet)" },
        ],
        cuts: [
          { at: 0, label: "2026 reeL", act: "2026 Reel" },
          { at: 3.1, label: "UI Film", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 7.58, label: "Herond Point Orb", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 8.55, label: "Herond Point launch teaser", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 10.18, label: "Herond Point launch", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 11.67, label: "Logo teaser", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 13.77, label: "New logo announcement", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 15.47, label: "New interface, mobile", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 17.58, label: "Herond AI teaser", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 18.52, label: "AI wallet", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 20.38, label: "Repositioning explainer", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 22.45, label: "Finally, some peace and quiet", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 24.4, label: "Chromium update", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 25.38, label: "Repositioning explainer", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 26.9, label: "Monthly Spend", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 29.1, label: "Freightos", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 31.4, label: "Ship Happens", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 34.52, label: "MoLaMa", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 38.38, label: "MB explainer", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 42.88, label: "Dobeedo", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 48.17, label: "SquarePeg", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 52.53, label: "Storyflow", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 58.7, label: "Mark Dao", act: "Freelance", href: "/works/select-freelance-work" },
          { at: 60.72, label: "Anonymous mode", act: "Herond Browser", href: "/works/herond-browser" },
          { at: 62.42, label: "AI UGC", act: "Defrasoft", href: "/works/defrasoft" },
          { at: 64.78, label: "App demo", act: "Defrasoft", href: "/works/defrasoft" },
          { at: 65.27, label: "Vertical ads", act: "Defrasoft", href: "/works/defrasoft" },
          { at: 68.58, label: "Family Guardian", act: "Defrasoft", href: "/works/defrasoft" },
          { at: 71.57, label: "Logo", act: "2026 Reel" },
        ],
      },
      { type: "zine-outro" },
    ],
  },
  {
    title: "Herond Browser",
    slug: "herond-browser",
    print: { fountain: "herond", deck: "ink-blue", stack: true, ramp: ["var(--ink-coral)", "var(--ink-violet)"] },
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
      // 10.HerondLabs_Info: the role as the lead, the chapters as the contents
      {
        type: "editorial-text",
        lead: "Inhouse Motion Designer\nBrand Materials &\nIn-app Components",
        content:
          "Herond Browser is a web3-native, agentic, privacy-focused web browser, built to transition web2.0 users to web3.0.\n\nI joined the team during a massive, coordinated rebrand effort to help deliver a UI Film, and stayed to design the core reward system visual and helped with social media motion graphics.",
        chapters: ["3D UI Film", "Reward System", "Motion Graphics"],
        info: "band",
        extras: [
          { src: "/works/herond-browser/onboarding-2.webp" },
          { src: "/works/herond-browser/mini-walletsidebar.mp4" },
          { src: "/works/herond-browser/x-orb-composited-000.webp" },
          { src: "/works/herond-browser/badge-pioneer.webp" },
        ],
      },
      {
        type: "video",
        chapter: "3D UI Film",
        src: "/works/herond-browser/ui-film.mp4",
        title: "UI Film",
        description: "Hero animation showcase for the landing page. Built to work as both a cinematic product showcase and a functional UI explainer, taking the project from storyboard to final render.",
      },
      // 10.HerondLabs_UIFilmBreakdown: one monitor, the three stages it was built in, named as on the board
      {
        type: "stages",
        chapter: "3D UI Film",
        title: "UI Film Breakdown",
        description: "We had to work with a constantly changing UI - so locking it down in Blender is a no-no.\n\nInstead, my process was animating an SVG layer in AE and ran it as an mp4 on a plane in Blender. That way, if any UI elements change, I only need to re-export the video texture instead of replacing Blender objects.",
        items: [
          { src: "/works/herond-browser/onboarding-fadein.mp4", label: "2D UI Animation" },
          { src: "/works/herond-browser/x-assembly-frame-2.mp4", label: "3D Render" },
          { src: "/works/herond-browser/breakdown-processed.mp4", label: "3D Render processed" },
        ],
        extras: [{ src: "/works/herond-browser/breakdown-blender-1.webp" }, { src: "/works/herond-browser/breakdown-blender-2.webp" }],
      },
      // Behance: stills pulled from the film for the app's onboarding
      {
        type: "deliverable-breakdown",
        chapter: "3D UI Film",
        title: "UI Film Stills",
        description: "Stills from the UI Film, exported in extra high definition and color corrected to be re-used in the app's onboarding flow.",
        images: ["/works/herond-browser/onboarding-1.webp", "/works/herond-browser/onboarding-2.webp", "/works/herond-browser/onboarding-3.webp", "/works/herond-browser/onboarding-4.webp"],
      },
      // desktop features for the landing page (Behance: "created for the marketing landing page")
      {
        type: "loops",
        chapter: "3D UI Film",
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
        chapter: "3D UI Film",
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
      // 10.2. HerondPointOrb1: the copy, the orb from draft to final; the in-app panel it shipped in and the Blender scene beside
      {
        type: "evolution",
        chapter: "Reward System",
        title: "Herond Point Orb",
        description: "To improve user retention and activity, the Herond team launched a Rewards system that collects redeemable points for various user behaviours.\n\nAt the center of that system is this: the Herond Point Orb.\n\nThe idea is to create something that feels like holding a star in your hands - something covetous.",
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
          { src: "/works/herond-browser/point-panel.mp4", label: "Herond Point panel" },
          { src: "/works/herond-browser/x-2026-port-stat-hpointorb-bts-new.mp4", label: "Blender" },
          { src: "/works/herond-browser/orb-12.mp4", label: "Blender" },
        ],
      },
      // 10.2. HerondPointRewards: the medals ringed around the helmet, bronze to silver to gold, both copy blocks at
      // opposite corners; board 3's asset-library recording (at the comp's 16x) under the note it proves
      {
        type: "orbit",
        chapter: "Reward System",
        title: "Herond Point Rewards",
        src: "/works/herond-browser/badge-earlyexplorer.webp",
        description: "The Herond Point system also had missions for users to accomplish. I was tasked with creating something people would want to share upon completing their mission.\n\nThematically speaking, these all aim to communicate a space/astronomy theme that support the Herond Point Orb.\n\nSince we aimed to introduce new rewards by the season, each medal is created with scalability in mind. I standardized each setup into reusable materials and layouts that lives in the Blender Asset Library, making iterations a breeze.",
        items: [
          { src: "/works/herond-browser/badge-pioneer.webp", label: "Pioneer" },
          { src: "/works/herond-browser/x-00-originals-active.webp", label: "Active" },
          { src: "/works/herond-browser/x-00-originals-newcomer.webp", label: "Newcomer" },
          { src: "/works/herond-browser/x-00-originals-firstswap.webp", label: "First swap" },
          { src: "/works/herond-browser/x-00-originals-firstclaim.webp", label: "First claim" },
          { src: "/works/herond-browser/x-00-originals-discord.webp", label: "Discord" },
          { src: "/works/herond-browser/x-00-originals-telegram.webp", label: "Telegram" },
          { src: "/works/herond-browser/badge-megawinner.webp", label: "Mega winner" },
          { src: "/works/herond-browser/badge-30days.webp", label: "30 days" },
          { src: "/works/herond-browser/badge-walletpioneer.webp", label: "Wallet pioneer" },
          { src: "/works/herond-browser/x-00-originals-7tickets.webp", label: "7 tickets" },
          { src: "/works/herond-browser/x-00-originals-14days.webp", label: "14 days" },
          { src: "/works/herond-browser/badge-firstspin.webp", label: "First spin" },
          { src: "/works/herond-browser/x-00-originals-7days.webp", label: "7 days" },
        ],
        extras: [
          {
            src: "/works/herond-browser/rewards-library.mp4",
            label: "Made a library for the project so we can promote/demote medals as needed by the Growth team. The kicker is that the lighting system also needed to change between the medals, so that needed to be made an asset too.",
          },
        ],
      },
      // 10.2. HerondPointRewards 2: the profile screen behind, the badge detail over it; the badge art they carry
      {
        type: "screens",
        chapter: "Reward System",
        title: "In the App",
        items: [
          { src: "/works/herond-browser/app-profile.webp", label: "Profile" },
          { src: "/works/herond-browser/app-badge-detail.webp", label: "Badge detail" },
        ],
        extras: [
          { src: "/works/herond-browser/x-overlordclone-30days7.webp", label: "30 days" },
          { src: "/works/herond-browser/x-overlordclone-14days3.webp", label: "14 days" },
          { src: "/works/herond-browser/x-overlordclone-lotteryclaim3.webp", label: "Lottery claim" },
          { src: "/works/herond-browser/x-overlordclone-walletpioneer3.webp", label: "Wallet pioneer" },
          { src: "/works/herond-browser/x-overlordclone-telegram3.webp", label: "Telegram" },
          { src: "/works/herond-browser/x-overlordclone-discord3.webp", label: "Discord" },
        ],
      },
      // the agentic turn: the orb carried into a live interface concept
      {
        type: "interactive-preview",
        chapter: "Reward System",
        title: "AI Agent Interface",
        description: "When Herond moved toward an agentic model, I built out an interface concept: an R3F orb with a full state machine, optimised for web performance, using AI tools throughout the workflow.",
        src: "/works/herond-browser/agent.mp4",
      },
      // the full-length films the reel cuts from (2026Reel_Main folder/(Footage)), screened with their sound
      {
        type: "screening",
        chapter: "Motion Graphics",
        title: "Films",
        items: [
          { src: "/works/herond-browser/film-whywerebrand.mp4", label: "Why we rebrand" },
          { src: "/works/herond-browser/film-logoteaser.mp4", label: "Logo teaser" },
          { src: "/works/herond-browser/film-logoannouncement.mp4", label: "New logo announcement" },
          { src: "/works/herond-browser/film-newuiteaser.mp4", label: "New UI teaser" },
          { src: "/works/herond-browser/film-mobilenewconcept.mp4", label: "New interface, mobile" },
          { src: "/works/herond-browser/film-repositioning.mp4", label: "Repositioning explainer" },
          { src: "/works/herond-browser/film-pointlaunch.mp4", label: "Herond Point launch" },
          { src: "/works/herond-browser/film-chromiumupdate.mp4", label: "Chromium update" },
          { src: "/works/herond-browser/film-pinyourtab.mp4", label: "Lock your focus, pin your tab" },
          { src: "/works/herond-browser/film-anonymode.mp4", label: "Anonymous mode" },
        ],
      },
      // 10.3. HerondSocialMedia: the board's 17 cuts on black; copy from the Behance social module
      {
        type: "wall",
        chapter: "Motion Graphics",
        title: "Social Media",
        description: "My day-to-day responsibilities also included creating motion graphic ads and social media posts.",
        items: [
          { src: "/works/herond-browser/cut-newlayout-walletcrosschain.mp4", label: "Move assets across chains" },
          { src: "/works/herond-browser/cut-shortads-peaceandquiet.mp4", label: "Finally, some peace and quiet" },
          { src: "/works/herond-browser/cut-herondpointlaunch-v3.mp4", label: "Herond Point launch" },
          { src: "/works/herond-browser/cut-walletcreativeads-part1-6.mp4", label: "Wallet ad" },
          { src: "/works/herond-browser/cut-herondaiteaser.mp4", label: "Herond AI teaser" },
          { src: "/works/herond-browser/cut-newaibrowser-v4.mp4", label: "The new AI browser" },
          { src: "/works/herond-browser/cut-herondcreativeads2-shield.mp4", label: "Annoying ads?" },
          { src: "/works/herond-browser/cut-herondpointlaunchteaser-new-v5.mp4", label: "Herond Point launch teaser" },
          { src: "/works/herond-browser/cut-shortads-stayworryfree.mp4", label: "Browse ad-free. Stay worry-free." },
          { src: "/works/herond-browser/cut-thenewaibrowserthatleadsyourway.mp4", label: "The new browser that leads your way" },
          { src: "/works/herond-browser/cut-final-comp-1.mp4", label: "Light sweep" },
          { src: "/works/herond-browser/cut-herondcreativeads3-aiwallet-1.mp4", label: "AI wallet" },
          { src: "/works/herond-browser/cut-newherondlogoannouncement.mp4", label: "New logo announcement" },
          { src: "/works/herond-browser/cut-shortads-stopfightingforyourcontent.mp4", label: "Stop fighting for your content" },
          { src: "/works/herond-browser/cut-herondcreativeads2-shield-001.mp4", label: "Shield" },
          { src: "/works/herond-browser/cut-relaycampaignteaser-1.mp4", label: "Herond × Relay" },
          { src: "/works/herond-browser/cut-herondproductlayerre-education-v3.mp4", label: "Herond AI leads your workflow" },
        ],
      },
      // HerondSocial/*CreativeAds*: each ad cut to three placements
      {
        type: "matrix",
        chapter: "Motion Graphics",
        title: "Formats",
        tables: [
          {
            title: "Formats",
            axis: ["1:1", "9:16", "16:9"],
            lines: [
              { label: "Signals", cells: ["/works/herond-browser/fmt-signals-1080x1080.mp4", "/works/herond-browser/fmt-signals-1080x1920.mp4", "/works/herond-browser/fmt-signals-1920x1080.mp4"] },
              { label: "AI Wallet", cells: ["/works/herond-browser/fmt-aiwallet-1080x1080.mp4", "/works/herond-browser/fmt-aiwallet-1080x1920.mp4", "/works/herond-browser/fmt-aiwallet-1920x1080.mp4"] },
              { label: "Shield", cells: ["/works/herond-browser/fmt-shield-1080x1080.mp4", "/works/herond-browser/fmt-shield-1080x1920.mp4", "/works/herond-browser/fmt-shield-1920x1080.mp4"] },
            ],
          },
        ],
      },
      // HerondSocial/20260309_ReferralRaceKVLaunch: one key visual, its placements and backgrounds
      {
        type: "variants",
        chapter: "Motion Graphics",
        title: "Referral Race",
        items: [
          { src: "/works/herond-browser/kv-16x9-black.webp", label: "16:9" },
          { src: "/works/herond-browser/kv-16x9-clear.webp", label: "16:9 clear" },
          { src: "/works/herond-browser/kv-1x1-black.webp", label: "1:1" },
          { src: "/works/herond-browser/kv-1x1-clear.webp", label: "1:1 clear" },
        ],
        extras: [{ src: "/works/herond-browser/kv-lockup.webp", label: "Lockup" }],
      },
      // the gift box shoot and the internal events, each opening its own photos
      {
        type: "ledger",
        title: "Photography",
        description: "When we needed to launch a gift box the team designed, I rose to the occasion with my love for photography. I also did media for most of the internal communications events.",
        groups: [
          { label: "Gift box", items: [{ src: "/works/herond-browser/photo-giftbox-1.webp" }, { src: "/works/herond-browser/photo-giftbox-2.webp" }, { src: "/works/herond-browser/photo-giftbox-3.webp" }, { src: "/works/herond-browser/photo-giftbox-4.webp" }] },
          { label: "Vibe Code Hackathon", items: [{ src: "/works/herond-browser/photo-hack-7665.webp" }, { src: "/works/herond-browser/photo-hack-7699.webp" }, { src: "/works/herond-browser/photo-hack-7738.webp" }, { src: "/works/herond-browser/photo-hack-7746.webp" }, { src: "/works/herond-browser/photo-hack-7781.webp" }, { src: "/works/herond-browser/photo-hack-7889.webp" }] },
          { label: "Christmas", items: [{ src: "/works/herond-browser/photo-xmas-6449.webp" }, { src: "/works/herond-browser/photo-xmas-6459.webp" }, { src: "/works/herond-browser/photo-xmas-6487.webp" }, { src: "/works/herond-browser/photo-xmas-6507.webp" }, { src: "/works/herond-browser/photo-xmas-6539.webp" }] },
          { label: "Women's Day", items: [{ src: "/works/herond-browser/photo-women-0622.webp" }, { src: "/works/herond-browser/photo-women-0633.webp" }, { src: "/works/herond-browser/photo-women-0689.webp" }, { src: "/works/herond-browser/photo-women-0699.webp" }, { src: "/works/herond-browser/photo-women-0737.webp" }] },
        ],
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
      // 04.Defrasoft_info: the role as the lead, the apps the work sold as the collage, the chapters down a fountain column
      {
        type: "editorial-text",
        info: "column",
        lead: "Inhouse Motion Designer\nPerformance UA Ads &\nIn-app Animations",
        content:
          "Defrasoft is an app publishing startup in HCMC, VN. I joined as a performance ads motion designer.\n\nIn my time there, I helped the team translate static Figma designs to intuitive app interactions for ads, driving all video advertisement efforts and balancing quality with speed and volume.",
        chapters: ["Motion Graphic Ads", "In-App Animation", "AI UGC Generation", "Interactive HTML5 Ad Units"],
        note: "Beautiful UIs created by a teammate, I just did the motion.",
        extras: [
          { src: "/works/defrasoft/x-defrasoft-voicelynotes-homeui.webp", label: "Voice Note AI" },
          { src: "/works/defrasoft/x-defrasoft-filerecovery-homeui.webp", label: "File Recovery" },
          { src: "/works/defrasoft/x-defrasoft-familyguardian-homeui.webp", label: "Family Guardian" },
          { src: "/works/defrasoft/x-defrasoft-messrecovery-homeu.webp", label: "Recover Deleted Message" },
          { src: "/works/defrasoft/x-defrasoft-voicenotes-icon.webp", label: "Voice Note AI icon" },
          { src: "/works/defrasoft/x-defrasoft-filerecoveryicon.webp", label: "File Recovery icon" },
          { src: "/works/defrasoft/x-defrasoft-familyguardianappicon.webp", label: "Family Guardian icon" },
          { src: "/works/defrasoft/x-defrasoft-messrecoveryicon.webp", label: "Recover Deleted Message icon" },
        ],
      },
      // GIFs_Carousel: the vertical ads on a turning ring
      {
        type: "carousel",
        chapter: "Motion Graphic Ads",
        title: "Video Ads",
        description: "The ads would then be deployed on Google Ads. It is my job not just to create, but to also learn from their performance, adapt with new insights, and handle technical areas like changing policies and specification guidelines.",
        items: [
          { src: "/works/defrasoft/ad-angle1-vert-withcta.mp4", label: "Voice Note AI" },
          { src: "/works/defrasoft/ad-vertical.mp4", label: "Recover Deleted Message" },
          { src: "/works/defrasoft/ad-hidefiles.mp4", label: "File Recovery" },
          { src: "/works/defrasoft/ad-familyguardian-partnertracking.mp4", label: "Family Guardian" },
          { src: "/works/defrasoft/ad-voicenote-ua-angle2-vertical-1.mp4", label: "Voice Note AI" },
          { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-1.mp4", label: "Recover Deleted Message" },
          { src: "/works/defrasoft/ad-databackup.mp4", label: "File Recovery" },
          { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-001.mp4", label: "Family Guardian" },
          { src: "/works/defrasoft/ad-voicenote-ua-angle3-vert.mp4", label: "Voice Note AI" },
          { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-6.mp4", label: "Recover Deleted Message" },
          { src: "/works/defrasoft/x-apppub-gifs-ex-dedup-recover.mp4", label: "File Recovery" },
          { src: "/works/defrasoft/x-apppub-gifs-ex-vertical-mp4-rendered-002.mp4", label: "Family Guardian" },
          { src: "/works/defrasoft/x-defra-angle1-demo.mp4", label: "Recover Deleted Message" },
          { src: "/works/defrasoft/ad-360tracker-featurevideo-886x19.mp4", label: "360 Tracker" },
        ],
      },
      // static ads: each creative across its formats, then the audiences they were cut for, on one trail
      {
        type: "trail",
        chapter: "Motion Graphic Ads",
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
              { label: "Files / Duplicates", cells: ["/works/defrasoft/x-english-dedup-general.webp", null, "/works/defrasoft/x-english-dedup-generalhor.webp"] },
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
      // one batch, then the next built on what it learned: the data backup ads, before and after (05.Defrasoft_End copy)
      {
        type: "process",
        chapter: "Motion Graphic Ads",
        title: "Iterations",
        description: "At Defrasoft, the craft becomes a game of optimization. I helped the team deliver batches of creatives that continually builds up on our insight from the previous one.",
        groups: [
          { label: "Round 1", items: [{ src: "/works/defrasoft/x-databackup-students.webp" }, { src: "/works/defrasoft/x-databackup-tech-savvy.webp" }] },
          { label: "Round 2", items: [{ src: "/works/defrasoft/x-1200x1500-students.webp" }, { src: "/works/defrasoft/x-1200x1500-tech-savvy.webp" }] },
        ],
      },
      // 04.Defrasoft_info_Ads 2: the store set for Recover Deleted Message
      {
        type: "store",
        chapter: "Motion Graphic Ads",
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
      // 04.Defrasoft_info_lottieRive: the editor, its state machine, then the animation running in the app (frozen Figma stills of animated screens dropped: a still cannot show motion)
      {
        type: "process",
        chapter: "In-App Animation",
        title: "Rive & Lottie Animations",
        description: "Built for light file sizes and clean developer handoff. State logic was part of the design, not an afterthought. Animations are optimized for mobile performance and responsive rendering.\n\nIt's not a difficult task, but required close collaboration between me and the devs for each respective app to actually verify how each animation appear and resolve any issues.",
        groups: [
          { label: "Rive", items: [{ src: "/works/defrasoft/rive-full.mp4" }] },
          { label: "States", items: [{ src: "/works/defrasoft/rive-states.mp4" }] },
          {
            label: "In the app",
            items: [
              { src: "/works/defrasoft/voicely-onboarding.mp4" },
              { src: "/works/defrasoft/x-apppub-gifs-screenrecording-07-21-2026-11-08-38-1.mp4" },
            ],
          },
        ],
      },
      // 04.Defrasoft_info_AI: one take per character (re-rolls of the same face dropped), on one trail
      {
        type: "trail",
        chapter: "AI UGC Generation",
        title: "AI UGC",
        description: "These talking head shots were generated with Google Veo 3.1 as soon as it became feasible at scale to do so. I used Claude to come up with the hooks and plugged those into Google Flow.\n\nI try to lean into the absurdity that AI provide instead of trying to mimic real life. Dude falling from the sky while trying to tell you about a new app? Heck yea.",
        items: [
          { src: "/works/defrasoft/x-ai-dm-20251120140617-001.mp4" },
          { src: "/works/defrasoft/cover.mp4" },
          { src: "/works/defrasoft/x-ai-if-you-have-202512150913-7fsh1.mp4" },
          { src: "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-opu.mp4" },
          { src: "/works/defrasoft/x-ai-i-downloaded-modegear-202512091657-0wod8.mp4" },
          { src: "/works/defrasoft/ugc.mp4" },
          { src: "/works/defrasoft/x-ai-but-i-felt-202512091619-s7tj9.mp4" },
          { src: "/works/defrasoft/ugc-i-evdcz.mp4" },
          { src: "/works/defrasoft/x-ai-download.mp4" },
          { src: "/works/defrasoft/x-ai-37cbe297-caae-4705-8006-54ff1212f3b0.mp4" },
          { src: "/works/defrasoft/x-ai-vertical-video-handheld-202512150912-194.mp4" },
          { src: "/works/defrasoft/x-ai-0ad4aa3b-9721-4943-abb4-964a3c8c0b4f.mp4" },
          { src: "/works/defrasoft/x-ai-0ba69811-fef2-40b6-9fe7-29a605f8bf3f.mp4" },
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
      // 07.Zcungviet_Info 2: the whole board black, the billboard beside the intro, the chapters scattered under
      {
        type: "editorial-text",
        info: "board",
        lead: "Project Brand Designer\nSocial Media - Media Production - Event Design",
        content:
          "Z Cung Viet was a social communications project to advocate for writing as a mental wellbeing practice.\n\nI started the team with 3 peers in uni and graduated with it. For Z Cung Viet, I created a brand identity, executed it, did media production, and print design.",
        chapters: ["Brand Identity", "Social Media Designs", "Media Production", "Event Materials"],
        extras: [{ src: "/works/z-cung-viet/mockup-3.webp" }],
      },
      // the mark in its four inks, the second mark and the pattern; then the identity applied
      {
        type: "library",
        chapter: "Brand Identity",
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
      // the campaign's messages out in the world
      {
        type: "deliverable-breakdown",
        chapter: "Social Media Designs",
        title: "Social Media Designs",
        layout: "feature",
        description: "On the daily, I produced social media posts that communicated brand messages and engaged with the audience through simple but effective prompting and conditioning to encourage writing.",
        images: ["/works/z-cung-viet/faq.webp", "/works/z-cung-viet/poster.webp"],
      },
      // 07.Zcungviet_Info 3: the episode graphics, named as on the board
      {
        type: "loops",
        chapter: "Media Production",
        title: "Motion Graphics",
        description: "These motion graphics were created to cement the brand in the creation of these episodes.\n\nPlus, we were making long-form documentary/interview format content, so it’s essential to keep the audience engaged with fun beats such as these.\n\nAs with all things, these were made with scalability and utility in mind, so they’re fully mogrt compatible.",
        groups: [
          { label: "Intro", items: [{ src: "/works/z-cung-viet/intro-hori.mp4" }] },
          { label: "Outtro", items: [{ src: "/works/z-cung-viet/outro.mp4" }] },
          { label: "Lower-thirds", items: [{ src: "/works/z-cung-viet/khoa.mp4" }, { src: "/works/z-cung-viet/don.mp4" }, { src: "/works/z-cung-viet/linh.mp4" }] },
          { label: "Interlude", items: [{ src: "/works/z-cung-viet/write-time.mp4" }] },
        ],
      },
      // 07.Zcungviet_Info 9
      {
        type: "deliverable-breakdown",
        chapter: "Media Production",
        title: "Production Recap",
        layout: "feature",
        description: "A short recap of the documentary episodes.\n\nI was responsible for camera operation, lighting, and audioworks. To be honest it’s a pretty small set on a smaller budget, but playing these roles gave me hands-on experience knowing exactly what works for post production.\n\nI handled posts, too. Building an offline, then an online, then color works, to a final cut for each of the episodes.",
        images: ["/works/z-cung-viet/production-recap.mp4", "/works/z-cung-viet/recap-2.mp4"],
      },
      // the activation day: its key visual, the print, the day itself
      {
        type: "process",
        chapter: "Event Materials",
        title: "Event Materials",
        description: "Event materials I designed and printed for the final activation day.",
        groups: [
          { label: "Key visual", items: [{ src: "/works/z-cung-viet/event-poster.mp4" }] },
          { label: "Print", items: [{ src: "/works/z-cung-viet/brand-mark.webp" }, { src: "/works/z-cung-viet/nametag.webp" }, { src: "/works/z-cung-viet/vongtay.webp" }] },
          { label: "On the day", items: [{ src: "/works/z-cung-viet/photo.webp" }, { src: "/works/z-cung-viet/photo-2.webp" }] },
        ],
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
        // 02. Intro: the copy on a fountain plate, a contents list under a rule beside it
        info: "intro",
        title: "Contents",
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
          { label: "Mark Dao", note: "TGS", items: [{ src: "/works/select-freelance-work/markdao-tgs.mp4" }] },
          { label: "Monthly Spend", note: "Data story", items: [{ src: "/works/select-freelance-work/monthly-spend.mp4" }] },
        ],
      },
      { type: "zine-outro" },
    ],
  },
];
