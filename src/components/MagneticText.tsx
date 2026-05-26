"use client";

import { useEffect, useRef, useState } from "react";
import {
  prepareWithSegments,
  layoutNextLineRange,
  materializeLineRange,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

interface MagneticTextProps {
  text: string;
  className?: string;
  maxWidth?: number;
  font?: string;
}

export default function MagneticText({
  text,
  className = "",
  maxWidth = 600,
  font = "300 20px Inter",
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const [prepared, setPrepared] = useState<PreparedTextWithSegments | null>(
    null,
  );

  useEffect(() => {
    if (!text) return;
    try {
      const p = prepareWithSegments(text, font);
      setPrepared(p);
    } catch (e) {
      console.warn("Pretext preparation failed:", e);
    }
  }, [text, font]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!prepared) return;

    const reflow = () => {
      try {
        const newLines: string[] = [];
        let currentCursor = { segmentIndex: 0, graphemeIndex: 0 };
        let lineY = 0;
        const lineHeight = 32;

        for (let i = 0; i < 50; i++) {
          // Safety cap for lines
          if (
            currentCursor.segmentIndex < 0 ||
            currentCursor.segmentIndex >= prepared.segments.length
          )
            break;

          const distY = Math.abs(lineY - mousePos.y);
          let effectiveWidth = maxWidth;

          if (distY < 50 && mousePos.x > maxWidth / 2) {
            const shrinkAmount = Math.max(0, 100 - distY * 2);
            effectiveWidth = maxWidth - shrinkAmount;
          }

          const line = layoutNextLineRange(
            prepared,
            currentCursor,
            Math.max(1, effectiveWidth),
          );

          if (!line) {
            break;
          }

          if (
            line.start.segmentIndex === line.end.segmentIndex &&
            line.start.graphemeIndex === line.end.graphemeIndex
          )
            break;

          const materialized = materializeLineRange(prepared, line);
          if (materialized && typeof materialized.text === "string") {
            newLines.push(materialized.text);
          }

          currentCursor = line.end;
          lineY += lineHeight;
        }
        setLines(newLines);
      } catch (e) {
        console.error("MagneticText reflow error:", e);
      }
    };

    const rafId = requestAnimationFrame(reflow);
    return () => cancelAnimationFrame(rafId);
  }, [prepared, mousePos, maxWidth, text]);

  return (
    <div
      ref={containerRef}
      className={`${className} transition-all duration-300 ease-out`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="whitespace-nowrap transition-all duration-300 ease-out"
          style={{
            opacity: 1,
            transform: `translateX(${mousePos.y > i * 32 - 20 && mousePos.y < i * 32 + 20 && mousePos.x > maxWidth / 2 ? -10 : 0}px)`,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
