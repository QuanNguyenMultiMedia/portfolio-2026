// Copied from herondlabs/defrasoft-landing-page web/src/Glyph.tsx.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PIECES } from './defrag';

// Small pictures drawn in the defrag engine's hand: each cell of a bitmap is one of the engine's three pieces that
// resolves into a dot. On arrival the pieces settle from the centre out; the cells marked 'a' keep defragmenting on
// a slow loop (a waveform, a ripple, a check being traced), so the picture stays quietly alive without moving.
const hash = (i: number, j: number) => { const a = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return a - Math.floor(a); };

export type Loop = 'wave' | 'ripple' | 'trace';
type Cell = { x: number; y: number; k: number; anim: boolean; rest: boolean; d: number; t: number };

function cellsOf(art: string[], loop: Loop) {
  const rows = art.length, cols = art[0].length, cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const out: Cell[] = [];
  let n = 0;
  art.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === '.') return;
    const h = hash(i, j), anim = ch === 'a';
    // Loop phase: a wave travels across the bars, a ripple spreads from the centre, a trace follows reading order.
    const t = loop === 'wave' ? i * 0.14 + Math.abs(j - cy) * 0.2 : loop === 'ripple' ? Math.abs(i - cx) * 0.16 + Math.abs(j - cy) * 0.1 : (anim ? n++ : 0) * 0.09;
    // A few still cells stay fragments at rest, so the picture always shows where it came from.
    out.push({ x: i, y: j, k: Math.floor(h * 3), anim, rest: !anim && h < 0.12, d: Math.hypot(i - cx, j - cy) / Math.hypot(cx || 1, cy || 1), t });
  }));
  return { cols, rows, cells: out };
}

// Arms once, when the picture is first in view; the loop only runs while it is on screen.
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setVis(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen, vis] as const;
}

export function DefragGlyph({ art, loop = 'ripple', className = '', style }: { art: string[]; loop?: Loop; className?: string; style?: CSSProperties }) {
  const [ref, seen, vis] = useSeen<SVGSVGElement>();
  const { cols, rows, cells } = cellsOf(art, loop);
  return (
    <svg ref={ref} aria-hidden="true" viewBox={`0 0 ${cols} ${rows}`} className={`glyph ${seen ? 'on' : ''} ${vis ? 'vis' : ''} ${className}`} style={style} fill="currentColor">
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${c.x + 0.5} ${c.y + 0.5})`} className={`gl-c ${c.anim ? 'gl-a' : ''} ${c.rest ? 'gl-rest' : ''}`} style={{ '--d': c.d.toFixed(3), '--t': `${c.t.toFixed(2)}s` } as CSSProperties}>
          <path className="gl-frag" d={PIECES[c.k]} />
          <circle className="gl-dot" r={0.36} />
        </g>
      ))}
    </svg>
  );
}

// The photograph's edge printed as the engine's field: pieces at the rim, resolving inward into dots that thin out to
// nothing, so the picture dissolves into the page the way the brand field does. Laid out once per size.
export function DefragVignette({ cell = 22, band = 3.2, className = '' }: { cell?: number; band?: number; className?: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { const w = Math.round(e.contentRect.width), h = Math.round(e.contentRect.height); setSize((p) => (Math.abs(p[0] - w) < 8 && Math.abs(p[1] - h) < 8 ? p : [w, h])); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  const [W, H] = size;
  const pieces: { x: number; y: number; k: number; frag: boolean; r: number; e: number }[] = [];
  if (W) {
    const cs = Math.max(10, Math.min(cell, W / 30)), cols = Math.ceil(W / cs), rows = Math.ceil(H / cs), ox = (W - cols * cs) / 2, oy = (H - rows * cs) / 2;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = ox + (i + 0.5) * cs, y = oy + (j + 0.5) * cs, h = hash(i + 3, j + 7);
      // Bottom-right corner only: 0 at the corner, 1 a band out; the band breathes with a little noise so the edge is never ruled.
      const e = Math.hypot(W - x, H - y) / (cs * band * 7 * (0.8 + 0.4 * hash(i * 0.37, j * 0.53)));
      if (e > 1 || h > 0.75 - 0.85 * e) continue;
      const frag = e < 0.28 + 0.25 * h;
      pieces.push({ x, y, k: Math.floor(hash(i, j) * 3), frag, r: cs * 0.42 * (1 - e) ** 0.8, e });
    }
  }
  const cs = W ? Math.max(10, Math.min(cell, W / 30)) : cell;
  return (
    <span ref={ref} aria-hidden="true" className={`vignette ${seen ? 'on' : ''} ${className}`}>
      {W > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="currentColor">
          {pieces.map((p, i) => (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} className={`vg-c ${p.frag ? 'vg-frag' : ''}`} style={{ '--e': p.e.toFixed(3) } as CSSProperties}>
              <g className="vg-p">{p.frag ? <path d={PIECES[p.k]} transform={`scale(${(cs * 0.82).toFixed(1)})`} /> : <circle r={p.r.toFixed(1)} />}</g>
            </g>
          ))}
        </svg>
      )}
    </span>
  );
}

// Bitmaps, one character per cell: '#' a still piece, 'a' a piece on the loop, '.' air.
export const ART = {
  // Summary AI: a speech bubble with a waveform breathing inside it.
  summary: [
    '.#########.',
    '##.......##',
    '#....a....#',
    '#..a.a.a..#',
    '#.aaaaaaa.#',
    '#..a.a.a..#',
    '#....a....#',
    '##.......##',
    '.###.#####.',
    '..##.......',
    '..#........',
  ],
  // 360 Tracker: a location pin, its centre pulsing.
  tracker: [
    '..#####..',
    '.#.....#.',
    '#...a...#',
    '#..aaa..#',
    '#...a...#',
    '.#.....#.',
    '..#...#..',
    '...#.#...',
    '....#....',
  ],
  // Happy VPN: a shield, with the check traced through it.
  happ: [
    '...###...',
    '.##...##.',
    '#.......#',
    '#.......#',
    '#.....a.#',
    '#....a..#',
    '#.a.a...#',
    '#..a....#',
    '.#.....#.',
    '..#...#..',
    '...#.#...',
    '....#....',
  ],
} satisfies Record<string, string[]>;

// The four principles at icon size: a heart in a hand, a receipt, a key, a phone.
export const RULE_ART: [string[], Loop][] = [
  [['.aa.aa.', 'aaaaaaa', 'aaaaaaa', '.aaaaa.', '..aaa..', '#..a..#', '.#####.'], 'ripple'],
  [['#####.', '#....#', '#aaa.#', '#....#', '#aa..#', '#....#', '#.#.##'], 'trace'],
  [['.###...', '#...#..', '#.a.#..', '#...#..', '.###aaa', '....a.a', '.......'], 'trace'],
  [['.####.', '#....#', '#.aa.#', '#.aa.#', '#....#', '#....#', '.#.##.'], 'ripple'],
];
