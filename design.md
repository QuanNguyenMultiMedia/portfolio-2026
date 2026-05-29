# Design System: Tech-Luxe Editorial

## Overview
A "Tech-Luxe" aesthetic: the intersection of high-end architectural minimalism and sharp, technical precision. We maintain the warm, minimalist luxury of a studio brochure but inject a modern, "hacker-craft" edge through hairline borders, monospace metadata, and razor-sharp geometries.

The interface feels like a premium technical manual or a luxury automotive configurator—refined, quiet, but unmistakably powered by high-fidelity engineering.

## Colors
- **Primary Background**: `#F5F5F5` (Neutral Off-white). A clean, timeless canvas that feels precise and airy.
- **Primary Text**: `#111111` (Deep Charcoal). High contrast for readability and editorial weight.
- **Accent**: `#0029FF` (Tech Blue). Used sparingly for data-readouts and interactive feedback.
- **Borders/Lines**: `rgba(0, 0, 0, 0.08)`. Hairline thickness (0.5px - 1px) to define space without clutter.

## Typography
- **Headlines**: **Plus Jakarta Sans**. A modern, architectural sans-serif that fits the tech-luxe aesthetic. Used in bold and extra-bold weights.
- **Body**: **Inter**. A neutral, high-performance sans-serif for clarity.
- **Metadata/Tech Data**: **JetBrains Mono** or **Geist Mono**. Used for coordinates, project years, technical specs, and HUD elements. Small size (10-12px) with increased tracking.
- **Labels**: Uppercase Plus Jakarta Sans, bold, with 1px hairline underlines.

## Components
- **Buttons**: Razor-sharp **0px corner radius**. 1px black borders. High-contrast hover states (invert colors).
- **Cards/Containers**: Defined by hairline borders rather than backgrounds. No shadows. Sharp corners. Use subtle "corner marks" (L-shaped hairlines) to frame 3D assets.
- **HUD Elements**: Floating technical labels (e.g., `[SYS_ACTIVE]`, `COORD_X: 42.1`) in monospace to give the 3D scenes a "monitored" feel.

## Visual Language: "The Grid"
- **Micro-Grids**: Subtle dot-matrix or 10px hairline grids appearing in the background of 3D scenes.
- **Technical Overlays**: Use coordinates and "data-readouts" near interactive elements to reinforce the "Orchestration" theme.
- **Glassmorphism 2.0**: High-blur, low-opacity surfaces with 1px solid white/black top-borders to create "edge-lighting" on technical panels.

## Do's and Don'ts
- **Do**: Use 0px radii for a "sharp" precision-engineered feel.
- **Don't**: Use rounded corners or soft shadows that "date" the interface to the 2010s.
- **Do**: Mix neutral off-white with razor-thin black lines and monospace accents.
- **Don't**: Overuse the blue accent; it should be a "glint" of tech, not a theme color.
- **Do**: Frame 3D content with technical "viewfinder" markings.
- **Don't**: Let the tech elements clutter the editorial whitespace; they should be "whisper-quiet".
- **Do**: Use GSAP for "mechanical" transitions—snappy, precise, and calculated.
- **Don't**: Use "bouncy" or playful easing functions.
- **Do**: Centralize layout spacing, typography, and motion variants in a shared config file (`src/lib/designSystem.ts`) to avoid bloated inline class redundancy.
- **Don't**: Apply horizontal translation and scale zoom animations to parent page containers (`PageWrapper.tsx`) if child elements are already sliding stagger-in. This causes opposing animation forces that look unrefined.
- **Don't**: Include ornamental labels or purely cosmetic, non-functional text elements (such as fake mock titles or decoration-only text markings like "MQ_RADIAL") that serve no informational or routing purpose. Every piece of copy must correspond to real context or functional state.

## Learned Lessons & Development Best Practices

### 1. Motion & Transition Cohesion
- **Staggered Item Entries**: Standard default pages should load statically in terms of position and scale (simply fading in and unblurring) while the inner elements slide horizontally from the right with a staggered delay. This draws the user's eye sequentially.
- **TypeScript Tuple Easing**: Framer Motion's `transition.ease` expects an explicit `[number, number, number, number]` tuple for custom cubic-bezier curves. Always type or cast easing arrays as a tuple to avoid compilation errors due to compiler array inference (`number[]`).

### 2. High-Performance Interactions
- **Bypass React Reconciliation**: For 120 FPS interactions (e.g., dial scroll wheels, drag sliders), directly mutate DOM styles (`element.style.transform`) using refs. Only trigger React state updates for visible text/metadata changes when the interaction settles.
- **Audio Context Recycling**: Eagerly instantiate a single global `AudioContext` on mount instead of instantiating on every click or tick. This avoids browser audio queue bottlenecks.

### 3. Layout Stacking & Portals
- **Preserve-3D Stacking Contexts**: Elements with `will-change: transform` or `transform-style: preserve-3d` spawn new stacking contexts, trapping elements. Use a custom `<Portal>` component to render details panels, drawer overlays, or modals under `document.body` to preserve correct layout positions.
- **Isolate Entrance Animations**: When using shared layout animations (`layoutId`), wrap the shared component inside a plain motion container that handles mount entrance fades/slides. This separates initial page load animation from the shared layout interpolation.
