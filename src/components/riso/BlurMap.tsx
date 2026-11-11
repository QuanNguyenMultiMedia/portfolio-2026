"use client";
// Display-type print stack, ported from MainTitle.aep › 01.Title (type at 197 comp px: 242pt × 81.47%):
//   each text layer: Roughen Edges (border 2.4, scale 11, complexity 2)
//   "Adjustment Layer 7" (×1.108, ×1.206): Compound Blur (Blur Layer "BlurMap", Maximum Blur 3); its Roughen Edges is off
//   "BlurMap": shape layer, Fractal Noise (Dynamic, contrast 546, brightness 12, scale 507, complexity 6).
// Measured in AE (32 bpc, alpha, probe comps of stepped edges under ramp maps):
//   · the kernel is Gaussian (fit error 0.007 vs 0.04+ for a box); σ = 1.1 × Maximum Blur × map, linear in the
//     map's gray: ≈ 3.8·map comp px here. The map is clamped to [0, 1]: values over 1 blur no more.
//   · a shape layer's effects ARE read as the map (a solid's are not). The noise is unclipped in 32 bpc, so after
//     the clamp 18.8% of the area is crisp, 26.2% fully blurred, the rest graded.
//   · the clamped map's structure: autocorrelation halves at 0.70 em and crosses zero at 1.82 em.
// The browser builds that map from two fractalNoise layers (coarse + fine, fitted to those two lengths) and maps
// it through MAP_TABLE, a quantile mapping from the browser noise histogram onto AE's clamped one.
// Lengths scale with the type: each [data-blurmap] element gets a filter for its font size (4px buckets).
import { Fragment, useEffect, useRef, useState } from "react";
import { isPhone } from "@/lib/gpu";

const COMP_TYPE = 197; // px: the type's rendered size in the comp
// AE's border is 2.4; at that strength on the web the serifs wobble and the face stops reading as Junicode. A third of
// it keeps the ink edge (no vector-clean outline) while every stroke, serif and bowl holds its drawn shape.
const ROUGH_BORDER = 0.8;
const ROUGH_SCALE = 11;
// σ at map = 1, in comp px. AE's is 3.8 (1.1 × 3 × the adjustment layer's scale). 2.4 (0.012 em): the haze
// breathes across the word as a soft ink edge, never as a smear, so the letterforms stay legible at every size.
const MAX_SIGMA = 2.4;
// Entrance: the whole word starts deep in the haze and settles onto the steady map, once, when it first shows.
// A Gaussian over the finished stack whose σ eases to 0 (σ 0 passes the input through untouched).
const INTRO_SIGMA = 28; // comp px: 0.14 em, the word is a soft cloud
const INTRO_S = 2.4;
const INTRO_EASE = "0.23 1 0.32 1";
const introId = (px: number) => `blurmap-${px}-in`;
// Blur tiers (fractions of MAX_SIGMA), dense at the low end: cross-fading two blurs only reads as one
// intermediate blur when their σ are close; a wide first step shows as a crisp core inside a glow.
const TIER_SIGMA = [0.04, 0.1, 0.2, 0.35, 0.55, 0.78, 1];
// σ is linear in the map (measured), so tier i is fully in at map = TIER_SIGMA[i]
const TIER_AT = TIER_SIGMA;
// map structure, in cycles per em of the type: coarse swells + fine billows, mixed variance-preserving
// (wc² + wf² = 1); fitted on the live chain to AE's clamped-map autocorrelation (0.70 / 1.82 em)
const F_COARSE = 0.28;
const F_FINE = 0.8;
const W_FINE = 0.42;
const W_COARSE = Math.sqrt(1 - W_FINE * W_FINE);
// mixed-noise R over [MAP_LO, MAP_HI] (≈ its 2.5th–97.5th percentiles, measured on this exact chain) → AE's
// clamped map, by quantile
const MAP_LO = 0.2824;
const MAP_HI = 0.7137;
const MAP_TABLE = "0 0 0 0 0 0 0 0 0 0 0 0 0 0.006 0.033 0.057 0.104 0.151 0.214 0.273 0.309 0.37 0.423 0.483 0.536 0.589 0.641 0.694 0.755 0.807 0.866 0.905 0.957 0.989 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1";
// Breathing (AE's map is static; the site's moves): each layer rotates between two seeds (cos/sin weights keep
// its variance, so the histogram and the table stay valid) and the window slides so the share of crisp vs soft
// swells and ebbs. The periods never line up.
// Every element's noise starts at its own top-left, and a coarse swell (~3.6 em) is wider than most words, so
// a single seed parks a whole word in one regime (measured over the name: seed 7 → 81% fully blurred, 0% crisp;
// seed 61 → 80% crisp). The coarse pair 29 ↔ 113 sweeps the name from 71% crisp through AE's mix (37% crisp /
// 26% full at 67.5°) to 33% full, never all haze; it rests at 67.5° (also the reduced-motion state).
const FINE_SEEDS = [19, 43];
const COARSE_SEEDS = [29, 113];
const FINE_TURN = [0, 22.5, 45, 67.5, 90, 67.5, 45, 22.5, 0];
const COARSE_TURN = [67.5, 90, 67.5, 45, 22.5, 0, 22.5, 45, 67.5];
const FINE_S = 7.3;
const COARSE_S = 17.9;
const SWELL_S = 13.7;
const SWELL = [0, -0.05, 0, 0.04, 0]; // window shift in noise R: negative = more of the word soft
const EASE = "0.45 0 0.55 1";

const INK_WAIT = 2500; // ms
const bucket = (px: number) => Math.max(8, Math.round(px / 4) * 4);
const idFor = (px: number) => `blurmap-${px}`;
const OPAQUE = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1"; // noise alpha varies too: keep R, alpha 1
const spline = (n: number) => Array(n).fill(EASE).join(";");
const rad = (d: number) => (d * Math.PI) / 180;
// a·cosθ + b·sinθ + offset keeping the mean at ½
const turnK = (d: number) => ({ k2: Math.cos(rad(d)), k3: Math.sin(rad(d)), k4: 0.5 * (1 - Math.cos(rad(d)) - Math.sin(rad(d))) });
const windowMatrix = (shift: number) => {
  const g = 1 / (MAP_HI - MAP_LO);
  return `${g} 0 0 0 ${-g * (MAP_LO + shift)}  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1`;
};

function Filter({ px, animate }: { px: number; animate: boolean }) {
  const k = px / COMP_TYPE;
  const rough = (seed: number, input: string, out: string) => (
    <>
      <feTurbulence type="fractalNoise" baseFrequency={1 / (ROUGH_SCALE * k)} numOctaves={2} seed={seed} result={`${out}n`} />
      <feDisplacementMap in={input} in2={`${out}n`} scale={ROUGH_BORDER * Math.SQRT2 * k} /* the old two ±½-border passes, in one: independent displacements add in quadrature */ xChannelSelector="R" yChannelSelector="G" result={out} />
    </>
  );
  const noise = (f: number, seed: number, out: string) => (
    <>
      <feTurbulence type="fractalNoise" baseFrequency={f} numOctaves={3} seed={seed} result={`${out}t`} />
      <feColorMatrix in={`${out}t`} type="matrix" values={OPAQUE} result={out} />
    </>
  );
  // one noise layer that turns between two seeds through the angles in `turn` (degrees), resting on turn[0]
  const rotor = (f: number, [a, b]: number[], turn: number[], dur: number, out: string) => {
    const rest = turnK(turn[0]);
    const track = (key: "k2" | "k3" | "k4") => turn.map((d) => turnK(d)[key].toFixed(4)).join(";");
    return (
      <>
        {noise(f, a, `${out}a`)}
        {noise(f, b, `${out}b`)}
        <feComposite in={`${out}a`} in2={`${out}b`} operator="arithmetic" k1={0} k2={rest.k2} k3={rest.k3} k4={rest.k4} result={out}>
          {animate && (["k2", "k3", "k4"] as const).map((key) => (
            <animate key={key} attributeName={key} dur={`${dur}s`} repeatCount="indefinite" values={track(key)} />
          ))}
        </feComposite>
      </>
    );
  };
  // tier i fades in as the map climbs from TIER_AT[i − 1] to TIER_AT[i]
  const mask = (i: number, out: string) => {
    const lo = i ? TIER_AT[i - 1] : 0;
    const g = 1 / (TIER_AT[i] - lo);
    return <feColorMatrix in="map" type="matrix" result={out} values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${g} 0 0 0 ${-g * lo}`} />;
  };
  const lerp = (a: string, b: string, m: string, out: string) => (
    <>
      <feComposite in={b} in2={m} operator="in" result={`${out}b`} />
      <feComposite in={a} in2={m} operator="out" result={`${out}a`} />
      <feMerge result={out}><feMergeNode in={`${out}a`} /><feMergeNode in={`${out}b`} /></feMerge>
    </>
  );
  return (
    <filter id={idFor(px)} x="-12%" y="-45%" width="124%" height="190%" /* room for the entrance haze */ colorInterpolationFilters="sRGB">
      {rough(11, "SourceGraphic", "r2")}
      {rotor(F_COARSE / px, COARSE_SEEDS, COARSE_TURN, COARSE_S, "nc")}
      {rotor(F_FINE / px, FINE_SEEDS, FINE_TURN, FINE_S, "nf")}
      <feComposite in="nc" in2="nf" operator="arithmetic" k1={0} k2={W_COARSE} k3={W_FINE} k4={0.5 * (1 - W_COARSE - W_FINE)} result="mix" />
      <feColorMatrix in="mix" type="matrix" values={windowMatrix(0)} result="win">
        {animate && <animate attributeName="values" dur={`${SWELL_S}s`} repeatCount="indefinite"
          values={SWELL.map(windowMatrix).join(";")} keyTimes="0;0.25;0.5;0.75;1" calcMode="spline" keySplines={spline(4)} />}
      </feColorMatrix>
      <feComponentTransfer in="win" result="map"><feFuncR type="table" tableValues={MAP_TABLE} /></feComponentTransfer>
      {TIER_SIGMA.map((f, i) => (
        <Fragment key={i}>
          {mask(i, `m${i + 1}`)}
          <feGaussianBlur in="r2" stdDeviation={MAX_SIGMA * f * k} result={`b${i + 1}`} />
          {lerp(i ? `t${i}` : "r2", `b${i + 1}`, `m${i + 1}`, `t${i + 1}`)}
        </Fragment>
      ))}
      <feGaussianBlur in={`t${TIER_SIGMA.length}`} stdDeviation={animate ? INTRO_SIGMA * k : 0}>
        {animate && <animate id={introId(px)} attributeName="stdDeviation" begin="indefinite" dur={`${INTRO_S}s`} fill="freeze"
          values={`${INTRO_SIGMA * k};0`} keyTimes="0;1" calcMode="spline" keySplines={INTRO_EASE} />}
      </feGaussianBlur>
    </filter>
  );
}

// The haze drifts on SMIL, and every SMIL tick re-runs the whole chain. Left to itself the timeline ticks every
// display frame (120+ Hz); stepped by hand it re-runs at the fountain's own rate. PrintRun sets html.haze-hold
// while the camera is off a sheet: the haze holds still there. Phones run only the entrance, then hold the map
// still (as their plates do): the chain re-raster was most of a mid-tier phone's frame.
const HAZE_FPS = 24;

export default function BlurMap() {
  const [sizes, setSizes] = useState<number[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const introUntil = useRef(0); // timeline s: phones step the timeline only until the last entrance has played out
  // reduced motion: the same graded map, held still
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animate) return;
    svg.pauseAnimations();
    let last = performance.now();
    const phone = isPhone();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (document.hidden || document.documentElement.classList.contains("haze-hold")) return;
      if (phone && svg.getCurrentTime() >= introUntil.current) return;
      svg.setCurrentTime(svg.getCurrentTime() + dt);
    }, 1000 / HAZE_FPS);
    return () => { window.clearInterval(id); svg.unpauseAnimations(); };
  }, [animate]);

  useEffect(() => {
    let raf = 0;
    const ro = new ResizeObserver(() => schedule());
    const seen = new WeakSet<Element>();
    const scan = () => {
      raf = 0;
      const next = new Set<number>();
      document.querySelectorAll<HTMLElement>("[data-blurmap]").forEach((el) => {
        const px = bucket(parseFloat(getComputedStyle(el).fontSize));
        if (!seen.has(el)) { seen.add(el); ro.observe(el); el.dataset.blurmapPx = String(px); io.observe(el); }
        next.add(px);
        // filter only what prints the ink: for fountain-filled type that is the plate's canvas, so the
        // transparent DOM text above it (there for reading and selection) keeps a clean highlight
        const ink = el.querySelector<HTMLElement>(".ink-fill > canvas") ?? el;
        ink.style.filter = `url(#${idFor(px)})`;
      });
      setSizes((prev) => {
        const merged = [...new Set([...prev, ...next])].sort((a, b) => a - b);
        return merged.length === prev.length ? prev : merged;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(scan); };
    // Entrance: play each size's intro once, when the first element using it is on screen and its ink is up
    // (fountain type: when the plate goes live; give up waiting after INK_WAIT so nothing stays hazed).
    const played = new Set<number>();
    const play = (px: number, tries = 0) => {
      if (played.has(px)) return;
      const anim = document.getElementById(introId(px)) as SVGAnimationElement | null;
      if (!anim) { if (tries < 60) requestAnimationFrame(() => play(px, tries + 1)); return; }
      played.add(px);
      anim.beginElement();
      const svg = svgRef.current;
      if (svg) introUntil.current = svg.getCurrentTime() + INTRO_S + 0.05;
    };
    const timers = new Set<number>();
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target as HTMLElement;
      const px = Number(el.dataset.blurmapPx);
      const plate = el.querySelector<HTMLElement>(".ink-fill");
      if (!plate || plate.hasAttribute("data-live")) return play(px);
      const watch = new MutationObserver(() => { if (plate.hasAttribute("data-live")) { watch.disconnect(); play(px); } });
      watch.observe(plate, { attributes: true, attributeFilter: ["data-live"] });
      timers.add(window.setTimeout(() => { watch.disconnect(); play(px); }, INK_WAIT));
    }));
    const mo = new MutationObserver(schedule); // route changes bring new display type
    mo.observe(document.body, { childList: true, subtree: true });
    scan();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  return (
    <svg ref={svgRef} className="sr-only" aria-hidden focusable="false">
      {sizes.map((px) => <Filter key={px} px={px} animate={animate} />)}
    </svg>
  );
}
