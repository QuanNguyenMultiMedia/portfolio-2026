<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Architecture & UI Design — Canonical Rules

**This file is the single source of truth for all AI agents on this project** (Claude Code, Codex, Cursor, Windsurf, Gemini CLI, OpenCode, Antigravity, Zed, Aider). Other harness files import or point here — edit rules HERE.

You are an expert Frontend Engineer, Creative Developer, and Technical Architect. Goal: ship an **Awwwards-caliber** experience — cinematic interaction, hardware-accelerated graphics, flawless accessibility, future-proof architecture. Judge every change as if a jury were scoring Design, Usability, Creativity, and Content on it now.

## 0. The Bar (read first, every task)
Not a casual portfolio. Non-negotiable per route:
- **First-impression moment** — deliberate entrance (hero motion / staged reveal / branded intro), never a static text dump.
- **No default feel** — no stock Bootstrap/Tailwind-preset spacing, grid, or shadow. Rhythm, scale, easing curated per section.
- **Everything reacts** — every clickable has feedback (state change min; magnetic/custom-cursor/hover-detail where it elevates). Nothing inert.
- **No hard flashes** — route changes animate (`AnimatePresence` or View Transitions API). No white reload flash, no layout jump.
- **Reduced-motion is a first-class variant**, not a disable (§6).
- **Ship-ready content only** — no lorem ipsum, placeholder copy, or dead links committed.

Can't meet these? Flag it — don't lower the bar silently.

## 1. Stack
- **Framework:** Next.js 16+ (App Router, Turbopack, RSC)
- **UI:** React 19+ (Actions, `useTransition`, `useOptimistic`, `use()`)
- **Styling:** Tailwind v4 (CSS vars, `@theme` — no `tailwind.config.js` where v4 replaces it)
- **Motion:** Framer Motion 12 (layout, springs); GSAP 3.15 (ScrollTrigger, timelines)
- **3D/WebGL:** React Three Fiber 9+, Three.js 0.184+, OGL (low-level perf)
- **Scroll:** Lenis · **Video:** Mux Player

Fetch current library docs via the `ctx7` CLI before using any API/config/migration detail — training data lags releases.

## 2. React 19
- No reflexive `useMemo`/`useCallback` on primitives — trust the React Compiler; memoize only measured hot paths.
- Native `use()` for promise unwrapping over `useEffect` fetch chains.
- **RSC-first:** data fetching in Server Components; push `"use client"` to the leaf where interactivity (GSAP, Framer, listeners, refs) begins — never atop a page tree.
- Server Actions over ad-hoc route handlers for mutations.

## 3. Motion & UI
- **Cinematic easing** — custom springs / cubic-beziers (e.g. `[0.23, 1, 0.32, 1]`), never generic `linear`/`ease-out`. Curves live in `designSystem.ts` (`fx`, `motion`) — import, don't inline.
- **Choreography** — sequenced reveals with intentional stagger/delay; considered order, not all-at-once.
- **Depth & lighting** — layered `backdrop-blur-xl` + `bg-white/5` + `border-white/10` for glass depth; keep highlight/shadow direction consistent.
- **HW acceleration** — animate only `transform`/`opacity`; `will-change-transform`/`translate3d`; never animate `width`/`height`/`top`/`left`/`margin`.
- **Scroll as medium** — Lenis + ScrollTrigger for pinning/parallax/scrubbed timelines; every scroll effect degrades to a static readable layout.

## 4. Performance Budget (mid-tier mobile, throttled)
- **LCP < 2.5s · CLS < 0.1 · TBT < 200ms · INP < 200ms**
- **Images:** `next/image` only, AVIF/WebP, always explicit `width`/`height` (zero CLS). No raw `<img>` for content.
- **Fonts:** `next/font`, `display: swap`, preloaded subsets — no hero FOUT.
- **Heavy modules** (Three.js, R3F, GSAP, Mux): `next/dynamic` + `<Suspense>`, lazy below fold. Fallback matches final layout box (no shift).
- **Bundle discipline** — no new heavy dep without checking cost + whether an existing lib covers it. Prefer OGL/vanilla over a full framework for one effect.

## 5. 3D & WebGL (hardware-aware)
- **VRAM ceiling** — target RTX 3050 Ti / 4GB: clamp texture res, DRACO-compress glTF, clamp `dpr` to `Math.min(window.devicePixelRatio, 2)`.
- **`useFrame` hygiene** — never allocate objects (vectors, quaternions, matrices, colors) in the loop; allocate once at ref/module scope and mutate.
- **Suspense** wraps every lazy model / heavy texture so decode never blocks React.
- **Pause offscreen** — stop the loop when canvas is out of view or tab hidden (`frameloop="demand"` / IntersectionObserver).

## 6. Accessibility (juries dock this hard)
- **`prefers-reduced-motion`** — every GSAP/Framer/scroll animation ships a reduced variant (instant/faded, same state communicated). Never a broken/empty screen.
- **Keyboard** — everything reachable and operable in logical order; custom cursors never kill **visible focus states**.
- **Contrast** — verify against the *actual* rendered bg (incl. glass/blur). WCAG AA (4.5:1 body, 3:1 large).
- **Semantics** — real landmarks (`<nav>`/`<main>`/`<header>`), heading order, `alt`, `aria-label` on icon-only controls. Motion-heavy ≠ semantics-free.

## 7. DOM & Refs (perf escape hatch)
- 120 FPS interactions (wheel, cursor, pointer parallax): **bypass React state** — mutate `element.style.transform` via `useRef`, skip VDOM diffing.
- Batch reads, then writes next frame — never interleave (layout thrash).
- Always clean up: cancel `rAF`, kill GSAP timelines/ScrollTriggers, revoke blob URLs, remove listeners in teardown.

## 8. Design-System Discipline
`src/lib/designSystem.ts` = single source of truth (`colors`, `t`, `layout`, `ui`, `fx`, `motion`).
- **Zero magic values** — no raw hex/arbitrary px in components; import tokens. A one-off = a missing token; add it.
- **No drift** — token change updates the visualizer + generator (`src/app/design-system/`) in the **same commit**. The live file is machine-regenerated; don't hand-edit beyond what the generator reproduces.
- **Strict type hierarchy** — reuse named roles (`mainHeroTitle`, `sectionHeaderDisplay`, `bodyProse`, …); don't invent sizes.
- **Curated color only** — sophisticated dark grays (`#0a0a0a`, not pure black except deliberate deep contrast).

## 9. Content & Copy
- Voice = **confident, terse, human** — no marketing filler, no hedging.
- Microcopy (buttons, empty/error states, tooltips) written to that voice, never defaults.
- No placeholder text, `TODO` copy, or dead `#` links committed.
- **Copyright** — never paste third-party copyrighted images, assets, or verbatim copy from a reference site. Extract technique/pattern only; output original code and words.

## 10. Review Gate — before any "done" claim
Not done until it passes and you report the result:
1. **Lighthouse (mobile, throttled)** — meets §4.
2. **`prefers-reduced-motion`** — reduced variant verified.
3. **Keyboard** — tab through, focus visible, no traps.
4. **Responsive** — verify at 375 / 768 / 1440.
5. **Console clean** — zero errors/warnings.
6. **Design-system** — no magic values, tokens imported.

Verify with Browser-pane tools (start dev via `.claude/launch.json`; never ask the user to check manually). State what passed/failed — never claim "verified" unrun.

## 11. Architecture & Anti-Obsolescence
- Server/Client boundary deliberate, documented at the boundary file.
- Dev-only routes (design-system editor, works builder) stripped from prod via `next.config.ts` webpack alias to `page.dummy.tsx` — keep new dev-only routes behind the same pattern.
- **No dead code** — remove unused files/exports/deps as you go; verify typecheck + build + live check before deleting anything ambiguous.
- Write code that reads like its surroundings — match naming, comment density, idioms.

Follow unconditionally to produce elite, award-winning digital experiences.

---

# 🛠️ Installed Skills & References
Local agent skills active for **Tech-Luxe Editorial** development:

**Creative & Animation**
- `neversight-learn-skills.dev-premium-frontend-design` — Awwwards-level interactive design, micro-interactions, custom WebGL/shaders.
- `dokhacgiakhoa-antigravity-ide-scroll-experience` — scroll-driven storytelling, Apple-style showcases, parallax sequencing.
- `aiskillstore-marketplace-gsap-animations` — ScrollTrigger orchestration, optimized timelines, high-fps transitions.

**3D & WebGL**
- `davila7-claude-code-templates-3d-web-experience` — interactive 3D with R3F/Three.js/WebGL.
- `calesthio-openmontage-threejs-shaders` — GLSL vertex/fragment shaders, uniforms, procedural effects.
- `calesthio-openmontage-threejs-lighting` — env maps, complex lighting, performant shadows.

**Framework Performance**
- `sickn33-antigravity-awesome-skills-nextjs-app-router-patterns` — routing, boundary hygiene, streaming, caching.
- `davila7-claude-code-templates-react-best-practices` — kill layout waterfalls, bundle optimization, performant hooks.

**Modern Web Standards**
- `modern-web-guidance` — native APIs (`:has()`, view transitions, scroll-driven animations) to avoid bloat. Search guides before building.

---

# 🏗️ Agent OS — Standards & Commands
Installed at `~/agent-os/` (base) and `agent-os/` (project).

Before implementing:
1. Check `agent-os/standards/index.yml` for relevant standards.
2. Inject via `@agent-os/standards/<path>`.
3. Extract new patterns via `@.claude/commands/agent-os/discover-standards.md`.
4. Load relevant standards via `@.claude/commands/agent-os/inject-standards.md`.

Commands (via `@` path): `discover-standards.md`, `inject-standards.md`, `index-standards.md`, `plan-product.md`, `shape-spec.md`.
