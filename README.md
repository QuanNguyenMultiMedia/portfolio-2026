# Quan Nguyen — Portfolio 2026

A premium, hardware-accelerated 3D scroll-based portfolio and creative sandbox built following a **Tech-Luxe Editorial** design system. The system integrates cinematic architectural minimalism with precise technical details, monospace telemetry, and high-performance WebGL/CSS 3D perspective animations.

---

## 🛠️ Stack & Technologies

- **Framework:** Next.js (App Router, Turbopack, React Server Components)
- **Styling:** Tailwind CSS, custom CSS Grid systems, premium fonts (Plus Jakarta Sans, JetBrains Mono, Inter)
- **Animations:** Framer Motion (for physics-based scroll triggers, dynamic templates, 3D translations, and page transitions)
- **3D & WebGL:** CSS 3D Transforms (`preserve-3d`, dynamic camera perspective mapping) and Three.js / React Three Fiber for WebGL experiences
- **Layout & Routing:** Lenis Smooth Scroll, Page Wrapper isolation, hydration-safe Portal overlays

---

## 💎 Design System: "Tech-Luxe Editorial"

The design system marries warm, luxury architectural layouts (as seen in high-end print design) with precise technical HUD telemetry:
- **Palette:** Deep charcoal text (`#111111`) over neutral off-white background (`#F5F5F5`), accented sparingly with Tech Blue (`#0029FF`).
- **Typography:** Architectural headlines in **Plus Jakarta Sans**, clean metadata in **JetBrains Mono** with wide letter spacing, and readable content in **Inter**.
- **Geometries:** Razor-sharp 0px borders, precision coordinate markings, crosshair viewfinders, and thin hairline boundaries.

---

## 🎥 Core Features & Engineering Highlights

### 1. True 3D Scroll Storytelling (Homepage)
- **Unified 3D Coordinate Space:** All home page slides exist in a single Z-axis depth volume (up to `-6300px` deep). As the user scrolls, the parent coordinate space translates forward, simulating a continuous fly-through camera movement.
- **Cinematic Depth-of-Field:** Multi-layered scroll-linked blur (`filter: blur(...)`) and opacity hooks simulate a real camera lens focusing on elements as they enter the focus plane, and blurring/fading out as they zoom past the screen.
- **Responsive 3D Projections:** Dynamic scaling adjustments detect mobile (`<768px`) layout width, shifting 3D elements into clean vertical sequences while maintaining standard grid distribution on desktop.

### 2. Camera Lens Distortion
- **Dynamic 3D Perspective Warp (Focal Length Distortion):** The viewport container dynamically adjusts its CSS 3D `perspective` from `1400px` down to `950px` (or `1200px` to `850px` on mobile) on scroll. This replicates a physical wide-angle lens, stretching elements toward the screen edges.
- **Cinematic Lens Vignette & Focus Blur:** A full-screen fixed overlay combined with a sharp radial gradient mask (`radial-gradient(circle at center, transparent 45%, black 100%)`) ensures the center region remains perfectly legible, while applying a dynamic edge blur (`0px` to `6px`) and a dark vignette (`0` to `0.35` opacity) toward the corners on scroll.

### 3. Portal-Based Detail Panel Isolation
- **Container Isolation:** In the Freebies archive page, detail overlays use a custom, hydration-safe `<Portal>` component to render directly under `document.body`. This breaks the overlays out of parent containers containing `will-change: transform` or Lenis scroll intercepts, ensuring popovers lock strictly to the viewport height.
- **Pixel-Perfect Logo Masking:** Duplicate logos inside detail panel masks align pixel-for-pixel with the global layout header by falling back to identical layout coordinates and avoiding animation-induced coordinate offsets.

### 4. Viewport Cursor-Following Parallax
- **Smooth Cursor Tracking:** Implemented window-level mouse movement capture, normalizing the cursor coordinates relative to the center of the screen, and routing them through a Framer Motion `useSpring` physics engine (`damping: 30, stiffness: 80, mass: 1`) to achieve a high-end architectural drift lag.
- **3D Tilt & Slide Transform Mapping:** Maps smoothed mouse offsets to rotation and translation properties (`rotateX`/`rotateY` up to `±6deg` and `translateX`/`translateY` up to `±60px`) on the parent `preserve-3d` container. Because elements are spaced along the Z-depth volume, deeper elements naturally shift wider across screen coordinates, producing a correct 3D perspective parallax view.
- **Auto-Centering & Mobile Bypass:** Touch screen devices bypass tracking to preserve performance and avoid layout offsets. The 3D scene automatically centers itself when the cursor leaves the window viewport.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local development server:**
   ```bash
   npm run dev
   ```

3. **Build the production bundle:**
   ```bash
   npm run build
   ```
