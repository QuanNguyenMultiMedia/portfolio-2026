"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
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

  // Client-side detection of screen size to handle responsive 3D coordinates
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress across the 500vh page height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active frame based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.18) {
      setActiveFrame(0);
    } else if (latest >= 0.18 && latest < 0.42) {
      setActiveFrame(1);
    } else if (latest >= 0.42 && latest < 0.68) {
      setActiveFrame(2);
    } else if (latest >= 0.68 && latest < 0.92) {
      setActiveFrame(3);
    } else {
      setActiveFrame(4);
    }
  });

  // ==========================================
  // CAMERA / WORLD TRANSLATION
  // ==========================================
  // The world translates along the Z-axis from 0px (at start) to 8000px (at end)
  const zWorld = useTransform(scrollYProgress, [0, 1], [0, 6000]);
  const transformWorld = useMotionTemplate`translate3d(0px, 0px, ${zWorld}px)`;

  // ==========================================
  // INDIVIDUAL FRAME OPACITY & BLUR CURVES (BASED ON Z-DISTANCE)
  // ==========================================
  // Frame 0: Hero (local Z offsets around 0)
  // Passes camera plane (1200px) when Z-world reaches 1200px (progress ~0.20)
  const opacityHero = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const blurHero = useTransform(scrollYProgress, [0, 0.12, 0.18], ["blur(0px)", "blur(0px)", "blur(12px)"]);

  // Frame 1: Manifesto (local Z = -1800)
  // In focus when Z-world = 1500 (progress 0.25). Passes camera (Z-world = 3000) at progress 0.50
  const opacityManifesto = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.32, 0.42],
    [0, 1, 1, 0]
  );
  const blurManifesto = useTransform(
    scrollYProgress,
    [0.08, 0.18, 0.32, 0.42],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]
  );

  // Frame 2: Capabilities (local Z = -3300)
  // In focus when Z-world = 3000 (progress 0.5). Passes camera (Z-world = 4500) at progress 0.75
  const opacityCapabilities = useTransform(
    scrollYProgress,
    [0.32, 0.42, 0.58, 0.68],
    [0, 1, 1, 0]
  );
  const blurCapabilities = useTransform(
    scrollYProgress,
    [0.32, 0.42, 0.58, 0.68],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]
  );

  // Frame 3: Testimonials (local Z = -4800)
  // In focus when Z-world = 4500 (progress 0.75). Passes camera (Z-world = 6000) at progress 1.00
  const opacityTestimonials = useTransform(
    scrollYProgress,
    [0.58, 0.68, 0.82, 0.92],
    [0, 1, 1, 0]
  );
  const blurTestimonials = useTransform(
    scrollYProgress,
    [0.58, 0.68, 0.82, 0.92],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]
  );

  // Frame 4: Stats (local Z = -6300)
  // Settles at focus when Z-world = 6000 (progress 1.0)
  const opacityStats = useTransform(scrollYProgress, [0.82, 0.92, 1.0], [0, 1, 1]);
  const blurStats = useTransform(
    scrollYProgress,
    [0.82, 0.92, 1.0],
    ["blur(8px)", "blur(0px)", "blur(0px)"]
  );

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
    { label: "Manifesto", progress: 0.25 },
    { label: "Capabilities", progress: 0.5 },
    { label: "Testimonials", progress: 0.75 },
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
          Story.Scroll // 3D Camera
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

                {/* Standing Portrait */}
                <motion.div
                  className="absolute right-8 top-24 z-10 hidden aspect-[3/4] w-full max-w-[320px] md:right-48 md:top-32 md:block md:max-w-md"
                  style={{
                    transform: "translate3d(0px, 0px, 150px)",
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
                  FRAME 1: MANIFESTO (Z offset around -2300px)
                  ========================================== */}
              <motion.div
                style={{
                  pointerEvents: activeFrame === 1 ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Background Grid Accent */}
                <motion.div
                  className="absolute left-1/2 top-1/2 border border-border-neutral/30 w-[90vw] md:w-[60vw] aspect-[2/1] pointer-events-none"
                  style={{
                    transform: "translate3d(0px, 0px, -1900px) translate(-50%, -50%)",
                    opacity: opacityManifesto,
                    filter: blurManifesto,
                  }}
                >
                  <div className="absolute inset-x-0 top-1/2 border-t border-border-neutral/20" />
                  <div className="absolute inset-y-0 left-1/2 border-l border-border-neutral/20" />
                </motion.div>

                {/* Top Label */}
                <motion.div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: isMobile
                      ? "translate3d(0px, -22vh, -1820px) translate(-50%, -50%)"
                      : "translate3d(0px, -20vh, -1820px) translate(-50%, -50%)",
                    opacity: opacityManifesto,
                    filter: blurManifesto,
                  }}
                >
                  <div className="tech-label text-tech-blue select-none">
                    01 // THE MANIFESTO
                  </div>
                </motion.div>

                {/* Manifesto metadata floating label */}
                <motion.div
                  className="absolute left-1/2 top-1/2 font-mono text-[9px] tracking-widest text-foreground/40 hidden md:block uppercase select-none"
                  style={{
                    transform: "translate3d(0px, 22vh, -1820px) translate(-50%, -50%)",
                    opacity: opacityManifesto,
                    filter: blurManifesto,
                  }}
                >
                  [RECORD_MANIFESTO_01] // PHILOSOPHY
                </motion.div>

                {/* Manifesto text box */}
                <motion.div
                  className="absolute left-1/2 top-1/2 max-w-[85vw] md:max-w-5xl w-full border border-border-neutral/30 p-8 md:p-16 bg-surface/90 relative"
                  style={{
                    transform: "translate3d(0px, 0px, -1800px) translate(-50%, -50%)",
                    opacity: opacityManifesto,
                    filter: blurManifesto,
                  }}
                >
                  {/* Corner ticks */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-tech-blue/40" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-tech-blue/40" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-tech-blue/40" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-tech-blue/40" />

                  <div className="text-center space-y-6">
                    <h2 className="font-display text-xl md:text-3xl font-bold tracking-tight uppercase leading-none">
                      Motion is the <span className="italic font-normal text-tech-blue">conduit of understanding</span>.
                    </h2>
                    <p className="font-sans text-xs md:text-sm font-light text-foreground/75 max-w-2xl mx-auto leading-relaxed">
                      I believe motion is not decoration; it is choreography. It is the silent guide that shapes user intent, clarifies complex systems, and turns digital interfaces into beautiful, intuitive loops. The following slides trace the discipline behind this practice.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* ==========================================
                  FRAME 2: CAPABILITIES (Z offset around -3000px, Staggered)
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
                  <div className="tech-label text-tech-blue select-none">
                    02 // CORE CAPABILITIES
                  </div>
                </motion.div>

                {/* Staggered Capability Cards */}
                {[
                  {
                    title: "Motion Design",
                    desc: "Kinetic UI walkthroughs, layout transitions, and interface choreography built to tell product stories.",
                    posDesktop: { x: "-22vw", y: "-16vh", z: -3250 },
                    posMobile: { x: "0vw", y: "-30vh", z: -3250 },
                  },
                  {
                    title: "Branding",
                    desc: "Rigorous visual identity frameworks, styleguides, and vector grids anchored in clean grid layouts.",
                    posDesktop: { x: "0vw", y: "-18vh", z: -3350 },
                    posMobile: { x: "0vw", y: "-18vh", z: -3350 },
                  },
                  {
                    title: "Social Media",
                    desc: "High-impact short-form reels, typography teasers, and promotional launch content.",
                    posDesktop: { x: "22vw", y: "-15vh", z: -3300 },
                    posMobile: { x: "0vw", y: "-6vh", z: -3300 },
                  },
                  {
                    title: "Visual Effects",
                    desc: "Advanced tracking, keying, and compositing workflows that blend design assets with physical footage.",
                    posDesktop: { x: "-22vw", y: "14vh", z: -3300 },
                    posMobile: { x: "0vw", y: "6vh", z: -3300 },
                  },
                  {
                    title: "Video Editing",
                    desc: "Rhythmic editing style with architectural pacing, narrative flow, and precise sound design.",
                    posDesktop: { x: "0vw", y: "16vh", z: -3200 },
                    posMobile: { x: "0vw", y: "18vh", z: -3200 },
                  },
                  {
                    title: "Web Animation",
                    desc: "Ultra-smooth interactive layouts built using Framer Motion and GSAP for calculated, responsive layouts.",
                    posDesktop: { x: "22vw", y: "15vh", z: -3400 },
                    posMobile: { x: "0vw", y: "30vh", z: -3400 },
                  },
                ].map((cap, idx) => {
                  const coords = isMobile ? cap.posMobile : cap.posDesktop;
                  return (
                    <motion.div
                      key={cap.title}
                      className="absolute left-1/2 top-1/2 w-[80vw] md:w-[20vw] group border border-border-neutral/30 p-6 bg-surface/90 hover:bg-foreground hover:text-background transition-all duration-500 flex flex-col justify-between h-36 rounded-none pointer-events-auto"
                      style={{
                        transform: `translate3d(${coords.x}, ${coords.y}, ${coords.z}px) translate(-50%, -50%)`,
                        opacity: opacityCapabilities,
                        filter: blurCapabilities,
                      }}
                    >
                      {/* Interactive Corner Ticks */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] opacity-40 group-hover:opacity-60">0{idx + 1}</span>
                        <span className="font-mono text-[7px] opacity-30 group-hover:opacity-50 tracking-wider">
                          [Z_DEPTH // {coords.z}px]
                        </span>
                        <span className="w-1.5 h-1.5 bg-tech-blue/40 rounded-full group-hover:bg-tech-blue transition-colors" />
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-display font-bold text-xs md:text-sm uppercase tracking-tight">
                            {cap.title}
                          </h3>
                          <span className="font-mono text-[6px] tracking-widest text-foreground/30 group-hover:text-background/40">
                            {coords.x.replace('vw', '')}X // {coords.y.replace('vh', '')}Y
                          </span>
                        </div>
                        <p className="font-sans text-[10px] text-foreground/60 group-hover:text-background/80 leading-relaxed font-light">
                          {cap.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ==========================================
                  FRAME 3: TESTIMONIALS (Z offset around -4500px, Staggered Parallax)
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
                  <div className="tech-label text-tech-blue select-none">
                    03 // COLLABORATIVE RECORDS
                  </div>
                </motion.div>

                {/* Staggered Testimonial Cards */}
                {[
                  {
                    brand: "FREIGHTOS",
                    quote: "Outstanding motion design that brought our branding to life. Highly detailed and perfect implementation of the design language.",
                    author: "Freightos Branding",
                    role: "Client Partner",
                    posDesktop: { x: "-22vw", y: "-15vh", z: -4700 },
                    posMobile: { x: "0vw", y: "-28vh", z: -4700 },
                  },
                  {
                    brand: "STORYFLOW",
                    quote: "Minh Quan is an exceptional talent. Very responsive, took direction perfectly, and added high-fidelity motion elements we didn't know we needed.",
                    author: "Storyflow Studio",
                    role: "Creative Director",
                    posDesktop: { x: "22vw", y: "-10vh", z: -4900 },
                    posMobile: { x: "0vw", y: "-9vh", z: -4900 },
                  },
                  {
                    brand: "SAVANNAH BEE CO",
                    quote: "Helped us capture our brand story beautifully with high-end animations. A true professional through and through.",
                    author: "Savannah Bee Company",
                    role: "Marketing Lead",
                    posDesktop: { x: "-18vw", y: "15vh", z: -4800 },
                    posMobile: { x: "0vw", y: "9vh", z: -4800 },
                  },
                  {
                    brand: "WONDERMILLCOSMOS",
                    quote: "Incredible attention to detail, cinematic pacing, and seamless delivery. Always reliable and always pushing the boundaries.",
                    author: "WonderMillCosmos",
                    role: "Creative Partner",
                    posDesktop: { x: "18vw", y: "17vh", z: -4600 },
                    posMobile: { x: "0vw", y: "28vh", z: -4600 },
                  },
                ].map((test, idx) => {
                  const coords = isMobile ? test.posMobile : test.posDesktop;
                  return (
                    <motion.div
                      key={test.brand}
                      className="absolute left-1/2 top-1/2 w-[85vw] md:w-[22vw] border border-border-neutral/30 p-5 md:p-6 bg-surface/90 hover:bg-foreground hover:text-background transition-all duration-500 flex flex-col justify-between relative pointer-events-auto group rounded-none"
                      style={{
                        transform: `translate3d(${coords.x}, ${coords.y}, ${coords.z}px) translate(-50%, -50%)`,
                        opacity: opacityTestimonials,
                        filter: blurTestimonials,
                      }}
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30" />
                      <div className="flex justify-between items-center mb-2.5">
                        <div className="tech-label text-[7px] text-tech-blue">
                          [RECORD_0{idx + 1}] // {test.brand}
                        </div>
                        <div className="font-mono text-[6px] tracking-wider text-foreground/35 group-hover:text-background/45 select-none">
                          [LOG_VERIFIED // {coords.z}px]
                        </div>
                      </div>
                      <p className="font-sans text-[11px] md:text-xs italic font-light text-foreground/80 group-hover:text-background/90 mb-3.5 leading-relaxed">
                        "{test.quote}"
                      </p>
                      <div className="border-t border-border-neutral/30 group-hover:border-background/25 pt-2.5 flex flex-col">
                        <span className="font-display text-[9px] font-bold uppercase tracking-wider">
                          {test.author}
                        </span>
                        <span className="font-mono text-[7px] opacity-40 group-hover:opacity-60">
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
                {/* Combined Panel Container */}
                <motion.div
                  className="absolute left-1/2 top-1/2 w-[90vw] md:w-[50vw] border border-border-neutral/30 p-6 md:p-12 bg-surface/90 rounded-none"
                  style={{
                    transform: "translate3d(0px, 0px, -6300px) translate(-50%, -50%)",
                    opacity: opacityStats,
                    filter: blurStats,
                  }}
                >
                  {/* Corner ticks */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/30" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    
                    {/* Left Metrics Column */}
                    <div className="md:col-span-6 space-y-6 md:space-y-8">
                      <div className="tech-label text-tech-blue">04 // ARCHIVE METRICS</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                          <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-primary leading-none">
                            50+
                          </div>
                          <div className="font-mono text-[8px] uppercase tracking-widest opacity-60 mt-1">
                            Archive Entries
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-primary leading-none">
                            100%
                          </div>
                          <div className="font-mono text-[8px] uppercase tracking-widest opacity-60 mt-1">
                            Client Rating
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-primary leading-none">
                            04+
                          </div>
                          <div className="font-mono text-[8px] uppercase tracking-widest opacity-60 mt-1">
                            Years Active
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-primary uppercase leading-none mt-1">
                            HCMC
                          </div>
                          <div className="font-mono text-[8px] uppercase tracking-widest opacity-60 mt-1.5">
                            VN // Global Base
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Brands & CTA Column */}
                    <div className="md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-neutral/30 pt-6 md:pt-0 md:pl-8">
                      <div>
                        <div className="tech-label text-tech-blue mb-4">BRANDS</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Freightos",
                            "Storyflow",
                            "WonderMill",
                            "Savannah Bee",
                            "Upwork VIP",
                            "Dobeedo",
                          ].map((brand) => (
                            <div
                              key={brand}
                              className="border border-border-neutral/30 p-2 bg-surface/5 flex items-center justify-center font-display text-[8px] font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 hover:border-primary/40 hover:bg-surface/10 transition-all duration-300"
                            >
                              {brand}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 space-y-4">
                        <TechButton href="/works" className="w-full">
                          Enter Selected Archive // View Works
                        </TechButton>
                        <div className="text-center pt-1">
                          <a
                            href="/contacts"
                            className="font-mono text-[9px] uppercase tracking-widest text-foreground/50 hover:text-tech-blue hover:underline transition-all duration-300"
                          >
                            Configure Collaboration // Contacts
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
