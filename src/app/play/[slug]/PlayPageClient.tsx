"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { playItems } from "@/data/play";
import { notFound } from "next/navigation";
import { useScreenSize } from "@/hooks/useScreenSize";

export default function PlayPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [colorMode, setColorMode] = useState<"mono" | "rgb">("mono");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState<number>(0.75);
  const screenSize = useScreenSize();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setReloadKey((prev) => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const frameWidth = isFullscreen
    ? "100vw"
    : (screenSize === "4xl" ? "82vw" : screenSize === "3xl" ? "78vw" : "74vw");
  const frameHeight = isFullscreen
    ? "100vh"
    : (screenSize === "4xl" ? "74vh" : screenSize === "3xl" ? "70vh" : "66vh");

  return (
    <div className="bg-background h-screen w-full overflow-hidden relative flex items-center justify-center font-sans text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {/* Main Screen Area - Viewfinder Frame */}
      <motion.div
        initial={false}
        animate={{
          width: frameWidth,
          height: frameHeight,
          marginTop: isFullscreen ? 0 : "1.5rem",
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}

        className={`relative flex flex-col z-10 border border-foreground/10 group bg-background ${
          isFullscreen ? "w-screen h-screen p-8 md:p-16 bg-background z-50 fixed inset-0" : ""
        }`}
      >
        {/* Viewfinder Corners (Glued to the Frame) */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-foreground/15 group-hover:border-foreground/40 z-20 pointer-events-none -translate-x-[1px] -translate-y-[1px] transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-foreground/15 group-hover:border-foreground/40 z-20 pointer-events-none translate-x-[1px] -translate-y-[1px] transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-foreground/15 group-hover:border-foreground/40 z-20 pointer-events-none -translate-x-[1px] translate-y-[1px] transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-foreground/15 group-hover:border-foreground/40 z-20 pointer-events-none translate-x-[1px] translate-y-[1px] transition-colors duration-300" />

        {/* TOP BAR: Sits above the frame normally, drops inside during fullscreen */}
        <div
          className={`absolute w-full flex justify-end items-end pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 ${
            isFullscreen ? "top-6 px-6" : "bottom-[calc(100%+8px)] left-0"
          }`}
        >
          {/* Top Right: Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullscreen(prev => {
                const next = !prev;
                setZoom(next ? 1.0 : 0.75);
                return next;
              });
            }}
            className={`pointer-events-auto flex items-center gap-3 group/btn transition-all duration-300 ${
              isFullscreen
                ? "bg-background/80 backdrop-blur-xl border border-foreground/15 rounded-none px-3 py-1.5 hover:bg-foreground/10"
                : ""
            }`}
          >
            <span className={`font-mono tracking-[0.2em] group-hover/btn:text-foreground transition-colors ${
              isFullscreen ? "text-[11px] 3xl:text-sm" : "text-[9px] 3xl:text-xs"
            }`}>
              {isFullscreen ? "MINIMIZE" : "EXPAND"}
            </span>
            <div className={`border flex items-center justify-center group-hover/btn:border-foreground transition-colors bg-background/50 backdrop-blur-sm ${
              isFullscreen ? "w-5 h-5 3xl:w-7 3xl:h-7" : "w-4 h-4 3xl:w-5 3xl:h-5"
            }`}>
              {isFullscreen ? (
                <div className="w-2.5 h-2.5 3xl:w-3.5 3xl:h-3.5 border-b border-l border-foreground/60 transition-transform" />
              ) : (
                <div className="w-2.5 h-2.5 3xl:w-3 3xl:h-3 border-t border-r border-foreground/60 transition-transform" />
              )}
            </div>
          </button>
        </div>

        {/* BOTTOM BAR: Sits below the frame normally, rises inside during fullscreen */}
        <div
          className={`absolute w-full flex justify-start items-start pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 ${
            isFullscreen ? "bottom-6 px-6" : "top-[calc(100%+8px)] left-0"
          }`}
        >
          {/* Bottom Left: Counter */}
          <div className="pointer-events-auto flex gap-2 items-baseline">
            <span className="font-mono text-[14px] 3xl:text-lg 4xl:text-xl">
              {(currentIndex + 1).toString().padStart(2, "0")}
            </span>
            <span className="font-mono text-[9px] 3xl:text-xs 4xl:text-sm tracking-[0.2em] mb-[1px] opacity-44">
              / {playItems.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* LEFT NAV: Sits to the left normally, slides inside during fullscreen */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 ${
            isFullscreen ? "left-6" : "right-[calc(100%+16px)] 3xl:right-[calc(100%+24px)] 4xl:right-[calc(100%+32px)]"
          }`}
        >
          <Link
            href={`/play/${prevProject.slug}`}
            className="block p-4 3xl:p-6 4xl:p-8 group/nav backdrop-blur-sm bg-background/20 hover:bg-background/40 transition-colors rounded-full border border-transparent hover:border-foreground/10"
          >
            <div className="w-3 h-3 3xl:w-4.5 3xl:h-4.5 4xl:w-6 4xl:h-6 border-l border-t border-foreground/30 group-hover/nav:border-foreground transition-colors -rotate-45" />
          </Link>
        </div>

        {/* RIGHT NAV: Sits to the right normally, slides inside during fullscreen */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 ${
            isFullscreen ? "right-6" : "left-[calc(100%+16px)] 3xl:left-[calc(100%+24px)] 4xl:left-[calc(100%+32px)]"
          }`}
        >
          <Link
            href={`/play/${nextProject.slug}`}
            className="block p-4 3xl:p-6 4xl:p-8 group/nav backdrop-blur-sm bg-background/20 hover:bg-background/40 transition-colors rounded-full border border-transparent hover:border-foreground/10"
          >
            <div className="w-3 h-3 3xl:w-4.5 3xl:h-4.5 4xl:w-6 4xl:h-6 border-r border-t border-foreground/30 group-hover/nav:border-foreground transition-colors rotate-45" />
          </Link>
        </div>

        {/* Frame Content - The "Playing" area */}
        <div className="relative w-full h-full overflow-hidden z-10 bg-background/50 backdrop-blur-sm flex flex-col justify-between">
          
          {/* Iframe element */}
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={project.url}
            title={project.title}
            onLoad={handleIframeLoad}
            style={{
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              transition: "filter 1.5s ease, opacity 1.5s ease, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            className={`absolute top-0 left-0 border-0 z-10 ${
              colorMode === "mono"
                ? "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                : "grayscale-0 opacity-100"
            }`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            allowFullScreen
          />

          {/* Fallback/Loader/Error Layer */}
          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-background z-20 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="z-10 flex flex-col items-center gap-8 font-mono max-w-md w-full">
                  <div className="w-12 h-12 border border-red-500/30 rounded-full flex items-center justify-center">
                    <span className="text-red-500/80 text-lg">!</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-red-400/80 font-bold">
                      SANDBOX_UNAVAILABLE
                    </div>
                    <div className="text-[9px] tracking-[0.15em] uppercase text-foreground/45">
                      FAILED TO RESOLVE: {project.slug.toUpperCase()}
                    </div>
                  </div>
                  <div className="w-full border-t border-foreground/10 pt-4 mt-2 space-y-1 text-left text-[8px] tracking-[0.1em] text-foreground/45">
                    <div className="flex justify-between">
                      <span>ERROR_TYPE</span>
                      <span className="text-red-400/60">CONNECTION_REFUSED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RESOURCE_PATH</span>
                      <span className="text-foreground/75 truncate max-w-[200px]" title={project.url}>{project.url}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleReload}
                    className="border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all px-6 py-3 text-[10px] tracking-[0.2em] uppercase"
                  >
                    Retry Connection
                  </button>
                </div>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-background z-20 flex flex-col items-center justify-center p-8 text-center"
              >
                {/* Tech scanline in loader */}
                <div className="absolute inset-x-0 h-[2px] bg-foreground/20 animate-scanline pointer-events-none z-0" />

                {/* Fallback Background image blurred */}
                <img
                  src={project.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm pointer-events-none z-0"
                />

                <div className="z-10 flex flex-col items-center gap-6 font-mono max-w-md w-full">
                  <div className="relative">
                    {/* Pulsing HUD ring */}
                    <div className="w-12 h-12 border border-foreground/10 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border border-foreground/20 rounded-full border-t-foreground/80 animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/80 font-bold">
                      INITIALIZING_SANDBOX
                    </div>
                    <div className="text-[9px] tracking-[0.15em] uppercase text-foreground/45">
                      RESOLVING: {project.slug.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* HUD Bottom Control Panel */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-3 font-mono text-[9px] 3xl:text-xs 4xl:text-sm tracking-[0.15em] uppercase z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Tech stack metadata tags */}
          <div className="flex items-center gap-2 opacity-50">
            <span>TECH:</span>
            {project.tech.map((t) => (
              <span key={t} className="border border-foreground/20 px-1.5 py-0.5 text-[8px] 3xl:text-[10px] 4xl:text-xs">
                {t}
              </span>
            ))}
          </div>

          {/* Interactive control buttons */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Color Mode Toggle */}
            <div className="flex items-center gap-1 border border-foreground/20 px-2 py-0.5 3xl:px-3 3xl:py-1 4xl:px-4 4xl:py-1.5 bg-background/50 backdrop-blur-sm">
              <span className="opacity-40">COLOR:</span>
              <button
                onClick={() => setColorMode("mono")}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  colorMode === "mono" ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                MONO
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setColorMode("rgb")}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  colorMode === "rgb" ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                RGB
              </button>
            </div>

            {/* Scale Selector */}
            <div className="flex items-center gap-1 border border-foreground/20 px-2 py-0.5 3xl:px-3 3xl:py-1 4xl:px-4 4xl:py-1.5 bg-background/50 backdrop-blur-sm">
              <span className="opacity-40">SCALE:</span>
              <button
                onClick={() => setZoom(0.65)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.65 ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                65%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(0.75)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.75 ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                75%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(0.85)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.85 ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                85%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(1.0)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 1.0 ? "text-foreground font-bold" : "text-foreground/30"
                }`}
              >
                100%
              </button>
            </div>

            {/* Reload button */}
            <button
              onClick={handleReload}
              className="cursor-pointer border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all px-2.5 py-0.5 3xl:px-4 3xl:py-1 4xl:px-5 4xl:py-1.5 flex items-center gap-1.5 bg-background/50 backdrop-blur-sm"
              title="Reload sandbox experience"
            >
              <span>RE-INIT</span>
              <span className="text-[7px]">↺</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
