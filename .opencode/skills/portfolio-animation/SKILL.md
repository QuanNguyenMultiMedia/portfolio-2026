---
name: portfolio-animation
description: Use when implementing scroll-driven animations, Framer Motion transforms, or GSAP timelines. Covers the easing curves, spring physics, and performance patterns used in the portfolio.
---

# Portfolio Animation Patterns

## Signature Easing Curve

Use `[0.23, 1, 0.32, 1]` (custom cubic-bezier) for all entrance, exit, and state transitions. This is the tech-luxe signature curve — snappy entrance, subtle overshoot.

## Spring Physics

- Cursor parallax: `{ damping: 30, stiffness: 80, mass: 1 }`
- Sine carousel drag: `{ damping: 30, stiffness: 200 }`
- Contact card tilt: `{ damping: 40, stiffness: 250, mass: 0.5 }`
- Pivot origin: `{ damping: 30, stiffness: 40, mass: 1 }`
- Custom spring `handleDialEnd` snap: `cubic-bezier(0.19, 1, 0.22, 1)`

## Scroll-Triggered Transforms

Use `useTransform(scrollProgress, inputRange, outputRange)` for camera Z-mapping. Never use scroll event listeners directly — always route through Lenis via `lenis.on("scroll", handler)` and store in a `useMotionValue`.

### Z-Axis Depth Mapping (Homepage)

```
0%   → Z=0      (Hero)
15%  → Z=1800   (Manifesto)
35%  → Z=3300   (Capabilities)
55%  → Z=4800   (Testimonials)
90%  → Z=6300   (Stats, holds)
```

### Frame Opacity/Blur Curves

Each frame uses `useTransform(zWorld, fadeInRange, focusRange, fadeOutRange, ...)` with `blur()` filter. Focus range is where the frame is fully visible. Fade in/out use 8px → 0px → 12px blur.

## Performance Rules

- Use `will-change-transform` on all GPU-animated elements.
- Direct DOM mutation (via `element.style.transform`) when FPS must exceed React render cycle.
- Never animate `width`, `height`, `top`, `left` — only `transform`, `opacity`, `filter`.
- Rate-limit audio generation (max 60 ticks/sec).
- `AnimatePresence mode="wait"` for sequential transitions.
