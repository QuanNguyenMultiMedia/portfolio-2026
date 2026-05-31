"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { projects } from "@/data/projects";
import { t, layout, fx } from "@/lib/designSystem";

export default function WorksPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialDragging, setIsDialDragging] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "laptop" | "3xl" | "4xl">("laptop");
  const screenParamsRef = useRef({ R: 200, curveAmount: 120, angleStep: 24 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setScreenSize("mobile");
        screenParamsRef.current = { R: 120, curveAmount: 60, angleStep: 18 };
      } else if (w >= 2560) {
        setScreenSize("4xl");
        screenParamsRef.current = { R: 320, curveAmount: 200, angleStep: 24 };
      } else if (w >= 1920) {
        setScreenSize("3xl");
        screenParamsRef.current = { R: 260, curveAmount: 150, angleStep: 24 };
      } else {
        setScreenSize("laptop");
        screenParamsRef.current = { R: 200, curveAmount: 120, angleStep: 24 };
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refs for extreme performance (no React state renders during dragging)
  const dialRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerParentRef = useRef<HTMLDivElement>(null);
  const dialContainerParentRef = useRef<HTMLDivElement>(null);

  const rotationRef = useRef<number>(0);
  const activeIndexRef = useRef<number>(0);

  const lastDragAngleRef = useRef<number | null>(null);
  const accumulatedRotationRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);

  // Persistent Audio Context to avoid browser bottlenecks and lag
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Eagerly create AudioContext on mount (starts suspended, resumes on first user gesture)
  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
    }
  }, []);

  const activeProject = projects[activeIndex] || projects[0] || {
    title: "",
    slug: "",
    year: "",
    category: "",
    id: "",
    description: "",
    colors: ["#000000", "#000000"],
    screens: []
  };

  const getCoverImage = (proj: (typeof projects)[0]) => {
    return proj.coverImage || proj.screens[0]?.src || "/projects/gom-men.png";
  };

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playDirectClickSound = () => {
    try {
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. High-passed noise transient (the crisp latch snap impact)
      const bufferSize = ctx.sampleRate * 0.008; // 8ms transient
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(2000, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.007);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Resonant body oscillator (simulates dial lock chamber)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio blocked
    }
  };

  const triggerVibration = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Direct DOM Mutator for 3D wheel styling (by-passing React render cycle for 120 FPS performance)
  const updateItemStyles = (currentRot: number) => {
    const sectorSize = 360 / projects.length;
    const { R, curveAmount, angleStep } = screenParamsRef.current;

    projects.forEach((_, i) => {
      const itemEl = itemRefs.current[i];
      if (!itemEl) return;

      // Infinite seamless circular module wrap formula
      let diff = i - currentRot / sectorSize;
      const N = projects.length;
      diff = ((((diff + N / 2) % N) + N) % N) - N / 2;

      const angle = diff * angleStep;
      const rad = (angle * Math.PI) / 180;

      const translateY = Math.sin(rad) * R;
      const translateZ = (Math.cos(rad) - 1) * R;
      const rotateX = -angle;

      // Shift items leftward (negative X) as they go out of sight to emphasize wrapping cylinder
      const translateX = - (1 - Math.cos(rad)) * curveAmount;

      const isActive = i === activeIndexRef.current;
      const scale = isActive ? 1.02 : 1 - Math.min(Math.abs(diff) * 0.08, 0.3);
      const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(diff) * 0.32);
      const blur = isActive ? 0 : Math.min(Math.abs(diff) * 1.5, 4);

      const isVisible = opacity > 0.01;
      const finalOpacity = isVisible ? opacity : 0;

      // Apply style values directly to the DOM node
      itemEl.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
      itemEl.style.opacity = String(finalOpacity);
      itemEl.style.filter = `blur(${blur}px)`;
      itemEl.style.pointerEvents = isVisible ? "auto" : "none";
    });
  };

  // Initial placement of wheel items on mount and screen size changes
  useEffect(() => {
    updateItemStyles(rotationRef.current);
  }, [screenSize]);

  const handleDialStart = (clientX: number, clientY: number) => {
    setIsDialDragging(true);
    initAudioContext();

    // Set continuous transition speed for dragging weight
    if (knobRef.current) {
      knobRef.current.style.transition =
        "transform 0.08s cubic-bezier(0.1, 0.8, 0.2, 1)";
    }
    projects.forEach((_, i) => {
      const itemEl = itemRefs.current[i];
      if (itemEl) {
        itemEl.style.transition =
          "transform 0.12s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.12s, filter 0.12s";
      }
    });

    const dialEl = dialRef.current;
    if (!dialEl) return;

    const rect = dialEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const startAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    lastDragAngleRef.current = startAngle;
    accumulatedRotationRef.current = 0;
  };

  const handleDialMove = (clientX: number, clientY: number) => {
    if (!isDialDragging) return;
    updateDialAngle(clientX, clientY);
  };

  const updateDialAngle = (clientX: number, clientY: number) => {
    const dialEl = dialRef.current;
    if (!dialEl) return;

    const rect = dialEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (lastDragAngleRef.current === null) {
      lastDragAngleRef.current = currentAngle;
      return;
    }

    let delta = currentAngle - lastDragAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastDragAngleRef.current = currentAngle;

    // Accumulate free continuous rotation angle
    const absDelta = Math.abs(delta);
    if (absDelta > 0.05) {
      accumulatedRotationRef.current += absDelta;
      const velocity = Math.min(absDelta * 8, 120);

      // Play continuous winding click sounds
      const tickThreshold = 3.5;
      if (accumulatedRotationRef.current >= tickThreshold) {
        accumulatedRotationRef.current %= tickThreshold;
        playToyWindingTick(velocity);
      }
    }

    // Direct DOM rotation calculation
    rotationRef.current = rotationRef.current + delta;

    if (knobRef.current) {
      knobRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }

    // Direct DOM update of 3D items
    updateItemStyles(rotationRef.current);

    // React state updates ONLY when active index actually swaps (optimizes paint operations)
    const sectorSize = 360 / projects.length;
    const normalizedRotation = ((rotationRef.current % 360) + 360) % 360;
    const nearestIndex =
      Math.round(normalizedRotation / sectorSize) % projects.length;

    if (
      nearestIndex !== activeIndexRef.current &&
      nearestIndex >= 0 &&
      nearestIndex < projects.length
    ) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex); // Trigger text description React render
      triggerVibration();
    }
  };

  const handleDialEnd = () => {
    setIsDialDragging(false);

    const sectorSize = 360 / projects.length;
    const snappedRotation =
      Math.round(rotationRef.current / sectorSize) * sectorSize;
    rotationRef.current = snappedRotation;

    // Direct lock snaps with spring-bezier curve on snap
    if (knobRef.current) {
      knobRef.current.style.transition =
        "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)";
      knobRef.current.style.transform = `rotate(${snappedRotation}deg)`;
    }

    projects.forEach((_, i) => {
      const itemEl = itemRefs.current[i];
      if (itemEl) {
        itemEl.style.transition =
          "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.75s, filter 0.75s";
      }
    });

    updateItemStyles(snappedRotation);

    const normalizedIndex =
      ((Math.round(snappedRotation / sectorSize) % projects.length) +
        projects.length) %
      projects.length;
    activeIndexRef.current = normalizedIndex;
    setActiveIndex(normalizedIndex);

    // Audio mechanical lock
    playDirectClickSound();
    triggerVibration();
  };

  // Setup drag event listeners
  useEffect(() => {
    if (!isDialDragging) return;

    const onGlobalMouseMove = (e: MouseEvent) => {
      handleDialMove(e.clientX, e.clientY);
    };

    const onGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDialMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onGlobalMouseUp = () => {
      handleDialEnd();
    };

    window.addEventListener("mousemove", onGlobalMouseMove);
    window.addEventListener("mouseup", onGlobalMouseUp);
    window.addEventListener("touchmove", onGlobalTouchMove, { passive: true });
    window.addEventListener("touchend", onGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", onGlobalMouseMove);
      window.removeEventListener("mouseup", onGlobalMouseUp);
      window.removeEventListener("touchmove", onGlobalTouchMove);
      window.removeEventListener("touchend", onGlobalMouseUp);
    };
  }, [isDialDragging]);

  // Robust Rate-Limited Winding Tick to safeguard browser thread
  const playToyWindingTick = (velocity: number) => {
    try {
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      // Enforce 16ms rate limit (max 60 ticks per sec) to completely resolve audio clutter/latency!
      if (now - lastTickTimeRef.current < 0.016) {
        return;
      }
      lastTickTimeRef.current = now;

      // 1. Friction noise transient (simulates metal gear clicking)
      const bufferSize = ctx.sampleRate * 0.004; // 4ms click
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(3000, now);

      const noiseGain = ctx.createGain();
      const clickVolume = 0.03 + Math.min(velocity / 800, 0.03);
      noiseGain.gain.setValueAtTime(clickVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.003);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. High metallic click oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Dynamic frequency pitch based on rotational velocity
      const baseFreq = 480 + Math.min(velocity * 12, 600);

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.008);

      const toneVolume = 0.04 + Math.min(velocity / 600, 0.04);
      gain.gain.setValueAtTime(toneVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.01);
    } catch {
      // Audio blocked
    }
  };

  const handleItemClick = (i: number) => {
    initAudioContext();
    setActiveIndex(i);
    activeIndexRef.current = i;

    const sectorSize = 360 / projects.length;
    const currentRev = Math.floor(rotationRef.current / 360);

    let targetRotation = currentRev * 360 + i * sectorSize;
    const diff = targetRotation - rotationRef.current;
    if (diff > 180) targetRotation -= 360;
    if (diff < -180) targetRotation += 360;

    rotationRef.current = targetRotation;

    if (knobRef.current) {
      knobRef.current.style.transition =
        "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)";
      knobRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }

    projects.forEach((_, index) => {
      const itemEl = itemRefs.current[index];
      if (itemEl) {
        itemEl.style.transition =
          "transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.75s, filter 0.75s";
      }
    });

    updateItemStyles(targetRotation);
    playDirectClickSound();
    triggerVibration();
  };

  const getTitleFontSizeClass = (title: string) => {
    if (title.length > 15) {
      return "text-base md:text-2xl lg:text-[1.5rem] xl:text-[1.75rem] 3xl:text-[2.25rem] 4xl:text-[3rem]";
    }
    return "text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]";
  };

  const getArrowSizeClass = (title: string) => {
    if (title.length > 15) {
      return "text-base md:text-2xl lg:text-[1.5rem] xl:text-[1.75rem] 3xl:text-[2.25rem] 4xl:text-[3rem]";
    }
    return "text-lg md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] 3xl:text-[3rem] 4xl:text-[3.75rem]";
  };

  return (
    <PageWrapper variant="hero">
      <div className="relative w-full max-w-screen-xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto h-full flex flex-col justify-start lg:justify-between gap-4 lg:gap-0 pt-12 md:pt-28 pb-16 lg:pb-24 px-6 md:px-16 3xl:px-24 4xl:px-32 overflow-hidden z-10">
        {/* Ambient Mobile Background Image (Dynamic Cross-Fade) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] lg:hidden z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeProject.slug}
              src={getCoverImage(activeProject)}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover blur-xl scale-105"
            />
          </AnimatePresence>
        </div>

        {/* Minimal SubHeader */}
        <motion.div
          {...fx.headerSlideIn}
          className="hidden md:flex w-full justify-between items-end border-b border-primary/10 pb-3 mb-3 lg:mb-4 shrink-0"
        >
          <div className="flex flex-col gap-1">
            <span className={`${t.meta} tracking-[0.4em] opacity-40 group-hover:opacity-40`}>
              Selected Works
            </span>
          </div>
        </motion.div>

        {/* Main Grid conformed to viewport */}
        <div className="relative z-10 w-full max-w-none grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 3xl:gap-24 4xl:gap-32 items-stretch flex-1 min-h-0">
          {/* Left Column: Widescreen Viewport & Details */}
          <motion.div
            {...fx.slideIn(0)}
            className="col-span-12 lg:col-span-5 flex flex-col justify-between h-full min-h-0 space-y-6 lg:space-y-8 3xl:space-y-12 items-end text-right pb-2"
          >
            <div className="relative -mx-8 w-[calc(100%+64px)] self-stretch lg:self-auto lg:mx-0 lg:w-full h-[120px] lg:h-auto lg:flex-1 min-h-0 lg:min-h-[260px] 3xl:min-h-[380px] 4xl:min-h-[480px] bg-transparent border-y lg:border border-primary/10 overflow-hidden group transition-all duration-700 mb-6 lg:mb-0 block">
              <div
                className="absolute inset-0 opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{
                  backgroundColor: activeProject.colors?.[0] || "#ffffff",
                }}
              />

              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-primary/30 group-hover:border-primary transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-primary/30 group-hover:border-primary transition-colors duration-500" />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-primary/10 group-hover:border-primary/30 rounded-full flex items-center justify-center pointer-events-none z-20 transition-all duration-700 group-hover:scale-110">
                <div className="w-1.5 h-1.5 bg-primary/20 group-hover:bg-primary/40 rounded-full" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full absolute inset-0"
                >
                  <img
                    src={getCoverImage(activeProject)}
                    alt={activeProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full flex-shrink-0 h-[96px] md:h-[80px] lg:h-[96px] 3xl:h-[120px] 4xl:h-[160px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="flex flex-col gap-3 md:gap-4 shrink-0 w-full items-end text-right"
                >
                  <p className={`${t.body} max-w-[420px] 3xl:max-w-[540px] 4xl:max-w-[680px] text-right ml-auto`}>
                    {activeProject.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Dynamic 3D Cylinder Scroll Wheel & Integrated Axle Dial */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center relative min-h-[320px] md:min-h-0 lg:h-full select-none pl-4 pb-16 lg:pb-0">
            <div className="relative w-full h-full flex items-center md:pb-0">
              {/* Left Section: 3D Cylinder Scroll Container */}
              <motion.div
                ref={scrollContainerParentRef}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, ease: fx.ease, delay: 0.10 }}
                onAnimationComplete={() => {
                  if (scrollContainerParentRef.current) {
                    scrollContainerParentRef.current.style.transform = '';
                    scrollContainerParentRef.current.style.filter = '';
                  }
                  updateItemStyles(rotationRef.current);
                }}
                className="relative flex-1 h-full pr-[168px] md:pr-[220px] 3xl:pr-[320px] 4xl:pr-[420px] flex items-center justify-start overflow-hidden"
              >
                {/* Viewfinder Selection Frame - aligns perfectly to Bezel boundary */}
                <div className="absolute left-0 right-[158px] md:right-[210px] 3xl:right-[310px] 4xl:right-[410px] top-1/2 -translate-y-1/2 h-[60px] md:h-[80px] 3xl:h-[110px] 4xl:h-[140px] border-y border-primary/10 bg-transparent pointer-events-none z-0">
                  {/* Persistent, stationary vertical indicator on the left edge */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-full z-10" />
                </div>

                {/* Cylindrical 3D Scroll Container */}
                <div
                  className="relative w-full h-full flex items-center justify-start overflow-hidden"
                  style={{
                    perspective: "1500px",
                    transformStyle: "preserve-3d",
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                  }}
                >
                  <div
                    className="relative w-full h-[60px] md:h-[80px] 3xl:h-[110px] 4xl:h-[140px] flex items-center justify-start"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {projects.map((project, i) => {
                      const isActive = i === activeIndex;

                      return (
                        <div
                          key={project.slug}
                          ref={(el) => {
                            itemRefs.current[i] = el;
                          }}
                          onClick={() => {
                            if (isActive) {
                              router.push(`/works/${project.slug}`);
                            } else {
                              handleItemClick(i);
                            }
                          }}
                          className="absolute left-0 w-[calc(100%-140px)] md:w-[calc(100%-200px)] 3xl:w-[calc(100%-300px)] 4xl:w-[calc(100%-400px)] pl-8 pr-6 h-[60px] md:h-[80px] 3xl:h-[110px] 4xl:h-[140px] flex items-center cursor-pointer select-none group/wheel-item"
                          style={{
                            transformOrigin: "left center",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-between">
                            <h3 className={`font-display uppercase tracking-tighter leading-[0.85] font-bold transition-all duration-300 origin-left inline-block group-hover/wheel-item:skew-x-[-10deg] ${
                              isActive
                                ? "text-primary animate-pulse-subtle"
                                : "text-foreground/15 group-hover/wheel-item:text-foreground/45"
                            } ${getTitleFontSizeClass(project.title)}`}>
                              {project.title}
                            </h3>
                            <span className={`font-light leading-none ml-6 transition-all duration-500 shrink-0 ${
                              isActive
                                ? "text-primary opacity-100 translate-x-0 scale-100"
                                : "text-foreground/0 opacity-0 scale-90 translate-x-4 pointer-events-none"
                            } group-hover/wheel-item:translate-x-1 group-hover/wheel-item:-translate-y-1 ${getArrowSizeClass(project.title)}`}>
                              ↗
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Integrated Dial Bezel (Pristine wireframe strokes only - scaled down) */}
              <motion.div
                ref={dialContainerParentRef}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, ease: fx.ease, delay: 0.15 }}
                onAnimationComplete={() => {
                  if (dialContainerParentRef.current) {
                    dialContainerParentRef.current.style.transform = '';
                    dialContainerParentRef.current.style.filter = '';
                  }
                }}
                className="absolute right-6 md:right-0 top-[40%] md:top-1/2 -translate-y-1/2 w-[120px] h-[120px] md:w-[160px] md:h-[160px] 3xl:w-[240px] 3xl:h-[240px] 4xl:w-[320px] 4xl:h-[320px] flex items-center justify-center z-20"
              >
                <div
                  ref={dialRef}
                  className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] 3xl:w-[240px] 3xl:h-[240px] 4xl:w-[320px] 4xl:h-[320px] rounded-full border border-primary/10 bg-transparent flex items-center justify-center select-none cursor-pointer touch-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleDialStart(e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                      handleDialStart(
                        e.touches[0].clientX,
                        e.touches[0].clientY,
                      );
                    }
                  }}
                >
                  {/* Bezel ticks */}
                  {projects.map((_, i) => {
                    const angle = (i * 360) / projects.length;
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0 flex items-start justify-center pointer-events-none"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <div
                          className={`w-0.5 transition-all duration-300 ${
                            isActive
                              ? "h-3.5 3xl:h-5 4xl:h-7 bg-primary"
                              : "h-2 3xl:h-3 4xl:h-4 bg-foreground/20 mt-1.5 3xl:mt-2.5 4xl:mt-3.5"
                          }`}
                        />
                      </div>
                    );
                  })}

                  {/* Rotatable Knob */}
                  <div
                    ref={knobRef}
                    className="w-[84px] h-[84px] md:w-[110px] md:h-[110px] 3xl:w-[170px] 3xl:h-[170px] 4xl:w-[226px] 4xl:h-[226px] rounded-full bg-transparent border border-primary/20 flex items-center justify-center relative"
                  >
                    {/* Concentric rings texture details */}
                    <div className="absolute inset-2 rounded-full border border-primary/[0.04] pointer-events-none" />
                    <div className="absolute inset-4 rounded-full border border-primary/[0.02] pointer-events-none" />

                    {/* Indicator Marker - hollow stroke ring */}
                    <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 md:w-3 md:h-3 3xl:w-4.5 3xl:h-4.5 4xl:w-6 4xl:h-6 rounded-full border border-primary bg-transparent" />
                  </div>

                  {/* Static Center Cap (Sibling - remains stationary and upright) */}
                  <div className="absolute w-[32px] h-[32px] md:w-[44px] md:h-[44px] 3xl:w-[66px] 3xl:h-[66px] 4xl:w-[90px] 4xl:h-[90px] rounded-full bg-transparent backdrop-blur-[1px] border border-primary/15 flex items-center justify-center pointer-events-none z-30">
                    <span className="text-xs md:text-sm 3xl:text-xl 4xl:text-3xl font-mono font-black text-primary/80 tracking-tighter">
                      0{activeIndex + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
