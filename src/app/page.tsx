"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

// Internal Components
import BalancedText from "@/components/BalancedText";
import MeasuredHeader from "@/components/MeasuredHeader";
import PageWrapper from "@/components/PageWrapper";
import TechButton from "@/components/TechButton";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Track scroll progress across the 500vh page height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax multiplier based on scroll progress (0 on Hero, fades in during scroll transition)
  const parallaxMultiplier = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  // ==========================================
  // VIEWPORT CURSOR PARALLAX
  // ==========================================
  // Mouse coordinates normalized from -0.5 (left/top) to 0.5 (right/bottom)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft spring dynamics for a high-end architectural "drift" lag
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 1 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 1 });

  // Map mouse offsets to tilt and translate transforms (subtle follow)
  const rawRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [-1.5, 1.5]);
  const rawRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [1.5, -1.5]);
  const rawTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const rawTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]);

  // Scale transforms by parallaxMultiplier to disable parallax on Hero frame
  const rotateX = useTransform([rawRotateX, parallaxMultiplier], ([rX, mult]) => (rX as number) * (mult as number));
  const rotateY = useTransform([rawRotateY, parallaxMultiplier], ([rY, mult]) => (rY as number) * (mult as number));
  const translateX = useTransform([rawTranslateX, parallaxMultiplier], ([tX, mult]) => (tX as number) * (mult as number));
  const translateY = useTransform([rawTranslateY, parallaxMultiplier], ([tY, mult]) => (tY as number) * (mult as number));

  // Client-side detection of screen size to handle responsive 3D coordinates
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track cursor movement on window to update parallax values
  useEffect(() => {
    if (isMobile) {
      // Reset values on mobile to avoid layout offsets
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const clamp = (v: number) => Math.max(-0.3, Math.min(0.3, v));
      const xOffset = clamp((clientX / innerWidth) - 0.5);
      const yOffset = clamp((clientY / innerHeight) - 0.5);
      
      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    const handleMouseLeave = () => {
      // Gently return to center when mouse leaves the viewport
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, mouseX, mouseY]);

  // Track active frame based on scroll progress
  // Boundaries are midpoints between waypoints
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.075) {
      setActiveFrame(0);
    } else if (latest >= 0.075 && latest < 0.25) {
      setActiveFrame(1);
    } else if (latest >= 0.25 && latest < 0.425) {
      setActiveFrame(2);
    } else if (latest >= 0.425 && latest < 0.725) {
      setActiveFrame(3);
    } else {
      setActiveFrame(4);
    }
  });

  // ==========================================
  // CAMERA / WORLD TRANSLATION
  // ==========================================
  // Linear Z mapping between waypoints — no extra easing during scroll.
  // The only smoothing comes from Lenis itself. Snap feel is handled by
  // the idle-based snap in SmoothScroll.tsx.
  //
  //   Hero (Z=0)      → 15% scroll → Manifesto (Z=1800)
  //   Manifesto       → 20% scroll → Capabilities (Z=3300)
  //   Capabilities    → 20% scroll → Testimonials (Z=4800)
  //   Testimonials    → 35% scroll → Stats (Z=6300), holds to end
  const zWorld = useTransform(
    scrollYProgress,
    [0.0, 0.15, 0.35, 0.55, 0.90, 1.0],
    [0,   1800, 3300, 4800, 6300, 6300]
  );

  // Combine into single dynamic transform template
  const transformWorld = useMotionTemplate`translate3d(${translateX}px, ${translateY}px, ${zWorld}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // ==========================================
  // INDIVIDUAL FRAME OPACITY & BLUR CURVES (BASED ON CAMERA Z-DISTANCE)
  // ==========================================
  // Frame 0: Hero (local Z offsets around 0)
  // In focus at zWorld = 0, fades as camera moves past Z = 600px
  const opacityHero = useTransform(zWorld, [0, 600, 1000], [1, 1, 0]);
  const blurHero = useTransform(zWorld, [0, 600, 1000], ["blur(0px)", "blur(0px)", "blur(12px)"]);

  // Frame 1: Manifesto (local Z = -1800)
  // In focus at zWorld = 1800
  const opacityManifesto = useTransform(zWorld, [800, 1400, 2200, 2700], [0, 1, 1, 0]);
  const blurManifesto = useTransform(zWorld, [800, 1400, 2200, 2700], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  // Frame 2: Capabilities (local Z = -3300)
  // In focus at zWorld = 3300
  const opacityCapabilities = useTransform(zWorld, [2300, 2900, 3700, 4200], [0, 1, 1, 0]);
  const blurCapabilities = useTransform(zWorld, [2300, 2900, 3700, 4200], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  // Frame 3: Testimonials (local Z = -4800)
  // In focus at zWorld = 4800
  const opacityTestimonials = useTransform(zWorld, [3800, 4400, 5200, 5700], [0, 1, 1, 0]);
  const blurTestimonials = useTransform(zWorld, [3800, 4400, 5200, 5700], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  // Frame 4: Stats (local Z = -6300)
  // Settles at focus when zWorld = 6300
  const opacityStats = useTransform(zWorld, [5300, 5900, 6300], [0, 1, 1]);
  const blurStats = useTransform(zWorld, [5300, 5900, 6300], ["blur(8px)", "blur(0px)", "blur(0px)"]);

  // Camera focal length warp (dynamic 3D perspective distortion)
  const perspectiveVal = useTransform(scrollYProgress, (progress) => {
    const start = isMobile ? 1200 : 1400;
    const end = isMobile ? 850 : 950;
    return start + progress * (end - start);
  });
  const perspectiveTemplate = useMotionTemplate`${perspectiveVal}px`;

  // Radial lens focus blur & vignette overlays
  const lensBlurVal = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const lensBlurTemplate = useMotionTemplate`blur(${lensBlurVal}px)`;
  const lensEffectsOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  // HUD sections list for the indicator
  const HUDSections = [
    { label: "Intro", progress: 0 },
    { label: "Philosophy", progress: 0.25 },
    { label: "Services", progress: 0.5 },
    { label: "Endorsements", progress: 0.75 },
    { label: "Overview", progress: 1.0 },
  ];

  return (
    <>
      {/* Persistent fixed HUD Navigation Indicator - outside of PageWrapper containing block */}
      <nav className="fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-6 md:flex">
        <div className="flex flex-col gap-5 relative pr-4 py-8 border-r border-border-neutral/30">
          {HUDSections.map((sec, idx) => {
            const isActive = activeFrame === idx;
            return (
              <button
                key={sec.label}
                onClick={() => {
                  const lenis = (window as any).lenis;
                  if (lenis && containerRef.current) {
                    const containerHeight = containerRef.current.offsetHeight;
                    const viewportHeight = window.innerHeight;
                    const scrollTarget = sec.progress * (containerHeight - viewportHeight);
                    lenis.scrollTo(scrollTarget);
                  }
                }}
                className="group flex items-center gap-4 text-right transition-all outline-none cursor-pointer"
              >
                <span
                  className={`font-mono text-[9px] tracking-widest uppercase transition-all duration-300 ${
                    isActive
                      ? "text-tech-blue translate-x-0 opacity-100"
                      : "text-foreground/30 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  {sec.label}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-500 absolute right-[-3px] ${
                    isActive
                      ? "bg-tech-blue scale-150 shadow-[0_0_8px_rgba(0,41,255,0.6)]"
                      : "bg-foreground/20 scale-100 group-hover:bg-foreground/50 group-hover:scale-125"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="font-mono text-[7px] tracking-[0.2em] text-foreground/20 uppercase">
          Scroll Narrative // Depth Camera
        </div>
      </nav>

      <PageWrapper variant="story">
        {/* 500vh scroll container */}
        <div ref={containerRef} className="relative h-[600vh] w-full bg-background">
          
          {/* Sticky viewport frame container */}
          <motion.div
            className="sticky top-0 h-screen w-full overflow-hidden bg-background flex items-center justify-center"
            style={{
              perspective: perspectiveTemplate,
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* The 3D World (Translates in Z based on scroll) */}
            <motion.div
              style={{
                transform: transformWorld,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full h-full"
            >
              
              {/* ==========================================
                  FRAME 0: HERO (Z offsets from -100px to 150px)
                  ========================================== */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 0 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Viewport Corners & Coordinate Guides */}
                <motion.div
                  className="absolute inset-12 border border-foreground/5 pointer-events-none hidden md:block"
                  style={{
                    transform: "translate3d(0px, 0px, -50px)",
                    opacity: opacityHero,
                    filter: blurHero,
                  }}
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />
                  
                  {/* Subtle side coordinates */}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[7px] tracking-widest text-foreground/20 uppercase select-none vertical-text">
                    SYS_GRID_L // REF_0.0
                  </span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[7px] tracking-widest text-foreground/20 uppercase select-none vertical-text">
                    SYS_GRID_R // REF_1.0
                  </span>
                </motion.div>

                {/* Title / Headline */}
                <motion.div
                  className="absolute top-32 left-8 z-10 md:left-24 md:top-48"
                  style={{
                    transform: "translate3d(0px, 0px, 0px)",
                    transformStyle: "preserve-3d",
                    opacity: opacityHero,
                    filter: blurHero,
                  }}
                >
                  <div className="flex flex-col gap-0 select-none">
                    <MeasuredHeader
                      text="Minh Quan"
                      className="font-display text-7xl font-bold uppercase leading-[0.75] tracking-tighter md:text-[12rem]"
                      maxWidth={1400}
                      font="800 192px Plus Jakarta Sans"
                    />
                    <div className="mt-4 flex items-center gap-8">
                      <span className="font-display text-primary text-4xl font-light italic uppercase tracking-tighter md:text-8xl">
                        Midweight Motion Designer
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Standing Portrait — positioned on the right, below the logo */}
                <motion.div
                  className="absolute left-8 top-24 z-10 hidden aspect-[3/4] w-full max-w-[280px] md:right-[15vw] md:left-auto md:top-1/2 md:block md:max-w-sm"
                  style={{
                    transform: "translate3d(0px, 0px, 150px) translateY(-50%)",
                    transformStyle: "preserve-3d",
                    opacity: opacityHero,
                    filter: blurHero,
                  }}
                >
                  <div className="border-primary/5 group relative h-full w-full overflow-hidden border bg-surface/5">
                    <Image
                      src="/assets/portrait_standing.jpg"
                      alt="Minh Quan - Standing Portrait"
                      fill
                      priority
                      className="object-cover opacity-90 transition-all duration-[2000ms] grayscale group-hover:grayscale-0"
                    />
                  </div>
                </motion.div>

                {/* Floating Technical Indicators */}
                <motion.div
                  className="absolute top-8 right-8 font-mono text-[9px] tracking-widest text-foreground/40 hidden md:flex flex-col gap-1 items-end uppercase select-none"
                  style={{
                    transform: "translate3d(0px, 0px, 50px)",
                    opacity: opacityHero,
                    filter: blurHero,
                  }}
                >
                  <div>[SYS_STATE // OPERATIONAL]</div>
                  <div>LOC: 10.7626° N, 106.6602° E</div>
                  <div>DEPTH_STAGE_Z // HERO_00</div>
                </motion.div>

                {/* Bio info */}
                <motion.div
                  className="absolute bottom-12 left-8 z-10 max-w-sm md:bottom-24 md:left-24"
                  style={{
                    transform: "translate3d(0px, 0px, -100px)",
                    transformStyle: "preserve-3d",
                    opacity: opacityHero,
                    filter: blurHero,
                  }}
                >
                  <div className="space-y-6">
                    <BalancedText
                      text="Orchestrating space, time, and identity into cinematic digital products. Scroll to explore the craft."
                      className="text-subhead"
                      maxWidth={450}
                      font="300 24px Inter"
                      showHUD={false}
                    />
                  </div>
                </motion.div>
              </motion.div>
              {/* ==========================================
                  FRAME 1: MANIFESTO (Z offset around -1800px)
                  ========================================== */}
              {/* Manifesto: bare centered text — no panel, no grid, no decorations */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 1 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <motion.div
                  className="select-none text-center max-w-[90vw] md:max-w-5xl"
                  style={{
                    transform: "translate3d(0px, 0px, -1800px)",
                    opacity: opacityManifesto,
                    filter: blurManifesto,
                  }}
                >
                  <h2 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.92] text-primary">
                    MOTION IS THE <br/>
                    <span className="italic font-light text-tech-blue font-display">LANGUAGE</span> OF <br/>
                    INTENTION.
                  </h2>
                </motion.div>
              </motion.div>

              {/* ==========================================
                  FRAME 2: CAPABILITIES (Z offset around -3300px, Staggered)
                  ========================================== */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 2 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Header Label */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: "translate3d(0px, -42vh, -3450px) translate(-50%, -50%)",
                    opacity: opacityCapabilities,
                    filter: blurCapabilities,
                  }}
                >
                  <div className="tech-label text-tech-blue select-none font-bold text-xs md:text-sm tracking-widest">
                    02 // CAPABILITIES & EXPERTISE
                  </div>
                </motion.div>

                {/* Minimalist left-aligned title grid — no cards, no descriptions */}
                {[
                  { title: "Motion Design", z: -3250 },
                  { title: "Branding", z: -3300 },
                  { title: "Social Media", z: -3350 },
                  { title: "Visual Effects", z: -3350 },
                  { title: "Video Editing", z: -3200 },
                  { title: "Web Animation", z: -3400 },
                ].map((cap, idx) => {
                  const col = idx % 3;
                  const row = Math.floor(idx / 3);
                  const x = -28 + col * 20;
                  const y = -8 + row * 16;
                  return (
                    <motion.div
                      key={cap.title}
                      className="absolute left-1/2 top-1/2 pointer-events-auto"
                      style={{
                        transform: `translate3d(${x}vw, ${y}vh, ${cap.z}px) translate(-50%, -50%)`,
                        opacity: opacityCapabilities,
                        filter: blurCapabilities,
                      }}
                    >
                      <div className="text-left">
                        <div className="font-mono text-[10px] tracking-widest text-tech-blue/50 mb-1">
                          0{idx + 1}
                        </div>
                        <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-primary whitespace-nowrap">
                          {cap.title}
                        </h2>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ==========================================
                  FRAME 3: TESTIMONIALS (Z offset around -4800px, Staggered Parallax)
                  ========================================== */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 3 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Header Label */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: "translate3d(0px, -42vh, -4950px) translate(-50%, -50%)",
                    opacity: opacityTestimonials,
                    filter: blurTestimonials,
                  }}
                >
                  <div className="tech-label text-tech-blue select-none font-bold text-xs md:text-sm tracking-widest">
                    03 // CLIENT FEEDBACK
                  </div>
                </motion.div>

                {/* Bigger testimonial cards — wider, larger type for readability */}
                {[
                  {
                    brand: "FREIGHTOS",
                    quote: "The motion system Quan delivered didn't just look premium — it fundamentally improved how users understood our data hierarchy. Every transition had purpose.",
                    author: "Freightos Branding",
                    role: "Client Partner",
                    posDesktop: { x: "-18vw", y: "-14vh", z: -4700 },
                    posMobile: { x: "0vw", y: "-22vh", z: -4700 },
                  },
                  {
                    brand: "STORYFLOW",
                    quote: "Quan brought a level of spatial awareness to our UI that we hadn't articulated but immediately recognized as missing. The scroll-linked animations redefined our visual language.",
                    author: "Storyflow Studio",
                    role: "Creative Director",
                    posDesktop: { x: "18vw", y: "-14vh", z: -4850 },
                    posMobile: { x: "0vw", y: "-8vh", z: -4850 },
                  },
                  {
                    brand: "SAVANNAH BEE CO",
                    quote: "Every micro-interaction Quan designed serves the narrative — nothing is ornamental. That restraint is rare, and it made our brand feel instantly more sophisticated.",
                    author: "Savannah Bee Company",
                    role: "Marketing Lead",
                    posDesktop: { x: "-18vw", y: "14vh", z: -4800 },
                    posMobile: { x: "0vw", y: "6vh", z: -4800 },
                  },
                  {
                    brand: "WONDERMILLCOSMOS",
                    quote: "Working with Quan felt like collaborating with an architect who happens to animate. Every frame, every curve, every timing decision was justified by a structural reason.",
                    author: "WonderMillCosmos",
                    role: "Creative Partner",
                    posDesktop: { x: "18vw", y: "14vh", z: -4650 },
                    posMobile: { x: "0vw", y: "20vh", z: -4650 },
                  },
                ].map((test, idx) => {
                  const coords = isMobile ? test.posMobile : test.posDesktop;
                  return (
                    <motion.div
                      key={test.brand}
                      className="absolute left-1/2 top-1/2 w-[85vw] md:w-[34vw] border border-border-neutral/20 p-6 md:p-8 bg-surface/50 backdrop-blur-xl hover:border-tech-blue/50 hover:bg-surface/80 transition-all duration-500 flex flex-col justify-between relative pointer-events-auto group rounded-none shadow-sm"
                      style={{
                        transform: `translate3d(${coords.x}, ${coords.y}, ${coords.z}px) translate(-50%, -50%)`,
                        opacity: opacityTestimonials,
                        filter: blurTestimonials,
                      }}
                    >
                      {/* Technical Corners */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-tech-blue/40 group-hover:border-tech-blue transition-colors" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-tech-blue/40 group-hover:border-tech-blue transition-colors" />

                      {/* Card Header Info */}
                      <div className="flex justify-between items-center border-b border-border-neutral/10 pb-3">
                        <div className="font-mono text-xs text-tech-blue font-bold tracking-wider">
                          [REC_0{idx + 1}] // {test.brand}
                        </div>
                        <div className="font-mono text-[9px] text-foreground/30 uppercase tracking-widest hidden md:inline">
                          DEPTH_Z // {coords.z}PX
                        </div>
                      </div>

                      {/* Quote Content — larger type */}
                      <p className="font-sans text-sm md:text-lg italic font-light text-foreground/90 leading-relaxed my-4 py-2">
                        "{test.quote}"
                      </p>

                      {/* Card Footer Author Info */}
                      <div className="border-t border-border-neutral/10 pt-3 flex flex-col gap-1">
                        <span className="font-display text-xs md:text-sm font-bold uppercase tracking-wider text-primary">
                          {test.author}
                        </span>
                        <span className="font-mono text-[10px] md:text-xs text-foreground/45 uppercase tracking-widest">
                          {test.role}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ==========================================
                  FRAME 4: STATS & COLLABORATORS (Z offset -6000px, Settle block)
                  ========================================== */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 4 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Combined Panel Container — bigger layout */}
                <motion.div
                  className="absolute left-1/2 top-1/2 w-[90vw] md:w-[75vw] max-w-6xl border border-border-neutral/20 p-6 md:p-14 bg-surface/50 backdrop-blur-xl rounded-none shadow-md pointer-events-auto"
                  style={{
                    transform: "translate3d(0px, 0px, -6300px) translate(-50%, -50%)",
                    opacity: opacityStats,
                    filter: blurStats,
                  }}
                >
                  {/* Corner ticks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tech-blue/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-tech-blue/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-tech-blue/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tech-blue/50" />

                  {/* Panel Technical Header */}
                  <div className="flex justify-between items-center border-b border-border-neutral/10 pb-5 mb-8 md:mb-10">
                    <span className="font-mono text-xs md:text-sm text-tech-blue font-bold uppercase tracking-widest">
                      04 // METRICS & NETWORK
                    </span>
                    <span className="font-mono text-[10px] md:text-xs text-foreground/45 uppercase tracking-[0.2em]">
                      SYS_OVERVIEW // PLANE_Z_-6300
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14">
                    
                    {/* Left Metrics Column */}
                    <div className="md:col-span-6 space-y-8">
                      <div className="font-mono text-xs md:text-sm text-tech-blue font-bold tracking-widest">KEY METRICS</div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                        <div className="border-b border-border-neutral/10 pb-4">
                          <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">
                            50+
                          </div>
                          <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">
                            Projects Completed
                          </div>
                        </div>
                        <div className="border-b border-border-neutral/10 pb-4">
                          <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">
                            100%
                          </div>
                          <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">
                            Client Rating
                          </div>
                        </div>
                        <div className="border-b border-border-neutral/10 pb-4">
                          <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">
                            04+
                          </div>
                          <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">
                            Years Active
                          </div>
                        </div>
                        <div className="border-b border-border-neutral/10 pb-4">
                          <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary uppercase leading-none mt-1">
                            HCMC
                          </div>
                          <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">
                            VN // Global Base
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Brands & CTA Column */}
                    <div className="md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-neutral/15 pt-8 md:pt-0 md:pl-10">
                      <div>
                        <div className="font-mono text-xs md:text-sm text-tech-blue font-bold tracking-widest mb-5">TRUSTED COLLABORATORS</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "Freightos",
                            "Storyflow",
                            "WonderMill",
                            "Savannah Bee",
                            "Upwork (VIP)",
                            "Dobeedo",
                            "Z Cung Viet",
                            "Viettel Digital",
                          ].map((brand) => (
                            <div
                              key={brand}
                              className="border border-border-neutral/20 p-3 bg-surface/10 flex items-center justify-center font-display text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/75 hover:text-tech-blue hover:border-tech-blue/30 hover:bg-surface/30 transition-all duration-300"
                            >
                              {brand}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 space-y-5">
                        <TechButton href="/works" className="w-full text-sm md:text-base">
                          Browse Archive // View Works
                        </TechButton>
                        <div className="text-center pt-1">
                          <a
                            href="/contacts"
                            className="font-mono text-xs md:text-sm uppercase tracking-widest text-foreground/50 hover:text-tech-blue hover:underline transition-all duration-300"
                          >
                            Initiate Contact // Connect
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Dynamic Lens Vignette & Edge Blur Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-30 select-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
              style={{
                backdropFilter: lensBlurTemplate,
                WebkitBackdropFilter: lensBlurTemplate,
                maskImage: "radial-gradient(circle at center, transparent 45%, black 100%)",
                WebkitMaskImage: "radial-gradient(circle at center, transparent 45%, black 100%)",
                opacity: lensEffectsOpacity,
              }}
            />
          </motion.div>
        </div>
      </PageWrapper>
    </>
  );
}
