"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { projects } from "@/data/projects";

export default function WorksPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialDragging, setIsDialDragging] = useState(false);

  // Refs for extreme performance (no React state renders during dragging)
  const dialRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const activeProject = projects[activeIndex];

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

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
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
    projects.forEach((_, i) => {
      const itemEl = itemRefs.current[i];
      if (!itemEl) return;

      // Infinite seamless circular module wrap formula
      let diff = i - currentRot / sectorSize;
      const N = projects.length;
      diff = ((((diff + N / 2) % N) + N) % N) - N / 2;

      const angle = diff * 28; // Increased from 22 to 28 degrees for more space between items!
      const rad = (angle * Math.PI) / 180;
      const R = 360; // Curved projection radius

      const translateY = Math.sin(rad) * R;
      const translateZ = (Math.cos(rad) - 1) * R;
      const rotateX = -angle;

      const curveAmount = 140;
      const translateX = (1 - Math.cos(rad)) * curveAmount;

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

  // Initial placement of wheel items on mount
  useEffect(() => {
    updateItemStyles(0);
  }, []);

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

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Dynamic frequency scaling (buzz pitch) based on rotational velocity
      const baseFreq = 180 + Math.min(velocity * 18, 1000);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        baseFreq * 0.25,
        ctx.currentTime + 0.015,
      );

      gain.gain.setValueAtTime(
        0.06 + Math.min(velocity / 200, 0.08),
        ctx.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.018);
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
      return "text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem]";
    }
    return "text-4xl md:text-6xl lg:text-[4.75rem] xl:text-[5.25rem]";
  };

  const getArrowSizeClass = (title: string) => {
    if (title.length > 15) {
      return "text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem]";
    }
    return "text-5xl md:text-7xl lg:text-[6rem] xl:text-[6.5rem]";
  };

  return (
    <PageWrapper variant="hero">
      <div className="relative w-full h-full flex flex-col justify-between pt-24 lg:pt-28 pb-28 lg:pb-36 px-8 lg:px-24 overflow-y-auto lg:overflow-hidden z-10">
        {/* Dynamic ambient backgrounds */}
        <div
          className="absolute -left-1/4 top-1/4 w-[600px] h-[600px] pointer-events-none opacity-[0.06] rounded-full transition-all duration-1000 ease-out z-0"
          style={{
            background: `radial-gradient(circle, ${activeProject.colors?.[0] || "#ffffff"} 0%, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute -right-1/4 bottom-1/4 w-[600px] h-[600px] pointer-events-none opacity-[0.04] rounded-full transition-all duration-1000 ease-out z-0"
          style={{
            background: `radial-gradient(circle, ${activeProject.colors?.[1] || "#ffffff"} 0%, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />

        {/* Minimal SubHeader */}
        <div className="w-full flex justify-between items-end border-b border-primary/10 pb-4 mb-4 lg:mb-6 shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase">
              Selected Works
            </span>
            <h1 className="text-2xl md:text-3xl font-display uppercase tracking-tight font-bold">
              DIRECTORY
            </h1>
          </div>
        </div>

        {/* Main Grid conformed to viewport */}
        <div className="relative z-10 w-full max-w-none grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch flex-1 min-h-0">
          {/* Left Column: Widescreen Viewport & Details */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between h-full min-h-0 space-y-4 lg:space-y-6 items-end text-right pb-2">
            <div className="relative w-full flex-1 min-h-[240px] lg:min-h-[300px] bg-transparent border border-primary/10 overflow-hidden group shadow-2xl transition-all duration-700 ml-auto mr-0">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col gap-3 shrink-0 w-full items-end text-right"
              >
                <div className="flex flex-wrap items-center gap-3 shrink-0 justify-end w-full">
                  <span className="tech-label">{activeProject.category}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  <span className="tech-label">{activeProject.year}</span>

                  <div className="flex gap-1.5 ml-2">
                    <span className="px-2 py-0.5 bg-primary/5 rounded-none text-[8px] font-bold font-mono uppercase tracking-widest opacity-60">
                      CASE_STUDY
                    </span>
                    <span className="px-2 py-0.5 bg-tech-blue/5 text-tech-blue rounded-none text-[8px] font-bold font-mono uppercase tracking-widest opacity-70">
                      {activeProject.id}
                    </span>
                  </div>
                </div>

                <p className="text-body max-w-[480px] text-right ml-auto">
                  {activeProject.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Dynamic 3D Cylinder Scroll Wheel & Integrated Axle Dial */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center relative min-h-[440px] lg:min-h-0 lg:h-full select-none pl-4">
            <div className="relative w-full h-full flex items-center">
              {/* Left Section: 3D Cylinder Scroll Container */}
              <div className="relative flex-1 h-full pr-[120px] flex items-center justify-start overflow-hidden">
                {/* Viewfinder Selection Frame - aligns perfectly to Bezel boundary */}
                <div className="absolute left-0 right-[110px] h-[160px] border-y border-primary/10 bg-transparent pointer-events-none z-0">
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
                    className="relative w-full h-[160px] flex items-center justify-start"
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
                          className={`absolute left-0 w-[95%] max-w-[580px] pl-8 pr-6 h-[160px] flex items-center cursor-pointer select-none group/wheel-item ${
                            isActive
                              ? "bg-foreground/[0.02]"
                              : "hover:bg-foreground/[0.003]"
                          }`}
                          style={{
                            transformOrigin: "left center",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-between">
                            <h3 className={`font-display uppercase tracking-tighter leading-[0.85] font-bold transition-colors duration-500 ${
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
              </div>

              {/* Integrated Dial Bezel (Pristine wireframe strokes only) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[220px] h-[220px] flex items-center justify-center z-20">
                <div
                  ref={dialRef}
                  className="relative w-[220px] h-[220px] rounded-full border border-primary/10 bg-transparent flex items-center justify-center select-none cursor-pointer"
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
                              ? "h-3.5 bg-primary"
                              : "h-2 bg-foreground/20 mt-1.5"
                          }`}
                        />
                      </div>
                    );
                  })}

                  {/* Rotatable Knob */}
                  <div
                    ref={knobRef}
                    className="w-[156px] h-[156px] rounded-full bg-transparent border border-primary/20 flex items-center justify-center relative"
                  >
                    {/* Concentric rings texture details */}
                    <div className="absolute inset-2 rounded-full border border-primary/[0.04] pointer-events-none" />
                    <div className="absolute inset-4 rounded-full border border-primary/[0.02] pointer-events-none" />

                    {/* Indicator Marker - hollow stroke ring */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-primary bg-transparent" />
                  </div>

                  {/* Static Center Cap (Sibling - remains stationary and upright) */}
                  <div className="absolute w-[66px] h-[66px] rounded-full bg-transparent backdrop-blur-[1px] border border-primary/15 flex items-center justify-center pointer-events-none z-30">
                    <span className="text-sm font-mono font-black text-primary/80 tracking-tighter">
                      0{activeIndex + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
