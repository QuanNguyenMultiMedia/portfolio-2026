---
name: threejs-r3f-ogl
description: Use when working with Three.js, React Three Fiber, or OGL WebGL code. Covers shader patterns, performance budgets, and integration patterns used in the portfolio.
---

# Three.js / R3F / OGL Patterns

## React Three Fiber

- Use `@react-three/drei` helpers (`OrbitControls`, `Environment`, `ContactShadows`, `PerformanceMonitor`, `Suspense`).
- Always wrap `<Canvas>` in a `Suspense` boundary with a fallback.
- `PerformanceMonitor` for adaptive DPR (start at 1.0, incline to 1.5, decline to 1.0).
- GPU: `antialias: false`, `powerPreference: "high-performance"`, `alpha: true`.

## OGL Wave Gradient (GlobalSideBar)

- Full-screen shader on a `Triangle` mesh (no 3D geometry needed).
- Fragment shader: procedural noise-based grainient with 3-color blending.
- Uniforms: `iTime`, `iResolution`, `uColor1-3`, `uWarpStrength/Frequency/Speed`, `uGrainAmount`.
- Use `ResizeObserver` for responsive canvas sizing.
- Smooth color transitions via lerp (`0.08` factor) between target and current RGB values.
- DPR clamped to `Math.min(window.devicePixelRatio, 2)`.

## GeoJSON 3D Extrusion (Vietnam Forestation)

- `THREE.Shape` from GeoJSON polygon coordinates.
- `ExtrudeGeometry` with height from `feature.properties.height`.
- `MeshStandardMaterial`: white base color, roughness 0.1, metalness 0.8, blue emissive.
- NO `useFrame` object instantiation — pre-compute geometries in `useMemo`.

## Performance Budget

- DPR: `Math.min(window.devicePixelRatio, 2)` everywhere.
- Texture resolution: cap at 2048×2048 for remote textures, use WebP where possible.
- Geometry: prefer `BufferGeometry` over `Geometry` (removed in r125+).
- Draw calls: one mesh per extruded feature, not per face.
