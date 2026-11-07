"use client";
import "@/styles/hud.css";
// The section rail for the print run: one hairline notch per sheet, the active one long and inked.
// PrintRun reports the nearest sheet with run-index; a click asks for that sheet with run-goto.
// Hidden until the run has reported once (flow layout or no run keeps it out of the way).
import { useEffect, useState } from "react";

type RunIndex = { i: number; n: number };

export default function IndexRail() {
  const [state, setState] = useState<RunIndex | null>(null);

  useEffect(() => {
    const onIndex = (e: Event) => setState((e as CustomEvent<RunIndex>).detail);
    window.addEventListener("run-index", onIndex);
    return () => window.removeEventListener("run-index", onIndex);
  }, []);

  const active = state?.i ?? 0;
  const n = state?.n ?? 0;

  return (
    <nav aria-label="Sections" className="index-rail" hidden={!state}>
      {Array.from({ length: n }, (_, k) => (
        <button
          key={k}
          type="button"
          className="index-rail-notch"
          aria-label={`Section ${k + 1} of ${n}`}
          aria-current={k === active ? "true" : undefined}
          onClick={() => window.dispatchEvent(new CustomEvent("run-goto", { detail: { i: k } }))}
        />
      ))}
    </nav>
  );
}
