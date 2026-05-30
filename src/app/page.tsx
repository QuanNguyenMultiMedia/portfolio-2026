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
import dynamic from "next/dynamic";

import BalancedText from "@/components/BalancedText";
import PageWrapper from "@/components/PageWrapper";
import { GradientText } from "@/components/ui/gradient-text";
import { VerticalCutReveal } from "@/components/VerticalCutReveal";
import { t, motion as motionTokens, fx } from "@/lib/designSystem";

const MuxPlayer = dynamic(() => import("@/components/MuxPlayerWrapper"), {
  ssr: false,
});

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

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressKnobRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const [activeFrame, setActiveFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "laptop" | "3xl" | "4xl">("laptop");
  const [isMuted, setIsMuted] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Framer Motion Scroll Progress Refactor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Attach easing configs to Lenis on mount
  useEffect(() => {
    const lenis = (window as any).lenis || (window as any).__lenisInstance;
    if (lenis) {
      lenis.options.wheelMultiplier = 0.7;
      lenis.options.duration = 0.9;
    }
    return () => {
      if (lenis) {
        lenis.options.wheelMultiplier = 0.75;
        lenis.options.duration = 1.0;
      }
    };
  }, []);

  // 2. Responsive Device Detection
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setScreenSize("mobile");
      else if (w >= 2560) setScreenSize("4xl");
      else if (w >= 1920) setScreenSize("3xl");
      else setScreenSize("laptop");
      setIsMobile(w < 768);
      setViewportWidth(w);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDepths = () => {
    if (screenSize === "mobile") return MOBILE_DEPTHS;
    if (screenSize === "4xl") return [0, 3000, 5800, 8200, 10000];
    if (screenSize === "3xl") return [0, 2400, 4600, 6600, 8000];
    return DESKTOP_DEPTHS;
  };

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
      video.play().catch(() => {});
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
    let start = 1400;
    let end = 950;
    if (screenSize === "mobile") {
      start = 1200;
      end = 850;
    } else if (screenSize === "4xl") {
      start = 2200;
      end = 1500;
    } else if (screenSize === "3xl") {
      start = 1800;
      end = 1200;
    }
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

  // Direct DOM Timecode and Video Status Raf Loop
  useEffect(() => {
    let rafId: number;
    const updateVideoStatus = () => {
      const video = videoRef.current;
      if (video) {
        const curTime = video.currentTime ?? 0;
        const duration = video.duration || 1;

        // 1. Update Timecode Text
        if (timecodeRef.current) {
          const minutes = Math.floor(curTime / 60).toString().padStart(2, "0");
          const seconds = Math.floor(curTime % 60).toString().padStart(2, "0");
          const frames = Math.floor((curTime % 1) * 30).toString().padStart(2, "0");
          timecodeRef.current.textContent = `00:${minutes}:${seconds}:${frames}`;
        }

        // 2. Update Progress Bar & Knob
        const pct = (curTime / duration) * 100;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${pct}%`;
        }
        if (progressKnobRef.current) {
          progressKnobRef.current.style.left = `${pct}%`;
        }

        // 3. Update Play/Pause Button Icon
        if (playButtonRef.current) {
          playButtonRef.current.textContent = video.paused ? "▶" : "‖";
        }
      }
      rafId = requestAnimationFrame(updateVideoStatus);
    };
    rafId = requestAnimationFrame(updateVideoStatus);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const toggleFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request blocked:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleScrubMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    
    const element = e.currentTarget;
    const updateTime = (clientX: number) => {
      const rect = element.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
      video.currentTime = percentage * video.duration;
    };

    updateTime(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateTime(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

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
              className="absolute inset-0"
            >
              <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                <motion.div
                  {...fx.headerSlideIn}
                  className="absolute top-32 left-8 md:left-24 md:top-48 3xl:top-64 3xl:left-32 4xl:top-80 4xl:left-48 z-10"
                  style={{
                    transform: "translate3d(0px, 0px, 0px)",
                    opacity: opacityHero,
                  }}
                >
                  <div className="flex flex-col gap-0">
                    <h1 className={t.display}>
                      Minh Quan
                    </h1>
                    <div className="mt-3 3xl:mt-5">
                      <h2 className={`${t.h2} font-light leading-relaxed opacity-90 italic ${motionTokens.skewHover}`}>
                        loves{" "}
                        <GradientText>moving</GradientText>
                        {" "}things around.
                      </h2>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  {...fx.slideIn(1)}
                  className="absolute right-8 top-[360px] z-10 aspect-[3/4] w-full max-w-[130px] md:right-[10%] md:left-auto md:top-48 md:max-w-[280px] 3xl:right-[12%] 3xl:top-60 3xl:max-w-[340px] 4xl:right-[14%] 4xl:top-72 4xl:max-w-[400px] pointer-events-auto block"
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
              </div>
            </motion.div>

            {/* FRAME 1: MANIFESTO */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 1 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center antialiased"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[1]}px)`,
                  opacity: opacityManifesto,
                  visibility: visibilityManifesto,
                }}
              >
                <div className="relative text-left max-w-3xl 3xl:max-w-5xl 4xl:max-w-7xl">
 
                  <div className={`${t.h2} font-light leading-relaxed opacity-90 italic space-y-4`}>
                    <VerticalCutReveal
                      splitBy="words"
                      staggerDuration={0.02}
                      staggerFrom="first"
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      autoStart={activeFrame === 1}
                    >
                      Welcome! I'm Quan, a motion design lover. My craft is in making people stay and rewind. I believe motion and interaction is the soul of each brand, product, and experience.
                    </VerticalCutReveal>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* FRAME 2: SHOWREEL */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 2 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[2]}px)`,
                  opacity: opacityShowreel,
                  visibility: visibilityShowreel,
                }}
              >
                <div 
                  ref={videoContainerRef}
                  className={`relative bg-surface/5 border border-border-neutral/30 backdrop-blur-sm transition-all duration-300 ${
                    isFullscreen
                      ? 'fixed inset-0 z-50 max-w-none bg-black border-0 p-0'
                      : 'w-full max-w-4xl p-2 md:p-3 3xl:max-w-6xl 3xl:p-4 4xl:max-w-[1600px] 4xl:p-6'
                  }`}
                >
                  {/* Outer Technical HUD viewfinders (standard view only) */}
                  {!isFullscreen && (
                    <>
                      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-tech-blue/55 animate-pulse" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-tech-blue/55 animate-pulse" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-tech-blue/55 animate-pulse" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-tech-blue/55 animate-pulse" />
                    </>
                  )}



                  {/* Video Container */}
                  <div
                    onClick={() => {
                      if (videoRef.current) {
                        const video = videoRef.current as unknown as HTMLVideoElement;
                        if (video.paused) {
                          video.play().catch(() => {});
                        } else {
                          video.pause();
                        }
                      }
                    }}
                    className={`relative w-full overflow-hidden bg-black cursor-pointer group ${
                      isFullscreen ? 'h-full' : 'aspect-video'
                    }`}
                  >
                    <MuxPlayer
                      playbackId="SIBtpHN00huNJBdr01O00pcO02kjQElwnZFgWODBciieRg8"
                      className="w-full h-full object-cover"
                      onVideoReady={(el) => {
                        videoRef.current = el as any;
                        // Play if slide is already active when loaded
                        if (activeFrame === 2) {
                          (el as HTMLVideoElement).play().catch(() => {});
                        } else {
                          (el as HTMLVideoElement).pause();
                        }
                      }}
                    />
                  </div>

                  {/* Progress Bar Container — below video in standard, absolute bottom overlay in fullscreen */}
                  <div 
                    className={`relative h-1 bg-white/10 hover:h-2 hover:bg-white/20 transition-all duration-200 cursor-pointer pointer-events-auto group/scrub ${
                      isFullscreen
                        ? 'absolute bottom-16 3xl:bottom-24 left-4 right-4 z-10'
                        : 'mt-1'
                    }`}
                    onMouseDown={handleScrubMouseDown}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="absolute top-0 left-0 h-full bg-tech-blue/80 group-hover/scrub:bg-tech-blue transition-colors duration-200" ref={progressBarRef} style={{ width: "0%" }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-none bg-white opacity-0 group-hover/scrub:opacity-100 transition-opacity border border-black" ref={progressKnobRef} style={{ left: "0%" }} />
                  </div>

                  {/* Bottom Controls — below in standard, absolute overlay in fullscreen */}
                  <div
                    className={`flex justify-between items-center select-none pointer-events-auto ${
                      isFullscreen
                        ? 'absolute bottom-3 left-4 right-4 z-10 3xl:bottom-6 3xl:left-6 3xl:right-6'
                        : 'mt-1'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Left: Play/Pause and Timecode */}
                    <div className="flex items-center gap-4 bg-black/45 backdrop-blur-xs p-2 3xl:p-3 border border-white/5">
                      <button
                        ref={playButtonRef}
                        onClick={() => {
                          if (videoRef.current) {
                            const video = videoRef.current;
                            if (video.paused) {
                              video.play().catch(() => {});
                            } else {
                              video.pause();
                            }
                          }
                        }}
                        className="w-8 h-8 3xl:w-11 3xl:h-11 4xl:w-14 4xl:h-14 flex items-center justify-center font-mono text-xs 3xl:text-sm 4xl:text-base border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto cursor-pointer"
                      >
                        ▶
                      </button>
                      
                      <div className="flex flex-col gap-0.5 font-mono text-[8px] 3xl:text-[10px] 4xl:text-xs text-white/50 text-left">
                        <div>TIME: <span ref={timecodeRef} className="text-white font-medium text-[9px] 3xl:text-xs 4xl:text-sm">00:00:00:00</span></div>
                        <div>ENC: H.264 // FPS: 60.0</div>
                      </div>
                    </div>

                    {/* Right: Audio and Fullscreen Controls */}
                    <div className="flex items-center gap-2 bg-black/45 backdrop-blur-xs p-2 3xl:p-3 border border-white/5">
                      <button
                        onClick={toggleMute}
                        className="font-mono text-[9px] 3xl:text-[11px] 4xl:text-xs uppercase tracking-widest px-3 py-1.5 3xl:px-4 3xl:py-2 4xl:px-5 4xl:py-2.5 border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto cursor-pointer"
                      >
                        {isMuted ? "UNMUTE // AUDIO_OFF" : "MUTE // AUDIO_ON"}
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="w-8 h-8 3xl:w-11 3xl:h-11 4xl:w-14 4xl:h-14 flex items-center justify-center font-mono text-[10px] border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        ⛶
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
              className="absolute inset-0"
            >
              {TESTIMONIALS.map((test, idx) => {
                const depths = getDepths();
                
                const getOffsets = () => {
                  if (screenSize === "mobile") return { x: "0vw", y: "0vh", zOffset: idx * 250 };
                  if (screenSize === "4xl") {
                    return {
                      x: idx % 2 === 0 ? "-16vw" : "16vw",
                      y: idx < 2 ? "-13vh" : "13vh",
                      zOffset: idx * 100,
                    };
                  }
                  if (screenSize === "3xl") {
                    return {
                      x: idx % 2 === 0 ? "-15vw" : "15vw",
                      y: idx < 2 ? "-11vh" : "11vh",
                      zOffset: idx * 80,
                    };
                  }
                  return {
                    x: idx % 2 === 0 ? "-13vw" : "13vw",
                    y: idx < 2 ? "-9vh" : "9vh",
                    zOffset: idx * 50,
                  };
                };

                const offsets = getOffsets();
                const x = offsets.x;
                const y = offsets.y;
                const z = screenSize === "mobile" ? (-depths[3] - offsets.zOffset) : (-depths[3] + offsets.zOffset);

                return (
                  <motion.div
                    key={test.brand}
                    className="absolute left-1/2 top-1/2 w-[80vw] md:w-[28vw] 3xl:w-[24vw] 4xl:w-[20vw] border border-border-neutral/20 p-5 md:p-6 3xl:p-8 4xl:p-10 bg-surface/50 backdrop-blur-xl pointer-events-auto"
                    style={{
                      transform: `translate3d(${x}, ${y}, ${z}px) translate(-50%, -50%)`,
                      opacity: testimonialOpacityCurves[idx],
                      visibility: testimonialVisibilityCurves[idx],
                    }}
                  >
                    <div className="flex items-center border-b border-border-neutral/10 pb-2 mb-3">
                      <span className={t.subtitle}>
                        {test.brand}
                      </span>
                    </div>
                    <p className={t.body}>
                      &ldquo;{test.quote}&rdquo;
                    </p>
                    <div className="border-t border-border-neutral/10 pt-2 mt-3 flex flex-col gap-0.5">
                      <span className={`${t.h3} ${motionTokens.skewHover}`}>
                        {test.author}
                      </span>
                      <span className={t.meta}>
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
              className="absolute inset-0"
            >
              <motion.div
                className="absolute left-1/2 top-1/2 w-[90vw] md:w-[75vw] max-w-5xl 3xl:max-w-6xl 4xl:max-w-[1400px] border border-border-neutral/20 p-5 md:p-10 3xl:p-16 4xl:p-20 bg-surface/50 backdrop-blur-xl pointer-events-auto"
                style={{
                  transform: `translate3d(0px, 0px, ${-getDepths()[4]}px) translate(-50%, -50%)`,
                  opacity: opacityStats,
                  visibility: visibilityStats,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 3xl:gap-14">
                  <div className="md:col-span-6 space-y-6 3xl:space-y-10">
                    <p className={t.subtitle}>
                      Key Metrics
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 3xl:gap-x-10 3xl:gap-y-10">
                      <div className="border-b border-border-neutral/10 pb-3 3xl:pb-4">
                        <div className={t.display}>50+</div>
                        <div className={`${t.meta} mt-2 3xl:mt-3`}>Projects Completed</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-3 3xl:pb-4">
                        <div className={t.display}>100%</div>
                        <div className={`${t.meta} mt-2 3xl:mt-3`}>Client Rating</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-3 3xl:pb-4">
                        <div className={t.display}>04+</div>
                        <div className={`${t.meta} mt-2 3xl:mt-3`}>Years of Experience</div>
                      </div>
                      <div className="border-b border-border-neutral/10 pb-3 3xl:pb-4">
                        <div className={`${t.h1} mt-1 3xl:mt-2`}>HCMC</div>
                        <div className={`${t.meta} mt-2 3xl:mt-3`}>VN // Global Base</div>
                      </div>
                    </div>
                  </div>
 
                  <div className="md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-neutral/15 pt-6 md:pt-0 md:pl-8 3xl:pl-12">
                    <div>
                      <p className={`${t.subtitle} mb-4 3xl:mb-6 4xl:mb-8`}>
                        Trusted Collaborators
                      </p>
                      <div className="grid grid-cols-2 gap-2.5 3xl:gap-4">
                        {BRANDS.map((brand) => (
                          <div
                            key={brand}
                            className={`border border-border-neutral/20 p-2 3xl:p-3.5 4xl:p-4 bg-surface/10 flex items-center justify-center ${t.h3} ${motionTokens.skewHover} hover:text-tech-blue hover:border-tech-blue/30 hover:bg-surface/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}
                          >
                            {brand}
                          </div>
                        ))}
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


