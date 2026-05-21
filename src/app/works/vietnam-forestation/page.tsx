"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

const VietnamForest3D = dynamic(
  () => import("@/components/projects/VietnamForest3D"),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

export default function VietnamForestationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const screens = [
    {
      type: "hero",
      title: "Vietnam Forestation",
      subtitle: "3D Extrusion & GIS Data Visualization",
      description:
        "A technical study on high-fidelity environmental data rendering.",
    },
    {
      type: "visual",
      content: <VietnamForest3D />,
      caption: "01. Real-time GIS Extrusion",
    },
    {
      type: "details",
      content:
        "Optimized for 3050 Ti systems using hardware-aware rendering and performance monitoring.",
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current || !scrollRef.current) return;
      const sections = gsap.utils.toArray(".horizontal-slide");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: scrollRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + containerRef.current!.offsetWidth,
        },
      });
    },
    { scope: scrollRef },
  );

  return (
    <div ref={scrollRef} className="bg-background overflow-x-hidden">
      <div ref={containerRef} className="flex w-[300vw] h-screen">
        {screens.map((screen, i) => (
          <section
            key={i}
            className="horizontal-slide flex-shrink-0 w-screen h-screen flex items-center justify-center p-12 border-r border-primary/5 relative"
          >
            <div className="absolute top-12 right-12 tech-label">
              SEC_0{i + 1} // {screen.type.toUpperCase()}
            </div>

            {screen.type === "hero" && (
              <div className="max-w-4xl w-full">
                <h1 className="text-5xl md:text-7xl font-display uppercase leading-tight mb-8">
                  {screen.title}
                </h1>
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="space-y-4">
                    <p className="text-xs font-bold tracking-widest uppercase opacity-40">
                      {screen.subtitle}
                    </p>
                    <p className="text-xl font-light max-w-md">
                      {screen.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {screen.type === "visual" && (
              <div className="w-full h-full relative">
                {screen.content}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 tech-label opacity-40">
                  {screen.caption}
                </div>
              </div>
            )}

            {screen.type === "details" && (
              <div className="max-w-2xl text-center space-y-8">
                <p className="text-3xl font-light leading-relaxed">
                  {screen.content}
                </p>
                <div className="h-px w-24 bg-primary mx-auto opacity-20" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Static Overlays */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 flex gap-4 items-center z-50">
        <span className="tech-label opacity-40">01</span>
        <div className="flex gap-2">
          {screens.map((_, i) => (
            <div key={i} className="h-[2px] w-8 bg-primary/10 relative" />
          ))}
        </div>
        <span className="tech-label opacity-40">0{screens.length}</span>
      </div>
    </div>
  );
}
