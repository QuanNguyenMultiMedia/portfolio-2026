# Portfolio 2026 — Complete Content Inventory

> All text content in chronological user journey order.
> Returns `→` indicate link/CTA destinations.

---

## 1. PERSISTENT UI (Every Page)

### Loading Screen (first thing user sees)
```
Status messages (cycling):
  "Initializing Environment"
  "Mounting Modules"
  "Compiling Shaders"
  "Calibrating Viewport"
  "Establishing Connection"
  "Ready"

Progress: {n}%
```

### Navbar (fixed bottom)
```
All pages → [Home] [Works] [Takes] [Play] [Freebies] [Contacts]

HUD Notch above navbar:
  {directory} // {title}
    - Home page:       DIRECTORY // HOME
    - /works:          DIRECTORY // WORKS
    - /works/[slug]:   ARCHIVE // {SLUG_UPPERCASE}
    - /takes:          DIRECTORY // TAKES
    - /takes/[slug]:   ESSAYS // {SLUG_UPPERCASE}
    - /play:           DIRECTORY // PLAY
    - /freebies:       DIRECTORY // FREEBIES
    - /contacts:       DIRECTORY // CONTACTS
```

### LogoMark (fixed top-right)
```
Alt text: "Minh Quan Logo"
SVG logo: links to /
Theme-aware (light/dark variant)
Hidden on mobile
```

### GlobalSideBar (fixed left)
```
Topic label (rotated -90°):
  - /        → HOME
  - /works  → ARCHIVE (list) or {CATEGORY} (detail)
  - /takes  → ESSAYS (list) or {TOPIC} (detail)
  - /freebies → BOUTIQUE
  - /play   → LABS
  - /contacts → CONNECT

Theme toggle:
  Shows "THEME // DARK" or "THEME // LIGHT" on hover (home only)
  Sun icon (light mode) / Moon icon (dark mode)

Hidden on mobile
```

### HTML Metadata (layout.tsx)
```
Title: "Minh Quan | Motion Design & Creative Engineering"
Description: "Portfolio of Minh Quan — Midweight Motion Designer exploring the intersection of cinematic motion, 3D engineering, and editorial design. Ho Chi Minh City based, globally available."
Keywords: Motion Design, WebGL, Three.js, Creative Developer, UI Animation, Branding, Minh Quan

Open Graph:
  Title: "Minh Quan | Motion Design & Creative Engineering"
  Description: "Cinematic motion, 3D engineering, and editorial design portfolio."
  Site Name: "Minh Quan Portfolio"
```

---

## 2. HOME PAGE (`/`)

### Frame 0 — Hero
```
Headline (top-left):
  "Minh Quan"
  "Midweight Motion Designer"

Tagline (below, balanced text):
  "Orchestrating space, time, and identity into cinematic digital products. Scroll to explore the craft."

Image (right, grayscale → color on hover):
  portrait_standing.jpg
  Alt: "Minh Quan - Standing Portrait"
```

### Frame 1 — Manifesto
```
Headline (glass panel with corner brackets):
  "Motion Is The"
  "Language" (italic, tech-blue accent)
  "Of"
  "Intention."
```

### Frame 2 — Showreel
```
HUD labels:
  "LIVE_FEED // SHOWREEL_2026"
  "SRC: MUX_STREAM // 1080P"

Video controls:
  ▶ Play/Pause button
  TIME: 00:00:00:00
  ENC: H.264 // FPS: 60.0

  "UNMUTE // AUDIO_OFF" or "MUTE // AUDIO_ON" button
  ⛶ Fullscreen toggle

Scrub bar at bottom
```

### Frame 3 — Testimonials (4 cards, 2×2 grid)

**Freightos** (top-left):
  Quote: "The motion system Quan delivered didn't just look premium — it fundamentally improved how users understood our data hierarchy. Every transition had purpose."
  Author: Freightos Branding — Client Partner

**Storyflow** (top-right):
  Quote: "Quan brought a level of spatial awareness to our UI that we hadn't articulated but immediately recognized as missing. The scroll-linked animations redefined our visual language."
  Author: Storyflow Studio — Creative Director

**Savannah Bee Co** (bottom-left):
  Quote: "Every micro-interaction Quan designed serves the narrative — nothing is ornamental. That restraint is rare, and it made our brand feel instantly more sophisticated."
  Author: Savannah Bee Company — Marketing Lead

**WonderMillCosmos** (bottom-right):
  Quote: "Working with Quan felt like collaborating with an architect who happens to animate. Every frame, every curve, every timing decision was justified by a structural reason."
  Author: WonderMillCosmos — Creative Partner

### Frame 4 — Stats
```
HUD label: "Key Metrics"

Numbers:
  50+  → Projects Completed
  100% → Client Rating
  04+  → Years Active
  HCMC → VN // Global Base

HUD label: "Trusted Collaborators"

Brand grid (8):
  Freightos, Storyflow, WonderMill, Savannah Bee,
  Upwork (VIP), Dobeedo, Z Cung Viet, Viettel Digital

CTA buttons:
  "Browse Archive // View Works" → /works
  "Initiate Contact // Connect"  → /contacts
```

---

## 3. WORKS ARCHIVE (`/works`)

### Header
```
Label: "Selected Works"
Title: "DIRECTORY"
```

### Project Browser — 3D Dial Interface

Each project shows in the preview area (left) + 3D scroll list (right):

**1. 2026 Reel**
  - Category: Showreel | Year: 2026
  - ID: PRJ_001
  - Description: "A curated showcase of the year's most impactful motion design, branding, and creative engineering work. Every frame selected for narrative momentum and technical craft."
  - → /works/2026-reel

**2. Herond Browser**
  - Category: UI Motion | Year: 2025
  - ID: PRJ_002
  - Description: "Motion design system and UI animation for Herond Browser — a privacy-first web browser reimagining the browsing experience through fluid, purpose-driven micro-interactions."
  - → /works/herond-browser

**3. Defrasoft**
  - Category: Branding | Year: 2025
  - ID: PRJ_003
  - Description: "Complete visual identity and motion system for Defrasoft — a B2B SaaS analytics platform. From logo construction to product UI animation across the entire ecosystem."
  - → /works/defrasoft

**4. Z Cung Viet**
  - Category: Motion | Year: 2023
  - ID: PRJ_004
  - Description: "Brand film and motion identity for 'Z Cũng Viết' — a creative writing platform redefining how Vietnamese youth engage with literature and self-expression through short-form video."
  - → /works/z-cung-viet

**5. Select Freelance Work**
  - Category: Motion | Year: 2020 – Present
  - ID: PRJ_005
  - Description: "A curated selection of freelance projects spanning motion design, explainer videos, social media campaigns, and brand films for clients across industries and continents."
  - → /works/select-freelance-work

Dial shows: "01", "02", "03", "04", "05" (center cap)
Haptic and audio feedback on selection

---

## 4. PROJECT DETAIL (`/works/[slug]`)

### Shared header elements:
```
Back arrow: ← → /works
Title label: {project.title} (top-left, fixed)
```

### Hero section per project:
```
{category} — {year}

Title (split into alternating bold/italic words):

  "2026 Reel"
  → 2026 (bold) | Reel (italic)

  "Herond Browser"
  → Herond (bold) | Browser (italic)

  "Defrasoft"
  → Defrasoft (bold, single word)

  "Z Cung Viet"
  → Z (bold) | Cung (italic, on new line) | Viet (bold, on new line)

  "Select Freelance Work"
  → Select (bold) | Freelance (italic, on new line) | Work (bold, on new line)

Description: (same as archive description)
```

### Screen modules (per project):

**2026 Reel:**
  1. Bento layout — "A cross-section of 2026's motion language."
  2. Image — "01. Motion Design Compilation"
  3. Details — "A tightly edited sequence that moves from brand identity systems to UI motion, with each transition serving the arc of the year's creative evolution."

**Herond Browser:**
  1. Image — "01. Core Interaction Prototyping"
  2. Bento — "Gesture mapping and transition logic."
  3. Details — "Every micro-interaction in Herond Browser was designed to feel structural rather than ornamental — tab switches that respect spatial memory, scroll physics that mirror natural hand inertia."

**Defrasoft:**
  1. Image — "01. Logo Construction & Typography"
  2. Bento — "Brand applications across digital surfaces."
  3. Details — "A modular identity system built on a disciplined grid. Every component — from data visualization charts to loading states — follows the same spatial logic."
  4. Bento (split layout) — "Dashboard animation studies."

**Z Cung Viet:**
  1. Image — "01. Brand Film — Keyframe Selection"
  2. Bento — "Typography-driven narrative sequences."
  3. Details — "A typographic-first approach where Vietnamese letterforms become cinematic protagonists. The challenge was balancing editorial readability with motion intensity."

**Select Freelance Work:**
  1. Bento — "Selected freelance deliverables — 2020 to present."
  2. Image — "01. Explainer & Brand Films"
  3. Details — "From Freightos to Upwork Enterprise, each project demanded a unique visual language. The common thread is structural motion design — every animation serves a communication goal."
  4. Image — "02. Social Media & Short-Form Campaigns"

### Next Project section (end of every project page):
```
Label: "Want to see more?"
Title: "Next Project"

Image preview (grayscale → color on hover)
Hover overlay shows next project title
"Click to advance" — "/ 2026"
```

---

## 5. VIETNAM FORESTATION (`/works/vietnam-forestation`)

Sections (GSAP horizontal pin-scroll, 3 screens):

### Screen 1 — Hero:
```
Title: "Vietnam Forestation"
Subtitle: "3D Extrusion & GIS Data Visualization"
Description: "A technical study on high-fidelity environmental data rendering."
```

### Screen 2 — Visual:
```
3D R3F scene (dynamic import, SSR: false)
Caption: "01. Real-time GIS Extrusion"
```

### Screen 3 — Details:
```
Content: "Optimized for 3050 Ti systems using hardware-aware rendering and performance monitoring."
```

Progress overlay: "01" — [— — —] — "03"

---

## 6. TAKES ARCHIVE (`/takes`)

### Header:
```
Directory: "Essays // 02"
Title: "Takes"
Subtitle: "Thoughts & Perspectives"
```

### Essay list (6 items):

**1. Mastering the WebGL Pipeline**
  - ESSAY_01 // WEBGL // 2026
  - "Diving into custom GLSL shaders, GPU pipeline architecture, and the discipline required to achieve 120 FPS in the browser."
  - → /takes/mastering-webgl-pipeline

**2. ThreeJS: Abstraction vs Control**
  - ESSAY_02 // THREEJS // 2026
  - "Finding the sweet spot between Three.js ergonomics and raw WebGL control for production-grade 3D experiences."
  - → /takes/threejs-abstraction-control

**3. The Canvas as a Canvas**
  - ESSAY_03 // CANVAS // 2026
  - "Revisiting the HTML5 Canvas API as an immediacy-driven tool for generative art and pixel-level manipulation."
  - → /takes/html-on-canvas

**4. Retype: The Art of Digital Typography**
  - ESSAY_04 // RETYPE // 2026
  - "Kinetic typography as an architectural discipline — where letterforms become structural and pacing becomes narrative."
  - → /takes/retype-digital-typography

**5. Motion Systems with Cavalry**
  - ESSAY_05 // CAVALRY // 2026
  - "Node-based procedural animation workflows that bridge the gap between motion design and production code."
  - → /takes/motion-design-cavalry

**6. The Architecture of Motion**
  - ESSAY_06 // MOTION // 2026
  - "How the physics of transition design shapes user perception in premium digital experiences."
  - → /takes/architecture-of-motion

---

## 7. TAKE DETAIL (`/takes/[slug]`)

### Header:
```
Back: "← Back To Essays" → /takes
```

**1. Mastering the WebGL Pipeline**
  - Date: June 2026
  - Excerpt: "( Diving into custom GLSL shaders, GPU pipeline architecture, and the discipline required to achieve 120 FPS in the browser. )"
  - Content:
    > WebGL represents the rawest form of web graphics, stripping away the comfort of higher-level abstractions. When we write custom GLSL shaders, we're not just drawing pixels; we're orchestrating the GPU at a fundamental level.
    >
    > The architecture of a custom rendering pipeline requires strict discipline: managing vertex attributes, organizing uniform data, and optimizing draw calls. It's an environment where mathematical precision directly translates to visual fidelity.
    >
    > One critical insight I've gathered through iterative profiling is that the bottleneck is almost never the fragment shader — it's the vertex count and the number of draw calls. Instanced rendering, frustum culling, and LOD stratification are not optional optimizations; they're foundational architectural decisions. A scene that runs at 18 FPS without culling can easily hit 120 FPS once you respect the hardware's memory hierarchy.

**2. ThreeJS: Abstraction vs Control**
  - Date: May 2026
  - Excerpt: "( Finding the sweet spot between Three.js ergonomics and raw WebGL control for production-grade 3D experiences. )"
  - Content:
    > Three.js is a marvel of software engineering, providing a robust scene graph that shields developers from the complexities of raw WebGL. However, true mastery of the library involves knowing when to break out of that abstraction.
    >
    > Whether it's writing custom ShaderMaterials, instanced rendering for particle systems, or managing geometry disposal to prevent memory leaks, the sweet spot lies at the intersection of high-level ease and low-level control.
    >
    > The default renderer pipeline in Three.js is generously feature-rich, but it comes at a cost. For a recent particle-heavy project, switching from MeshStandardMaterial to a custom ShaderMaterial with manual UV management reduced draw calls by 60% and dropped frame-time variance from 14ms to a stable 4ms. The abstraction tax is real, and knowing when to bypass it separates production-quality work from prototypes.

**3. The Canvas as a Canvas**
  - Date: April 2026
  - Excerpt: "( Revisiting the HTML5 Canvas API as an immediacy-driven tool for generative art and pixel-level manipulation. )"
  - Content:
    > Before WebGL became ubiquitous, the HTML5 2D Canvas was the primary playground for web experimentation. Even today, its sheer simplicity and immediate mode rendering model make it incredibly powerful for certain types of visual work.
    >
    > By manipulating pixel arrays directly (ImageData), we can achieve classic demoscene effects, custom cellular automata, or intricate generative art without the overhead of a 3D context.
    >
    > What fascinates me about the Canvas API is its brutally procedural nature. There is no scene graph, no retained mode, no automatic dirty-checking. You issue drawing commands, the pixels render, and the buffer is cleared. This forces a mindset of explicit state management — every stroke, fill, and transformation must be re-issued each frame. It's akin to working with a physical sketchpad: the immediacy is both the constraint and the liberation.

**4. Retype: The Art of Digital Typography**
  - Date: March 2026
  - Excerpt: "( Kinetic typography as an architectural discipline — where letterforms become structural and pacing becomes narrative. )"
  - Content:
    > Typography in the digital realm is no longer static. It breathes, reacts, and shifts. Kinetic typography isn't merely about adding motion; it's about adding meaning through pacing, weight shifts, and structural transitions.
    >
    > When we treat letters as architectural elements rather than just semantic vessels, the entire interface transforms from a readable document into an experiential space.
    >
    > A well-designed kinetic type system considers three axes: temporal hierarchy (when does each element enter?), spatial anchoring (where does it sit in the Z-layout?), and weight dynamics (how does font-weight map to emphasis over time?). I've found that mapping CSS font-variation-settings to scroll progress creates some of the most tasteful transitions — a variable font that moves from Hairline (100) to Black (900) as the user descends a narrative feels less like animation and more like reading depth.

**5. Motion Systems with Cavalry**
  - Date: February 2026
  - Excerpt: "( Node-based procedural animation workflows that bridge the gap between motion design and production code. )"
  - Content:
    > Cavalry represents a paradigm shift in 2D motion design, moving away from purely linear timelines towards procedural, node-based systems. This approach aligns perfectly with how developers think about UI architecture.
    >
    > By building reusable animation rigs and data-driven behaviors, we can bridge the gap between motion prototypes and actual implementation, ensuring that the final coded interface faithfully replicates the original design intent.
    >
    > The real power of Cavalry lies in its data-binding capabilities. Instead of hand-animating each state, you wire your geometry to CSV exports, JSON schemas, or live APIs. For a recent data-visualization project, I piped real-time analytics into Cavalry's node graph, which drove 200+ individual shape layers without a single keyframe. The output was then exported as a Lottie JSON and rendered in-browser via react-lottie — a fully procedural pipeline from data to pixel.

**6. The Architecture of Motion**
  - Date: January 2026
  - Excerpt: "( How the physics of transition design shapes user perception in premium digital experiences. )"
  - Content:
    > Movement is not merely the displacement of matter through space; it is the dialogue between stability and intent. In the realm of digital orchestration, every transition carries the weight of structural logic.
    >
    > When we build interfaces that feel premium, we are essentially building environments that respect the laws of physics, even if those physics are simulated. The way a menu slides into view or a 3D asset responds to scroll is a testament to the architecture of that digital space.
    >
    > I've spent considerable time refining spring-based animation systems — specifically the relationship between damping, stiffness, and mass in a critically-damped versus under-damped system. A subtle 5% overshoot on a button press communicates tactile feedback without crossing into cartoonish territory. The difference between an ease-out that feels "right" and one that feels "close" often comes down to a single decimal point in the spring constant. Motion design at this level is indistinguishable from engineering.

---

## 8. PLAY ARCHIVE (`/play`)

### Header:
```
Subtitle: "// PLAYGROUND_SANDBOX"
Title: "PLAY"
```

### Sandbox cards (5 items):

**1. Tourmaline Cat**
  - Description: "Web experience deployment exploration on Netlify."
  - Tech: React, Netlify
  - → /play/tourmaline-cat

**2. Coruscating Donut**
  - Description: "Interactive application test deployment."
  - Tech: Web, Netlify
  - → /play/coruscating-donut

**3. Melodic Concha**
  - Description: "Experimental UI and sound deployment."
  - Tech: Audio, Web
  - → /play/melodic-concha

**4. Enchanting Kashata**
  - Description: "Digital playground and interaction sandbox."
  - Tech: Sandbox, Netlify
  - → /play/enchanting-kashata

**5. Charming Starlight**
  - Description: "Visual fidelity and lighting test."
  - Tech: Visuals, Netlify
  - → /play/charming-starlight

---

## 9. PLAY DETAIL (`/play/[slug]`)

### Shared elements:
```
Back: "← Return_Archive" → /play
```

### HUD header (top-right, hidden in fullscreen):
```
"SYS_LOC: LOCAL_STATIC_MIRROR"
STATUS: INITIALIZING / RUNNING (with amber/green dot)
```

### Top bar (above frame / docks inside during fullscreen):
```
Left: "DATA_VIZ // {SLUG_UPPERCASE}"
       {project.title}

Right: "EXPAND" / "MINIMIZE" toggle button
```

### Bottom bar (below frame / rises inside during fullscreen):
```
Left:   "{currentIndex+1}" / "{total}" (e.g. "01 / 05")
Right:  "INTERACTIVE" (with red pulsing dot)
```

### Navigation arrows (left/right):
```
← Previous project link
→ Next project link
```

### Control panel (below frame):
```
"TECH:" — {tag1} {tag2} (bordered tech stack labels)

Controls:
  COLOR: [MONO] | [RGB]
  SCALE: [65%] | [75%] | [85%] | [100%]
  "RE-INIT ↺" reload button
```

### Loading state:
```
Spinning HUD ring
"INITIALIZING_SANDBOX"
"RESOLVING: {SLUG_UPPERCASE}"

Status logs:
  LOAD_METHOD     LOCAL_MIRROR_IFRAME
  RESOURCE_PATH   {url}
  SECURE_SANDBOX  SAME_ORIGIN_OK
```

### Error state:
```
"!" icon
"SANDBOX_UNAVAILABLE"
"FAILED TO RESOLVE: {SLUG_UPPERCASE}"

Error logs:
  ERROR_TYPE      CONNECTION_REFUSED
  RESOURCE_PATH   {url}

Button: "Retry Connection"
```

### Decorative background labels (non-fullscreen only):
```
Bottom-left:  "{tech1} // {tech2} // PORTFOLIO_PLAY_V1"
Bottom-right: "FRAME_LATENCY: 0.00ms // LOCAL_ENV_OK"
```

---

## 10. FREEBIES ARCHIVE (`/freebies`)

### Header:
```
Directory: "Free Library // 01"
Title: "Boutique"
Subtitle: "Curated Downloads"
```

### Staggered grid (5 items):

**1. Editorial Typeface Specimen** (TYPOGRAPHY)
  - Description: "A 48-page high-fidelity PDF specimen dissecting the intersection of brutalist architecture and modern serif typography. Each spread pairs structural photography with type system breakdowns, including variable font axis mappings, kerning tables, and grid overlay references. Optimized for both print (300 DPI, CMYK) and high-res digital display (Retina, sRGB). Perfect for type designers and editorial architects."
  - Download: # (placeholder)

**2. Liquid Gradient Pack** (TEXTURES)
  - Description: "A curated set of 12 high-resolution grainient textures engineered for experimental web backgrounds and editorial overlays. Each texture features multi-layered grain structure with subtle color bleed, rendered at 4096x4096px. Formats include lossless .webp (optimized for web delivery), .png (for compositing), and an accompanying .css file with pre-configured backdrop-filter blend modes. Ideal for adding organic warmth to otherwise sterile digital surfaces."
  - Download: # (placeholder)

**3. Minimalist Mockups // Vol 1** (MOCKUPS)
  - Description: "Five photorealistic device mockups conceived around negative space and architectural lighting. Each mockup includes multi-angle perspectives (front, isometric, detail crop) with realistic environmental reflections and drop shadows. Layered PSDs with smart-object swap slots, pre-configured 3D light rigs, and color-grading LUTs included. The set covers laptop, tablet, phone, monitor, and a display configuration for hero section presentations."
  - Download: # (placeholder)

**4. Motion Design Presets** (MOTION)
  - Description: "A signature After Effects preset pack engineered for the 'tech-luxe' animation aesthetic — where elastic eases meet mechanical precision. Includes 24 animation presets (entry, exit, emphasis, and looping), 8 custom expression controllers, and a comprehensive easing curve library mapped to cubic-bezier values for direct translation to web frameworks. Each preset is documented with reference FPS targets and GPU utilization notes."
  - Download: # (placeholder)

**5. Noise Texture Toolkit** (TEXTURES)
  - Description: "A procedural noise texture toolkit designed for 3D shader work and digital painting. Contains 16 seamless 4K resolution maps spanning Perlin, Simplex, Voronoi, Fractal Brownian Motion, and custom hybrid noise types. Each map available in 8-bit and 16-bit depth, with EXR float-format variants for HDR rendering pipelines. Accompanied by a GLSL snippet library for real-time shader implementation."
  - Download: # (placeholder)

### Detail Overlay (Portal, when clicking an item):
```
Category label (HUD): {category} (e.g. "TYPOGRAPHY")

Title (display text, large): {item.title}

Description (paragraphs split on \n\n)

"COLOR PALETTE // SPEC_2026"
  Color swatches with hex labels on hover

Button: "Download // Free" → {downloadUrl}
Close button: × (SVG X icon)
```

---

## 11. FREEBIE DETAIL (`/freebies/[slug]`)

### Header:
```
Back: "← Back To Boutique" → /freebies
WaveGradientBar with blue-cyan colors
```

### Screens (horizontal scroll):

**Screen 1 — Hero:**
```
Section label: "SEC_01 // HERO"

Title: {item.title} (MeasuredHeader with HUD)
Subtitle: "{category} // 2026 EDITION"
Description: {item.description} (BalancedText with HUD)
```

**Screen 2 — Image:**
```
Section label: "SEC_02 // IMAGE"

Image: {item.image}
Caption: "PREVIEW_RENDER_01"
```

**Screen 3 — Details:**
```
Section label: "SEC_03 // DETAILS"

Content: "Every asset is built with production scalability in mind. Organized layer structures, consistent naming conventions, and colour-managed profiles ensure seamless integration into any existing workflow — whether you're working in After Effects, Figma, or a custom WebGL pipeline."
```

### Progress overlay (top-center):
```
"01" — [—] [—] [—] — "03"
```

### Hint (bottom-right):
```
"DRAG_OR_SCROLL" — (horizontal line)
```

---

## 12. CONTACTS (`/contacts`)

### Front Side — "Contact"

```
Header tab: "Contact" (italic, positioned top-right)

Email:
  QUANNGUYENHERE
  @GMAIL.COM
  → mailto:quannguyenhere@gmail.com
  (Animated underline on hover)

Social links:
  01  LINKEDIN  → https://www.linkedin.com/in/quannguyenhere/
  02  BEHANCE   → #
  03  UPWORK    → #

Tagline:
  "Multimedia creative designer at the intersection of architecture, motion, and code."

Image:
  portrait_sitting.jpg
  Alt: "Minh Quan Portrait"
  Grayscale → color on hover
```

### Back Side — "About"

```
Header tab: "About" (italic, positioned top-right)

Name + title:
  "Quan Nguyen"
  "Multimedia Designer"

Experience timeline:
  Upwork              2020 – Present
    Freelance Motion Graphic Designer

  "Z Cũng Viết"       2023
    Project Manager & Lead Creative

  Viettel Digital     2022
    Lead Content Marketing Intern

Education:
  "FPT University // BBA Multimedia Communications"

Bio quotes:
  "I'm a Multimedia Communications creative obsessed with telling stories with a purpose."

  "Since 2020, I've been working as a Freelance Motion Graphics Designer, bringing brands' messages to life with dynamic and bold visuals."

  "My approach combines strategic communications with high-end aesthetic execution. I believe that every frame should serve a narrative."

Expertise tags:
  Motion Graphics
  Visual Systems
```

---

## APPENDIX: Image Assets Referenced

All images use Wikimedia Commons public-domain artworks as placeholders:

| Key | Artwork | Artist |
|-----|---------|--------|
| WANDERER | Wanderer above the Sea of Fog | Caspar David Friedrich |
| STARRY_NIGHT | The Starry Night | Vincent van Gogh |
| GREAT_WAVE | The Great Wave off Kanagawa | Hokusai |
| TOWER_OF_BABEL | The Tower of Babel | Pieter Bruegel the Elder |
| COMPOSITION_8 | Composition VIII | Wassily Kandinsky |
| NIGHT_WATCH | The Night Watch | Rembrandt |
| GIRL_WITH_PEARL_EARRING | Girl with a Pearl Earring | Johannes Vermeer |
| THE_KISS | The Kiss | Gustav Klimt |
| AMERICAN_GOTHIC | American Gothic | Grant Wood |
| LIBERTY_LEADING | Liberty Leading the People | Eugène Delacroix |
| THE_SCREAM | The Scream | Edvard Munch |
| SUNDAY_ON_LA_GRANDE_JATTE | A Sunday on La Grande Jatte | Georges Seurat |
| WATER_LILIES | Water Lilies | Claude Monet |
| BIRTH_OF_VENUS | The Birth of Venus | Sandro Botticelli |
| SCHOOL_OF_ATHENS | The School of Athens | Raphael |
| CREATION_OF_ADAM | Creation of Adam | Michelangelo |
| MONA_LISA | Mona Lisa | Leonardo da Vinci |
| LAS_MENINAS | Las Meninas | Diego Velázquez |

Portrait photos:
- /assets/portrait_standing.jpg — "Minh Quan - Standing Portrait"
- /assets/portrait_sitting.jpg — "Minh Quan Portrait"

Logo:
- /assets/Logo_Icon_Only.svg (Loading screen)
- /assets/Logo_Full_LightMode.svg / Logo_Full_DarkMode.svg (LogoMark)
- /assets/favicon white.png (favicon)
