"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import Image from "next/image";

import BalancedText from "@/components/BalancedText";
import PageWrapper from "@/components/PageWrapper";
import TechButton from "@/components/TechButton";

const TESTIMONIALS = [
  {
    brand: "Freightos",
    quote: "The motion system Quan delivered didn't just look premium — it fundamentally improved how users understood our data hierarchy. Every transition had purpose.",
    author: "Freightos Branding", role: "Client Partner",
  },
  {
    brand: "Storyflow",
    quote: "Quan brought a level of spatial awareness to our UI that we hadn't articulated but immediately recognized as missing. The scroll-linked animations redefined our visual language.",
    author: "Storyflow Studio", role: "Creative Director",
  },
  {
    brand: "Savannah Bee Co",
    quote: "Every micro-interaction Quan designed serves the narrative — nothing is ornamental. That restraint is rare, and it made our brand feel instantly more sophisticated.",
    author: "Savannah Bee Company", role: "Marketing Lead",
  },
  {
    brand: "WonderMillCosmos",
    quote: "Working with Quan felt like collaborating with an architect who happens to animate. Every frame, every curve, every timing decision was justified by a structural reason.",
    author: "WonderMillCosmos", role: "Creative Partner",
  },
];

const BRANDS = [
  "Freightos", "Storyflow", "WonderMill", "Savannah Bee",
  "Upwork (VIP)", "Dobeedo", "Z Cung Viet", "Viettel Digital",
];

const DESKTOP_DEPTHS = [0, 1800, 3500, 5000, 6200];
const MOBILE_DEPTHS = [0, 1000, 2000, 3000, 4200];

function interpolateDepth(z: number, input: number[], output: number[]) {
  if (z <= input[0]) return output[0];
  if (z >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    if (z >= input[i] && z < input[i + 1]) {
      const t = (z - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[output.length - 1];
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);

  const [activeFrame, setActiveFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 1. Framer Motion Scroll Progress Refactor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Attach easing configs to Lenis on mount
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.options.wheelMultiplier = 0.8;
      lenis.options.easing = (t: number) => 1 - Math.pow(1 - t, 3);
    }
    return () => {
      if (lenis) {
        lenis.options.wheelMultiplier = 1.0;
        lenis.options.easing = (t: number) => t;
      }
    };
  }, []);

  // 2. Responsive Device Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getDepths = () => (isMobile ? MOBILE_DEPTHS : DESKTOP_DEPTHS);

  // 3. Cursor Follower System (Tilt Parallax)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 1 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 1 });

  const rawRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [-1.2, 1.2]);
  const rawRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [1.2, -1.2]);
  const rawTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const rawTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  // Modulate parallax from 50% on Hero to 100% on other sections
  const parallaxMultiplier = useTransform(scrollYProgress, [0.0, 0.15], [0.5, 1.0]);

  const rotateX = useTransform([rawRotateX, parallaxMultiplier], ([rX, mult]) => (rX as number) * (mult as number));
  const rotateY = useTransform([rawRotateY, parallaxMultiplier], ([rY, mult]) => (rY as number) * (mult as number));
  const translateX = useTransform([rawTranslateX, parallaxMultiplier], ([tX, mult]) => (tX as number) * (mult as number));
  const translateY = useTransform([rawTranslateY, parallaxMultiplier], ([tY, mult]) => (tY as number) * (mult as number));

  useEffect(() => {
    if (isMobile) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const clamp = (v: number) => Math.max(-0.3, Math.min(0.3, v));
      mouseX.set(clamp(clientX / innerWidth - 0.5));
      mouseY.set(clamp(clientY / innerHeight - 0.5));
    };
    const handleMouseLeave = () => {
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

  // Frame Activation
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.075) setActiveFrame(0);
    else if (latest < 0.25) setActiveFrame(1);
    else if (latest < 0.50) setActiveFrame(2);
    else if (latest < 0.75) setActiveFrame(3);
    else setActiveFrame(4);
  });

  // Control video playback based on active slide visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (activeFrame === 2) {
      video.play().catch((err) => {
        console.warn("Playback blocked or interrupted:", err);
      });
    } else {
      video.pause();
    }
  }, [activeFrame]);

  // Z-Axis Depth Interpolation (Responsive)
  const baseZ = useTransform(scrollYProgress, (p) => {
    const points = [0.0, 0.15, 0.35, 0.55, 1.00];
    const depths = getDepths();
    if (p <= 1.00) {
      for (let i = 0; i < points.length - 1; i++) {
        if (p >= points[i] && p < points[i + 1]) {
          const t = (p - points[i]) / (points[i + 1] - points[i]);
          return depths[i] + t * (depths[i + 1] - depths[i]);
        }
      }
    }
    return depths[depths.length - 1];
  });

  // Smooth, refined Z transitions and end stops using spring physics
  const zWorld = useSpring(baseZ, { damping: 28, stiffness: 100, mass: 0.6 });
  const transformWorld = useMotionTemplate`translate3d(${translateX}px, ${translateY}px, ${zWorld}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // Dynamic Opacity and Visibility Transitions (Optimized, no expensive blur filters)
  // We fade out layers earlier (before they get too close to the perspective camera) to prevent raster/text pixelation.
  const opacityHero = useTransform(zWorld, (zVal) => {
    const depths = getDepths();
    const h = depths[0] ?? 0;
    const m = depths[1] ?? 1800;
    return interpolateDepth(zVal as number, [h, h + (m - h) * 0.15, h + (m - h) * 0.45], [1, 1, 0]);
  });
  const visibilityHero = useTransform(opacityHero, (op) => (op as number) > 0.01 ? "visible" : "hidden");

  const opacityManifesto = useTransform(zWorld, (zVal) => {
    const depths = getDepths();
    const h = depths[0] ?? 0;
    const m = depths[1] ?? 1800;
    const s = depths[2] ?? 3500;
    const fadeInStart = h + (m - h) * 0.4;
    const fadeInEnd = h + (m - h) * 0.8;
    const fadeOutStart = m + (s - m) * 0.15;
    const fadeOutEnd = m + (s - m) * 0.45;
    return interpolateDepth(zVal as number, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], [0, 1, 1, 0]);
  });
  const visibilityManifesto = useTransform(opacityManifesto, (op) => (op as number) > 0.01 ? "visible" : "hidden");

  const opacityShowreel = useTransform(zWorld, (zVal) => {
    const depths = getDepths();
    const m = depths[1] ?? 1800;
    const s = depths[2] ?? 3500;
    const t = depths[3] ?? 5000;
    const fadeInStart = m + (s - m) * 0.4;
    const fadeInEnd = m + (s - m) * 0.8;
    const fadeOutStart = s + (t - s) * 0.15;
    const fadeOutEnd = s + (t - s) * 0.45;
    return interpolateDepth(zVal as number, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], [0, 1, 1, 0]);
  });
  const visibilityShowreel = useTransform(opacityShowreel, (op) => (op as number) > 0.01 ? "visible" : "hidden");

  // Staggered testimonials opacity & visibility curves
  const testimonialOpacityCurves = TESTIMONIALS.map((_, idx) => {
    return useTransform(zWorld, (zVal) => {
      const depths = getDepths();
      const s = depths[2] ?? 3500; // showreel
      const t = depths[3] ?? 5000; // testimonials
      const st = depths[4] ?? 6200; // stats
 
      if (isMobile) {
        // Sequentially space out cards on mobile
        const cardTargetZ = t + idx * 250;
        const fadeInStart = cardTargetZ - 300;
        const fadeInEnd = cardTargetZ - 50;
        const fadeOutStart = cardTargetZ + 50;
        const fadeOutEnd = cardTargetZ + 300;
        return interpolateDepth(zVal as number, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], [0, 1, 1, 0]);
      } else {
        const fadeInStart = s + (t - s) * 0.4;
        const fadeInEnd = s + (t - s) * 0.8;
        const fadeOutStart = t + (st - t) * 0.15;
        const fadeOutEnd = t + (st - t) * 0.45;
        return interpolateDepth(zVal as number, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], [0, 1, 1, 0]);
      }
    });
  });

  const testimonialVisibilityCurves = testimonialOpacityCurves.map((opCurve) => {
    return useTransform(opCurve, (op) => (op as number) > 0.01 ? "visible" : "hidden");
  });

  const opacityStats = useTransform(zWorld, (zVal) => {
    const depths = getDepths();
    const t = depths[3] ?? 5000;
    const st = depths[4] ?? 6200;
    const fadeInStart = t + (st - t) * 0.4;
    const fadeInEnd = t + (st - t) * 0.8;
    return interpolateDepth(zVal as number, [fadeInStart, fadeInEnd, st], [0, 1, 1]);
  });
  const visibilityStats = useTransform(opacityStats, (op) => (op as number) > 0.01 ? "visible" : "hidden");

  const perspectiveVal = useTransform(scrollYProgress, (progress) => {
    const start = isMobile ? 1200 : 1400;
    const end = isMobile ? 850 : 950;
    return start + progress * (end - start);
  });
  const perspectiveTemplate = useMotionTemplate`${perspectiveVal}px`;

  // Custom Showreel HUD Video Mute Trigger
  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Direct DOM Timecode Counter Raf Loop
  useEffect(() => {
    let rafId: number;
    const updateTimecode = () => {
      const video = videoRef.current;
      if (video && timecodeRef.current) {
        const curTime = video.currentTime ?? 0;
        const minutes = Math.floor(curTime / 60).toString().padStart(2, "0");
        const seconds = Math.floor(curTime % 60).toString().padStart(2, "0");
        const frames = Math.floor((curTime % 1) * 30).toString().padStart(2, "0");
        timecodeRef.current.textContent = `00:${minutes}:${seconds}:${frames}`;
      }
      rafId = requestAnimationFrame(updateTimecode);
    };
    rafId = requestAnimationFrame(updateTimecode);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <PageWrapper variant="story">
      <div ref={containerRef} className="relative h-[600vh] w-full bg-background">
        <motion.div
          className="sticky top-0 h-screen w-full overflow-hidden bg-background flex items-center justify-center"
          style={{
            perspective: perspectiveTemplate,
            perspectiveOrigin: "50% 50%",
          }}
        >
          <motion.div
            style={{
              transform: transformWorld,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-full"
          >
            {/* FRAME 0: HERO */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 0 ? "auto" : "none",
                transformStyle: "preserve-3d",
                visibility: visibilityHero,
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute top-32 left-8 md:left-24 md:top-48 z-10"
                  style={{
                    transform: "translate3d(0px, 0px, 0px)",
                    opacity: opacityHero,
                  }}
                >
                  <div className="flex flex-col gap-0 select-none">
                    <h1 className="font-display text-6xl md:text-7xl lg:text-[5.25rem] font-bold uppercase tracking-tighter leading-[0.85] text-primary whitespace-nowrap">
                      Minh Quan
                    </h1>
                    <div className="mt-5">
                      <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight tracking-tight text-primary">
                        Midweight Motion Designer
                      </h2>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute left-8 top-24 z-10 hidden aspect-[3/4] w-full max-w-[220px] md:right-[18%] md:left-auto md:top-48 md:block md:max-w-sm"
                  style={{
                    transform: "translate3d(0px, 0px, 150px)",
                    opacity: opacityHero,
                  }}
                >
                  <div className="group relative h-full w-full overflow-hidden bg-surface/5">
                    <Image
                      src="/assets/portrait_standing.jpg"
                      alt="Minh Quan - Standing Portrait"
                      fill
                      priority
                      className="object-cover opacity-90 grayscale transition-all duration-[2000ms] group-hover:grayscale-0"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-12 left-8 max-w-sm md:bottom-24 md:left-24 z-10"
                  style={{
                    transform: "translate3d(0px, 0px, -100px)",
                    opacity: opacityHero,
                  }}
                >
                  <BalancedText
                    text="Orchestrating space, time, and identity into cinematic digital products. Scroll to explore the craft."
                    className="text-base font-light leading-relaxed text-foreground/80 font-sans"
                    maxWidth={400}
                    font="300 16px Inter"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* FRAME 1: MANIFESTO */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 1 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center antialiased"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[1]}px)`,
                  opacity: opacityManifesto,
                  visibility: visibilityManifesto,
                }}
              >
                <div className="relative text-center max-w-3xl px-8 py-12 md:px-16 md:py-20 bg-surface/30 backdrop-blur-xl border border-border-neutral/20 select-none">
                  {/* Subtle technical HUD corner markers */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/30" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/30" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30" />

                  <p className="font-mono text-[9px] tracking-[0.4em] text-tech-blue font-bold uppercase mb-8">
                    // Visual Philosophy
                  </p>
                  <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.9] text-primary antialiased">
                    Motion Is The <br />
                    <span className="italic font-light text-tech-blue">Language</span> Of <br />
                    Intention.
                  </h2>
                  <p className="mt-8 text-sm md:text-base font-light leading-relaxed text-foreground/60 max-w-md mx-auto antialiased">
                    Every transition, every curve, every frame exists because it serves the narrative. Nothing is ornamental.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* FRAME 2: SHOWREEL */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 2 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[2]}px)`,
                  opacity: opacityShowreel,
                  visibility: visibilityShowreel,
                }}
              >
                <div className="relative w-full max-w-4xl aspect-video bg-surface/5 border border-border-neutral/30 backdrop-blur-sm p-2 md:p-3 pointer-events-auto">
                  {/* Outer Technical HUD viewfinders */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-tech-blue/55" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-tech-blue/55" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-tech-blue/55" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-tech-blue/55" />

                  {/* Video Container */}
                  <div className="relative w-full h-full overflow-hidden bg-black">
                    <MuxPlayer
                      playbackId="La6KMZg8Gi00YVNHDPjuOwYZPnIIEprMgKb8HI9Ma92M"
                      className="w-full h-full object-cover"
                      onVideoReady={(el) => {
                        videoRef.current = el as any;
                        // Play if slide is already active when loaded
                        if (activeFrame === 2) {
                          (el as HTMLVideoElement).play().catch((err) => {
                            console.warn("Autoplay on mount blocked:", err);
                          });
                        } else {
                          (el as HTMLVideoElement).pause();
                        }
                      }}
                    />

                    {/* HUD Status Bar (Top) */}
                    <div className="absolute top-3 left-4 right-4 flex justify-between items-center font-mono text-[9px] text-white/70 select-none tracking-wider bg-black/45 backdrop-blur-xs px-2.5 py-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE_FEED // SHOWREEL_2026
                      </span>
                      <span>SRC: MUX_STREAM // 1080P</span>
                    </div>

                    {/* HUD Controls / Metrics (Bottom) */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end select-none">
                      {/* Left: Timecode and Stats */}
                      <div className="flex flex-col gap-1 font-mono text-[8px] text-white/50 bg-black/45 backdrop-blur-xs p-2 text-left">
                        <div>TIME: <span ref={timecodeRef} className="text-white font-medium">00:00:00:00</span></div>
                        <div>ENC: H.264 // FPS: 60.0</div>
                      </div>

                      {/* Right: Custom Mute Button */}
                      <button
                        onClick={toggleMute}
                        className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto"
                      >
                        {isMuted ? "UNMUTE // AUDIO_OFF" : "MUTE // AUDIO_ON"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* FRAME 3: TESTIMONIALS */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 3 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              {TESTIMONIALS.map((test, idx) => {
                const depths = getDepths();
                const x = isMobile ? "0vw" : (idx % 2 === 0 ? "-20vw" : "20vw");
                const y = isMobile ? "0vh" : (idx < 2 ? "-14vh" : "14vh");
                const z = isMobile ? (-depths[3] - idx * 250) : (-depths[3] + idx * 50);

                return (
                  <motion.div
                    key={test.brand}
                    className="absolute left-1/2 top-1/2 w-[85vw] md:w-[34vw] border border-border-neutral/20 p-6 md:p-8 bg-surface/50 backdrop-blur-xl pointer-events-auto"
                    style={{
                      transform: `translate3d(${x}, ${y}, ${z}px) translate(-50%, -50%)`,
                      opacity: testimonialOpacityCurves[idx],
                      visibility: testimonialVisibilityCurves[idx],
                    }}
                  >
                    <div className="flex items-center border-b border-border-neutral/10 pb-3 mb-4">
                      <span className="font-mono text-xs text-tech-blue font-bold tracking-wider">
                        {test.brand}
                      </span>
                    </div>
                    <p className="font-sans text-sm md:text-lg italic font-light text-foreground/90 leading-relaxed">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                    <div className="border-t border-border-neutral/10 pt-3 mt-4 flex flex-col gap-1">
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

            {/* FRAME 4: STATS */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 4 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute left-1/2 top-1/2 w-[90vw] md:w-[75vw] max-w-6xl border border-border-neutral/20 p-6 md:p-14 bg-surface/50 backdrop-blur-xl pointer-events-auto"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[4]}px) translate(-50%, -50%)`,
                  opacity: opacityStats,
                  visibility: visibilityStats,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14">
                  <div className="md:col-span-6 space-y-8">
                    <p className="font-mono text-xs md:text-sm text-tech-blue font-bold tracking-widest">
                      Key Metrics
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                      <div className="border-b border-border-neutral/10 pb-4">
                        <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">50+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">Projects Completed</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-4">
                        <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">100%</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">Client Rating</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-4">
                        <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary leading-none">04+</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">Years Active</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-4">
                        <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary uppercase leading-none mt-1">HCMC</div>
                        <div className="font-mono text-sm uppercase tracking-widest text-foreground/50 mt-3">VN // Global Base</div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-neutral/15 pt-8 md:pt-0 md:pl-10">
                    <div>
                      <p className="font-mono text-xs md:text-sm text-tech-blue font-bold tracking-widest mb-5">
                        Trusted Collaborators
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {BRANDS.map((brand) => (
                          <div
                            key={brand}
                            className="border border-border-neutral/20 p-3 bg-surface/10 flex items-center justify-center font-display text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/75 hover:text-tech-blue hover:border-tech-blue/30 hover:bg-surface/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function MuxPlayer({
  playbackId,
  className,
  onVideoReady,
}: {
  playbackId: string;
  className?: string;
  onVideoReady?: (el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@mux/mux-video").then(() => {
      if (!ref.current) return;
      let el = ref.current.querySelector("mux-video") as HTMLElement;
      if (!el) {
        el = document.createElement("mux-video");
        el.setAttribute("stream-type", "on-demand");
        el.setAttribute("playback-id", playbackId);
        el.setAttribute("loop", "");
        el.setAttribute("muted", "");
        el.setAttribute("playsinline", "");
        el.setAttribute("preload", "auto");
        el.className = className ?? "";
        ref.current.innerHTML = "";
        ref.current.appendChild(el);
      }
      onVideoReady?.(el);
    });
  }, [playbackId, className, onVideoReady]);

  return <div ref={ref} className="w-full h-full animate-fade-in" />;
}
