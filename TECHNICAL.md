---
task: "Motion & 3D Portfolio Orchestration"
agent_capability: ["filesystem", "terminal", "web_browser"]
environment: "Local / RTX 3050 Ti (4GB VRAM) / 64GB RAM"
---

# 🚀 Portfolio System Architecture

## 1. System Constraints & Context
- **Hardware Profile:** Optimize for 4GB VRAM; prioritize texture compression and efficient geometry.
- **Environment:** Compatible with Stability Matrix; avoid port conflicts with Proton VPN or Tailscale.
- **Stack:** Next.js (App Router, Hybrid Serverless Mode), React Three Fiber, GSAP, Mux, Next.js Image Optimization.

## 2. Agent Directives
> [!IMPORTANT]
> Agent should prioritize "Suspense" patterns for all 3D assets to prevent UI blocking.

### A. Initialization Phase
- [x] Initialize Next.js project with `typescript` and `tailwind`.
- [x] Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@mux/mux-video`.
- [x] Configure `next.config.mjs` for high-bitrate video streaming via Mux.

### B. Core Feature Implementation
- [x] **Interactive Hero:** Create a `Canvas` component. Implement a 3D extrusion logic based on the `Vietnam Forestation` GeoJSON project.
- [x] **Motion Sequencing:** Setup a scroll-linked camera/world transition timeline that triggers on-scroll to transition the camera between 3D scenes.
- [x] **Hardware-Aware Rendering:** Implement a performance monitor that downgrades Three.js `pixelRatio` if VRAM usage spikes (essential for 3050 Ti stability).
- [x] **Viewport Cursor-Following Parallax:** Add spring-smoothed cursor tilt (`rotateX`/`rotateY`) and slide (`translateX`/`translateY`) transforms to the 3D world container.

## 3. Performance & SEO / AISEO Directives
- [x] **WebGL Fill-Rate Optimization:** Cap `dpr` to 1.0 and scale drawing buffers of smooth UI shaders (e.g. `WaveGradientBar`) to `0.25x` to save massive fill-rate calculations.
- [x] **Visibility-Aware Rendering:** Implement `IntersectionObserver` on animation canvas loops to cancel requestAnimationFrame cycles when elements are off-screen or `display: none` (responsive breakpoints).
- [x] **Next.js Native Image Optimization:** Deploy using Hybrid Serverless hosting on Vercel; refactor raw `<img>` tags to `<Image>` and animatable `<MotionImage>` to leverage WebP/AVIF format auto-conversion and responsive sizes versioning.
- [x] **AISEO Structured Schemas:** Configure dynamic sitemaps (`sitemap.ts`), indexation policies (`robots.ts`), and JSON-LD profile objects (Person & Portfolio) inside layout metadata.

## 4. Reference Material
- **Data:** `@/data/vietnam-forest-data.json` (Reference for 3D extrusion heights).
- **Styles:** Use a "Glassmorphism" aesthetic to match the DIY woodworking project vibe (matte glass texture).
