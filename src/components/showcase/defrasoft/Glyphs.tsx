"use client";
// The product pictures and the four principles from the landing page, drawn in the engine's hand (Glyph.tsx).
// On the site, scroll sets each section's --in and the cells resolve centre-out; here the slider is the scroll.
import { useState, type CSSProperties } from "react";
import { ART, DefragGlyph, RULE_ART } from "./Glyph";
import "./defrasoft.css";

const PRODUCTS = [
  { key: "summary", name: "Summary AI", loop: "wave" },
  { key: "tracker", name: "360 Tracker", loop: "ripple" },
  { key: "happ", name: "Happy VPN", loop: "trace" },
] as const;

export default function Glyphs() {
  const [inn, setIn] = useState(1);
  return (
    <div className="df-glyphs" style={{ "--in": inn } as CSSProperties}>
      <div>
        <div className="df-glyph-row">
          {PRODUCTS.map((p) => (
            <figure key={p.key} className={`is-${p.key}`}>
              <DefragGlyph art={ART[p.key]} loop={p.loop} />
              <figcaption>{p.name}</figcaption>
            </figure>
          ))}
        </div>
        <div className="df-rules">
          {RULE_ART.map(([art, loop], i) => <DefragGlyph key={i} art={art} loop={loop} />)}
        </div>
      </div>
      <div className="df-bar">
        <label className="df-meta">
          Scroll {Math.round(inn * 100)}%
          <input className="df-range" type="range" min={0} max={1} step={0.01} value={inn} onChange={(e) => setIn(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}
