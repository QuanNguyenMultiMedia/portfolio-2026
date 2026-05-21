"use client";

export interface HUDLabelProps {
  text: string;
  className?: string;
  showLine?: boolean;
}

export default function HUDLabel({ text, className = "", showLine = false }: HUDLabelProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="tech-label">{text}</span>
      {showLine && <div className="h-px w-12 bg-primary/20" />}
    </div>
  );
}
