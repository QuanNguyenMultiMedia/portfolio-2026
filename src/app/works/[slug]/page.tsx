"use client";

import { useRef, use, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import BalancedText from "@/components/BalancedText";
import Lenis from "lenis";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const screens = project.screens;

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.querySelector(".lenis-content") as HTMLElement,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      wheelMultiplier: 1.2,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

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
      {/* Editorial Header */}
      <div className="fixed top-8 left-8 md:top-12 md:left-12 z-50 pointer-events-auto flex items-center gap-12">
        <Link href="/works" className="group flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center border border-foreground/10 group-hover:border-foreground/40 transition-colors">
            <span className="text-[10px] font-mono group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </div>
        </Link>
        <div className="hidden md:flex flex-col gap-0.5">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-60">
            {project.title}
          </span>
        </div>
      </div>

      <div className="lenis-content h-screen w-fit flex items-stretch">
        {/* Typographic Hero Section - 375.studio inspired */}
        <section className="flex-shrink-0 w-[100vw] md:w-[85vw] relative flex flex-col justify-center px-12 md:px-24 overflow-hidden border-r border-foreground/5">
          <div className="relative z-10">
            <div className="flex flex-col gap-8 md:gap-16">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.3, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-[10px] font-mono tracking-[0.5em] uppercase">
                    {project.category}
                  </span>
                  <div className="h-px w-8 bg-foreground/20" />
                  <span className="text-[10px] font-mono tracking-[0.5em] uppercase">
                    {project.year}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.2,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="text-8xl md:text-[14rem] font-display uppercase leading-[0.75] tracking-tighter"
                >
                  {project.title.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={
                        i % 2 === 1
                          ? "italic font-light block ml-12 md:ml-32 text-primary"
                          : "block"
                      }
                    >
                      {word}
                    </span>
                  ))}
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="max-w-2xl"
              >
                <div className="h-px w-16 bg-primary/40 mb-8" />
                <p className="text-lg font-light leading-relaxed opacity-70">
                  {project.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Modules - Offmenu Editorial Style */}
        {screens.map((screen, i) => (
          <section
            key={i}
            className={`flex-shrink-0 h-screen flex items-center justify-center relative px-12 md:px-24 border-r border-foreground/5
              ${screen.type === "image" ? "min-w-[80vw] md:min-w-[100vw]" : ""}
              ${screen.type === "bento" ? "min-w-[100vw] md:min-w-[120vw]" : ""}
              ${screen.type === "details" ? "min-w-[50vw] md:min-w-[40vw]" : ""}
            `}
          >
            {/* Editorial Grid Module */}
            {screen.type === "bento" && (
              <div className="w-full h-full py-24 md:py-32 grid grid-cols-12 gap-6 md:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className="col-span-8 h-[60vh] relative overflow-hidden group shadow-2xl"
                >
                  <img
                    src={screen.images?.[0]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                <div className="col-span-4 space-y-12">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="aspect-square relative overflow-hidden border border-foreground/5"
                  >
                    <img
                      src={screen.images?.[1]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="aspect-[4/3] relative overflow-hidden border border-foreground/5"
                  >
                    <img
                      src={screen.images?.[2]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* High-Impact Single Image */}
            {screen.type === "image" && (
              <div className="w-full h-[75vh] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative overflow-hidden group shadow-2xl"
                >
                  <img
                    src={screen.src}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                  />
                  <div className="absolute bottom-8 right-8 text-[8px] font-mono tracking-widest opacity-30 uppercase pointer-events-none">
                    IMG_REF // {i + 1}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Editorial Content */}
            {screen.type === "details" && (
              <div className="max-w-[576px] space-y-8">
                <div className="h-px w-16 bg-primary" />
                <h3 className="text-4xl md:text-6xl font-display uppercase leading-tight tracking-tight">
                  {screen.content}
                </h3>
              </div>
            )}
          </section>
        ))}

        {/* Conclusion / Next Project - High Impact Offmenu Style */}
        <section className="flex-shrink-0 w-[100vw] md:w-[80vw] relative flex flex-col justify-center px-12 md:px-24 overflow-hidden group">
          <Link
            href={`/works/${projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length].slug}`}
            className="relative z-10 flex flex-col gap-12"
          >
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.8em] uppercase opacity-40 group-hover:text-primary transition-colors">
                Want to see more?
              </span>
              <h3 className="text-7xl md:text-[10rem] font-display uppercase tracking-tighter leading-none group-hover:italic transition-all duration-700">
                Next Project
              </h3>
            </div>

            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden shadow-2xl">
              <motion.img
                src={
                  projects[
                    (projects.findIndex((p) => p.slug === slug) + 1) %
                      projects.length
                  ].coverImage
                }
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl md:text-8xl font-display uppercase text-white drop-shadow-2xl opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                  {
                    projects[
                      (projects.findIndex((p) => p.slug === slug) + 1) %
                        projects.length
                    ].title
                  }
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-mono tracking-widest uppercase">
                Click to advance
              </span>
              <div className="h-px flex-1 mx-8 bg-foreground/20" />
              <span className="text-[10px] font-mono tracking-widest uppercase">
                / 2026
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
