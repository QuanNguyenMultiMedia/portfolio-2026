"use client";

import { useRef, use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { layout, ui, t, fx } from "@/lib/designSystem";
import { notFound } from "next/navigation";
import useLenis from "@/hooks/useLenis";

export default function ProjectPageClient({
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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-lenis-prevent
      className="relative bg-background h-screen w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      <div className="lenis-content h-screen w-fit flex items-stretch">
        {/* Typographic Hero Section - 375.studio inspired */}
        <section className="flex-shrink-0 w-[100vw] md:w-[85vw] 3xl:w-[70vw] 4xl:w-[65vw] relative flex flex-col justify-center px-12 md:px-24 3xl:px-40 4xl:px-48 overflow-hidden border-r border-foreground/5">
          <div className="relative z-10">
            <div className="flex flex-col gap-8 md:gap-16 3xl:gap-24">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.3, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4"
                >
                  <span className={`${t.meta} tracking-[0.5em] opacity-100`}>
                    {project.category}
                  </span>
                  <div className="h-px w-8 bg-foreground/20" />
                  <span className={`${t.meta} tracking-[0.5em] opacity-100`}>
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
                  className={t.hero}
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
                <p className={t.body}>
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
            className={`flex-shrink-0 h-screen flex items-center justify-center relative px-12 md:px-24 3xl:px-40 4xl:px-48 border-r border-foreground/5
              ${screen.type === "image" ? "min-w-[80vw] md:min-w-[100vw] 3xl:min-w-[90vw]" : ""}
              ${screen.type === "bento" ? "min-w-[100vw] md:min-w-[120vw] 3xl:min-w-[110vw]" : ""}
              ${screen.type === "details" ? "min-w-[50vw] md:min-w-[40vw] 3xl:min-w-[35vw]" : ""}
            `}
          >
            {/* Editorial Grid Module */}
            {screen.type === "bento" && (
              <div className="w-full h-full py-24 md:py-32 3xl:py-40 4xl:py-48 grid grid-cols-12 gap-6 md:gap-12 3xl:gap-16 4xl:gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className="col-span-8 h-[60vh] 3xl:h-[65vh] relative overflow-hidden group border border-primary/10"
                >
                  <img
                    src={screen.images?.[0]}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                <div className="col-span-4 space-y-12 3xl:space-y-16">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="aspect-square relative overflow-hidden border border-foreground/5"
                  >
                    <img
                      src={screen.images?.[1]}
                      alt={`${project.title} detail`}
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
                      alt={`${project.title} detail secondary`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* High-Impact Single Image */}
            {screen.type === "image" && (
              <div className="w-full h-[75vh] 3xl:h-[80vh] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative overflow-hidden group border border-primary/10"
                >
                  <img
                    src={screen.src}
                    alt={screen.caption || project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                  />
                  <div className="absolute bottom-8 right-8 3xl:bottom-12 3xl:right-12 text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest opacity-30 uppercase pointer-events-none">
                    IMG_REF // {i + 1}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Editorial Content */}
            {screen.type === "details" && (
              <div className="max-w-[576px] 3xl:max-w-3xl 4xl:max-w-4xl space-y-8 3xl:space-y-12">
                <div className="h-px w-16 3xl:w-24 bg-primary" />
                <h3 className={t.display}>
                  {screen.content}
                </h3>
              </div>
            )}
          </section>
        ))}

        {/* Conclusion / Next Project - High Impact Offmenu Style */}
        <section className="flex-shrink-0 w-[100vw] md:w-[80vw] 3xl:w-[70vw] 4xl:w-[65vw] relative flex flex-col justify-center px-12 md:px-24 3xl:px-40 4xl:px-48 overflow-hidden group">
          <Link
            href={`/works/${projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length].slug}`}
            className="relative z-10 flex flex-col gap-12 3xl:gap-16"
          >
            <div className="space-y-4">
              <span className={`${t.meta} tracking-[0.8em] opacity-40 group-hover:text-primary transition-colors`}>
                Want to see more?
              </span>
              <h3 className={`${t.display} group-hover:italic transition-all duration-700`}>
                Next Project
              </h3>
            </div>

            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden border border-primary/10">
              <motion.img
                src={
                  projects[
                    (projects.findIndex((p) => p.slug === slug) + 1) %
                      projects.length
                  ].coverImage
                }
                alt="Next project preview"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${t.h1} text-white opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700`}>
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
