"use client";
// The line engine behind every run of copy on herondlabs.com (src/lib/pretext.ts, on @chenglou/pretext), ported.
// Segments are measured once against the browser's own font engine through canvas; every break after that is
// arithmetic over cached widths, so a balanced heading is a 12-step binary search on line count instead of
// a reflow per guess. Each line is painted as its own block, with its measured width set beside it.
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import { layoutWithLines, measureLineStats, prepareWithSegments, type PreparedTextWithSegments } from "@chenglou/pretext";
import "./herondlabs.css";

type Wrap = "wrap" | "balance" | "pretty";
// the home cover's own H1 (src/content/en/home.ts)
const TEXT = "Product engineering teams for startups and SMEs shipping mission-critical software.";
const ORPHAN_RATIO = 0.25;

function balancedWidth(p: PreparedTextWithSegments, max: number, lines: number) {
  let lo = max / lines, hi = max;
  for (let i = 0; i < 12; i += 1) {
    const mid = (lo + hi) / 2;
    if (measureLineStats(p, mid).lineCount <= lines) hi = mid; else lo = mid;
  }
  return Math.min(max, measureLineStats(p, hi).maxLineWidth);
}
const join = (ls: readonly { text: string }[]) => ls.map((l) => l.text.trim()).join(" ");

export default function Linebreak() {
  const box = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState<{ css: string; lh: number; size: number } | null>(null);
  const [measure, setMeasure] = useState(0.62);
  const [wrap, setWrap] = useState<Wrap>("balance");
  const [room, setRoom] = useState(0);

  // read the painted typography once the face is in, as the site's readTypography does
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setRoom(el.clientWidth));
    ro.observe(el);
    document.fonts.load('700 48px "HL Inter"').then(() => {
      // sized so the narrowest measure (~9 lines at 1.08) still fits the field
      const size = Math.max(22, Math.min(56, el.clientWidth / 14, el.clientHeight / 12));
      setFont({ css: `normal 700 ${size}px "HL Inter"`, lh: size * 1.08, size });
    });
    return () => ro.disconnect();
  }, []);

  const prepared = useMemo(() => (font ? prepareWithSegments(TEXT, font.css, { letterSpacing: -0.04 * font.size }) : null), [font]);
  // the measure never drops below the widest word: below it pretext hard-breaks the word, which the site never ships
  const floor = useMemo(() => {
    if (!font) return 120;
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = font.css;
    return Math.max(...TEXT.split(/\s+/).map((w) => ctx.measureText(w).width + w.length * -0.04 * font.size)) + 2;
  }, [font]);
  const max = Math.max(floor, room * measure);
  const out = useMemo(() => {
    if (!prepared || !font) return null;
    let r = layoutWithLines(prepared, max, font.lh);
    let used = max;
    if (r.lines.length > 1 && wrap !== "wrap") {
      const last = r.lines[r.lines.length - 1];
      if (wrap === "balance" || last.width < max * ORPHAN_RATIO) {
        const w = balancedWidth(prepared, max, r.lines.length);
        const re = layoutWithLines(prepared, w, font.lh);
        if (re.lines.length === r.lines.length && join(re.lines) === join(r.lines)) { r = re; used = w; }
      }
    }
    return { lines: r.lines, used };
  }, [prepared, font, max, wrap]);

  const drag = useRef<{ x: number; m: number } | null>(null);
  const down = (e: RPE) => { (e.target as Element).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, m: measure }; };
  const move = (e: RPE) => {
    if (!drag.current || !room) return;
    setMeasure(Math.max(0.2, Math.min(1, drag.current.m + (e.clientX - drag.current.x) / room)));
  };

  return (
    <div className="hl-sheet">
      <div className="hl-sheet-bar">
        <div role="radiogroup" aria-label="Wrap" className="flex">
          {(["wrap", "balance", "pretty"] as const).map((w) => (
            <button key={w} type="button" role="radio" aria-checked={wrap === w} className="hl-seg" onClick={() => setWrap(w)}>{w}</button>
          ))}
        </div>
        {out && <span className="hl-annot">{out.lines.length} lines · measure {Math.round(max)} px · set {Math.round(out.used)} px</span>}
      </div>
      <div ref={box} className="hl-sheet-field">
        {font && out && (
          <div className="hl-measure" style={{ width: max }}>
            {out.lines.map((l, i) => (
              <div key={i} className="hl-line" style={{ font: font.css, lineHeight: `${font.lh}px`, letterSpacing: `${-0.04 * font.size}px` }}>
                <span className="hl-line-ink" style={{ width: l.width }}>{l.text.replace(/\s+$/, "")}</span>
                <span className="hl-annot hl-line-w">{l.width.toFixed(1)}</span>
              </div>
            ))}
            {wrap !== "wrap" && out.used < max && <span aria-hidden className="hl-used" style={{ left: out.used }} />}
            <span
              role="slider"
              tabIndex={0}
              aria-label="Measure"
              aria-valuemin={20}
              aria-valuemax={100}
              aria-valuenow={Math.round(measure * 100)}
              className="hl-handle"
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={() => (drag.current = null)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setMeasure((m) => Math.min(1, m + 0.02));
                if (e.key === "ArrowLeft") setMeasure((m) => Math.max(0.2, m - 0.02));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
