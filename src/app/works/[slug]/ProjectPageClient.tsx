"use client";

import { useRef, use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "@/data/projects";
import { layout, ui, t, fx } from "@/lib/designSystem";
import { notFound } from "next/navigation";
import useLenis from "@/hooks/useLenis";
import { useScreenSize } from "@/hooks/useScreenSize";
import HUDLabel from "@/components/HUDLabel";

const MotionImage = motion.create(Image);

function DeliverableCarousel({
  images,
  screenSize,
}: {
  images: string[];
  screenSize: string;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [positionX, setPositionX] = useState(0);

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;
    const scrollWidth = carouselRef.current.scrollWidth;
    const offsetWidth = containerRef.current.offsetWidth;
    setConstraints({
      left: -Math.max(0, scrollWidth - offsetWidth),
      right: 0,
    });
  }, [images, screenSize]);

  // Center a slide in the viewport
  const getStep = () => {
    if (!carouselRef.current || !containerRef.current || images.length <= 1) return 0;
    const scrollWidth = carouselRef.current.scrollWidth;
    const offsetWidth = containerRef.current.offsetWidth;
    return (scrollWidth - offsetWidth) / (images.length - 1);
  };

  const handleNext = () => {
    const step = getStep();
    if (step === 0) return;
    const nextIndex = Math.min(images.length - 1, currentSlide + 1);
    setPositionX(-nextIndex * step);
    setCurrentSlide(nextIndex);
  };

  const handlePrev = () => {
    const step = getStep();
    if (step === 0) return;
    const prevIndex = Math.max(0, currentSlide - 1);
    setPositionX(-prevIndex * step);
    setCurrentSlide(prevIndex);
  };

  const handleDragEnd = (event: any, info: any) => {
    const step = getStep();
    if (step === 0) return;
    // Calculate ending position based on drag offset
    const currentX = positionX + info.offset.x;
    const nearestIndex = Math.min(
      images.length - 1,
      Math.max(0, Math.round(-currentX / step))
    );
    setPositionX(-nearestIndex * step);
    setCurrentSlide(nearestIndex);
  };

  const isMobile = screenSize === "mobile";

  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        <div className="w-full overflow-x-auto flex gap-4 pr-6 pb-2 scrollbar-none snap-x snap-mandatory">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[16/10] w-[75vw] flex-shrink-0 border border-primary/10 p-3 bg-surface/5 snap-center"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="75vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-mono opacity-40 tracking-wider text-right pr-6">
          SWIPE FOR MORE // 01 OF {images.length}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-6 select-none">
      <div
        ref={carouselRef}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="w-full overflow-hidden flex items-center"
      >
        <motion.div
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.15}
          animate={{ x: positionX }}
          onDragEnd={handleDragEnd}
          className="flex gap-8 cursor-grab active:cursor-grabbing w-max select-none py-4"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[16/10] h-[35vh] md:h-[45vh] 3xl:h-[50vh] 4xl:h-[55vh] border border-primary/10 bg-surface/5 p-4 md:p-6 select-none pointer-events-none flex-shrink-0 group transition-colors duration-500 hover:border-primary/20"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-[1.2s] group-hover:scale-105"
                />
              </div>
              {/* Viewfinder corner lines */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary/40 transition-colors" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/20 group-hover:border-primary/40 transition-colors" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-primary/20 group-hover:border-primary/40 transition-colors" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary/40 transition-colors" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Controls & Progress Indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-between border-t border-primary/10 pt-4 pr-4">
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-primary/70">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="hover:text-primary transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed select-none"
            >
              [ ← PREV ]
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === images.length - 1}
              className="hover:text-primary transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed select-none"
            >
              [ NEXT → ]
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* Visual Progress Line */}
            <div className="w-24 md:w-36 h-px bg-primary/10 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-primary/60"
                animate={{
                  width: `${((currentSlide + 1) / images.length) * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>

            <span className="text-[10px] font-mono tracking-widest text-foreground/40 select-none">
              SLIDE_0{currentSlide + 1} // 0{images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

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
      className={
        isMobile
          ? "relative bg-background w-full min-h-screen overflow-y-auto"
          : "relative bg-background h-screen w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      }
    >
      <div
        className={
          isMobile
            ? "lenis-content w-full h-auto flex flex-col items-stretch px-6 py-16 gap-16"
            : "lenis-content h-screen w-fit flex items-stretch"
        }
      >
        {screens.map((screen, i) => (
          <section
            key={i}
            className={
              isMobile
                ? "w-full flex items-center justify-center relative py-8 border-b border-foreground/5 last:border-b-0"
                : `flex-shrink-0 h-screen flex items-center justify-center relative px-12 md:px-24 3xl:px-40 4xl:px-48 border-r border-foreground/5
                ${screen.type === "zine-cover" ? "min-w-[85vw] md:min-w-[85vw] 3xl:min-w-[80vw]" : ""}
                ${screen.type === "editorial-text" ? "min-w-[65vw] md:min-w-[65vw] 3xl:min-w-[60vw]" : ""}
                ${screen.type === "deliverable-breakdown" ? "min-w-[90vw] md:min-w-[90vw] 3xl:min-w-[85vw]" : ""}
                ${screen.type === "zine-outro" ? "min-w-[85vw] md:min-w-[85vw] 3xl:min-w-[80vw]" : ""}
                ${screen.type === "image" ? "min-w-[80vw] md:min-w-[100vw] 3xl:min-w-[90vw]" : ""}
                ${screen.type === "bento" ? "min-w-[100vw] md:min-w-[120vw] 3xl:min-w-[110vw]" : ""}
                ${screen.type === "details" ? "min-w-[50vw] md:min-w-[40vw] 3xl:min-w-[35vw]" : ""}
              `
            }
          >
            {/* ZINE COVER SCREEN */}
            {screen.type === "zine-cover" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-6"
                    : "w-full h-full py-16 grid grid-cols-12 gap-12 items-center"
                }
              >
                {/* Desktop Left: running metadata */}
                {!isMobile && (
                  <div className="col-span-3 h-full flex flex-col justify-between border-r border-primary/10 pr-8">
                    <div className="space-y-4">
                      <HUDLabel text={project.category} />
                      <div className="text-[10px] font-mono tracking-widest uppercase opacity-40">
                        YEAR // {project.year}
                      </div>
                      <div className="text-[10px] font-mono tracking-widest uppercase opacity-40">
                        CLIENT // {project.client}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className={`${t.monoEyebrow} block opacity-30`}>
                        DELIVERABLES
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {project.services?.map((svc, sIdx) => (
                          <span
                            key={sIdx}
                            className={`${t.metaDataLabel} opacity-70`}
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content Title */}
                <div
                  className={
                    isMobile
                      ? "w-full space-y-4"
                      : "col-span-6 flex flex-col justify-center gap-8 pl-4"
                  }
                >
                  <h1 className={t.mainHeroTitle}>
                    {project.title.split(" ").map((word, idx) => (
                      <span
                        key={idx}
                        className={
                          idx % 2 === 1
                            ? "italic font-light block ml-6 text-primary"
                            : "block"
                        }
                      >
                        {word}
                      </span>
                    ))}
                  </h1>
                  <p className={t.bodyProse}>{project.description}</p>
                </div>

                {/* Tall image frame - inset matted print border */}
                <div
                  className={
                    isMobile
                      ? "w-full aspect-[4/5] relative border border-primary/10 p-3 bg-surface/5 overflow-hidden"
                      : "col-span-3 h-[60vh] relative border border-primary/10 p-4 md:p-6 bg-surface/5 overflow-hidden group transition-colors duration-500 hover:border-primary/20"
                  }
                >
                  {project.coverImage && (
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        priority
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                    </div>
                  )}
                  {/* Viewfinder corner lines */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/20 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-primary/20 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary/40 transition-colors" />
                </div>
              </div>
            )}

            {/* EDITORIAL TEXT SCREEN */}
            {screen.type === "editorial-text" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-4"
                    : "w-full h-full py-24 flex flex-col justify-center max-w-2xl 3xl:max-w-3xl 4xl:max-w-4xl"
                }
              >
                <div className="border-t border-primary/15 pt-8 space-y-6">
                  <div className={`${t.monoEyebrow} opacity-40`}>
                    [ NARRATIVE_FOCUS ] // {project.id}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 3xl:gap-12">
                    <div className="md:col-span-8 columns-2 gap-8 text-[11px] md:text-xs 3xl:text-sm leading-relaxed font-light text-foreground/75 space-y-4">
                      {screen.content?.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx} className="mb-4 inline-block w-full break-inside-avoid">
                          {para}
                        </p>
                      ))}
                    </div>
                    <div className="md:col-span-4 space-y-4 font-mono text-[9px] 3xl:text-[10px] tracking-widest text-foreground/45 border-l border-primary/10 pl-6 h-full flex flex-col justify-start">
                      <div className="border-b border-primary/5 pb-2">
                        // THE OBJECTIVE WAS TO DEFINE STRUCTURAL MOVEMENT WITH AN EDITORIAL WHITE SPACE BIAS.
                      </div>
                      <div className="border-b border-primary/5 pb-2 border-dashed">
                        // DYNAMICS GOVERNED BY CUSTOM SPRING EQUATIONS IN REAL-TIME.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DELIVERABLE BREAKDOWN SCREEN */}
            {screen.type === "deliverable-breakdown" && (
              <div
                className={
                  isMobile
                    ? "w-full flex flex-col gap-6"
                    : "w-full h-full py-16 grid grid-cols-12 gap-12 items-center"
                }
              >
                {/* Left Description Column */}
                <div
                  className={
                    isMobile
                      ? "w-full space-y-4"
                      : "col-span-4 flex flex-col justify-center gap-6 h-full pr-8 border-r border-primary/10"
                  }
                >
                  <div className="space-y-2">
                    <span className="font-mono text-2xl md:text-3xl font-black text-primary/30 block">
                      {screen.number}
                    </span>
                    <HUDLabel text="DELIVERABLE_SPEC" className="opacity-60" />
                  </div>
                  <h3 className={`${t.workItemName} text-primary`}>
                    {screen.title}
                  </h3>
                  <div className="text-[11px] md:text-xs 3xl:text-sm leading-relaxed font-light text-foreground/75 space-y-4">
                    {screen.description?.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx} className="mb-2">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right Carousel Column */}
                <div
                  className={
                    isMobile
                      ? "w-full"
                      : "col-span-8 h-full flex items-center pl-4"
                  }
                >
                  {screen.images && (
                    <DeliverableCarousel
                      images={screen.images}
                      screenSize={screenSize}
                    />
                  )}
                </div>
              </div>
            )}

            {/* OUTRO / NEXT PROJECT SCREEN */}
            {screen.type === "zine-outro" && (
              <div
                className={
                  isMobile
                    ? "w-full py-12 flex flex-col gap-8 mt-4 border-t border-foreground/5"
                    : "w-full h-full py-16 grid grid-cols-12 gap-12 items-center"
                }
              >
                {/* Desktop Left Details */}
                <div
                  className={
                    isMobile
                      ? "w-full space-y-4"
                      : "col-span-4 h-full flex flex-col justify-between pr-8 border-r border-primary/10"
                  }
                >
                  <div className="space-y-4">
                    <HUDLabel text="PROJECT_OVERVIEW" />
                    <div className="space-y-2 text-[10px] font-mono tracking-widest uppercase text-foreground/50">
                      <div>CLIENT // {project.client}</div>
                      <div>ROLE // {project.role}</div>
                      <div>YEAR // {project.year}</div>
                    </div>
                  </div>
                  <div className="pt-8">
                    <p className={`${t.bodyProse} italic opacity-60`}>
                      * All design system configurations and source interactions
                      are dynamically processed in-browser.
                    </p>
                  </div>
                </div>

                {/* Desktop Right Link - inset matted print border */}
                <div
                  className={
                    isMobile
                      ? "w-full"
                      : "col-span-8 pl-4 h-[60vh] flex items-center"
                  }
                >
                  <Link
                    href={`/works/${
                      projects[
                        (projects.findIndex((p) => p.slug === slug) + 1) %
                          projects.length
                      ].slug
                    }`}
                    className="relative w-full h-full group border border-primary/10 p-4 md:p-6 bg-surface/5 overflow-hidden block transition-colors duration-500 hover:border-primary/20"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
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
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-20">
                      <span
                        className={`${t.monoEyebrow} text-white opacity-60 group-hover:text-primary transition-colors`}
                      >
                        CONTINUE // NEXT_PROJECT
                      </span>
                      <h4
                        className={`${t.mainHeroTitle} text-white drop-shadow-md group-hover:translate-x-2 transition-transform duration-500`}
                      >
                        {
                          projects[
                            (projects.findIndex((p) => p.slug === slug) + 1) %
                              projects.length
                          ].title
                        }
                      </h4>
                    </div>
                  </div>
                  {/* Viewfinder borders */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/40 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/40 group-hover:border-primary/40 transition-colors" />
                </Link>
              </div>
            </div>
          )}

            {/* --- BACKWARD COMPATIBILITY FALLBACKS --- */}

            {/* Bento Spread */}
            {screen.type === "bento" && (
              <div
                className={
                  isMobile
                    ? "w-full grid grid-cols-1 gap-6 items-center"
                    : "w-full h-full py-24 md:py-32 grid grid-cols-12 gap-6 md:gap-12 items-center"
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                  className={
                    isMobile
                      ? "w-full aspect-[16/10] relative overflow-hidden group border border-primary/10"
                      : "col-span-8 h-[60vh] relative overflow-hidden group border border-primary/10"
                  }
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
                  </div>
                </motion.div>

                <div
                  className={
                    isMobile
                      ? "w-full grid grid-cols-2 gap-4"
                      : "col-span-4 space-y-12"
                  }
                >
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
                  </motion.div>
                </div>
              </div>
            )}

            {/* Single Image Spread */}
            {screen.type === "image" && (
              <div
                className={
                  isMobile
                    ? "w-full aspect-[16/10] flex items-center justify-center"
                    : "w-full h-[75vh] flex items-center justify-center"
                }
              >
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
                  <div className="absolute bottom-8 right-8 text-[8px] font-mono tracking-widest opacity-30 uppercase pointer-events-none">
                    IMG_REF // {i + 1}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Editorial Details */}
            {screen.type === "details" && (
              <div
                className={
                  isMobile
                    ? "w-full space-y-6"
                    : "max-w-[576px] space-y-8"
                }
              >
                <div className="h-px w-16 bg-primary" />
                <h3
                  className={
                    isMobile
                      ? "text-lg md:text-xl font-light leading-relaxed text-left"
                      : t.heroTagline
                  }
                >
                  {screen.content}
                </h3>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
