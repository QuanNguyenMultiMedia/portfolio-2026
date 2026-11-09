// The project name as MainTitle.aep sets it on a project's spreads (03 title, 05/08/11 end): huge serif in the
// project's own fountain, screened, each letter printed as its own pass, so the baselines step a little and
// the tone moves along the ramp letter by letter. The name bleeds off the sheet's trim; the deck overprints it.
// `stack` sets each word as a column of letters (11.HerondLabs_End), words stepped down against each other.
// Motion lives in CSS (riso.css › bleed): letters bleed in from a soft blot one after another, then drift
// against the spread on its own scroll timeline, so the overprint shifts as the sheet passes.
import type { Project } from "@/data/projects";

// per-letter baseline step, in em: a fixed sequence (no randomness, so server and client print the same sheet)
const STEP = [0, 0.03, -0.02, 0.01, 0.05, 0.035, -0.015, 0.02, -0.03, 0.04, 0.005, -0.025];

export default function BleedName({
  title,
  print,
  stack = false,
  as: Tag = "h1",
  className = "",
}: {
  title: string;
  print: NonNullable<Project["print"]>;
  stack?: boolean;
  as?: "h1" | "h2" | "div";
  className?: string;
}) {
  const words = title.split(" ");
  const n = title.replace(/ /g, "").length;
  const rows = Math.max(...words.map((w) => w.length));
  let k = 0;
  return (
    <Tag
      className={`bleed-name ${stack ? "is-stack" : ""} ${className}`}
      data-fountain={print.fountain}
      style={{ "--n": n, "--rows": rows } as React.CSSProperties}
    >
      <span className="sr-only">{title}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden className="bleed-word" style={{ "--w": w } as React.CSSProperties}>
          {Array.from(word).map((ch, c) => {
            const i = k++;
            return (
              <span
                key={c}
                className="bleed-letter plate"
                style={{ "--k": i, "--jy": `${STEP[i % STEP.length]}em` } as React.CSSProperties}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
