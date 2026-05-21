"use client";

import { useEffect, useState, useMemo } from "react";
import { prepareWithSegments, walkLineRanges } from "@chenglou/pretext";

export interface BalancedTextProps {
  text: string;
  className?: string;
  maxWidth?: number;
  font?: string;
  style?: React.CSSProperties;
  showHUD?: boolean;
}

export default function BalancedText({ 
  text, 
  className = "", 
  maxWidth = 800, 
  font = "400 16px Inter",
  style = {},
  showHUD = false
}: BalancedTextProps) {
  const [balancedWidth, setBalancedWidth] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [lines, setLines] = useState<{ width: number; height: number; y: number }[]>([]);
  
  const prepared = useMemo(() => {
    if (!text || typeof window === "undefined") return null;
    try {
      return prepareWithSegments(text, font);
    } catch (e) {
      console.warn("Pretext preparation failed:", e);
      return null;
    }
  }, [text, font]);

  useEffect(() => {
    if (!prepared) return;

    let maxW = 0;
    const lineData: { width: number; height: number; y: number }[] = [];
    let i = 0;
    
    walkLineRanges(prepared, maxWidth, (line) => {
      if (line.width > maxW) maxW = line.width;
      lineData.push({ 
        width: line.width, 
        height: 24, // Approximation or we could calculate from font
        y: i * 24 
      });
      i++;
    });

    setLines(lineData);
    setBalancedWidth(Math.ceil(maxW) + 1);
    setIsReady(true);
  }, [prepared, maxWidth]);

  return (
    <div 
      className={`${className} relative transition-opacity duration-500 group/text`}
      style={{ 
        ...style,
        maxWidth: balancedWidth ? `${balancedWidth}px` : `${maxWidth}px`,
        opacity: isReady ? 1 : 0,
        width: "100%"
      }}
    >
      <div className="relative z-10">{text}</div>
      
      {showHUD && isReady && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/text:opacity-100 transition-opacity duration-300">
          {lines.map((line, i) => (
            <div 
              key={i}
              className="absolute left-0 border-l border-tech-blue/30 overflow-hidden"
              style={{ 
                width: `${line.width}px`, 
                height: `1.4em`, // Using em to match line height roughly
                top: `${i * 1.6}em`, 
              }}
            >
              <div className="absolute top-0 right-0 text-[6px] font-mono text-tech-blue opacity-50">
                L_0{i+1} // {Math.round(line.width)}PX
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-tech-blue/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-tech-blue/5 to-transparent animate-scanline opacity-20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
