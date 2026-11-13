"use client";

// Client boundary: the sandbox viewer holds frame, zoom and colour state around a live iframe.
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { PlayItem } from "@/data/play";
import { useScreenSize } from "@/hooks/useScreenSize";
import { fx } from "@/lib/designSystem";

type Sibling = { slug: string; title: string };

export default function PlayEntry({
  project, prevProject, nextProject, index, count,
}: {
  project: PlayItem; prevProject: Sibling; nextProject: Sibling; index: number; count: number;
}) {

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [colorMode, setColorMode] = useState<"mono" | "rgb">("mono");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState<number>(0.75);
  const screenSize = useScreenSize();
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    <div className="bg-background h-screen w-full overflow-hidden relative flex items-center justify-center font-sans text-foreground selection:bg-black selection:text-white">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {/* Main Screen Area - Viewfinder Frame */}
      <motion.div
        layout
        transition={{ duration: 0.7, ease: fx.easeSharp }}
        style={{
          width: frameWidth,
          height: frameHeight,
          marginTop: isFullscreen ? 0 : "1.5rem",
        }}
        className={`relative flex flex-col z-10 border border-primary/25 group bg-background ${
          isFullscreen ? "w-screen h-screen p-8 md:p-16 bg-background z-50 fixed inset-0" : ""
        }`}
      >
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
                ? "bg-background border border-primary/25 rounded-none px-3 py-1.5 hover:bg-foreground/10"
                : ""
            }`}
          >
            <span className={`font-sans group-hover/btn:text-foreground transition-colors ${
              isFullscreen ? "text-[11px] 3xl:text-sm" : "text-[12px] 3xl:text-xs"
            }`}>
              {isFullscreen ? "MINIMIZE" : "EXPAND"}
            </span>
            <div className={`border flex items-center justify-center group-hover/btn:border-foreground transition-colors bg-background ${
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
            <span className="font-sans text-[14px] 3xl:text-lg 4xl:text-xl">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span className="font-sans text-[12px] 3xl:text-xs 4xl:text-sm mb-[1px] opacity-44">
              / {count.toString().padStart(2, "0")}
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
            href={`/garden/${prevProject.slug}`}
            aria-label={prevProject.title}
            className="block p-4 3xl:p-6 4xl:p-8 group/nav bg-background hover:bg-background transition-colors rounded-none border border-transparent hover:border-primary/25"
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
            href={`/garden/${nextProject.slug}`}
            aria-label={nextProject.title}
            className="block p-4 3xl:p-6 4xl:p-8 group/nav bg-background hover:bg-background transition-colors rounded-none border border-transparent hover:border-primary/25"
          >
            <div className="w-3 h-3 3xl:w-4.5 3xl:h-4.5 4xl:w-6 4xl:h-6 border-r border-t border-foreground/30 group-hover/nav:border-foreground transition-colors rotate-45" />
          </Link>
        </div>

        {/* Frame Content - The "Playing" area */}
        <div className="relative w-full h-full overflow-hidden z-10 bg-background flex flex-col justify-between">
          
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
              transition: "filter 1.5s ease, opacity 1.5s ease, transform 0.7s var(--ease-editorial-sharp)",
            }}
            className={`absolute top-0 left-0 border-0 z-10 ${
              colorMode === "mono"
                ? "opacity-50 group-hover:opacity-100"
                : "opacity-100"
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
                <div className="z-10 flex flex-col items-center gap-8 font-sans max-w-md w-full">
                  <div className="space-y-2">
                    <div className="text-[12px] text-red-400/80 font-bold">
                      SANDBOX_UNAVAILABLE
                    </div>
                    <div className="text-[12px] text-foreground">
                      FAILED TO RESOLVE: {project.slug.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={handleReload}
                    className="border border-primary/25 hover:border-foreground hover:bg-foreground hover:text-background transition-all px-6 py-3 text-[12px]"
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
                transition={{ duration: 0.6, ease: fx.ease }}
                className="absolute inset-0 bg-background z-20 flex flex-col items-center justify-center p-8 text-center"
              >
                {/* Tech scanline in loader */}
                <div className="absolute inset-x-0 h-[2px] bg-foreground/20 pointer-events-none z-0" />

                {/* Fallback Background image blurred */}
                <img
                  src={project.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm pointer-events-none z-0 mix-blend-print"
                />

                <div className="z-10 flex flex-col items-center gap-6 font-sans max-w-md w-full">
                  <div className="relative">
                    {/* Pulsing HUD ring */}
                    <div className="w-12 h-12 border border-primary/25 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border border-primary/25 rounded-full border-t-foreground/80 animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[12px] text-foreground font-bold">
                      INITIALIZING_SANDBOX
                    </div>
                    <div className="text-[12px] text-foreground">
                      RESOLVING: {project.slug.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* HUD Bottom Control Panel */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-3 font-sans text-[12px] 3xl:text-xs 4xl:text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Tech stack metadata tags */}
          <div className="flex items-center gap-2 opacity-50">
            <span>TECH:</span>
            {project.tech.map((t) => (
              <span key={t} className="border border-primary/25 px-1.5 py-0.5 text-[12px] 3xl:text-[12px] 4xl:text-xs">
                {t}
              </span>
            ))}
          </div>

          {/* Interactive control buttons */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Color Mode Toggle */}
            <div className="flex items-center gap-1 border border-primary/25 px-2 py-0.5 3xl:px-3 3xl:py-1 4xl:px-4 4xl:py-1.5 bg-background">
              <span className="opacity-40">COLOR:</span>
              <button
                onClick={() => setColorMode("mono")}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  colorMode === "mono" ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                MONO
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setColorMode("rgb")}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  colorMode === "rgb" ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                RGB
              </button>
            </div>

            {/* Scale Selector */}
            <div className="flex items-center gap-1 border border-primary/25 px-2 py-0.5 3xl:px-3 3xl:py-1 4xl:px-4 4xl:py-1.5 bg-background">
              <span className="opacity-40">SCALE:</span>
              <button
                onClick={() => setZoom(0.65)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.65 ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                65%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(0.75)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.75 ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                75%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(0.85)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 0.85 ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                85%
              </button>
              <span className="opacity-20">|</span>
              <button
                onClick={() => setZoom(1.0)}
                className={`cursor-pointer hover:text-foreground transition-colors px-1 ${
                  zoom === 1.0 ? "text-foreground font-bold" : "text-foreground"
                }`}
              >
                100%
              </button>
            </div>

            {/* Reload button */}
            <button
              onClick={handleReload}
              className="cursor-pointer border border-primary/25 hover:border-foreground hover:bg-foreground hover:text-background transition-all px-2.5 py-0.5 3xl:px-4 3xl:py-1 4xl:px-5 4xl:py-1.5 flex items-center gap-1.5 bg-background"
              title="Reload sandbox experience"
            >
              <span>RE-INIT</span>
              <span className="text-[12px]">↺</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
