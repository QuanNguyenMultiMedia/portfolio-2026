# Portfolio 2026: Refactor & Art-Direction Plan

Status: proposal · 2026-10-21 · baseline: `master` @ 07fbdfc

## 1. Where it stands

The home page (`src/app/page.tsx`, 844 lines, one `"use client"` component) is a 600vh sticky stage. A
CSS-3D "camera" flies through five frames along Z: hero, manifesto, showreel, testimonials/globe,
stats. Why it reads as dated:

- **The camera move is the only idea.** Every frame arrives the same way: it fades up out of depth
  and fades back. There's no change of scale, layout or material between beats, so the five frames
  feel like slides on a dolly.
- **HUD styling is overused.** `EYE_DETECTION // SYS_ZOOM_500%`, `ENC: H.264 // FPS: 60.0`, corner
  brackets, `animate-pulse`. This was the 2022–24 "tech-luxe" look and is now generic.
- **The content is a CV.** The stats card (50+ / 100% / 04+ / HCMC) and the brand-name grid are the
  weakest frame, and the scroll ends on them. No work is shown on the home page.
- **The showreel is a framed widget mid-scroll** instead of the centrepiece.

Technical debt in that file and around it:

| Issue | Where |
|---|---|
| Whole page is client-rendered; no RSC, no streaming | `page.tsx:1` |
| Five hand-written opacity curves that recompute `getDepths()` every frame | `page.tsx:201-256` |
| `useState` `activeFrame` re-renders 800 lines of JSX on each frame change | `page.tsx:161` |
| Two breakpoint systems (`isMobile` resize listener + `useScreenSize`) | `page.tsx:63,99` |
| Lenis reached through `window.lenis` and polled with rAF | `page.tsx:75` |
| Animates `width`/`left` (progress bar, image reveal), which breaks §3 | `page.tsx:307,559` |
| StarField is DOM-based and parallaxed from React motion values | `StarField.tsx` |
| Hand-built video player (≈200 lines) inline in the page | `page.tsx:285-746` |
| Hard-coded copy, brands and the Mux ID in JSX | `page.tsx:32,608,667` |
| No reduced-motion variant for the Z-fly | whole page |
| Four nav components (Navbar, MobileNavbar, MobileTopBar, GlobalSideBar) ≈ 800 lines | `components/` |
| 1100-line `ProjectPageClient`, 816-line `works/page`, 699-line `contacts/page` | `app/` |
| Dev-only routes are stripped by a **webpack** alias; Next 16 builds with Turbopack, so they probably ship to prod (needs a check) | `next.config.ts:35` |
| Tokens are Tailwind class strings with arbitrary `text-[…]` per breakpoint, not fluid `@theme` tokens | `designSystem.ts` |
| Repo clutter: `out/`, `test-results/`, `dev-server.ps1`, `start-server.ps1`, `tsconfig.tsbuildinfo`, three agent-rule files | root |

## 2. Art direction: "Studio Reel"

> **Superseded for visual language (2026-11-05):** colour, type, texture and layout now come from
> [design.md](design.md) ("Riso Run", a simulated risograph print system extracted from the AE portfolio). That means a light paper ground, not dark,
> and the dark-only decision in §6 is reversed. The beat structure below still holds; the "Colour", "Type" and
> "Texture" bullets are replaced by design.md.

One idea: **the site is a cut, not a slideshow.** Treat the home page like an edited title
sequence. Each beat uses a different editorial device, and the cuts between beats are the motion
signature.

- **Type.** Drop Plus Jakarta + Inter for one expressive variable display face with a wide axis
  range (weight + width, e.g. a grotesk with `wdth`), plus a quiet mono. Scroll drives the variable
  axes (`font-variation-settings`) instead of fades. Headlines are set at `clamp()` scale, tight
  leading, mixed case. Retire the all-caps everywhere.
- **Colour.** Keep the `#0a0a0a` ground and the tech-blue, but use the blue as **light**: as a
  shader-driven glow or grade that bleeds from the reel, not as borders.
- **Texture.** A single WebGL layer (OGL, already a dependency) behind everything: film grain,
  subtle chromatic split on cuts, and a displacement that follows the cursor. This replaces
  StarField, the HUD brackets and the pulsing corners.
- **Kill list.** `//`-style system labels, corner brackets, pulse, grayscale-on-hover portraits,
  stat cards, the boxed brand grid.

### New home sequence (same story, rebuilt)

1. **Cold open.** The name is set huge and cut by the reel: the first frames of the showreel play
   *inside the letterforms* (video as text mask), then the mask scales out to full-bleed. The intro
   doubles as the loading screen, so the current spinner disappears.
2. **Reel.** Full-bleed, edge-to-edge, sound-off autoplay. It scrubs on scroll for ~1 viewport,
   then hands control to a minimal player (one button, one progress line).
3. **Manifesto.** One sentence, kinetic. Words resolve as the scroll reaches them (SplitText +
   variable weight), with the eye crop as a cut-in insert shot rather than a sliding box.
4. **Signal.** Testimonials only, as one quiet typographic beat. The globe is cut. Client names are
   drawn from the quote data rather than shown as a grid.
5. **Outro/CTA.** A big mailto line and availability status. This replaces the stats card; the one
   number worth keeping goes into the outro copy.

The home page keeps its current scope: no selected-work section is added. Work stays on `/works`.

**Reduced motion:** the same five beats as a normal vertical editorial page with static poster frames
and cross-fades. It's built from the same section components, not a separate page.

## 3. Tech stack moves

| Area | Now | Move to | Why |
|---|---|---|---|
| Scroll engine | Framer `useScroll` + 5 manual curves + CSS 3D | **GSAP ScrollTrigger timelines** (one per section, `scrub`) driven by **Lenis**, registered once; plus **native CSS scroll-driven animations** (`animation-timeline: view()`) for simple reveals | Timelines are declarative and seekable, and nothing goes through React state. CSS covers small reveals with zero JS |
| Page transitions | `PageWrapper` + AnimatePresence | **View Transitions API** (Next 16 `experimental.viewTransition` / React `<ViewTransition>`) for shared-element thumbnail → hero | Native, no layout jump, and it's what juries look for now |
| Text motion | `VerticalCutReveal` (224 lines) | **GSAP SplitText** (free since 3.13) | One maintained primitive |
| Background | DOM StarField + OGL WaveGradientBar | **One OGL full-screen pass** (grain + glow + cursor displacement), paused offscreen | One GPU context, cheap on a 3050 Ti, and replaces two components |
| Video | Custom player in `page.tsx` + MuxPlayerWrapper | `components/reel/` with `<mux-video>` + a small controls component; poster via `next/image` | Separates concerns and keeps LCP on the poster |
| Rendering | Entire home is client | **RSC page** that composes server sections and loads only client islands (`ReelStage`, `WorkRail`, `Signal`) | Smaller JS, faster LCP/TBT |
| Content | Hard-coded in JSX + `src/data/*.ts` | All copy in `src/content/` typed modules (or MDX for takes/works) | One place to edit, and testable |
| Tokens | Class-string maps with per-breakpoint arbitrary sizes | **Tailwind v4 `@theme`** CSS vars: fluid `clamp()` type scale, spacing, easings as `--ease-*`; `designSystem.ts` becomes a thin typed re-export | Removes ~40 arbitrary values per role and the 3xl/4xl ladders |
| Breakpoints | `useScreenSize`, `isMobile`, 3xl/4xl variants | CSS container queries + `gsap.matchMedia()` | No resize listeners in React |
| Nav | 4 components | One `SiteNav` with responsive layout + one `ThemeToggle` | ≈800 → ≈250 lines |
| Dev routes | webpack alias | Route segment guarded by `process.env.NODE_ENV` + `notFound()`, or move under `src/app/(dev)/` excluded via `pageExtensions` | Works under Turbopack |
| Deps | — | Remove `@chenglou/pretext` / `@mux/mux-video` if unused after the move (verify); add nothing heavy | Bundle discipline |

The plan deliberately leaves out R3F/Three. Nothing in the direction needs a scene graph, and OGL
covers the shader layer.

## 4. Target structure

```
src/
  app/
    (site)/            layout.tsx · page.tsx (RSC) · works/ · takes/ · play/ · freebies/ · contacts/
    (dev)/             design-system/ · works/builder/   ← blocked in prod
  content/             home.ts · projects.ts · testimonials.ts · takes.ts · …
  components/
    shell/             SiteNav · ThemeToggle · Cursor · GrainCanvas(OGL) · Intro
    motion/            useScrollTimeline · SplitReveal · ViewTransitionLink · reduced-motion helpers
    reel/              ReelStage · ReelControls
    home/              ColdOpen · Manifesto · Signal · Outro
    work/              ProjectHero · ProjectBlocks (split from ProjectPageClient)
  styles/              theme.css (@theme tokens) · globals.css
  lib/                 designSystem.ts (typed token re-export) · lenis.ts · gsap.ts (single registration)
```

## 5. Phases

Each phase ships on its own branch and passes the §10 review gate before merge.

| # | Phase | Scope | Exit check |
|---|---|---|---|
| 0 | **Baseline & cleanup** | Lighthouse + bundle report on current `master`; delete `out/`, `test-results/`, stray `.ps1`/`.html`/`.png`, `tsbuildinfo`; commit the pending `docs/` move; verify whether the dev routes ship in prod and fix the guard | Numbers recorded in `docs/baseline.md`; prod build has no `/design-system` |
| 1 | **Foundations** | Dark-only (drop `next-themes` + light palette), remove `cobe`; `@theme` tokens (fluid type, easings, colour), new font pair via `next/font`, `lib/gsap.ts` + `lib/lenis.ts` (single instance, context-provided), reduced-motion helpers, View Transitions on | Design-system visualizer regenerated from the new tokens in the same commit |
| 2 | **Shell** | `SiteNav` replaces the 4 nav components; `GrainCanvas` replaces StarField + WaveGradientBar; `Intro` replaces LoadingScreen | Keyboard + focus pass; one WebGL context |
| 3 | **Home rebuild** | RSC page + five sections from §2; content moved to `content/home.ts`; old `page.tsx`, `VerticalCutReveal`, `ClientSignal` and `StarField` deleted | LCP < 2.5s mobile, reduced-motion variant reviewed, 375/768/1440 |
| 4 | **Work & detail pages** | Split `ProjectPageClient` (1127 lines) and `works/page` (816 lines) into `components/work/*`; thumbnail → hero View Transition | No file > 300 lines in `app/` |
| 5 | **Secondary routes** | takes / play / freebies / contacts restyled on the new tokens; contacts split up | Zero magic values (grep for `text-[`, `#`) |
| 6 | **Hardening** | Playwright visual + reduced-motion snapshots, vitest on content shapes, Lighthouse CI budget, dep prune | Full §10 gate green; report vs Phase 0 baseline |

Phases 2 and 4/5 can run in parallel once Phase 1 lands. Phase 3 depends on 1 and 2.

## 6. Decisions (settled 2026-10-21)

1. **Display typeface:** a free Google Fonts variable grotesk with `wght` + `wdth` axes, loaded via
   `next/font`. Final face picked in Phase 1 from a type specimen.
2. **Selected work on home:** none. The home page keeps its current scope.
3. **Globe:** cut. Remove `Globe.tsx` and the `cobe` dependency.
4. **Theme:** dark-only. Remove `next-themes`, `ThemeProvider`, the theme toggle, the light palette
   and the `theme-detector` script.
5. **Copy:** Claude drafts the manifesto, signal intro and outro in the §9 voice for the owner to edit.
