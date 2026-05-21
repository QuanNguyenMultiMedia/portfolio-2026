"use client";

export default function Viewfinder() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-12 left-12 w-4 h-4 border-t border-l border-primary/20" />
      <div className="absolute top-12 right-12 w-4 h-4 border-t border-r border-primary/20" />
      <div className="absolute bottom-12 left-12 w-4 h-4 border-b border-l border-primary/20" />
      <div className="absolute bottom-12 right-12 w-4 h-4 border-b border-r border-primary/20" />
    </div>
  );
}
