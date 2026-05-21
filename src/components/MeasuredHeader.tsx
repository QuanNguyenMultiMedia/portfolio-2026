"use client";

import { useEffect, useState } from "react";
import {
  prepareWithSegments,
  walkLineRanges,
  materializeLineRange,
} from "@chenglou/pretext";

export interface MeasuredHeaderProps {
  text: string;
  className?: string;
  maxWidth?: number;
  font?: string;
}

export default function MeasuredHeader({
  text,
  className = "",
  maxWidth = 1200,
  font = "800 112px Plus Jakarta Sans",
}: MeasuredHeaderProps) {
  const [lines, setLines] = useState<{ text: string; width: number }[]>([]);
  const [isReady, setIsReady] = useState(false);

  const [prepared, setPrepared] = useState<any>(null);

  useEffect(() => {
    if (!text) return;
    try {
      setPrepared(prepareWithSegments(text, font));
    } catch (e) {
      console.warn("Pretext preparation failed:", e);
    }
  }, [text, font]);

  useEffect(() => {
    if (!prepared) return;

    const lineData: { text: string; width: number }[] = [];
    walkLineRanges(prepared, maxWidth, (line) => {
      const materialized = materializeLineRange(prepared, line);
      lineData.push({
        text: materialized.text,
        width: line.width,
      });
    });

    setLines(lineData);
    setIsReady(false);
    setTimeout(() => setIsReady(true), 100);
  }, [prepared, maxWidth, text]);

  return (
    <div
      className={`relative ${className
        .split(" ")
        .filter(
          (c) =>
            !c.startsWith("text-") &&
            !c.startsWith("leading-") &&
            !c.startsWith("font-"),
        )
        .join(" ")}`}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="relative group/line mb-2"
          style={{ width: `${line.width}px` }}
        >
          {/* Dimension Label */}
          <div className="absolute -top-6 left-0 text-[8px] font-mono opacity-0 group-hover/line:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/line:translate-y-0 text-tech-blue">
            MEAS_W // {Math.round(line.width)}PX
          </div>

          <h2
            className={`${className
              .split(" ")
              .filter(
                (c) =>
                  c.startsWith("text-") ||
                  c.startsWith("leading-") ||
                  c.startsWith("font-"),
              )
              .join(
                " ",
              )} transition-all duration-700 ease-out m-0 p-0 whitespace-nowrap`}
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? "none" : "translateY(20px) skewX(-10deg)",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {line.text}
          </h2>

          {/* Underline HUD */}
          <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-primary/5 group-hover/line:bg-tech-blue/20 transition-all scale-x-0 group-hover/line:scale-x-100 origin-left duration-500" />
        </div>
      ))}
    </div>
  );
}
