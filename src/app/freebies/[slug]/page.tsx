"use client";

import { useRef, use, useState } from "react";
import Link from "next/link";
import BalancedText from "@/components/BalancedText";
import { notFound } from "next/navigation";

import MeasuredHeader from "@/components/MeasuredHeader";
import WaveGradientBar from "@/components/WaveGradientBar";
import useLenis from "@/hooks/useLenis";
import { freebies } from "@/data/freebies";

export default function FreebiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis({
    wrapperRef: scrollRef,
    contentQuery: ".lenis-content",
    orientation: "horizontal",
    gestureOrientation: "both",
    wheelMultiplier: 0.7,
    lerp: 0.11,
    autoAssign: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const item = freebies.find((f) => f.slug === slug);

  if (!item) {
    notFound();
  }

  const project = {
    title: item.title,
    slug: item.id,
    screens: [
      {
        type: "hero" as const,
        title: item.title.toUpperCase(),
        subtitle: `${item.category} // 2026 EDITION`,
        description: item.description,
      },
      {
        type: "image" as const,
        caption: "PREVIEW_RENDER_01",
        src: item.image,
      },
      {
        type: "details" as const,
        content:
          "Every asset is built with production scalability in mind. Organized layer structures, consistent naming conventions, and colour-managed profiles ensure seamless integration into any existing workflow — whether you're working in After Effects, Figma, or a custom WebGL pipeline.",
      },
    ],
  };
  const screens = project.screens;

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!lenisRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(lenisRef.current.scroll);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !lenisRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    lenisRef.current.scrollTo(scrollLeft - walk, { immediate: true });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-lenis-prevent
      className="bg-background h-screen w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Back Button */}
      <div className="fixed top-16 left-16 z-50 pointer-events-auto">
        <Link href="/freebies" className="group flex items-center gap-4 py-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/60 transition-colors" />
            <span className="text-[10px] font-mono group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            Back To Boutique
          </span>
        </Link>
      </div>

      <WaveGradientBar
        colors={["#5e60ce", "#5390d9", "#4ea8de", "#48bfe3", "#56cfe1"]}
        topic="FREEBIES"
      />

      <div className="lenis-content h-screen w-fit flex">
        {screens.map((screen, i) => (
          <section
            key={i}
            className={`flex-shrink-0 h-screen flex items-center justify-center relative px-24 
              ${screen.type === "hero" ? "min-w-[80vw]" : ""}
              ${screen.type === "image" ? "min-w-[100vw]" : ""}
              ${screen.type === "details" ? "min-w-[60vw]" : ""}
            `}
          >
              <div className="absolute top-12 right-12 tech-label">
                {`SEC_0${i + 1} // ${screen.type.toUpperCase()}`}
              </div>

            {screen.type === "hero" && (
              <div className="max-w-4xl w-full">
                <MeasuredHeader
                  text={screen.title || ""}
                  className="text-5xl md:text-7xl font-display uppercase leading-tight mb-8"
                  maxWidth={1000}
                  font="800 72px Plus Jakarta Sans"
                />
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-40">
                      {screen.subtitle}
                    </p>
                    <BalancedText
                      text={screen.description || ""}
                      className="text-xl font-light opacity-80"
                      maxWidth={448}
                      font="300 20px Inter"
                      showHUD={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {screen.type === "image" && (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-full max-w-6xl aspect-video bg-primary/5 rounded-none relative overflow-hidden border border-primary/5">
                  {screen.src && (
                    <img
                      src={screen.src}
                      alt={screen.caption || "Project Image"}
                      className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 pointer-events-none"
                    />
                  )}
                </div>
                <p className="tech-label opacity-40">{screen.caption}</p>
              </div>
            )}

            {screen.type === "details" && (
              <div className="max-w-2xl text-center space-y-8">
                <BalancedText
                  text={screen.content || ""}
                  className="text-3xl font-light leading-relaxed italic"
                  maxWidth={672}
                  font="300 30px Inter"
                  showHUD={true}
                />
                <div className="h-px w-24 bg-tech-blue mx-auto opacity-40" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Progress Overlay */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 flex gap-4 items-center z-50 opacity-40">
        <span className="tech-label text-[8px]">01</span>
        <div className="flex gap-1">
          {screens.map((_, i) => (
            <div key={i} className="h-[1px] w-6 bg-primary/20 relative" />
          ))}
        </div>
        <span className="tech-label text-[8px]">0{screens.length}</span>
      </div>

      <div className="fixed bottom-32 right-12 flex items-center gap-4 tech-label opacity-30 z-50">
        <span>DRAG_OR_SCROLL</span>
        <div className="w-12 h-px bg-primary" />
      </div>
    </div>
  );
}
