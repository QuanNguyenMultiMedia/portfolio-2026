"use client";

import { useRef, use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";
import { layout, ui, t, fx } from "@/lib/designSystem";
import { notFound } from "next/navigation";
import useLenis from "@/hooks/useLenis";
import { useScreenSize } from "@/hooks/useScreenSize";

const MotionImage = motion.create(Image);

export default function ProjectPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const screenSize = useScreenSize();
  const isMobile = screenSize === "mobile";
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis({
    wrapperRef: isMobile ? undefined : scrollRef,
    contentQuery: isMobile ? undefined : ".lenis-content",
    orientation: isMobile ? "vertical" : "horizontal",
    gestureOrientation: isMobile ? "vertical" : "both",
    wheelMultiplier: 0.7,
    lerp: 0.11,
    autoAssign: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const screens = project.screens;

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
      onMouseDown={isMobile ? undefined : handleMouseDown}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseUp={isMobile ? undefined : handleMouseUp}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      data-lenis-prevent={isMobile ? undefined : ""}
      className={isMobile 
        ? "relative bg-background w-full min-h-screen overflow-y-auto" 
        : "relative bg-background h-screen w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"}
    >
      <div className={isMobile 
        ? "lenis-content w-full h-auto flex flex-col items-stretch px-6 py-16 gap-12" 
        : "lenis-content h-screen w-fit flex items-stretch"}>
        {/* Typographic Hero Section - 375.studio inspired */}
        <section className={isMobile 
          ? "w-full relative flex flex-col justify-center py-8 overflow-hidden border-b border-foreground/5" 
          : "flex-shrink-0 w-[100vw] md:w-[85vw] 3xl:w-[70vw] 4xl:w-[65vw] relative flex flex-col justify-center px-12 md:px-24 3xl:px-40 4xl:px-48 overflow-hidden border-r border-foreground/5"}>
          <div className="relative z-10">
            <div className="flex flex-col gap-8 md:gap-16 3xl:gap-24">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.3, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4"
                >
                  <span className={`${t.metaDataLabel} tracking-[0.5em] opacity-100`}>
                    {project.category}
                  </span>
                  <div className="h-px w-8 bg-foreground/20" />
                  <span className={`${t.metaDataLabel} tracking-[0.5em] opacity-100`}>
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
                  className={t.mainHeroTitle}
                >
                  {project.title.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className={
                        i % 2 === 1
                          ? "italic font-light block ml-6 md:ml-16 3xl:ml-24 4xl:ml-32 text-primary"
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
                className="max-w-xl 3xl:max-w-2xl 4xl:max-w-3xl"
              >
                <div className="h-px w-12 3xl:w-16 4xl:w-20 bg-primary/40 mb-6 3xl:mb-8" />
                <p className={t.bodyProse}>
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
            className={isMobile 
              ? "w-full flex items-center justify-center relative py-4 border-b border-foreground/5 last:border-b-0"
              : `flex-shrink-0 h-screen flex items-center justify-center relative px-12 md:px-24 3xl:px-40 4xl:px-48 border-r border-foreground/5
                ${screen.type === "image" ? "min-w-[80vw] md:min-w-[100vw] 3xl:min-w-[90vw]" : ""}
                ${screen.type === "bento" ? "min-w-[100vw] md:min-w-[120vw] 3xl:min-w-[110vw]" : ""}
                ${screen.type === "details" ? "min-w-[50vw] md:min-w-[40vw] 3xl:min-w-[35vw]" : ""}
              `
            }
          >
            {/* Editorial Grid Module */}
            {screen.type === "bento" && (
              <div className={isMobile 
                ? "w-full grid grid-cols-1 gap-6 items-center"
                : "w-full h-full py-24 md:py-32 3xl:py-40 4xl:py-48 grid grid-cols-12 gap-6 md:gap-12 3xl:gap-16 4xl:gap-24 items-center"}>
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className={isMobile 
                    ? "w-full aspect-[16/10] relative overflow-hidden group border border-primary/10"
                    : "col-span-8 h-[60vh] 3xl:h-[65vh] relative overflow-hidden group border border-primary/10"}
                >
                  <Image
                    src={screen.images?.[0] || ""}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-primary/10 group-hover:border-primary/30 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                      <div className="w-1 h-1 bg-primary/20 group-hover:bg-primary/40 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                <div className={isMobile 
                  ? "w-full grid grid-cols-2 gap-4"
                  : "col-span-4 space-y-12 3xl:space-y-16"}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="aspect-square relative overflow-hidden border border-foreground/5 group"
                  >
                    <Image
                      src={screen.images?.[1] || ""}
                      alt={`${project.title} detail`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    
                    {/* Viewfinder overlay */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary transition-colors duration-500" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="aspect-[4/3] relative overflow-hidden border border-foreground/5 group"
                  >
                    <Image
                      src={screen.images?.[2] || ""}
                      alt={`${project.title} detail secondary`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    
                    {/* Viewfinder overlay */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-primary/20 group-hover:border-primary transition-colors duration-500" />
                      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary transition-colors duration-500" />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* High-Impact Single Image */}
            {screen.type === "image" && (
              <div className={isMobile ? "w-full aspect-[16/10] flex items-center justify-center" : "w-full h-[75vh] 3xl:h-[80vh] flex items-center justify-center"}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative overflow-hidden group border border-primary/10"
                >
                  <Image
                    src={screen.src || ""}
                    alt={screen.caption || project.title}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                  />
                  <div className="absolute bottom-8 right-8 3xl:bottom-12 3xl:right-12 text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest opacity-30 uppercase pointer-events-none">
                    IMG_REF // {i + 1}
                  </div>
                  
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-primary/10 group-hover:border-primary/30 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                      <div className="w-1 h-1 bg-primary/20 group-hover:bg-primary/40 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Editorial Content */}
            {screen.type === "details" && (
              <div className={isMobile 
                ? "w-full space-y-6"
                : "max-w-[576px] 3xl:max-w-3xl 4xl:max-w-4xl space-y-8 3xl:space-y-12"}>
                <div className="h-px w-16 3xl:w-24 bg-primary" />
                <h3 className={isMobile ? "text-lg md:text-xl font-light leading-relaxed text-left" : t.sectionHeaderDisplay}>
                  {screen.content}
                </h3>
              </div>
            )}
          </section>
        ))}

        {/* Conclusion / Next Project - High Impact Offmenu Style */}
        <section className={isMobile 
          ? "w-full py-12 relative flex flex-col justify-center overflow-hidden border-t border-foreground/5 mt-4"
          : "flex-shrink-0 w-[100vw] md:w-[80vw] 3xl:w-[70vw] 4xl:w-[65vw] relative flex flex-col justify-center px-12 md:px-24 3xl:px-40 4xl:px-48 overflow-hidden group"}>
          <Link
            href={`/works/${projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length].slug}`}
            className="relative z-10 flex flex-col gap-12 3xl:gap-16 w-full"
          >
            <div className="space-y-4">
              <span className={`${t.metaDataLabel} tracking-[0.8em] opacity-40 group-hover:text-primary transition-colors`}>
                Want to see more?
              </span>
              <h3 className={`${t.sectionHeaderDisplay} group-hover:italic transition-all duration-700`}>
                Next Project
              </h3>
            </div>

            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden border border-primary/10">
              <MotionImage
                src={
                  projects[
                    (projects.findIndex((p) => p.slug === slug) + 1) %
                      projects.length
                  ].coverImage || ""
                }
                alt="Next project preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${t.pageTitle} text-white opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700`}>
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
              <span className="text-[10px] 3xl:text-xs 4xl:text-sm font-mono tracking-widest uppercase">
                Click to advance
              </span>
              <div className="h-px flex-1 mx-8 bg-foreground/20" />
              <span className="text-[10px] 3xl:text-xs 4xl:text-sm font-mono tracking-widest uppercase">
                / 2026
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
