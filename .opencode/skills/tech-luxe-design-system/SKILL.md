---
name: tech-luxe-design-system
description: Use when implementing or reviewing UI components against the Tech-Luxe Editorial design system. Covers color tokens, typography hierarchy, spacing, and component primitives defined in PRD.md.
---

# Tech-Luxe Editorial Design System

## Color Tokens

Light mode: `--background: #F5F5F5`, `--foreground: #111111`, `--primary: #000000`, `--tech-blue: #0029FF`, `--border-neutral: rgba(0,0,0,0.08)`, `--surface: #FFFFFF`.

Dark mode: `--background: #0A0A0A`, `--foreground: #F5F5F5`, `--primary: #FFFFFF`, `--tech-blue: #0029FF`, `--border-neutral: rgba(255,255,255,0.1)`, `--surface: #111111`.

## Typography

- **Display** (headlines): Plus Jakarta Sans, 800 weight for hero, 700 for sections.
- **Body** (readable text): Inter, 300 weight.
- **Mono** (labels, metadata): JetBrains Mono, 400-500 weight, 9-12px, tracking 0.3-0.4em.

## Layout Rules

- 0px border radius on ALL components. No rounded corners anywhere.
- Hairline borders (`border-border-neutral`) instead of box shadows.
- Glassmorphism: `bg-surface/50 backdrop-blur-xl` for overlay panels.
- Corner marks (L-shaped brackets) on framed content.

## TechButton

- JetBrains Mono, 10px, 0.4em tracking, uppercase.
- 0px radius, 1px solid border.
- Hover: bg-foreground fills from bottom, text inverts.

## HUDLabel

- JetBrains Mono, 9px, 0.3em tracking, uppercase.
- Optional hairline underline.
- Opacity 60% default.

## Bad Patterns (Avoid)

- `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full` on buttons/cards.
- `shadow-*` on containers (use `border-border-neutral` instead).
- `font-sans` for headlines (use `font-display`: Plus Jakarta Sans).
- `font-display` for body text (use `font-sans`: Inter).
