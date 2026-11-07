"use client";
// Split-fountain plate (design.md §2 "Split fountain", §5).
// One shared OGL context renders every visible fountain into its own 2D canvas,
// at ~0.6x resolution and 24fps, paused offscreen and when the tab is hidden.
// The shader ports the 01.Title ink layers of MainTitle.aep (see FRAG header); the dither grid is screen-locked.
// mode="aurora" draws the far-backdrop light curtains instead (smooth, undithered, low contrast).

import { useEffect, useRef } from "react";

const FRAG = /* glsl */ `
// Port of the two ink layers of MainTitle.aep › 01.Title (2800×2443 comp):
//   "Shape Layer 12" (sky) under "Shape Layer 4" (green). Each is a 5-point Polystar (outer 1436, inner 718,
//   rot 120.28°, group offset −396,78) whose layer Rotation is keyed through 360° in 6.983 s. Shape layers are
//   continuously rasterised, so the effect stack runs in COMP space after the transform, on a comp-sized buffer:
//   Gaussian Blur 189.4 → Wave Warp (semicircle, h 518, w 230.7) → Gaussian Blur 189.4 → Colorama (−43°)
//   → Gaussian Blur 189.4 → Glasswork (45°, size 238, disp 10/88) → CC Radial Blur (zoom 153, centre 1464,2428.5)
//   → AGP RetroDither (palette 3, 14 levels, downscale 4). The teeth stay screen-locked while the star turns under them.
// Axis conventions, wave scale and coverage were fitted against the green layer soloed in AE at 0–6 s (IoU 0.93);
// the Colorama ramps are the RetroDither palette entries measured from the same renders.
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLean;
uniform float uCell;
uniform float uDark;
uniform float uMode;   // 0 = split-fountain wash (the AE port below), 1 = aurora backdrop
varying vec2 vUv;

const float PI = 3.14159265;
const float LOOP = 6.98333;                      // rotation keys 0 → 6.983 s, 360°
const vec2 COMP = vec2(2800.0, 2443.0);
const vec2 RB_C = vec2(1464.0, 2428.485);        // CC Radial Blur centre (comp px)

// AE Polystar (star) in shape space; angle 0 puts the first point down
float sdStar(vec2 p, float rot){
  p -= vec2(-396.0, 78.0);
  float an = PI / 5.0;
  float a = atan(p.x, -p.y) - radians(rot + 180.0);
  float bn = mod(a, 2.0 * an) - an;
  vec2 q = length(p) * vec2(cos(bn), abs(sin(bn)));
  vec2 A = vec2(1435.89, 0.0);
  vec2 B = 717.94 * vec2(cos(an), sin(an));
  vec2 e = B - A, w = q - A;
  vec2 d = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
  return length(d) * -sign(e.x * w.y - e.y * w.x);
}

// comp px → shape space (inverse of position · rotation · scale, anchor 0,0)
vec2 toShape(vec2 p, vec2 pos, vec2 scl, float rotDeg){
  float r = radians(-rotDeg);
  return mat2(cos(r), sin(r), -sin(r), cos(r)) * (p - pos) / scl;
}

// AE Wave Warp, semicircle, comp px: travels along dir (0° up, clockwise), displaces across it.
// Fitted: period = 2 × Wave Width, swing = 1.2 × Wave Height. Pinning "all edges" eases it to zero at the buffer edge.
vec2 waveWarp(vec2 p, float dirDeg, bool pin){
  float r = radians(dirDeg);
  vec2 dir = vec2(sin(r), -cos(r));
  vec2 perp = vec2(-dir.y, dir.x);
  float x = fract(dot(p, dir) / (230.7 * 2.0));
  float semi = sqrt(max(0.0, 1.0 - (2.0 * x - 1.0) * (2.0 * x - 1.0)));
  float k = 1.0;
  if (pin) { vec2 e = min(p, COMP - p); k = smoothstep(0.0, 700.0, min(e.x, e.y)); }
  return p + perp * (semi - 0.5) * 518.0 * 1.2 * k;
}

vec3 rampGreen(float I){
  vec3 g0 = vec3(0.039,0.157,0.039), g1 = vec3(0.039,0.353,0.157), g2 = vec3(0.039,0.549,0.275);
  vec3 g3 = vec3(0.039,0.667,0.392), g4 = vec3(0.157,0.784,0.549), g5 = vec3(0.314,0.824,0.667);
  if (I < 0.2) return mix(g0, g1, I / 0.2);
  if (I < 0.35) return mix(g1, g2, (I - 0.2) / 0.15);
  if (I < 0.5) return mix(g2, g3, (I - 0.35) / 0.15);
  if (I < 0.7) return mix(g3, g4, (I - 0.5) / 0.2);
  return mix(g4, g5, min(1.0, (I - 0.7) / 0.2));
}
vec3 rampSky(float I){
  vec3 b0 = vec3(0.078,0.431,0.510), b1 = vec3(0.078,0.667,0.824), b2 = vec3(0.157,0.784,0.941);
  vec3 b3 = vec3(0.353,0.824,0.980), b4 = vec3(0.510,0.863,0.980);
  if (I < 0.25) return mix(b0, b1, I / 0.25);
  if (I < 0.45) return mix(b1, b2, (I - 0.25) / 0.2);
  if (I < 0.65) return mix(b2, b3, (I - 0.45) / 0.2);
  return mix(b3, b4, min(1.0, (I - 0.65) / 0.2));
}

// one ink layer at a comp pixel, before the radial blur: premultiplied colour + alpha
vec4 ink(vec2 p, vec2 pos, vec2 scl, float rotDeg, float dirDeg, bool green){
  // Glasswork: 45° ribs, 238 px, displacement 10 / 88
  p += vec2(10.0, 88.0) * 0.5 * sin(dot(p, vec2(0.7071, 0.7071)) * 2.0 * PI / 238.0);
  vec2 wp = waveWarp(p, dirDeg, !green);
  // star clipped to the comp-sized layer buffer, both in comp px
  float d = sdStar(toShape(wp, pos, scl, rotDeg), 120.279) * 0.5 * (scl.x + scl.y);
  vec2 bq = abs(wp - COMP * 0.5) - COMP * 0.5;
  d = max(d, length(max(bq, 0.0)) + min(max(bq.x, bq.y), 0.0));
  float I = 1.0 - smoothstep(-280.0, 280.0, d);   // three 189.4 blurs
  vec3 c = green ? rampGreen(I) : rampSky(I);
  float a = I; // Colorama "Modify Alpha" off: the blurred alpha passes through
  return vec4(c * a, a);
}

// CC Radial Blur, zoom 153: average along the ray toward the centre
vec4 layer(vec2 p, vec2 pos, vec2 scl, float rotDeg, float dirDeg, bool green){
  vec4 acc = vec4(0.0);
  for (int k = 0; k < 12; k++) {
    float z = 1.06 - float(k) * 0.011; // centred on the source so the streaks do not shift the edge
    acc += ink(RB_C + (p - RB_C) * z, pos, scl, rotDeg, dirDeg, green);
  }
  return acc / 12.0;
}

float bayer4(vec2 c){
  int x = int(mod(c.x, 4.0)); int y = int(mod(c.y, 4.0));
  int i = x + y * 4;
  float m[16];
  m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;
  m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
  for (int k = 0; k < 16; k++) { if (k == i) return (m[k] + 0.5) / 16.0; }
  return 0.5;
}

// Aurora mode: three slow light curtains in the same two ink ramps, smooth (no dither, no cell grid), low
// contrast. Far backdrop only: it never carries meaning, so it sits at most ~30% over the paper.
float hash(float n){ return fract(sin(n) * 43758.5453); }
float noise1(float x){ float i = floor(x), f = fract(x); return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f)); }
vec3 aurora(vec2 uv){
  float t = uTime * 0.25;
  vec3 paper = vec3(1.0 - uDark);
  vec3 col = paper;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    // curtain spine: drifts sideways, folds with height
    float cx = 0.22 + 0.28 * fi + 0.07 * sin(uv.y * 2.6 + t * (0.6 + 0.2 * fi) + fi * 2.1) + uLean.x * 0.15;
    float w = 0.10 + 0.04 * sin(t * 0.4 + fi);
    float body = exp(-pow((uv.x - cx) / w, 2.0));
    // vertical rays: noise across x, stretched along y, slowly sliding
    float rays = 0.55 + 0.45 * noise1(uv.x * 38.0 + fi * 11.0 + t * 0.8);
    // bright lower hem fading upward, like a real curtain
    float hem = smoothstep(0.05, 0.35, uv.y) * (1.0 - smoothstep(0.35, 0.95, uv.y));
    float I = clamp(body * rays * hem, 0.0, 1.0);
    vec3 ink = mod(fi, 2.0) < 0.5 ? rampGreen(0.35 + 0.5 * I) : rampSky(0.3 + 0.5 * I);
    col = mix(col, ink, I * (0.30 - 0.06 * fi));
  }
  return col;
}

void main(){
  if (uMode > 0.5) { vec2 auv = vUv; gl_FragColor = vec4(aurora(auv), 1.0); return; }
  vec2 cell = floor(vUv * uRes / uCell);
  vec2 uv = (cell + 0.5) * uCell / uRes;
  uv.y = 1.0 - uv.y;

  // cover-fit the board's ink rect (comp 153,161 → 2646,2307) to the canvas
  vec2 rect0 = vec2(153.0, 161.0), rectS = vec2(2493.0, 2146.0);
  float va = uRes.x / uRes.y, ra = rectS.x / rectS.y;
  vec2 span = va > ra ? vec2(rectS.x, rectS.x / va) : vec2(rectS.y * va, rectS.y);
  vec2 comp = rect0 + (rectS - span) * 0.5 + uv * span - uLean * 120.0;

  float t = mod(uTime, LOOP) / LOOP * 360.0;
  vec4 sky = layer(comp, vec2(1822.915, 1026.289), vec2(3.101, 1.588), -3.6596 + t, -133.0, false);
  vec4 grn = layer(comp, vec2(2085.939, 1890.875), vec2(2.824, 1.860), 153.5288 - t, -200.0, true);

  // RetroDither: ordered threshold on alpha (14 levels) and colour (palette step 10/255)
  float th = bayer4(cell) - 0.5;
  vec3 skyC = sky.rgb / max(sky.a, 1e-3), grnC = grn.rgb / max(grn.a, 1e-3);
  float sa = clamp(floor(sky.a * 13.0 + 0.5 + th) / 13.0, 0.0, 1.0);
  float ga = clamp(floor(grn.a * 13.0 + 0.5 + th) / 13.0, 0.0, 1.0);

  vec3 col = vec3(1.0 - uDark); // paper: white multiplies onto light stock, black screens onto dark
  col = mix(col, skyC, sa);
  col = mix(col, grnC, ga);
  col = clamp(floor(col * 25.5 + 0.5 + th) / 25.5, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = /* glsl */ `
attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

// masks: the [data-clip] elements whose text clips the plate (the shader prints only inside their glyphs).
// size is the canvas's layout box (CSS px, from a ResizeObserver), so the loop never reads layout; mask is the
// glyph cut, built once per output size and font load, then stamped every frame.
type Slot = {
  canvas: HTMLCanvasElement; visible: boolean; lean: [number, number]; target: [number, number];
  clip: boolean; masks: HTMLElement[]; size: [number, number];
  mask: HTMLCanvasElement | null; maskKey: string; sheet: HTMLElement | null; tick: number; faded: boolean;
  mode: "wash" | "aurora";
};

// Cut the plate to each mask element's glyphs, at the output resolution, set in its own computed font.
// Works in the canvas's local CSS px, so a sheet scaled by the camera's perspective still lines up;
// baseline per CSS: half-leading above the font's ascent inside the line box. One line per element.
// Returns null when nothing could be cut; the caller then blanks the plate rather than print it uncut.
function buildMask(canvas: HTMLCanvasElement, els: HTMLElement[], cw: number, ch: number): HTMLCanvasElement | null {
  if (!canvas.offsetWidth || !canvas.offsetHeight || !els.some((el) => el.isConnected && el.textContent)) return null;
  const cr = canvas.getBoundingClientRect();
  const proj = cr.width / Math.max(1, canvas.offsetWidth); // on-screen scale from 3D transforms
  const layer = document.createElement("canvas");
  layer.width = cw; layer.height = ch;
  const lx = layer.getContext("2d");
  if (!lx) return null;
  lx.setTransform(cw / canvas.offsetWidth, 0, 0, ch / canvas.offsetHeight, 0, 0);
  for (const el of els) {
    const cs = getComputedStyle(el);
    lx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    lx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
    lx.textBaseline = "alphabetic";
    lx.fillStyle = "#000";
    const m = lx.measureText("Hg");
    const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);
    const r = el.getBoundingClientRect();
    const x = (r.left - cr.left) / proj;
    const top = (r.top - cr.top) / proj + (r.height / proj - lineH) / 2;
    lx.fillText(el.textContent ?? "", x, top + (lineH - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent);
  }
  return layer;
}

// --- shared renderer (module scope: one context for the page) ---
const SETTLE = 0.16; // resting speed vs the AE loop: one turn in ~44 s, inside design.md's 40–90 s drift
const TAU = 5; // s: how long the entrance takes to settle
const FADE_CHECK = 12; // frames between computed-opacity reads (~0.5 s at 24fps): never a style flush per frame
const slots = new Set<Slot>();
let started = false;
let still = false;

async function start() {
  if (started) return;
  started = true;
  const { Renderer, Program, Mesh, Triangle } = await import("ogl");
  const renderer = new Renderer({ dpr: 1, alpha: false, antialias: false, preserveDrawingBuffer: true });
  const gl = renderer.gl;
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: { uRes: { value: [1, 1] }, uTime: { value: 0 }, uLean: { value: [0, 0] }, uCell: { value: 4 }, uDark: { value: 0 }, uMode: { value: 0 } },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let last = 0;
  const t0 = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || now - last < 1000 / 24) return;
    last = now;
    // settle-in: the ink enters at the AE speed, then eases down to a slow drift (speed 1 → SETTLE, time constant TAU)
    const el = (now - t0) / 1000;
    const time = still ? 0 : SETTLE * el + (1 - SETTLE) * TAU * (1 - Math.exp(-el / TAU));
    program.uniforms.uDark.value = document.documentElement.classList.contains("dark") ? 1 : 0;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const scale = dpr * 0.6;
    for (const s of slots) {
      if (!s.visible || !s.size[0] || !s.size[1]) continue;
      // a sheet the print run has taken off the press (an attribute: no style flush to read it)
      if (s.sheet && s.sheet.hasAttribute("data-off")) continue;
      const host = s.canvas.parentElement;
      // a plate faded fully out (page plate off this spread) costs nothing; sampled, not read every frame
      if (!still && host && s.tick++ % FADE_CHECK === 0) s.faded = getComputedStyle(host).opacity === "0";
      if (!still && s.faded) continue;
      s.lean[0] += (s.target[0] - s.lean[0]) * 0.06;
      s.lean[1] += (s.target[1] - s.lean[1]) * 0.06;
      const [rw, rh] = s.size;
      const w = Math.max(2, Math.round(Math.min(rw * scale, 1100)));
      const h = Math.max(2, Math.round(Math.min(rh * scale, 1100 * (rh / Math.max(rw, 1)))));
      // a text-clipped plate keeps the shader's coarse dither but cuts the glyph edges at device resolution
      const out = s.clip ? dpr / scale : 1;
      const cw = Math.round(w * out), ch = Math.round(h * out);
      if (s.canvas.width !== cw || s.canvas.height !== ch) { s.canvas.width = cw; s.canvas.height = ch; }
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [w, h];
      program.uniforms.uTime.value = time;
      program.uniforms.uLean.value = s.lean;
      program.uniforms.uCell.value = Math.max(1, Math.round(4 * scale));
      program.uniforms.uMode.value = s.mode === "aurora" ? 1 : 0;
      renderer.render({ scene: mesh });
      const ctx = s.canvas.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "copy";
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(gl.canvas, 0, 0, w, h, 0, 0, cw, ch);
        if (s.clip) {
          if (!s.masks.some((m) => m.isConnected)) { s.masks = host ? Array.from(host.querySelectorAll<HTMLElement>("[data-clip]")) : []; s.mask = null; }
          const key = `${cw}x${ch}`;
          if (!s.mask || s.maskKey !== key) { s.mask = buildMask(s.canvas, s.masks, cw, ch); s.maskKey = key; }
          if (!s.mask) {
            // could not cut the glyphs this frame: print nothing, and let the DOM text carry the name
            ctx.clearRect(0, 0, cw, ch);
            if (host) { delete host.dataset.live; host.dataset.fallback = ""; }
            continue;
          }
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(s.mask, 0, 0);
        }
        ctx.globalCompositeOperation = "source-over";
      }
      if (host && !host.dataset.live) host.dataset.live = ""; // first frame is up: CSS may now lean on it
    }
    if (still) { cancelAnimationFrame(raf); started = false; }
  };
  let raf = requestAnimationFrame(frame);
}

export default function Fountain({ className = "", children, clipText = false, mode = "wash" }: { className?: string; children?: React.ReactNode; clipText?: boolean; mode?: "wash" | "aurora" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const slot: Slot = {
      canvas, visible: false, lean: [0, 0], target: [0, 0], clip: clipText,
      masks: clipText ? Array.from(canvas.parentElement?.querySelectorAll<HTMLElement>("[data-clip]") ?? []) : [],
      size: [0, 0], mask: null, maskKey: "", sheet: canvas.closest<HTMLElement>(".sheet"), tick: 0, faded: false, mode,
    };
    slots.add(slot);
    // layout size (unaffected by the camera's transforms); a new size or a font swap re-cuts the glyph mask
    const ro = new ResizeObserver(([e]) => { slot.size = [e.contentRect.width, e.contentRect.height]; slot.mask = null; });
    ro.observe(canvas);
    const onFonts = () => { slot.mask = null; };
    document.fonts?.addEventListener("loadingdone", onFonts);
    const io = new IntersectionObserver(([e]) => {
      slot.visible = e.isIntersecting;
      if (slot.visible) start();
    }, { rootMargin: "200px" });
    io.observe(canvas);
    // no first frame in time (WebGL unavailable): let the DOM text carry the name
    const host = canvas.parentElement;
    const fallback = clipText ? window.setTimeout(() => { if (host && !host.dataset.live) host.dataset.fallback = ""; }, 2500) : 0;
    const onMove = (e: PointerEvent) => {
      // lean 3–5% toward the pointer, on a spring (applied in the shared loop)
      slot.target = [(e.clientX / window.innerWidth - 0.5) * 0.35, (e.clientY / window.innerHeight - 0.5) * 0.35];
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.clearTimeout(fallback); io.disconnect(); ro.disconnect(); document.fonts?.removeEventListener("loadingdone", onFonts); slots.delete(slot); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div className={`fountain ${className}`}>
      <canvas ref={ref} aria-hidden />
      {children ? <div className="fountain-content">{children}</div> : null}
    </div>
  );
}
