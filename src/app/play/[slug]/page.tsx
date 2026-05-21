"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { playItems } from "@/data/play";
import { notFound } from "next/navigation";

export default function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentIndex = playItems.findIndex((p) => p.slug === slug);
  const project = playItems[currentIndex];

  if (!project) {
    notFound();
  }

  const prevProject =
    currentIndex > 0
      ? playItems[currentIndex - 1]
      : playItems[playItems.length - 1];
  const nextProject =
    currentIndex < playItems.length - 1
      ? playItems[currentIndex + 1]
      : playItems[0];

  return (
    <div className="bg-background h-screen w-full overflow-hidden relative flex items-center justify-center font-serif text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Back Button (Hidden in fullscreen) */}
      <motion.div
        animate={{
          opacity: isFullscreen ? 0 : 1,
          pointerEvents: isFullscreen ? "none" : "auto",
        }}
        className="absolute top-16 left-16 md:top-24 md:left-24 z-50"
      >
        <Link href="/play" className="group flex items-center gap-4 py-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-foreground/20 group-hover:border-foreground/60 transition-colors" />
            <span className="text-[10px] font-sans group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </div>
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            Return_Archive
          </span>
        </Link>
      </motion.div>

      {/* Main Screen Area - Viewfinder Frame */}
      <motion.div
        initial={false}
        animate={{
          width: isFullscreen ? "100vw" : "70vw",
          height: isFullscreen ? "100vh" : "70vh",
          marginTop: isFullscreen ? 0 : "3rem", // mt-12 approx
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex flex-col z-10 border border-foreground/10 group bg-background"
      >
        {/* Viewfinder Corners (Glued to the Frame) */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-foreground/40 z-20 pointer-events-none -translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-foreground/40 z-20 pointer-events-none translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-foreground/40 z-20 pointer-events-none -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-foreground/40 z-20 pointer-events-none translate-x-[1px] translate-y-[1px]" />

        {/* TOP BAR: Sits above the frame normally, drops inside during fullscreen */}
        <div
          className={`absolute w-full flex justify-between items-end pointer-events-none transition-all duration-700 ease-[0.23,1,0.32,1] z-30 ${
            isFullscreen ? "top-6 px-6" : "bottom-[calc(100%+24px)] left-0"
          }`}
        >
          {/* Top Left: Metadata */}
          <div className="flex flex-col gap-1 pointer-events-auto">
            <span className="tech-label text-foreground/50">DATA_VIZ</span>
            <span className="font-mono text-[10px] opacity-80">
              {project.title.toUpperCase()}
            </span>
          </div>

          {/* Top Right: Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="pointer-events-auto flex items-center gap-3 group/btn"
          >
            <span className="tech-label group-hover/btn:text-foreground transition-colors">
              {isFullscreen ? "MINIMIZE" : "EXPAND"}
            </span>
            <div className="w-4 h-4 border border-foreground/30 flex items-center justify-center group-hover/btn:border-foreground transition-colors bg-background/50 backdrop-blur-sm">
              {isFullscreen ? (
                <div className="w-2 h-2 border-b border-l border-foreground/60 transition-transform" />
              ) : (
                <div className="w-2 h-2 border-t border-r border-foreground/60 transition-transform" />
              )}
            </div>
          </button>
        </div>

        {/* BOTTOM BAR: Sits below the frame normally, rises inside during fullscreen */}
        <div
          className={`absolute w-full flex justify-between items-start pointer-events-none transition-all duration-700 ease-[0.23,1,0.32,1] z-30 ${
            isFullscreen ? "bottom-6 px-6" : "top-[calc(100%+24px)] left-0"
          }`}
        >
          {/* Bottom Left: Counter */}
          <div className="pointer-events-auto flex gap-2 items-baseline">
            <span className="font-mono text-[14px]">
              {(currentIndex + 1).toString().padStart(2, "0")}
            </span>
            <span className="tech-label mb-[1px] opacity-40">
              / {playItems.length.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Bottom Right: Status */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" />
            <span className="tech-label opacity-80">INTERACTIVE</span>
          </div>
        </div>

        {/* LEFT NAV: Sits to the left normally, slides inside during fullscreen */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-700 ease-[0.23,1,0.32,1] z-30 ${
            isFullscreen ? "left-6" : "right-[calc(100%+32px)]"
          }`}
        >
          <Link
            href={`/play/${prevProject.slug}`}
            className="block p-4 group/nav backdrop-blur-sm bg-background/20 hover:bg-background/40 transition-colors rounded-full border border-transparent hover:border-foreground/10"
          >
            <div className="w-3 h-3 border-l border-t border-foreground/30 group-hover/nav:border-foreground transition-colors -rotate-45" />
          </Link>
        </div>

        {/* RIGHT NAV: Sits to the right normally, slides inside during fullscreen */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-700 ease-[0.23,1,0.32,1] z-30 ${
            isFullscreen ? "right-6" : "left-[calc(100%+32px)]"
          }`}
        >
          <Link
            href={`/play/${nextProject.slug}`}
            className="block p-4 group/nav backdrop-blur-sm bg-background/20 hover:bg-background/40 transition-colors rounded-full border border-transparent hover:border-foreground/10"
          >
            <div className="w-3 h-3 border-r border-t border-foreground/30 group-hover/nav:border-foreground transition-colors rotate-45" />
          </Link>
        </div>

        {/* Frame Content - The "Playing" area */}
        <div className="relative w-full h-full overflow-hidden z-10 bg-background">
          <motion.div
            initial={false}
            animate={{ scale: isFullscreen ? 1 : 0.7 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-0 left-0 w-[100vw] h-[100vh] origin-top-left z-10"
          >
            <object
              type="text/html"
              data={`/play/${project.slug}/index.html`}
              className="w-full h-full border-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              aria-label={project.title}
            />
          </motion.div>
          {/* Fallback Placeholder during load */}
          <img
            src={project.src}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 z-0 pointer-events-none"
          />
        </div>
      </motion.div>
    </div>
  );
}
