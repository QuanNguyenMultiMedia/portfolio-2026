"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { playItems } from "@/data/play";
import { notFound } from "next/navigation";

export default function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [colorMode, setColorMode] = useState<"mono" | "rgb">("mono");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState<number>(0.75);

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
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="bg-background h-screen w-full overflow-hidden relative flex items-center justify-center font-sans text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Background scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

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

      {/* HUD Header Info - Left top edge (Title / Status) (Hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="absolute top-16 right-16 md:top-24 md:right-24 z-40 hidden md:flex items-center gap-8 font-mono text-[9px] tracking-[0.2em] uppercase opacity-40">
          <div>SYS_LOC: LOCAL_STATIC_MIRROR</div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            STATUS: {isLoading ? 'INITIALIZING' : 'RUNNING'}
          </div>
        </div>
      )}

      {/* Main Screen Area - Viewfinder Frame */}
      <motion.div
        initial={false}
        animate={{
          width: isFullscreen ? "100vw" : "70vw",
          height: isFullscreen ? "100vh" : "70vh",
          marginTop: isFullscreen ? 0 : "3rem", // mt-12 approx
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex flex-col z-10 border border-foreground/10 group bg-background ${
          isFullscreen ? "w-screen h-screen p-8 md:p-16 bg-background z-50 fixed inset-0" : ""
        }`}
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
            <span className="font-mono text-[9px] tracking-[0.2em] text-foreground/50">DATA_VIZ // {project.slug.toUpperCase()}</span>
            <span className="font-mono text-[10px] opacity-80 font-bold uppercase">
              {project.title}
            </span>
          </div>

          {/* Top Right: Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullscreen(prev => {
                const next = !prev;
                setZoom(next ? 1.0 : 0.75);
                return next;
              });
            }}
            className="pointer-events-auto flex items-center gap-3 group/btn"
          >
            <span className="font-mono text-[9px] tracking-[0.2em] group-hover/btn:text-foreground transition-colors">
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
            <span className="font-mono text-[9px] tracking-[0.2em] mb-[1px] opacity-44">
              / {playItems.length.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Bottom Right: Status */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.2em] opacity-80">INTERACTIVE</span>
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
        <div className="relative w-full h-full overflow-hidden z-10 bg-background/50 backdrop-blur-sm flex flex-col justify-between">
          
          {/* Iframe element */}
          <iframe
            key={reloadKey}
            src={project.url}
            title={project.title}
            onLoad={() => setIsLoading(false)}
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

          {/* Fallback/Loader Layer */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
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

                  {/* Tech-luxe visual status logs */}
                  <div className="w-full border-t border-foreground/10 pt-4 mt-2 space-y-1 text-left text-[8px] tracking-[0.1em] text-foreground/45">
                    <div className="flex justify-between">
                      <span>LOAD_METHOD</span>
                      <span className="text-foreground/75">LOCAL_MIRROR_IFRAME</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RESOURCE_PATH</span>
                      <span className="text-foreground/75 truncate max-w-[200px]" title={project.url}>{project.url}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SECURE_SANDBOX</span>
                      <span className="text-emerald-500">SAME_ORIGIN_OK</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD Bottom Control Panel */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-3 font-mono text-[9px] tracking-[0.15em] uppercase z-20">
          {/* Tech stack metadata tags */}
          <div className="flex items-center gap-2 opacity-50">
            <span>TECH:</span>
            {project.tech.map((t) => (
              <span key={t} className="border border-foreground/20 px-1.5 py-0.5 text-[8px]">
                {t}
              </span>
            ))}
          </div>

          {/* Interactive control buttons */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Color Mode Toggle */}
            <div className="flex items-center gap-1 border border-foreground/20 px-2 py-0.5 bg-background/50 backdrop-blur-sm">
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
            <div className="flex items-center gap-1 border border-foreground/20 px-2 py-0.5 bg-background/50 backdrop-blur-sm">
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
              className="cursor-pointer border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all px-2.5 py-0.5 flex items-center gap-1.5 bg-background/50 backdrop-blur-sm"
              title="Reload sandbox experience"
            >
              <span>RE-INIT</span>
              <span className="text-[7px]">↺</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative background grid and metadata labels */}
      {!isFullscreen && (
        <>
          <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-0 hidden md:block font-mono text-[8px] tracking-[0.2em] uppercase opacity-30 select-none">
            {project.tech.join(" // ")} // PORTFOLIO_PLAY_V1
          </div>
          <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 z-0 hidden md:block font-mono text-[8px] tracking-[0.2em] uppercase opacity-30 select-none">
            FRAME_LATENCY: 0.00ms // LOCAL_ENV_OK
          </div>
        </>
      )}
    </div>
  );
}
