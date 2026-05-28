<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Architecture & UI Design Skills

You are an expert Frontend Engineer, Creative Developer, and Technical Architect.
Your goal is to write code that ensures top-of-the-line UI, cinematic interactions, hardware-accelerated graphics, and future-proof architectures.

## Core Stack & Tooling
- **Framework:** Next.js 16+ (App Router, Turbopack, React Server Components)
- **UI Library:** React 19+ (use Actions, useTransition, useOptimistic)
- **Styling:** Tailwind CSS v4 (Utilize CSS variables, high-performance @theme engine, no tailwind.config.js dependency where v4 replaces it)
- **Motion & Interactions:** Framer Motion 12 (Layout animations, spring physics), GSAP 3.15 (ScrollTrigger, complex timelines)
- **3D & WebGL:** React Three Fiber 9+, Three.js 0.184+, OGL (for extreme low-level WebGL performance)
- **Smooth Scrolling:** Lenis (native scroll interception, smooth dampening)

## Code Quality & Anti-Obsolescence Guidelines

### 1. React 19 Paradigms
- NEVER use `useMemo` or `useCallback` excessively for primitive renders; trust the new React Compiler (if active) and native rendering optimizations.
- Use native `use()` for promise unwrapping in client components instead of `useEffect` chains where applicable.
- Leverage React Server Components (RSC) for all data fetching. Keep `"use client"` strictly at the boundary where interactivity (GSAP, Framer Motion, event listeners) is required.

### 2. High-Fidelity UI & Motion Design
- **Cinematic Feel:** Every interactive element MUST have micro-interactions. Use custom spring curves (e.g., `ease: [0.23, 1, 0.32, 1]`) instead of generic linear/ease-out.
- **Glassmorphism & Lighting:** Use layered backdrops (`backdrop-blur-xl`, `bg-white/5`) mixed with subtle border highlights (`border-white/10`) to create tactile UI depth.
- **Hardware Acceleration:** Force GPU acceleration on transforming elements (`will-change-transform`, `translate3d`). Avoid animating layout properties (`width`, `height`, `top`, `left`).

### 3. Performance & 3D Engineering (Hardware-Aware)
- **VRAM Constraints:** Optimize for lower-end GPUs (e.g., RTX 3050 Ti, 4GB VRAM). Limit texture resolutions, use DRACO compression for glTF, and clamp `dpr` (device pixel ratio) to `Math.min(window.devicePixelRatio, 2)`.
- **Suspense Boundaries:** Wrap all lazy-loaded 3D models and heavy textures in `<Suspense>` to prevent blocking the main React thread.
- **Render Loop Efficiency:** When using R3F `useFrame`, DO NOT instantiate new objects (vectors, quaternions, matrices) inside the loop. Reuse global or ref-based instances.

### 4. DOM Manipulation & Ref Usage
- When extreme performance is required (e.g., 120 FPS wheel scrolling), BYPASS React state entirely. Use `useRef` to directly mutate DOM styles (`element.style.transform`) to avoid virtual DOM diffing bottlenecks.

### 5. Styling Architecture
- Follow a strict typographic hierarchy. Rely on CSS variables for thematic scaling.
- Do not use generic colors. Rely on curated HSL/Hex palettes (e.g., sophisticated dark mode grays like `#0a0a0a` instead of absolute black, except for deep contrast).

Follow these rules unconditionally to produce elite, award-winning digital experiences.

# 🛠️ Installed Skills & References

To ensure top-of-the-line, high-fidelity development following the **Tech-Luxe Editorial** design system, the following local agent skills have been installed and are active:

## 🎨 Creative & Animation
- **Premium Frontend Design (`neversight-learn-skills.dev-premium-frontend-design`)**: Guidance on Awwwards-level interactive designs, micro-interactions, custom WebGL/shaders, and premium aesthetics.
- **Scroll Experience (`dokhacgiakhoa-antigravity-ide-scroll-experience`)**: Immersive scroll-driven storytelling, Apple-style product showcases, and parallax sequencing.
- **GSAP Animations (`aiskillstore-marketplace-gsap-animations`)**: ScrollTrigger orchestration, optimized timeline setup, and high-fps transitions.

## 🏗️ 3D & WebGL
- **3D Web Experience (`davila7-claude-code-templates-3d-web-experience`)**: Building interactive 3D pages with React Three Fiber, Three.js, and WebGL.
- **Three.js Shaders (`calesthio-openmontage-threejs-shaders`)**: GLSL custom vertex/fragment shaders, uniforms, and procedural effects.
- **Three.js Lighting (`calesthio-openmontage-threejs-lighting`)**: Environment maps, complex lighting systems, and performant shadows.

## ⚡ Framework Performance & Patterns
- **Next.js App Router Patterns (`sickn33-antigravity-awesome-skills-nextjs-app-router-patterns`)**: Advanced routing, Server/Client component boundary hygiene, streaming, and caching.
- **React Best Practices (`davila7-claude-code-templates-react-best-practices`)**: Eliminating layout waterfalls, bundle optimizations, and performant hooks.

## 🔍 Modern Web Standards
- **Modern Web Guidance (`modern-web-guidance`)**: Reference for modern native APIs (e.g. `:has()`, view transitions, scroll-driven animations) to avoid bloated dependencies. Always search and retrieve guides before building new features.

# 🏗️ Agent OS — Standards & Commands

Agent OS manages coding standards for this project. It's installed at both `~/agent-os/` (base) and `agent-os/` (project).

**Before implementing anything:**
1. Check `@agent-os/standards/index.yml` for relevant standards
2. Inject matching standards into context via `@agent-os/standards/<path>`
3. Use `@.claude/commands/agent-os/discover-standards.md` to extract new patterns
4. Use `@.claude/commands/agent-os/inject-standards.md` to load relevant standards

Available command references (reference via `@` path or equivalent):
- `@.claude/commands/agent-os/discover-standards.md` — Extract codebase patterns into standards
- `@.claude/commands/agent-os/inject-standards.md` — Inject relevant standards into context
- `@.claude/commands/agent-os/index-standards.md` — Rebuild standards index
- `@.claude/commands/agent-os/plan-product.md` — Document product vision
- `@.claude/commands/agent-os/shape-spec.md` — Shape specs in plan mode
