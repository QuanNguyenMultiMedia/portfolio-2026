"use client";
// Split-fountain plate (design.md §2 "Split fountain", §5).
// One shared OGL context renders every visible fountain into its own 2D canvas,
// at ~0.6x resolution and 24fps, paused offscreen and when the tab is hidden.
// The shader ports the 01.Title ink layers of MainTitle.aep (see FRAG header); the dither grid is screen-locked.

import { useEffect, useRef } from "react";
import { afterLoadIdle, fastGpu, isPhone, warmProgram } from "@/lib/gpu";

const FRAG = /* glsl */ `
// Port of the two ink layers of MainTitle.aep › 01.Title (2800×2443 comp):
//   "Shape Layer 12" (sky) under "Shape Layer 4" (green). Each is a 5-point Polystar (outer 1436, inner 718,
//   rot 120.28°, group offset −396,78) whose layer Rotation is keyed through 360° in 6.983 s. Shape layers are
//   continuously rasterised, so the effect stack runs in COMP space after the transform, on a comp-sized buffer:
//   Gaussian Blur 189.4 → Wave Warp (semicircle, h 518, w 230.7) → Gaussian Blur 189.4 → Colorama (−43°)
//   → Gaussian Blur 189.4 → Glasswork (45°, size 238, disp 10/88) → CC Radial Blur (zoom 153, centre 1464,2428.5)
//   → AGP RetroDither (palette 3, 14 levels, downscale 4). The teeth stay screen-locked while the star turns under them.
// Axis conventions, wave scale and coverage were fitted against the green layer soloed in AE at 0–6 s (IoU 0.93);
// the ramps are the composite colours measured on the rendered board (the soloed-layer palette printed dull and yellow-green).
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLean;
uniform float uCell;
uniform float uDark;
uniform float uZoom;   // span scale of the board rect: <1 prints a closer crop of the ink
uniform vec3 uPtr;     // cursor in plate uv (y down) + strength: the ink swirls around it
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
  // composite colours measured on the rendered 01.Title board (OCIO viewer-exact), deep bloom → open field
  vec3 g0 = vec3(0.055,0.192,0.133), g1 = vec3(0.071,0.275,0.180), g2 = vec3(0.090,0.490,0.243);
  vec3 g3 = vec3(0.098,0.659,0.408), g4 = vec3(0.133,0.894,0.765), g5 = vec3(0.235,0.914,0.827); // g5 = the open field (AE median #41ead5 over paper)
  if (I < 0.2) return mix(g0, g1, I / 0.2);
  if (I < 0.35) return mix(g1, g2, (I - 0.2) / 0.15);
  if (I < 0.5) return mix(g2, g3, (I - 0.35) / 0.15);
  if (I < 0.7) return mix(g3, g4, (I - 0.5) / 0.2);
  return mix(g4, g5, min(1.0, (I - 0.7) / 0.2));
}
vec3 rampSky(float I){
  vec3 b0 = vec3(0.243,0.780,0.980), b1 = vec3(0.259,0.902,0.988), b2 = vec3(0.557,0.914,0.988);
  vec3 b3 = vec3(0.765,0.937,0.992), b4 = vec3(0.824,0.953,0.992);
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

void main(){
  vec2 cell = floor(vUv * uRes / uCell);
  vec2 uv = (cell + 0.5) * uCell / uRes;
  uv.y = 1.0 - uv.y;

  // cover-fit the board's ink rect (comp 153,161 → 2646,2307) to the canvas
  vec2 rect0 = vec2(153.0, 161.0), rectS = vec2(2493.0, 2146.0);
  float va = uRes.x / uRes.y, ra = rectS.x / rectS.y;
  vec2 span = va > ra ? vec2(rectS.x, rectS.x / va) : vec2(rectS.y * va, rectS.y);
  span *= uZoom;
  vec2 comp = rect0 + (rectS - span) * 0.5 + uv * span - uLean * 120.0;
  // cursor: a soft eddy, the ink turns around the pointer and is pushed off it (comp px, aspect-correct falloff)
  vec2 dv = (uv - uPtr.xy) * vec2(va, 1.0);
  float f = exp(-dot(dv, dv) / 0.035) * uPtr.z;
  comp += (vec2(-dv.y, dv.x) * 2600.0 + dv * 900.0) * f;

  float t = mod(uTime, LOOP) / LOOP * 360.0;
  vec4 sky = layer(comp, vec2(1822.915, 1026.289), vec2(3.101, 1.588), -3.6596 + t, -133.0, false);
  vec4 grn = layer(comp, vec2(2085.939, 1890.875), vec2(2.824, 1.860), 153.5288 - t, -200.0, true);

  // pass 1 prints the smooth field; the RetroDither screen runs in pass 2 (DITHER) at device resolution
  vec3 skyC = sky.rgb / max(sky.a, 1e-3), grnC = grn.rgb / max(grn.a, 1e-3);
  vec3 col = vec3(1.0 - uDark); // paper: white multiplies onto light stock, black screens onto dark
  col = mix(col, skyC, sky.a);
  col = mix(col, grnC, grn.a);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Pass 2: AGP RetroDither as measured on the rendered board. The screen is fine (dots of ~4 board px, about
// 2 CSS px) and chromatic: each channel thresholds on its own phase of the ordered matrix, so the field breaks
// into magenta, yellow, cyan, white and black specks around its colour. Runs at device resolution over the
// low-res smooth field (bilinear), so the dots stay crisp while the heavy field shader stays cheap.
const DITHER = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform float uDot;
uniform float uLevels;
varying vec2 vUv;
float bayer4(vec2 c){
  int x = int(mod(c.x, 4.0)); int y = int(mod(c.y, 4.0));
  int i = x + y * 4;
  float m[16];
  m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;
  m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
  for (int k = 0; k < 16; k++) { if (k == i) return (m[k] + 0.5) / 16.0; }
  return 0.5;
}
void main(){
  vec3 col = texture2D(tMap, vUv).rgb;
  vec2 d = floor(gl_FragCoord.xy / uDot);
  // the matrix, jittered per dot: the grunge and Glasswork under the dither break its regular grid on the board
  vec3 p3 = fract(vec3(d.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); // hash without sine (no diagonal bands)
  float j = fract((p3.x + p3.y) * p3.z) - 0.5;
  vec3 th = vec3(bayer4(d), bayer4(d + vec2(2.0, 1.0)), bayer4(d + vec2(1.0, 3.0))) - 0.5 + j * 0.6;
  gl_FragColor = vec4(clamp(floor(col * uLevels + 0.5 + th) / uLevels, 0.0, 1.0), 1.0);
}`;

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
  p: Required<FountainParams>; ptr: [number, number, number]; ptrTarget: [number, number, number];
};

// Per-plate tuning: the same ink, printed differently (the sidebar runs it as a narrow, cursor-led strip).
export type FountainParams = {
  speed?: number;   // x the shared drift
  phase?: number;   // s offset into the loop, so two plates never print the same frame
  zoom?: number;    // board crop (1 = the whole board rect)
  lean?: number;    // window-pointer lean strength (1 = default)
  cursor?: number;  // local eddy strength under the pointer (0 = off)
};
const DEFAULTS: Required<FountainParams> = { speed: 1, phase: 0, zoom: 1, lean: 1, cursor: 0 };

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
const DOT = 1.5; // CSS px per screen dot (≈ 3 board px at the board's 2800 px, measured)
const LEVELS = 3; // steps per channel: the board's coarse, chromatic palette
const MAX_OUT = 2560; // device px cap for the printed plate
const SETTLE = 0.16; // resting speed vs the AE loop: one turn in ~44 s, inside design.md's 40–90 s drift
const TAU = 5; // s: how long the entrance takes to settle
const FADE_CHECK = 12; // frames between computed-opacity reads (~0.5 s at 24fps): never a style flush per frame
const slots = new Set<Slot>();
let started = false;
let still = false;
// Aurora behaviour: a route warp is a solar gust through the same ink. The fountain runs faster for the jump
// and its fields swing along the jump's heading, then settle back to the slow drift. Reversed for Back.
const GUST_MS = 900; // matches the warp's exit + travel + arrive
const GUST_SPEED = 2.2; // extra drift speed (x the AE loop) at the gust's peak
const GUST_LEAN = 0.6; // lean added along the heading at the peak
let gustT0 = -1e9, gustDir = 1, gustHead: [number, number] = [0, 0];
const gust = (now: number) => {
  const u = (now - gustT0) / GUST_MS;
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 2;
};

const TRAVEL_HOLD = 0.08; // |sheet depth| past which fountain-filled type stops drawing

// The context and shader compile are the heaviest main-thread work on the page: they wait for load and an idle
// slot (lib/gpu afterLoadIdle), so first paint and input never queue behind them. The plates fade in anyway.
let queued = false;
function startWhenIdle() {
  if (queued) return;
  queued = true;
  afterLoadIdle(() => { start(); });
}

async function start() {
  if (started) return;
  started = true;
  const { Renderer, Program, Mesh, Triangle, RenderTarget } = await import("ogl");
  const renderer = new Renderer({ dpr: 1, alpha: false, antialias: false, preserveDrawingBuffer: true });
  const gl = renderer.gl;
  // no GPU (lib/gpu): the plates stay down and the DOM ink carries the type, as it does without WebGL
  if (!fastGpu(gl)) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    for (const s of slots) { const host = s.canvas.parentElement; if (host && s.clip) host.dataset.fallback = ""; }
    return;
  }
  await warmProgram(gl, VERT, FRAG); // compile off the main thread first; the build below then hits the cache
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: { uRes: { value: [1, 1] }, uTime: { value: 0 }, uLean: { value: [0, 0] }, uCell: { value: 4 }, uDark: { value: 0 }, uZoom: { value: 1 }, uPtr: { value: [0.5, 0.5, 0] } },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  await warmProgram(gl, VERT, DITHER);
  const field = new RenderTarget(gl, { width: 2, height: 2 });
  const screen = new Program(gl, { vertex: VERT, fragment: DITHER, uniforms: { tMap: { value: field.texture }, uDot: { value: 2 }, uLevels: { value: LEVELS } } });
  const screenMesh = new Mesh(gl, { geometry: new Triangle(gl), program: screen });
  let fW = 0, fH = 0;
  still = isPhone() || window.matchMedia("(prefers-reduced-motion: reduce)").matches; // phones print one still frame

  let last = 0, drift = 0, glW = 0, glH = 0;
  const t0 = performance.now();
  window.addEventListener("warp", (e) => {
    const d = (e as CustomEvent<{ dir: "fwd" | "back"; heading: { x: number; y: number } }>).detail;
    gustDir = d?.dir === "back" ? -1 : 1;
    gustHead = [d?.heading.x ?? 0, d?.heading.y ?? 0];
    gustT0 = performance.now();
  });
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || now - last < 1000 / 24) return;
    const g = still ? 0 : gust(now);
    drift += g * GUST_SPEED * gustDir * Math.min(0.1, last ? (now - last) / 1000 : 0);
    last = now;
    // settle-in: the ink enters at the AE speed, then eases down to a slow drift (speed 1 → SETTLE, time constant TAU)
    const el = (now - t0) / 1000;
    const time = still ? 0 : SETTLE * el + (1 - SETTLE) * TAU * (1 - Math.exp(-el / TAU)) + drift;
    program.uniforms.uDark.value = document.documentElement.classList.contains("dark") ? 1 : 0;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const scale = dpr * 0.6;
    for (const s of slots) {
      if (!s.visible || !s.size[0] || !s.size[1]) continue;
      // a sheet the print run has taken off the press (an attribute: no style flush to read it)
      if (s.sheet && s.sheet.hasAttribute("data-off")) continue;
      // fountain-filled type prints through BlurMap's filter chain, which re-runs on every new frame: while its
      // sheet travels past the camera (PrintRun's inline --d, no style flush) the ink holds its last frame
      if (s.clip && s.sheet && Math.abs(parseFloat(s.sheet.style.getPropertyValue("--d")) || 0) > TRAVEL_HOLD) continue;
      const host = s.canvas.parentElement;
      // a plate faded fully out (page plate off this spread) costs nothing; sampled, not read every frame
      if (!still && host && s.tick++ % FADE_CHECK === 0) s.faded = getComputedStyle(host).opacity === "0";
      if (!still && s.faded) continue;
      s.lean[0] += (s.target[0] + gustHead[0] * g * GUST_LEAN * gustDir - s.lean[0]) * 0.06;
      s.lean[1] += (s.target[1] + gustHead[1] * g * GUST_LEAN * gustDir - s.lean[1]) * 0.06;
      const [rw, rh] = s.size;
      const w = Math.max(2, Math.round(Math.min(rw * scale, 1100)));
      const h = Math.max(2, Math.round(Math.min(rh * scale, 1100 * (rh / Math.max(rw, 1)))));
      // the field renders small (w x h); the screen prints at device resolution (capped), 1:1 into the plate
      const k = Math.min(1, MAX_OUT / Math.max(rw * dpr, rh * dpr));
      const cw = Math.max(2, Math.round(rw * dpr * k)), ch = Math.max(2, Math.round(rh * dpr * k));
      if (s.canvas.width !== cw || s.canvas.height !== ch) { s.canvas.width = cw; s.canvas.height = ch; }
      if (fW !== w || fH !== h) { field.setSize(w, h); fW = w; fH = h; }
      program.uniforms.uRes.value = [w, h];
      s.ptr[0] += (s.ptrTarget[0] - s.ptr[0]) * 0.18;
      s.ptr[1] += (s.ptrTarget[1] - s.ptr[1]) * 0.18;
      s.ptr[2] += (s.ptrTarget[2] - s.ptr[2]) * 0.08;
      program.uniforms.uTime.value = time * s.p.speed + s.p.phase;
      program.uniforms.uLean.value = s.lean;
      program.uniforms.uZoom.value = s.p.zoom;
      program.uniforms.uPtr.value = s.ptr;
      program.uniforms.uCell.value = 1;
      renderer.render({ scene: mesh, target: field });
      // resizing the GL canvas reallocates its drawing buffer: only when this plate's size differs from the last
      if (glW !== cw || glH !== ch) { renderer.setSize(cw, ch); glW = cw; glH = ch; }
      screen.uniforms.tMap.value = field.texture; // setSize swaps in a new texture: rebind every frame
      screen.uniforms.uDot.value = DOT * dpr * k;
      renderer.render({ scene: screenMesh });
      const ctx = s.canvas.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "copy";
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(gl.canvas, 0, 0, cw, ch, 0, 0, cw, ch);
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

export default function Fountain({ className = "", children, clipText = false, params }: { className?: string; children?: React.ReactNode; clipText?: boolean; params?: FountainParams }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const slot: Slot = {
      canvas, visible: false, lean: [0, 0], target: [0, 0], clip: clipText,
      masks: clipText ? Array.from(canvas.parentElement?.querySelectorAll<HTMLElement>("[data-clip]") ?? []) : [],
      size: [0, 0], mask: null, maskKey: "", sheet: canvas.closest<HTMLElement>(".sheet"), tick: 0, faded: false,
      p: { ...DEFAULTS, ...params }, ptr: [0.5, 0.5, 0], ptrTarget: [0.5, 0.5, 0],
    };
    slots.add(slot);
    // layout size (unaffected by the camera's transforms); a new size or a font swap re-cuts the glyph mask
    const ro = new ResizeObserver(([e]) => { slot.size = [e.contentRect.width, e.contentRect.height]; slot.mask = null; });
    ro.observe(canvas);
    const onFonts = () => { slot.mask = null; };
    document.fonts?.addEventListener("loadingdone", onFonts);
    const io = new IntersectionObserver(([e]) => {
      slot.visible = e.isIntersecting;
      if (slot.visible) startWhenIdle();
    }, { rootMargin: "200px" });
    io.observe(canvas);
    // no first frame in time (WebGL unavailable; the start waits for load + idle): let the DOM text carry the name
    const host = canvas.parentElement;
    const fallback = clipText ? window.setTimeout(() => { if (host && !host.dataset.live) host.dataset.fallback = ""; }, 5000) : 0;
    const onMove = (e: PointerEvent) => {
      // lean 3–5% toward the pointer, on a spring (applied in the shared loop)
      const k = 0.35 * slot.p.lean;
      slot.target = [(e.clientX / window.innerWidth - 0.5) * k, (e.clientY / window.innerHeight - 0.5) * k];
      if (!slot.p.cursor || !host) return;
      // the eddy follows the pointer while it is over the plate (plus a margin), and lets go when it leaves
      const r = host.getBoundingClientRect();
      const m = 48;
      const over = e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m;
      slot.ptrTarget = [(e.clientX - r.left) / Math.max(1, r.width), (e.clientY - r.top) / Math.max(1, r.height), over ? slot.p.cursor : 0];
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
