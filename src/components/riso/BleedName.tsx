// The project name as MainTitle.aep prints it on a project's spreads (03 title, 05/08/11 end). In the comps the
// type itself is switched off: it is the track matte for the ink layer (a blurred, wave-warped Colorama field run
// through RetroDither), and an adjustment layer roughens and diffuses the result. Here the same three parts are
// the site's own: the fountain shader (Fountain clipText) cut to the glyphs, then BlurMap's roughen → compound
// blur stack on the plate ([data-blurmap]), which also plays the haze entrance. Each letter is its own cut
// ([data-clip]); every letter holds the baseline. Colorama is a gradient map per project (RAMPS).
import { useId } from "react";
import Fountain, { type FountainParams } from "./Fountain";
import type { Project } from "@/data/projects";

// Colorama, ported as a gradient map: the plate's luminance (dense ink → bare paper) through each project's ramp,
// read off its end comp, densest first. Paper stays white so the plate still multiplies away outside the ink.
// The mint plate is the shader's own palette (05.Defrasoft_End is the board it was measured on): no map.
const RAMPS: Partial<Record<NonNullable<Project["print"]>["fountain"], string[]>> = {
  herond: ["#2f33e8", "#7a5ee0", "#d07cc0", "#f3d9ec", "#ffffff"], // 11.HerondLabs_End
  azure: ["#1d4fc4", "#3d78dc", "#8fb4ec", "#dce8f8", "#ffffff"],  // 08.ZCungViet_End
  electric: ["#2a00f0", "#3a3efa", "#2f8dff", "#cfe6ff", "#ffffff"],
  tide: ["#06566a", "#0a8a90", "#4fbfae", "#d5efe8", "#ffffff"],
};
const channel = (ramp: string[], i: number) => ramp.map((h) => (parseInt(h.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3)).join(" ");

// a different frame of the loop for each project, so no two names print the same ink
export const PHASE: Record<NonNullable<Project["print"]>["fountain"], number> = { mint: 0, azure: 1.7, herond: 3.1, electric: 4.4, tide: 5.6 };

/** Colorama for a fountain plate: the project's ramp as an SVG gradient map, applied by `filter: url(#id)` on the
 *  plate's wrapper. Renders nothing for the mint plate (the shader's own palette). */
export function RampFilter({ id, fountain, density = 0 }: { id: string; fountain: NonNullable<Project["print"]>["fountain"]; density?: number }) {
  const ramp = RAMPS[fountain];
  if (!ramp) return null;
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
        {/* the mint ink only spans luminance ≈ 0.6–0.95: stretch 0.62–0.95 to the full ramp, densest core to paper */}
        <feComponentTransfer>
          <feFuncR type="linear" slope="3" intercept={-1.85 - density} />
          <feFuncG type="linear" slope="3" intercept={-1.85 - density} />
          <feFuncB type="linear" slope="3" intercept={-1.85 - density} />
        </feComponentTransfer>
        <feComponentTransfer>
          <feFuncR type="table" tableValues={channel(ramp, 0)} />
          <feFuncG type="table" tableValues={channel(ramp, 1)} />
          <feFuncB type="table" tableValues={channel(ramp, 2)} />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
export const hasRamp = (fountain: NonNullable<Project["print"]>["fountain"]) => Boolean(RAMPS[fountain]);

export default function BleedName({
  title,
  print,
  as: Tag = "h1",
  className = "",
  id,
  params,
  density = 0,
}: {
  title: string;
  print: NonNullable<Project["print"]>;
  as?: "h1" | "h2" | "div";
  className?: string;
  id?: string;
  params?: FountainParams; // on top of the per-print phase and crop (e.g. a cursor eddy on the home name)
  density?: number; // heavier ink: shifts the plate down its ramp toward the dense end (0 = as the end comps print)
}) {
  const ramp = RAMPS[print.fountain];
  const mapId = `ramp-${useId().replace(/:/g, "")}`;
  return (
    <Tag
      id={id}
      className={`bleed-name ${className}`}
      data-fountain={print.fountain}
      data-blurmap=""
      aria-label={title}
      style={{
        // the longest word, for the portrait sheet's fit (riso.css)
        "--fit": Math.max(...title.split(" ").map((w) => w.length)),
        ...(ramp ? { filter: `url(#${mapId})` } : {}),
      } as React.CSSProperties}
    >
      <RampFilter id={mapId} fountain={print.fountain} density={density} />
      <Fountain
        className="ink-fill bleed-fill"
        clipText params={{ phase: PHASE[print.fountain], zoom: 0.45, ...params }}
      >
        {title.split(" ").map((word, w) => (
          <span key={w} aria-hidden className="bleed-word" style={{ "--w": w } as React.CSSProperties}>
            {Array.from(word).map((ch, c) => (
              <span key={c} data-clip="" className="ink-knock bleed-letter">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </Fountain>
    </Tag>
  );
}
