// Ported from herondlabs/dename-landing-page src/mark.ts, unchanged.
/**
 * DeName mark — the badge rebuilt from its golden construction.
 *
 * Every proportion is a power of φ, so the tuning knobs are exponents. Spikes, corners and the
 * border are sized once from the base height and stay fixed in absolute units; stretching the
 * mark only adds body — width goes into the gap between the spike tips, height into the lower block.
 */
export const PHI = (1 + Math.sqrt(5)) / 2

export type Exponents = {
  /** (U + M) = H0 / φ^band — the spike band sits on the golden cut of the height. */
  band: number
  /** M = U / φ^mouth */
  mouth: number
  /** D = W0 / φ^depth */
  depth: number
  /** r = M / φ^corner */
  corner: number
  /** ρ = r / φ^tip */
  tip: number
  /** s = M / φ^border */
  border: number
}

export const GOLDEN: Exponents = { band: 2, mouth: 2, depth: 2, corner: 3, tip: 1, border: 1 }

/** Base aspect W0 / H0 — √5/2, the golden-root rectangle the master is drawn in. */
export const BASE_ASPECT = Math.sqrt(5) / 2

export type Construction = { W0: number; H0: number; U: number; M: number; D: number; r: number; rho: number; s: number }

export function construct(H0: number, e: Exponents = GOLDEN, aspect = BASE_ASPECT): Construction {
  const W0 = H0 * aspect
  const band = H0 / PHI ** e.band // U + M
  const U = band / (1 + PHI ** -e.mouth)
  const M = band - U
  const r = M / PHI ** e.corner
  return { W0, H0, U, M, D: W0 / PHI ** e.depth, r, rho: r / PHI ** e.tip, s: M / PHI ** e.border }
}

/** Smallest body that still reads: tips at least M apart, lower block at least as tall as the upper. */
export function clampSize(c: Construction, W: number, H: number) {
  return { W: Math.max(W, 2 * c.D + c.M), H: Math.max(H, 2 * c.U + c.M) }
}

type Vertex = [x: number, y: number, radius: number]

/** Outline in y-down space, clockwise from the top-left; the two spikes are point-symmetric about the band centre. */
export function outline(c: Construction, W: number, H: number): Vertex[] {
  const { U, M, D, r, rho } = c
  return [
    [0, 0, r], [W, 0, r], [W, U, r], [W - D, U + M, rho], [W, U + M, r],
    [W, H, r], [0, H, r], [0, U + M, r], [D, U, rho], [0, U, r],
  ]
}

/** Rounds every vertex with a true circular fillet (cubic approximation) and returns an SVG path. */
export function toPath(poly: Vertex[], dx = 0, dy = 0) {
  const f = (n: number) => +n.toFixed(2)
  const P = (x: number, y: number) => `${f(x + dx)} ${f(y + dy)}`
  let d = ''
  poly.forEach(([x, y, rad], i) => {
    const [ax, ay] = poly[(i + poly.length - 1) % poly.length]
    const [bx, by] = poly[(i + 1) % poly.length]
    const u1 = unit(ax - x, ay - y)
    const u2 = unit(bx - x, by - y)
    const th = Math.acos(Math.min(1, Math.max(-1, u1[0] * u2[0] + u1[1] * u2[1])))
    const t = rad / Math.tan(th / 2)
    const k = (4 / 3) * Math.tan((Math.PI - th) / 4) * rad
    const t1 = [x + u1[0] * t, y + u1[1] * t]
    const t2 = [x + u2[0] * t, y + u2[1] * t]
    d += `${i ? 'L' : 'M'}${P(t1[0], t1[1])}C${P(t1[0] - u1[0] * k, t1[1] - u1[1] * k)} ${P(t2[0] - u2[0] * k, t2[1] - u2[1] * k)} ${P(t2[0], t2[1])}`
  })
  return d + 'Z'
}

function unit(x: number, y: number): [number, number] {
  const l = Math.hypot(x, y)
  return [x / l, y / l]
}

/** Convenience: path for a W×H body whose spikes are scaled from a base height `unit`. */
export function markPath(W: number, H: number, unitH: number, e: Exponents = GOLDEN, inset = 0) {
  const c = construct(unitH, e)
  const s = clampSize(c, W - 2 * inset, H - 2 * inset)
  return { c, ...s, d: toPath(outline(c, s.W, s.H), inset, inset) }
}

/** Spike scale for a surface: the largest base mark that fits it, so spikes never outgrow the shorter side. */
export function fitUnit(W: number, H: number, aspect = BASE_ASPECT) {
  return Math.min(W / aspect, H)
}

/** Fillet circle centres and radii — for drawing the construction. */
export function filletCircles(poly: Vertex[]) {
  return poly.map(([x, y, rad], i) => {
    const [ax, ay] = poly[(i + poly.length - 1) % poly.length]
    const [bx, by] = poly[(i + 1) % poly.length]
    const u1 = unit(ax - x, ay - y)
    const u2 = unit(bx - x, by - y)
    const bis = unit(u1[0] + u2[0], u1[1] + u2[1])
    const th = Math.acos(Math.min(1, Math.max(-1, u1[0] * u2[0] + u1[1] * u2[1])))
    const dist = rad / Math.sin(th / 2)
    return { cx: x + bis[0] * dist, cy: y + bis[1] * dist, r: rad }
  })
}

/** The Illustrator master (Dename_Brand_Fin.ai), body at the origin, 438.88pt tall — the ghost the construction is checked against. */
export const MASTER = {
  H: 438.88,
  d: 'M10.52 0h469.72c6.31 0 10.52 4.21 10.52 10.52v100.66c0 6.31-3.5 9.81-9.11 11.22l-161.25 39.26c-4.21 1.4-7.71 4.21-7.71 7.01 0 2.1 4.91 4.21 11.22 4.21l156.34-3.51c6.31 0 10.52 4.21 10.52 10.52v248.48c0 6.31-4.21 10.52-10.52 10.52H10.52c-6.31 0-10.52-4.21-10.52-10.52v-249.88c0-6.31 3.51-9.82 9.11-11.22l166.16-42.77c4.91-1.4 7.71-3.51 7.71-5.61s-4.21-3.51-11.22-3.51l-161.25 4.91c-6.31 0-10.52-4.21-10.52-10.52V10.51C0 4.2 4.21-.01 10.52-.01Z',
}

/** Brand colours as drawn in the master (spa-green family on the site). */
export const GREEN = '#5f9848'
export const PAPER = '#f9f8f6'
// The badge green taken down the same hue — 4:1 against the body, so it reads as green, never black.
export const FOREST = '#1a3312'

/**
 * Two versions, named for the ground they sit on. The border always rings the body; only its colour flips —
 * `light` (paper border and words) for dark or busy grounds, `dark` (forest border and words) for light grounds.
 */
export type Tone = 'light' | 'dark'
export const TONES: Record<Tone, { border: string; words: string }> = {
  light: { border: PAPER, words: PAPER },
  dark: { border: FOREST, words: '#1a1f17' }, // ink words: FOREST on GREEN is 3.8:1, ink clears 4.5:1
}

/** App icon: the badge on a paper tile, inset by 1/φ⁴ of the side so the OS corner mask never touches it. */
export function iconSvg(S: number, e: Exponents = GOLDEN) {
  const m = S / PHI ** 4
  const B = S - 2 * m
  const c = construct(fitUnit(B, B), e)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="${PAPER}"/><path d="${toPath(outline(c, B, B), m, m)}" fill="${GREEN}"/></svg>`
}

/** Favicon: the whole badge on a transparent square; the border follows the browser's colour scheme. */
export function faviconSvg(S: number, e: Exponents = GOLDEN) {
  const c = construct(fitUnit(S, S), e)
  const B = S - c.s
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><path d="${toPath(outline(c, B, B), c.s / 2, c.s / 2)}" fill="${GREEN}" stroke-width="${c.s}" stroke-linejoin="round" paint-order="stroke"/><style>path{stroke:${FOREST}}@media (prefers-color-scheme:dark){path{stroke:${PAPER}}}</style></svg>`
}

// Coaster Sans metrics per em, measured in the browser: advance width and cap height.
const WORDS = { DENAME: { w: 4.212, cap: 0.701 }, LABS: { w: 2.601, cap: 0.728 } }

/**
 * DENAME in the upper block, LABS in the lower — each sized to the smaller of its height fit (cap = block/φ)
 * and its width fit (the block minus one border inset each side), so no stretch can push a word out.
 */
export function wordLayout(c: Construction, W: number, H: number) {
  const pad = c.s
  const room = W - 2 * pad
  const L = H - c.U - c.M
  const top = Math.min(c.U / PHI / WORDS.DENAME.cap, room / WORDS.DENAME.w)
  const low = Math.min(L / PHI / WORDS.LABS.cap, room / WORDS.LABS.w)
  return [
    { text: 'DENAME', x: pad, y: (c.U + top * WORDS.DENAME.cap) / 2, size: top },
    // LABS sits in the bottom-left corner, one border inset from both edges, however tall the block grows.
    { text: 'LABS', x: pad, y: H - pad, size: low },
  ]
}
