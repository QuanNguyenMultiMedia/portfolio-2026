# Portfolio 2026 — Master Product Requirements Document

> **Project:** Minh Quan | Motion Design & Creative Engineering  
> **Live URL:** `http://localhost:3000` (Development)  
> **Repository:** `github.com/QuanNguyenMultiMedia/portfolio-2026`  
> **Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion 12 · GSAP 3.15 · Three.js 0.184 · R3F 9 · Lenis 1.3 · OGL 1.0  
> **Target Device Baseline:** RTX 3050 Ti (4GB VRAM), 1080p–1440p, 60–120 FPS  
> **Last Updated:** May 25, 2026 (v4 — Overscroll dampening, contacts card flip anchor point fix, scroll snap)

---

## Table of Contents

1. [Executive Summary & Master Purpose](#1-executive-summary--master-purpose)
2. [Brand Identity & Design Philosophy](#2-brand-identity--design-philosophy)
3. [Design System](#3-design-system)
   - 3.1 Color Palette
   - 3.2 Typography
   - 3.3 Spacing & Layout
   - 3.4 Component Primitives
4. [Content Voice & Tone](#4-content-voice--tone)
5. [Positioning & Strategy](#5-positioning--strategy)
6. [Site Architecture & Routing](#6-site-architecture--routing)
7. [Section-by-Section Documentation](#7-section-by-section-documentation)
   - 7.1 Root Layout (`layout.tsx`)
   - 7.2 Home (`/` — page.tsx)
   - 7.3 Works Archive (`/works`)
   - 7.4 Project Detail (`/works/[slug]`)
   - 7.5 Vietnam Forestation (`/works/vietnam-forestation`)
   - 7.6 Takes Archive (`/takes`)
   - 7.7 Take Detail (`/takes/[slug]`)
   - 7.8 Play Archive (`/play`)
   - 7.9 Play Detail (`/play/[slug]`)
   - 7.10 Freebies Archive (`/freebies`)
   - 7.11 Freebie Detail (`/freebies/[slug]`)
   - 7.12 Contacts (`/contacts`)
8. [Component Library](#8-component-library)
9. [Animation & Interaction System](#9-animation--interaction-system)
10. [Technical Architecture](#10-technical-architecture)
    - 10.1 Lenis Smooth Scroll
    - 10.2 3D Coordinate System (Homepage)
    - 10.3 Performance Strategy
    - 10.4 Theme System
    - 10.5 Portal Isolation Pattern
11. [Completed Features](#11-completed-features)
12. [Future Roadmap](#12-future-roadmap)
13. [Known Bugs & Issues](#13-known-bugs--issues)

---

## 1. Executive Summary & Master Purpose

### Mission Statement
To establish Minh Quan's digital presence as the definitive portfolio of a **Midweight Motion Designer** operating at the intersection of cinematic motion design, 3D engineering, and editorial architecture. The site is not a gallery — it is a **spatial experience** that demonstrates the craft it represents.

### Core Objectives
1. **Demonstrate Craft Through Medium:** The site itself is the portfolio's strongest piece. Every scroll, transition, and micro-interaction is a proof of skill.
2. **Tech-Luxe Editorial Positioning:** Position Minh Quan as a premium, architecture-minded creative who bridges motion design and engineering — not a commodity freelancer.
3. **Narrative-Driven Portfolio Structure:** Guide visitors through a curated journey (Hero → Manifesto → Capabilities → Testimonials → Stats → Works) rather than a flat grid.
4. **Hardware-Accelerated Performance:** Maintain 60+ FPS on target hardware (RTX 3050 Ti) while delivering cinematic 3D visuals.
5. **Conversion & Connection:** Drive contact inquiries via the dual-sided Contact/About card and clear CTAs throughout.

### Key Differentiators
- **Scroll-based 3D camera flythrough** (not parallax — a true Z-axis translation in a unified 3D coordinate space)
- **Sine wave image carousel** with drag-to-advance interaction (replaces traditional slider/swiper)
- **Mechanical dial interface** for project browsing (3D cylindrical scroll wheel with haptic audio feedback)
- **WebGL wave gradient sidebar** using raw OGL shaders for per-page color identity
- **Dual-sided flipping contact card** with 3D tilt and click-to-flip interaction

---

## 2. Brand Identity & Design Philosophy

### Brand Archetype: The Architect-Artisan
- **Discipline:** Precision, structure, intentionality
- **Craft:** Motion, typography, spatial awareness
- **Voice:** Quiet confidence, technical fluency, editorial restraint
- **Visual Metaphor:** A luxury automotive configurator meets an architect's technical manual

### Design Principles

| # | Principle | Manifestation |
|---|-----------|---------------|
| 1 | **Spatial Honesty** | All 3D transforms reflect real camera physics. Depth-of-field blur, focal length warp, and perspective are mathematically driven — not decorative. |
| 2 | **Editorial Restraint** | Whitespace is the primary layout tool. Content breathes. Decorative elements are structural (viewfinders, hairlines, coordinate labels). |
| 3 | **Technical Precision** | Every interactive element has a micro-feedback: haptic vibration on dial snap, audio ticks on rotation, spring physics on cursor follow. |
| 4 | **Contrast Through Texture** | Not color contrast — textural contrast: matte glass panels against sharp hairline borders, grayscale imagery against blue accent glints. |
| 5 | **Cinematic Fidelity** | The scroll is the director's cut. Transitions are not triggered by scroll position — they are **camera movements** through a 3D volume. |

### Emotional Target
The visitor should feel they are exploring a **private studio archive** — not browsing a website. The experience should evoke the feeling of walking through a physical gallery where each frame is a curated installation.

---

## 3. Design System

### 3.1 Color Palette

#### Light Mode (Default)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#F5F5F5` | Page background — neutral off-white, editorial canvas |
| `--foreground` | `#111111` | Body text — deep charcoal, high readability |
| `--primary` | `#000000` | Headlines, high-impact UI |
| `--tech-blue` | `#0029FF` | Accent — HUD labels, interactive highlights, data readouts |
| `--border-neutral` | `rgba(0,0,0,0.08)` | Hairlines, dividers, frame borders |
| `--surface` | `#FFFFFF` | Card/panel backgrounds |

#### Dark Mode
| Token | Value |
|-------|-------|
| `--background` | `#0A0A0A` |
| `--foreground` | `#F5F5F5` |
| `--primary` | `#FFFFFF` |
| `--tech-blue` | `#0029FF` (unchanged) |
| `--border-neutral` | `rgba(255,255,255,0.1)` |
| `--surface` | `#111111` |

**Rule:** Tech Blue (`#0029FF`) is used sparingly as a "glint" — never as a dominant theme color. It appears only on:
- Active navigation pill
- HUD labels and data readouts
- Wave gradient sidebar accents
- Hover state highlights on links

### 3.2 Typography

| Role | Font Family | Weight | Size (Desktop) | Tracking |
|------|-------------|--------|----------------|----------|
| Hero Headline | Plus Jakarta Sans | 800 | `10rem` (160px) | `-0.02em` |
| Section Title | Plus Jakarta Sans | 700 | `5rem`–`8rem` | `-0.02em` |
| Subhead | Inter | 300 | `1.25rem`–`1.5rem` | Normal |
| Body | Inter | 300 | `1rem` | Normal |
| Metadata/Mono | JetBrains Mono | 400–500 | `7px`–`12px` | `0.2em`–`0.4em` |
| Labels | JetBrains Mono | 500 | `9px`–`11px` | `0.3em`–`0.5em` |

**Type Scale Philosophy:**
- Headlines use extreme size contrast (`10rem` hero vs `5rem` section)
- Monospace is always small and wide-tracked — it should feel like printed telemetry
- No weight below 300 (light); no weight above 800 (extra bold)

### 3.3 Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-tight` | `24px` | Tight component gaps |
| `--spacing-normal` | `48px` | Standard section padding |
| `--spacing-wide` | `112px` | Large section margins |
| `--spacing-xl` | `140px` | Page edge padding (desktop) |

**Grid System:**
- Primary layout uses CSS Grid (`editorial-grid`: 12 columns)
- Story pages (home) use absolute positioning within a 3D coordinate space
- Horizontally-scrolling project pages use flexbox with `lenis-content` wrapper

### 3.4 Component Primitives

**Buttons** (`TechButton`):
- `0px` border radius (sharp, precision-engineered)
- 1px solid border (`border-primary`)
- Hover: fill animation from bottom (primary: `bg-foreground` fills over text)
- Font: JetBrains Mono, `10px`, `0.4em` tracking, uppercase
- Variants: `primary`, `secondary`, `ghost`

**Cards/Containers:**
- Hairline borders (`border-border-neutral`) rather than box shadows
- Optional corner marks (L-shaped viewfinder brackets)
- `0px` border radius everywhere
- Glassmorphism: `bg-surface/50 backdrop-blur-xl` for overlay panels

**HUD Labels** (`HUDLabel`):
- JetBrains Mono, `9px`, `0.25em` tracking, uppercase
- Optional hairline underline
- Used for section identifiers, coordinates, technical metadata

**Viewfinders** (`Viewfinder`):
- Four L-shaped corner brackets at the edges of a viewport
- `border-primary/20` — subtle, architectural framing
- Used on hero sections and play sandbox frames

---

## 4. Content Voice & Tone

### Brand Voice

| Dimension | Approach |
|-----------|----------|
| **Tone** | Friendly but not too chatty. Plain language. Never self-promotional. |
| **Register** | Like talking to a coworker you get along with. No corporate speak. |
| **POV** | First person when it's personal. No "we" or "one". Just what I've seen and done. |
| **Sentence Structure** | Short. No need to impress anyone with long sentences. |

### What This Means

- Use **small words** when they work. Big words only where there are no small ones.
- Never say how good something is. Let the work speak.
- No mission statements. No "architectural this" or "cinematic that".
- Talk about the work, not about yourself.
- Avoid words like "premium", "curated", "bespoke", "delight", "craft".
- Forward slashes and all-caps are fine for UI labels (it's a design thing, not a voice thing).

### How Each Section Should Sound

| Section | Voice |
|---------|-------|
| Home tagline | Short. Says what I do. |
| Project pages | Describes the project, not the result. What was the problem, what was done. |
| Takes (essays) | Like explaining something to a friend. Plain technical talk. |
| Freebies | What's in the file, what format, what it's for. |
| Contact | Simple. Here's my email. Here's where else I'm online. |

### Voice Examples

> **Home:** "Minh Quan — motion & design"  
> **Project page:** "We needed a brand that felt honest. Clean type, muted colors, room to breathe."  
> **Takes:** "I've been writing custom shaders long enough to know that the bottleneck is almost never the fragment shader. It's draw calls."  
> **Freebies:** "48-page PDF. Print-ready at 300 DPI. Also works on screen."

---

## 5. Positioning & Strategy

### Competitive Positioning
Minh Quan is positioned between:
- **Pure motion designers** (who can't code the web experience themselves)
- **Pure creative developers** (who lack motion design pedigree)

The portfolio proves both capabilities simultaneously — the code *is* the motion design.

### Target Audience
1. **Agency Creative Directors** — looking for a motion designer who understands technical constraints
2. **Startup Founders / Product Designers** — needing UI motion systems, not just explainer videos
3. **Fellow Designers** — for community standing and collaboration opportunities
4. **Direct Clients** — brands needing a "motion architect" rather than a production artist

### Conversion Strategy
| Funnel Stage | Mechanism | Page(s) |
|-------------|-----------|---------|
| **Awareness** | Scroll-driven narrative showcases craft before credentials | Home (Z-axis flythrough) |
| **Interest** | Project case studies with editorial depth | `/works/[slug]` |
| **Consideration** | Technical essays establish authority | `/takes/[slug]` |
| **Intent** | Freebies demonstrate generosity and craft taste | `/freebies` |
| **Action** | Dual-sided contact/about card — low friction, high design | `/contacts` |

### SEO & Metadata
- Title: `Minh Quan | Motion Design & Creative Engineering`
- Description: *"Portfolio of Minh Quan — Midweight Motion Designer exploring the intersection of cinematic motion, 3D engineering, and editorial design. Ho Chi Minh City based, globally available."*
- Keywords: Motion Design, WebGL, Three.js, Creative Developer, UI Animation, Branding
- OpenGraph configured with title, description, site name, and URL

---

## 6. Site Architecture & Routing

```
/                          → Home (scroll-based 3D story)
├── /works                 → Works archive (3D cylindrical dial)
│   ├── /works/[slug]      → Project case study (horizontal Lenis scroll)
│   └── /works/vietnam-forestation → Dedicated 3D GIS page (GSAP ScrollTrigger)
├── /takes                 → Takes archive (editorial essay list)
│   └── /takes/[slug]      → Essay detail (12-column editorial grid)
├── /play                  → Play archive (experimental sandboxes)
│   └── /play/[slug]       → Sandbox detail (iframe + HUD controls)
├── /freebies              → Freebies archive (staggered grid + portal detail panel)
│   └── /freebies/[slug]   → Freebie detail (horizontal Lenis scroll)
└── /contacts              → Contact/About dual-sided card (3D flip)
```

### Persistent UI Shell
- **Navbar** (`Navbar.tsx`): Fixed bottom-center, HUD notch above, animated active pill, 6 nav items
- **LogoMark** (`LogoMark.tsx`): Fixed top-right, theme-aware SVG logo (light/dark)
- **GlobalSideBar** (`GlobalSideBar.tsx`): Fixed left sidebar, WebGL wave gradient, theme toggle, page topic label
- **SmoothScroll** (`SmoothScroll.tsx`): Wraps entire app in Lenis instance
- **LoadingScreen** (`LoadingScreen.tsx`): Full-screen boot sequence with animated logo and progress bar

---

## 7. Section-by-Section Documentation

### 7.1 Root Layout (`layout.tsx`)

**Purpose:** Server component providing HTML shell, metadata, and global providers.

**Component Tree:**
```
<html> → <ThemeProvider>
  <LoadingScreen />
  <SmoothScroll>
    <LogoMark /> (fixed top-right)
    <GlobalSideBar /> (fixed left)
    {children} (page content)
    <Navbar /> (fixed bottom-center)
  </SmoothScroll>
</ThemeProvider>
```

**Key Details:**
- `suppressHydrationWarning` on `<html>` and `<body>` for next-themes compatibility
- `"h-full antialiased"` on `<html>`, `"min-h-full"` on `<body>`
- Fonts loaded via Google Fonts `@import` in `globals.css`

**Metadata:**
- Title template: `Minh Quan | Motion Design & Creative Engineering`
- Head icons: `/assets/favicon white.png` (both standard and apple)

**Status:** ✅ Complete. No known issues.

---

### 7.2 Home (`/` — `page.tsx`)

**Purpose:** The primary portfolio experience — a 600vh scroll-driven 3D camera flythrough through 5 narrative frames.

**Architecture:**

The entire page is a single `<PageWrapper variant="story">` containing a 600vh scroll container. A sticky viewport (`position: sticky; top: 0; height: 100vh`) stays fixed while the scroll container drives the camera Z translation.

**Scroll Progress → Camera Z Mapping:**
```
Scroll % → Z Position
0.00   →       0px (Hero)
0.15   →    1800px (Manifesto)
0.35   →    3300px (Capabilities)
0.55   →    4800px (Testimonials)
0.90   →    6300px (Stats)
0.90-1.0 → 6300-6400px (overscroll zone — cubic ease-out, 100px max)
```
In the overscroll zone (progress 0.90–1.0), Z eases from 6300 to 6400 using a cubic ease-out curve (`1 - (1-t)³`), creating a tactile dampened feel. When the user stops scrolling in this zone, Lenis snaps back to the 0.90 waypoint automatically (triggered when velocity drops below 0.3). The snap-back uses a quadratic ease-out (`t*(2-t)`) over 500ms.

**Frame Z Depths & Opacity/Blur Curves:**

| Frame | Section | Z Depth | Focus Range | Blur Curve |
|-------|---------|---------|-------------|------------|
| 0 | Hero | `0px` | Z: 0–600 | fades out by 1000 |
| 1 | Manifesto | `-1800px` | Z: 1200–2400 | fades in 600–1200, fades out 2400–3000 |
| 2 | Capabilities | `-3300px` | Z: 2700–3900 | fades in 2100–2700, fades out 3900–4500 |
| 3 | Testimonials | `-4700px` to `-4850px` | Z: 4200–5400 | fades in 3600–4200, fades out 5400–6000 |
| 4 | Stats | `-6300px` | Z: 5700–6300 | fades in 5100–5700, holds |

**Frame Contents:**

- **Frame 0 — Hero:** Name headline (MeasuredHeader), standing portrait image (right, grayscale, Z+150), tagline (BalancedText, Z-100), pointer events active only when active frame.
- **Frame 1 — Manifesto:** Sine wave image carousel (top 55vh, drag-to-advance) + manifesto text (bottom left). Carousel images from `BASE_IMAGES` array (6 images × 3 repeats = 18 cards). Motion values (x, y, scale, zIndex) computed from `smoothOffset` using sin/cos wave functions.
- **Frame 2 — Capabilities:** 2×3 grid (mobile: 2-col, desktop: 3-col) of capability names (Motion Design, Branding, Social Media, Visual Effects, Video Editing, Web Animation).
- **Frame 3 — Testimonials:** 4 testimonial cards arranged in 2×2 grid (absolute positioned), Z-depth staggered by `+50px` per item. Each card shows brand, quote, author, role.
- **Frame 4 — Stats & Brands:** Left column (Key Metrics: 50+ Projects, 100% Rating, 4+ Years, HCMC base) + Right column (Trusted Collaborators grid + CTA buttons to /works and /contacts).

**Cursor Parallax System:**
- Window-level `mousemove` listener tracks normalized cursor position (-0.3 to 0.3)
- Framer Motion `useSpring` (damping:30, stiffness:80, mass:1) smooths values
- Transforms: `rotateX` (±1.5°), `rotateY` (±1.5°), `translateX` (±15px), `translateY` (±15px)
- Parallax is modulated by `parallaxMultiplier` (linear from 0 at 15% scroll to 1 at 25% scroll) — disabled during Hero, fades in during transition
- Disabled on mobile (<768px) — values reset to 0

**Perspective Warp:**
- CSS `perspective` animates from `1400px` (desktop start) to `950px` (desktop end) as scroll progresses
- Mobile: `1200px` → `850px`
- Creates a dynamic "lens breathing" effect as camera moves through Z-space

**Sine Carousel Mechanics:**
- `dragOffset` (useMotionValue) tracks cumulative drag delta × 0.005
- `smoothOffset` (useSpring, damping:30, stiffness:200) for smooth interpolation
- Each `SineCard` computes its position as a function of `(index / total + smoothOffset * 0.05) % 1`
- X position: linear spread (desktop: `±1200px`, mobile: `±500px`)
- Y position: sin wave (desktop: `±200px`, mobile: `±80px`)
- Scale: `0.35` to `0.8` based on closeness to center
- Z-index: `100 - proximity * 180` for proper stacking

**Status:** ✅ Complete. No known issues.

---

### 7.3 Works Archive (`/works`)

**Purpose:** Project browser with a custom 3D cylindrical scroll wheel and physical dial interface.

**Key Interaction:**
- A rotatable dial (220px diameter) with bezel ticks controls project selection
- 3D cylindrical wheel translates rotation angle into 3D position transforms for each project card
- Audio feedback: Web Audio API oscillator ticks during rotation (triangle wave, pitch scales with velocity)
- Haptic feedback: `navigator.vibrate(10)` on snap
- Active project snaps to center with a custom spring-bezier curve (`0.19, 1, 0.22, 1`)

**Layout:**
- 12-column grid (desktop): Left 5 cols (preview image + metadata), Right 7 cols (3D wheel + dial)
- Background: dynamic radial gradients using active project's color palette
- Active project shows as a clickable Link (→ navigates to `/works/[slug]`)
- Preview image: `<AnimatePresence>` crossfade with scale transitions

**Performance Strategy:**
- DOM mutations bypass React state for wheel transformations (direct `element.style.transform`)
- React state only updates for visible text/metadata changes
- Single AudioContext instance reused across all interactions
- Rate-limited tick sounds (max 60/sec)
- `requestAnimationFrame` for smooth visual updates during drag

**Data Source:** `@/data/projects.ts` — 5 projects defined (2026 Reel, Herond Browser, Defrasoft, Z Cung Viet, Select Freelance Work).

**Status:** ✅ Complete. Uses local project images (`/projects/*.png`) and Unsplash external imagery. All Wikimedia placeholder URLs replaced.

---

### 7.4 Project Detail (`/works/[slug]`)

**Purpose:** Horizontally scrolling editorial case study for each project.

**Interaction:**
- Custom Lenis instance (horizontal orientation)
- Click-drag to navigate (not just scroll wheel)
- `cursor-grab` / `cursor-grabbing` state

**Layout (left to right):**
1. **Hero Section** (100vw–85vw): Category, year, project title (split into alternating bold/italic words), description
2. **Content Modules** (variable widths):
   - `bento`: 12-column grid — large hero image (8 cols) + 2 stacked side images (4 cols)
   - `image`: Full-width image with caption overlay
   - `details`: Editorial text (40vw–50vw)
3. **Next Project** (100vw–80vw): Full-width hero image with overlay title and grayscale→color hover

**Data Model (`Project` interface):**
```typescript
interface Project {
  title: string; slug: string; year: string; category: string;
  id: string; description: string; coverImage?: string;
  screens: { type: "hero"|"image"|"details"|"video"|"bento"; ... }[];
  colors: string[];
}
```

**Status:** ✅ Structural complete. Placeholder Wikimedia images used for all projects — needs real asset replacements.

---

### 7.5 Vietnam Forestation (`/works/vietnam-forestation`)

**Purpose:** Dedicated project page featuring an interactive 3D GIS data visualization.

**Architecture:**
- GSAP `ScrollTrigger` for horizontal pin-scrolling through 3 sections
- Dynamic import of `VietnamForest3D` (`next/dynamic`, `ssr: false`)
- `PerformanceMonitor` from R3F Drei for adaptive DPR (1.0 → 1.5)

**3D Scene** (`VietnamForest3D.tsx`):
- Extrudes GeoJSON feature polygons from `vietnam-forest-data.json` into 3D shapes
- Height mapped from `feature.properties.height`
- MeshStandardMaterial with emissive blue glow
- Auto-rotating OrbitControls
- ContactShadows for grounding
- Environment preset "city"

**Status:** ✅ Structural complete. Data file is placeholder — needs real GeoJSON data.

---

### 7.6 Takes Archive (`/takes`)

**Purpose:** Editorial essay list — 6 technical essays displayed as alternating offset rows.

**Layout:**
- 12-column grid, items offset with `md:pl-32` on odd indices
- Each row: Index label (e.g., `ESSAY_01 // WEBGL // 2026`) → Title (large display type) → Arrow (appears on hover)
- Full-row click navigates to `/takes/[slug]`
- Hover state: background tint, title italicizes, arrow slides in

**Data Source:** `@/data/takes.ts` — 6 essays covering WebGL, Three.js, Canvas API, kinetic typography, Cavalry, and motion architecture.

**Status:** ✅ Complete.

---

### 7.7 Take Detail (`/takes/[slug]`)

**Purpose:** Individual essay reading page with editorial 12-column layout.

**Layout (12-column grid, each row spans 12 cols):**
1. **Media Row** (if image exists): `col-span-4 col-start-2` — grayscale image in bordered frame
2. **Title Row**: `col-span-4 col-start-8` — title + date metadata
3. **Excerpt Row**: `col-span-4 col-start-8` — italic excerpt
4. **Content Rows**: `col-span-4 col-start-8` — paragraphs split on `\n\n`

**Status:** ✅ Complete.

---

### 7.8 Play Archive (`/play`)

**Purpose:** Sandbox/browser for 5 experimental web experiences (interactive demos, visual tests).

**Layout:**
- 2-column grid (desktop) with `gap-px` for hairline separators
- Each card: title, tech tags, description, "LAUNCH_SANDBOX" CTA
- Hover: background fills to primary, text inverts
- CTA links to `/play/[slug]`

**Data Source:** `@/data/play.ts` — 5 items (Tourmaline Cat, Coruscating Donut, Melodic Concha, Enchanting Kashata, Charming Starlight).

**Status:** ✅ Complete.

---

### 7.9 Play Detail (`/play/[slug]`)

**Purpose:** Sandbox viewing environment with full HUD controls.

**Features:**
- **Iframe sandbox:** Loads static HTML files from `/play-static/` (built separately, served as static assets)
- **Fullscreen mode:** Animate between 70vw/70vh and 100vw/100vh with corner-detached HUD that docks inside during fullscreen
- **Color mode toggle:** MONO (grayscale + 50% opacity default, full color on hover) vs RGB (always full color)
- **Zoom controls:** 65%, 75%, 85%, 100%
- **Reload button:** Key-based iframe remount
- **Navigator arrows:** Left/right arrows to cycle between sandboxes
- **Scanline overlay:** CSS gradient scanline effect for retro-tech aesthetic
- **HUD metadata:** Title, slug, tech stack, loading status, frame latency indicator
- **Viewfinder corners:** On the main frame container

**States:**
- Loading: Animated spinner, tech status logs (LOAD_METHOD, RESOURCE_PATH, SECURE_SANDBOX), blurred background placeholder
- Error: Iframe failures surface via `onLoad` not firing (keeps loading state)
- Empty: Not applicable (always at least one sandbox)

**Status:** ✅ Complete.

---

### 7.10 Freebies Archive (`/freebies`)

**Purpose:** Boutique asset storefront — downloadable design resources presented in a staggered magazine grid.

**Layout:**
- 5 staggered grid positions cycling through layouts (e.g., `col-start-2 col-span-3`, then `col-start-7 col-span-4`, etc.)
- Each item: 4:5 aspect ratio thumbnail (grayscale → color on hover) + title in display type
- Click opens a **Portal-based detail overlay**

**Portal Detail Overlay:**
- Uses custom `<Portal>` component (renders under `document.body` to escape parent container transforms)
- Backdrop: `bg-background/95 backdrop-blur-3xl`
- Image hero (left, centered): Animated `<motion.div layoutId>` for shared layout animation
- Side panel (right, 420px): Category label, title, description, color palette swatches, download CTA (`TechButton`)
- Logo mask animation: clip-path reveal of the LogoMark
- Close: Click backdrop or × button

**Data Source:** `@/data/freebies.ts` — 5 items (Typeface Specimen, Liquid Gradient Pack, Minimalist Mockups, Motion Presets, Noise Texture Toolkit).

**Status:** ✅ Complete. Download links point to `#` — needs actual asset hosting.

---

### 7.11 Freebie Detail (`/freebies/[slug]`)

**Purpose:** Individual freebie detail page with horizontal Lenis scroll (similar structure to `/works/[slug]`).

**Structure:**
- Uses dummy project data (`dummyProject` — 3 screens: hero, image, details)
- Horizontal Lenis scroll (same pattern as project detail pages)
- Back button, wave gradient bar header
- Progress indicator overlay (top center)
- "DRAG_OR_SCROLL" hint (bottom right)

**Status:** ✅ Complete. Now looks up actual freebie items from `@/data/freebies.ts` by slug. Shows real title, description, category, and image. Dummy data removed.

---

### 7.12 Contacts (`/contacts`)

**Purpose:** Dual-sided contact card with 3D flip interaction — the site's primary conversion point.

**Front Side — "Contact":**
- Email link (`quannguyenhere@gmail.com`) with animated underline
- Social links: LinkedIn, Behance, Upwork (with numbered labels)
- Tagline: *"Multimedia creative designer at the intersection of architecture, motion, and code."*
- Profile portrait (sitting, grayscale → color on hover)

**Back Side — "About":**
- Name + title
- Experience timeline: Upwork (2020–Present), "Z Cũng Viết" (2023), Viettel Digital (2022)
- Bio quotes: *"I'm a Multimedia Communications creative obsessed with telling stories with a purpose."*
- Education: FPT University — BBA Multimedia Communications
- Expertise tags: Motion Graphics, Visual Systems

**Interaction:**
- Click any point on the card to flip (flip origin locks to click position for the full 1.2s rotation via `pivotX`/`pivotY` spring)
- Mouse hover: 3D spring tilt (rotateX/rotateY) — always active, even during flip
- Spring physics: damping:40, stiffness:250 for tilt; damping:30, stiffness:40 for pivot origin
- Fold-in animation: `rotateY: 0 → 180` with custom ease `[0.23, 1, 0.32, 1]`
- After 1.2s flip completes, pivot glides back to center (50,50) over ~600ms
- `backface-visibility: hidden` on both faces
- Rapid re-click blocked for 2s via `isAnimating` guard

**Status:** ✅ Complete.

---

## 8. Component Library

| Component | File | Type | Purpose |
|-----------|------|------|---------|
| `BalancedText` | `BalancedText.tsx` | Client | Text with `@chenglou/pretext` balanced line wrapping + optional HUD debug overlay |
| `GlobalSideBar` | `GlobalSideBar.tsx` | Client | Fixed left sidebar: theme toggle, WebGL wave bar, page topic label |
| `HUDLabel` | `HUDLabel.tsx` | Client | Monospace label with optional hairline underline |
| `LoadingScreen` | `LoadingScreen.tsx` | Client | Full-screen boot animation with progress bar, orbiting rings, status messages |
| `LogoMark` | `LogoMark.tsx` | Client | Theme-aware SVG logo (light/dark), fixed top-right, optional animation |
| `MagneticText` | `MagneticText.tsx` | Client | Text that responds to cursor proximity by dynamically reflowing line widths via `@chenglou/pretext` |
| `MeasuredHeader` | `MeasuredHeader.tsx` | Client | Display headline with `@chenglou/pretext` line measurement + per-line width HUD labels |
| `Navbar` | `Navbar.tsx` | Client | Fixed bottom navigation with animated active pill and HUD notch |
| `PageWrapper` | `PageWrapper.tsx` | Client | Animated page entry wrapper with 4 variants: `default`, `hero`, `full`, `story` |
| `Portal` | `Portal.tsx` | Client | `createPortal` wrapper — renders children under `document.body` |
| `SectionHeader` | `SectionHeader.tsx` | Client | Standardized section header with HUD label + display title + optional subtitle |
| `SmoothScroll` | `SmoothScroll.tsx` | Client | Global Lenis smooth scroll wrapper |
| `TechButton` | `TechButton.tsx` | Client | Sharp-edged button with hover fill animation, 3 variants |
| `ThemeProvider` | `ThemeProvider.tsx` | Client | `next-themes` provider wrapper with class-based dark mode |
| `Viewfinder` | `Viewfinder.tsx` | Client | Four corner brackets — decorative frame overlay |
| `WaveGradientBar` | `WaveGradientBar.tsx` | Client | WebGL wave gradient rendered via OGL (full-screen shader on a triangle mesh) |
| `VietnamForest3D` | `projects/VietnamForest3D.tsx` | Client (dynamic) | R3F scene: GeoJSON extrusion with adaptive performance |

---

## 9. Animation & Interaction System

### Animation Framework Distribution

| Library | Used For | Key APIs |
|---------|----------|----------|
| **Framer Motion 12** | Scroll-linked transforms, page transitions, spring physics, layout animations | `useTransform`, `useSpring`, `useMotionValue`, `useMotionTemplate`, `motion.div`, `AnimatePresence`, `layoutId` |
| **GSAP 3.15** | Horizontal ScrollTrigger on Vietnam Forestation page | `gsap.to`, `ScrollTrigger`, `.toArray` |
| **Lenis 1.3** | Global smooth scrolling, horizontal project scroll | `new Lenis()`, `lenis.on("scroll")`, `lenis.scrollTo()` |
| **OGL 1.0** | WebGL wave gradient in sidebar | `Renderer`, `Program`, `Mesh`, `Triangle`, custom GLSL fragment shader |
| **@chenglou/pretext** | Typographic line balancing | `prepareWithSegments`, `walkLineRanges`, `materializeLineRange`, `layoutNextLineRange` |

### Motion Design Principles Implemented

| Principle | Implementation | Files |
|-----------|---------------|-------|
| **Cinematic scroll narrative** | 5-frame Z-axis camera flythrough with depth-of-field blur | `page.tsx` (home) |
| **Spring physics** | Cursor parallax (damping:30, stiffness:80), sine carousel (damping:30, stiffness:200) | `page.tsx` |
| **Custom easing curves** | `[0.23, 1, 0.32, 1]` throughout (signature tech-luxe ease) | All files |
| **Micro-interactions** | Dial audio tick, vibration on snap, button hover fill | `works/page.tsx`, `TechButton.tsx` |
| **Shared layout animations** | Freebies detail panel expands from thumbnail with `layoutId` | `freebies/page.tsx` |
| **Page transitions** | `PageWrapper` blur/fade/slide entrance | `PageWrapper.tsx` |
| **Direct DOM manipulation** | 3D wheel transforms bypass React for 120 FPS | `works/page.tsx` |
| **Hover-driven state changes** | Grayscale→color, underline reveal, tilt parallax, label opacity | Multiple files |
| **Loading sequence** | Animated boot screen with percentage progress | `LoadingScreen.tsx` |

---

## 10. Technical Architecture

### 10.1 Lenis Smooth Scroll

**Global Instance** (`SmoothScroll.tsx`):
- Duration: 1.2s
- Easing: `min(1, 1 - Math.pow(1 - t, 3))` (cubic ease-out)
- Exposed on `window.lenis` for access by page components
- RAF loop drives `lenis.raf(time)` for frame synchronization

**Homepage Integration** (`page.tsx`):
- Polls for `window.lenis` readiness via `requestAnimationFrame` loop
- Attaches scroll listener to drive `scrollProgress` motion value
- Uses `lenis.animatedScroll / lenis.dimensions.limit.y` for normalized progress

**Horizontal Instances** (project detail, freebie detail):
- Separate Lenis instances with `orientation: "horizontal"`
- Wrapper and content elements passed explicitly
- Gesture orientation: `"both"` (wheel + trackpad)

### 10.2 3D Coordinate System (Homepage)

The homepage implements a **unified 3D coordinate space** rather than parallax layers:

```
Scroll Position (0–600vh)
  ↓
Normalized Progress (0–1)
  ↓
Z Transform (0px → 6300px → 6400px overscroll)
  ↓
Each frame positioned at a Z depth offset
  ├── Hero:            translateZ(0px)
  ├── Manifesto:       translateZ(-1800px)
  ├── Capabilities:    translateZ(-3300px)
  ├── Testimonials:    translateZ(-4700px to -4850px)
  └── Stats:           translateZ(-6300px)
```

**Overscroll dampening:**
Beyond 90% scroll (Z=6300), a cubic ease-out tail (`1-(1-t)³`) maps progress 0.90–1.0 to Z 6300–6400 (100px max). When the user stops in this zone (Lenis velocity < 0.3), an automatic snap-back scrolls to Z=6300 over 500ms with quadratic ease-out (`t*(2-t)`).

**Key properties:**
- `transformStyle: "preserve-3d"` on parent — children inherit 3D context
- `will-change: transform` on transformed elements (GPU promotion)
- Opacity/blur per frame creates "focal plane" illusion
- Perspective warp on viewport container creates lens breathing

### 10.3 Performance Strategy

**GPU / VRAM Budget:**
- DPR clamped: `Math.min(window.devicePixelRatio, 2)`
- OGL renderer: `antialias: false`, `dpr: min(DPR, 2)`
- R3F: `antialias: false`, `powerPreference: "high-performance"`
- `PerformanceMonitor` for adaptive DPR in Three.js scenes

**Render Optimization:**
- Direct DOM manipulation bypasses React reconciliation during drag interactions
- Single pre-allocated AudioContext — no creation per tick
- Rate-limited audio ticks (max 60/sec)
- Pointer events disabled on off-screen frames
- Images: `loading="lazy"` on non-critical images, `priority` on LCP candidates

**Layout Optimization:**
- No layout-triggering properties animated (width, height, top, left)
- All animations on `transform`, `opacity`, and `filter`
- Lenis handles scroll smoothing — no layout thrashing from scroll events

### 10.4 Theme System

- **Library:** `next-themes` with `attribute: "class"`
- **Default theme:** `"system"` (respects OS preference)
- **Selector:** `.dark` class on `<html>` overrides CSS custom properties
- **Transition:** `disableTransitionOnChange: true` to prevent FOUC
- **Toggle:** Moon/sun SVG icons in `GlobalSideBar` with animated rotation on toggle

### 10.5 Portal Isolation Pattern

The `<Portal>` component solves a specific problem: when a detail panel needs to break out of a parent container with `will-change: transform` or `transform-style: preserve-3d` (which creates new stacking contexts), rendering directly under `document.body` via `createPortal` ensures correct viewport positioning.

**Used in:** Freebies archive page for the detail overlay panel.

**Hydration Safety:**
- Sets `mounted = true` in useEffect
- Returns `null` during SSR to avoid server/client mismatch
- Only renders portal content after hydration

---

## 11. Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage 3D scroll narrative (5 frames) | ✅ Complete | Hero, Manifesto (sine carousel), Capabilities, Testimonials, Stats |
| Sine wave image carousel | ✅ Complete | Drag-to-advance, wrapped array, spring physics |
| Cursor-following 3D parallax | ✅ Complete | Spring-smoothed, mobile-disabled, modulates with scroll |
| Dynamic perspective warp | ✅ Complete | Lens breathing effect |
| Works archive with 3D dial | ✅ Complete | Mechanical audio feedback, haptic vibration, DOM-bypass rendering |
| Project detail pages (horizontal scroll) | ✅ Complete | 3 content module types |
| Takes (essays) archive + detail | ✅ Complete | 12-column editorial layout |
| Play sandbox archive | ✅ Complete | Static iframe hosting |
| Play sandbox detail with HUD | ✅ Complete | Fullscreen, zoom, color mode, reload |
| Freebies boutique archive | ✅ Complete | Portal-based detail overlay with shared layout animation |
| Freebie detail page | ✅ Partial | Horizontal scroll works; uses dummy data |
| Contacts dual-sided card | ✅ Complete | 3D flip with click-position origin |
| GlobalSideBar with WebGL wave | ✅ Complete | OGL shader, per-page colors, theme toggle |
| Navbar with active pill | ✅ Complete | Animated position transition |
| Loading screen | ✅ Complete | Animated boot sequence |
| Theme system (light/dark) | ✅ Complete | next-themes with class-based dark mode |
| Lenis smooth scroll | ✅ Complete | Global + horizontal instances |
| Vietnam Forestation 3D page | ✅ Complete | GSAP ScrollTrigger + R3F scene |
| MeasuredHeader (pretext) | ✅ Complete | Balanced text with per-line width HUD |
| BalancedText | ✅ Complete | Balanced wrapping with optional debug overlay |
| MagneticText | ✅ Complete | Cursor-responsive line reflow |
| TechButton | ✅ Complete | 3 variants with hover fill |
| Scanline animation | ✅ Complete | CSS keyframe animation |
| Responsive design | ✅ Partial | Desktop is primary target; mobile functional but not optimized |

---

## 12. Future Roadmap

### P0 — Critical (Q2 2026)

| Item | Description | File(s) | Status |
|------|-------------|---------|--------|
| **Replace placeholder images** | ✅ Complete. All Wikimedia URLs replaced with local project assets + Unsplash. | `data/projects.ts`, `data/takes.ts`, `data/freebies.ts` | ✅ Done |
| **Build verification** | ✅ Complete. Build compiles successfully (TypeScript + compile in 13.8s). | Configuration | ✅ Done |
| **Error boundaries** | ✅ Complete. Error state with retry button for iframe sandbox failures. | `play/[slug]/page.tsx` | ✅ Done |
| **Real download links for freebies** | All `downloadUrl: "#"` must point to actual hosted asset files | `data/freebies.ts` | 🔴 Pending |
| **Real GeoJSON data for Vietnam Forestation** | Replace placeholder with actual Vietnamese forestation GIS data | `data/vietnam-forest-data.json` | 🔴 Pending |
| **Accessibility pass** | Add `aria-label` to interactive elements, ensure keyboard navigation for dial and carousel | Multiple files | 🔴 Pending |

### P1 — High Priority (Q3 2026)

| Item | Description | File(s) |
|------|-------------|---------|
| **Image compression pipeline** | Implement next/image optimization or manual WebP conversion for all assets | Global |
| **Mobile optimization** | Homepage frames need proper vertical stacking on mobile (currently uses same Z-depth model) | `page.tsx` (home) |
| **Contact form** | Add a functional contact form (not just email link) — or a mailto: fallback | `contacts/page.tsx` |
| **Analytics** | Add privacy-respecting analytics (Plausible/Umami) | `layout.tsx` |
| **Sitemap + robots.txt** | Generate `sitemap.xml` and `robots.txt` for SEO | New files |

### P2 — Medium Priority (Q4 2026)

| Item | Description |
|------|-------------|
| **GSAP-powered project pages** | Replace horizontal Lenis with GSAP ScrollTrigger for project case studies (more control over narrative pinning) |
| **Video support in project screens** | Implement `type: "video"` with Mux or HTML5 video player |
| **3D model viewer in Play** | Add a `/play/[slug]` variant with a GLTF model viewer (R3F) |
| **Pagination / infinite scroll on Takes** | Current 6 essays fit on one page — scale for more |
| **Freebies search/filter** | Filter by category (Typography, Textures, Mockups, Motion) |
| **Dark mode image variants** | Some images need different treatment in dark mode (white logomarks on light images) |
| **Bento grid variants** | More layouts for bento modules in project pages (currently only 12-col hero + 2 side) |

### P3 — Nice to Have (2027+)

| Item | Description |
|------|-------------|
| **Page transitions** | Framer Motion `animate()` with route change for cinematic page-to-page flow |
| **Cursor follower (custom)** | Replace default cursor with a custom SVG follower on desktop |
| **WebGL background on homepage** | Replace CSS perspective with a true WebGL 3D background (OGL or Three.js) |
| **Music / ambient audio** | Optional ambient soundtrack with mute toggle |
| **CMS integration** | Headless CMS (Sanity/Prismic) for non-developer content updates |
| **A/B test scroll behavior** | Test snap-to-section vs free scroll user preference |
| **i18n** | Vietnamese language toggle |
| **Service Worker / PWA** | Offline support for portfolio browsing |

---

## 13. Known Bugs & Issues

### Fixed

| # | Issue | File | Fix |
|---|-------|------|-----|
| B1 | **Wikimedia images returning 400** — All URLs replaced with local project assets + Unsplash images. | `data/projects.ts`, `data/takes.ts`, `data/freebies.ts` | ✅ Replaced all 18 Wikimedia URLs with reliable sources |
| B2 | **Freebie detail dummy data** — Now looks up actual freebie data by slug, renders real content. | `freebies/[slug]/page.tsx` | ✅ Real data lookup from `@/data/freebies` |
| B3 | **Build failure** — Build now compiles successfully. | All files | ✅ Build passes (TypeScript + compile in 13.8s) |
| B4 | **LCP warning** — Added `priority` prop to loading screen logo. | `LoadingScreen.tsx` | ✅ `priority` added to LCP element |
| B5 | **Sine carousel lazy loading** — Removed `loading="lazy"` from SineCard images. | `page.tsx` | ✅ `loading="lazy"` removed |
| B6 | **Works dial audio first-tap** — AudioContext now created eagerly on mount, resumes on first user gesture. | `works/page.tsx` | ✅ Eager AudioContext creation |
| B9 | **Viewport jump on route change** — Lenis scroll position resets to top on pathname change. | `SmoothScroll.tsx` | ✅ Scroll-to-top on route change via `usePathname` |
| B10 | **Theme flash** — Inline `<script>` in `<head>` reads localStorage/OS preference before React hydration. | `layout.tsx` | ✅ Inline theme-sniffing script prevents flash |
| B11 | **GlobalSideBar mobile overlap** — Sidebar now hidden on mobile (`hidden md:flex`). | `GlobalSideBar.tsx` | ✅ Hidden on screens < md breakpoint |
| B14 | **Iframe error state** — Added error UI with retry button when sandbox fails to load. | `play/[slug]/page.tsx` | ✅ Error state: "SANDBOX_UNAVAILABLE" + retry |
| B15 | **WaveGradientBar color transitions** — Increased lerp factor from 0.05 to 0.08 for faster color smoothing. | `WaveGradientBar.tsx` | ✅ Faster color transitions |
| B12 | **Navbar notch truncation** — Added `max-w-[70vw] overflow-hidden text-ellipsis` to prevent overflow. | `Navbar.tsx` | ✅ Text truncates with ellipsis on small viewports |
| B16 | **Contacts card flip pivot** — Extended pivot hold duration from 300ms to 800ms for a more visible effect. | `contacts/page.tsx` | ✅ Pivot persists longer after flip |

### Remaining Known Issues

| # | Issue | File | Impact | Status |
|---|-------|------|--------|--------|
| B7 | **Mobile homepage** uses same Z-depth model as desktop — frames not vertically stacked, causing zoomed-out appearance. | `page.tsx` | Poor mobile UX | 🟡 Open |
| B8 | **Next.js `unoptimized: true`** — Disables next/image optimization globally. Intended for architecture. | `next.config.ts` | Larger image bundles | 🟢 Expected |
| B13 | **MagneticText** RAF-driven reflow — CPU spike when many instances on screen. Currently only theoretical. | `MagneticText.tsx` | Performance overhead | 🟡 Monitor |

---

## Appendix A: Data Schemas

### Project (`data/projects.ts`)
```typescript
interface Project {
  title: string;
  slug: string;
  year: string;
  category: string;
  id: string;          // e.g. "PRJ_001"
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
  colors: string[];    // 3 hex colors for sidebar + backgrounds
}
```

### Take (`data/takes.ts`)
```typescript
interface Take {
  title: string;
  slug: string;
  date: string;        // e.g. "June 2026"
  excerpt: string;
  topic: string;       // e.g. "WEBGL", "THREEJS", "CANVAS"
  colors: string[];
  image: string;
  content: string;     // paragraphs separated by \n\n
}
```

### PlayItem (`data/play.ts`)
```typescript
interface PlayItem {
  title: string;
  slug: string;
  description: string;
  src: string;         // placeholder image
  url: string;         // path to static HTML file
  colors: string[];
  tech: string[];      // tags like ["React", "Netlify"]
}
```

### FreebieItem (`data/freebies.ts`)
```typescript
interface FreebieItem {
  id: string;
  slug: string;        // stable URL identifier (e.g. "editorial-typeface-specimen")
  title: string;
  description: string;
  category: string;    // "TYPOGRAPHY", "TEXTURES", "MOCKUPS", "MOTION"
  image: string;
  downloadUrl: string;
  colors: string[];
}
```

---

## Appendix B: Environment & Setup

### MCP Server Configuration

| Server | Tool | Status | Purpose |
|--------|------|--------|---------|
| **Playwright** | Browser automation | ✅ Enabled | Visual snapshots, interaction testing, console log inspection |
| **GitHub** | Git operations | ⚠️ Disabled (needs token) | PR management, issue tracking, repo operations |

Configuration lives in `.opencode/opencode.json` (project scope) and `~/.config/opencode/opencode.jsonc` (global scope). Project config overrides global.

### Installed Skills

Skills are project-specific knowledge bundles that guide AI agents toward correct patterns. They live under `.opencode/skills/<name>/SKILL.md` and are auto-loaded by the agent.

| Skill | Description | Use When |
|-------|-------------|----------|
| **tech-luxe-design-system** | Color tokens, typography, spacing, component primitives from the PRD design system | Implementing or reviewing UI against the design system |
| **portfolio-animation** | Framer Motion spring configs, Z-axis depth mapping, easing curves, performance rules | Building scroll animations, state transitions, or cursor effects |
| **threejs-r3f-ogl** | R3F patterns, OGL shader setup, GeoJSON extrusion, VRAM budgets | Working with Three.js scenes, WebGL shaders, or 3D data viz |
| **gepeto** | Pinokio 1-click launcher creation | Building launchers or managing app deployments via Pinokio |
| **pinokio** | App discovery and launch via Pinokio | Finding and running local apps through the Pinokio runtime |

### Agent Configuration

A `design-review` subagent is configured in `.opencode/opencode.json` to check UI against the design system. It has read-only permission and produces a markdown violation report.

### Installing New Skills

```bash
# Create a new skill:
# 1. mkdir .opencode/skills/<skill-name>
# 2. Create SKILL.md with frontmatter (name, description)
# 3. Restart opencode

# External skills can be added via URLs in skills.urls config
```

### Prerequisites
- Node.js 20+
- npm 10+
- (Optional) RTX 3050 Ti / equivalent for full 3D performance testing

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

### Project Structure
```
portfolio-2026/
├── public/
│   ├── assets/          # Images, SVGs, favicon
│   ├── play-static/     # Pre-built sandbox HTML files (5 sandboxes)
│   ├── projects/        # Local project thumbnail images
│   └── play/            # Empty subdirectories (unused)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── contacts/
│   │   ├── freebies/
│   │   ├── play/
│   │   ├── takes/
│   │   └── works/
│   ├── components/      # React components
│   │   └── projects/    # Project-specific 3D components
│   ├── data/            # Static data files
│   └── globals.css      # Tailwind + custom styles
├── next.config.ts
├── tsconfig.json
├── package.json
├── .opencode/
│   ├── opencode.json    # Project-level AI agent config
│   └── skills/          # Project-specific skill bundles
│       ├── tech-luxe-design-system/
│       ├── portfolio-animation/
│       └── threejs-r3f-ogl/
├── AGENTS.md            # AI agent configuration
├── README.md
├── TECHNICAL.md
├── design.md
└── PRD.md               # This document
```

---

*Document generated from full codebase audit. For questions or corrections, contact the development lead.*
