"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

import BalancedText from "@/components/BalancedText";
import MeasuredHeader from "@/components/MeasuredHeader";
import PageWrapper from "@/components/PageWrapper";
import TechButton from "@/components/TechButton";

const BASE_IMAGES = [
  { src: "/projects/squarepeg.png", alt: "SquarePeg" },
  { src: "/assets/portrait_sitting.jpg", alt: "Portrait" },
  { src: "/projects/mo-lam-ma.png", alt: "Mo Lam Ma" },
  { src: "/projects/gom-men.png", alt: "Gom Men" },
  { src: "/assets/hero-visual.png", alt: "Hero Visual" },
  { src: "/assets/portrait_sitting_smiling.jpg", alt: "Portrait Smiling" },
];

const CAROUSEL_IMAGES = [...BASE_IMAGES, ...BASE_IMAGES, ...BASE_IMAGES];

const CAPABILITIES = [
  "Motion Design", "Branding", "Social Media",
  "Visual Effects", "Video Editing", "Web Animation",
];

const TESTIMONIALS = [
  {
    brand: "Freightos",
    quote: "The motion system Quan delivered didn't just look premium ΓÇö it fundamentally improved how users understood our data hierarchy. Every transition had purpose.",
    author: "Freightos Branding", role: "Client Partner",
  },
  {
    brand: "Storyflow",
    quote: "Quan brought a level of spatial awareness to our UI that we hadn't articulated but immediately recognized as missing. The scroll-linked animations redefined our visual language.",
    author: "Storyflow Studio", role: "Creative Director",
  },
  {
    brand: "Savannah Bee Co",
    quote: "Every micro-interaction Quan designed serves the narrative ΓÇö nothing is ornamental. That restraint is rare, and it made our brand feel instantly more sophisticated.",
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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    function attach() {
      const lenis = (window as any).lenis;
      if (!lenis) {
        const rafId = requestAnimationFrame(attach);
        cleanup = () => cancelAnimationFrame(rafId);
        return;
      }
      const onScroll = (l: any) => {
        scrollProgress.set(l.animatedScroll / l.dimensions.limit.y);
      };
      onScroll(lenis);
      lenis.on("scroll", onScroll);
      cleanup = () => lenis.off("scroll", onScroll);
    }
    attach();
    return () => cleanup?.();
  }, [scrollProgress]);

  const parallaxMultiplier = useTransform(scrollProgress, [0.15, 0.25], [0, 1]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 1 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 1 });

  const rawRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [-1.5, 1.5]);
  const rawRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [1.5, -1.5]);
  const rawTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const rawTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]);

  const rotateX = useTransform([rawRotateX, parallaxMultiplier], ([rX, mult]) => (rX as number) * (mult as number));
  const rotateY = useTransform([rawRotateY, parallaxMultiplier], ([rY, mult]) => (rY as number) * (mult as number));
  const translateX = useTransform([rawTranslateX, parallaxMultiplier], ([tX, mult]) => (tX as number) * (mult as number));
  const translateY = useTransform([rawTranslateY, parallaxMultiplier], ([tY, mult]) => (tY as number) * (mult as number));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (latest < 0.075) setActiveFrame(0);
    else if (latest < 0.25) setActiveFrame(1);
    else if (latest < 0.55) setActiveFrame(2);
    else if (latest < 0.75) setActiveFrame(3);
    else setActiveFrame(4);
  });

  const zWorld = useTransform(
    scrollProgress,
    [0.0, 0.15, 0.35, 0.55, 0.90, 1.0],
    [0, 1800, 3300, 4800, 6300, 6300],
  );

  const transformWorld = useMotionTemplate`translate3d(${translateX}px, ${translateY}px, ${zWorld}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const opacityHero = useTransform(zWorld, [0, 600, 1000], [1, 1, 0]);
  const blurHero = useTransform(zWorld, [0, 600, 1000], ["blur(0px)", "blur(0px)", "blur(12px)"]);

  const opacityManifesto = useTransform(zWorld, [600, 1200, 2400, 3000], [0, 1, 1, 0]);
  const blurManifesto = useTransform(zWorld, [600, 1200, 2400, 3000], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  const opacityCapabilities = useTransform(zWorld, [2100, 2700, 3900, 4500], [0, 1, 1, 0]);
  const blurCapabilities = useTransform(zWorld, [2100, 2700, 3900, 4500], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  const opacityTestimonials = useTransform(zWorld, [3600, 4200, 5400, 6000], [0, 1, 1, 0]);
  const blurTestimonials = useTransform(zWorld, [3600, 4200, 5400, 6000], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  const opacityStats = useTransform(zWorld, [5100, 5700, 6300], [0, 1, 1]);
  const blurStats = useTransform(zWorld, [5100, 5700, 6300], ["blur(8px)", "blur(0px)", "blur(0px)"]);

  const perspectiveVal = useTransform(scrollProgress, (progress) => {
    const start = isMobile ? 1200 : 1400;
    const end = isMobile ? 850 : 950;
    return start + progress * (end - start);
  });
  const perspectiveTemplate = useMotionTemplate`${perspectiveVal}px`;

  // Sine carousel: drag to advance image strip forward/back, wraps around
  const dragOffset = useMotionValue(0);
  const smoothOffset = useSpring(dragOffset, { damping: 30, stiffness: 200 });

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    (el as any).__dragging = true;
    (el as any).__lastX = e.clientX;
  }, []);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    const el = e.currentTarget;
    if (!(el as any).__dragging) return;
    const delta = e.clientX - (el as any).__lastX;
    (el as any).__lastX = e.clientX;
    dragOffset.set(dragOffset.get() + delta * 0.005);
  }, []);

  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    delete (e.currentTarget as any).__dragging;
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
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute top-32 left-8 z-10 md:left-24 md:top-48 max-w-[55vw]"
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
                    className="font-display text-6xl font-bold uppercase leading-[0.75] tracking-tighter md:text-[10rem]"
                    maxWidth={900}
                    font="800 192px Plus Jakarta Sans"
                  />
                  <div className="mt-4">
                    <span className="font-display text-primary text-2xl font-light italic uppercase tracking-tighter md:text-5xl">
                      Midweight Motion Designer
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute left-8 top-24 z-10 hidden aspect-[3/4] w-full max-w-[220px] md:right-[12vw] md:left-auto md:top-1/2 md:block md:max-w-xs"
                style={{
                  transform: "translate3d(0px, 0px, 150px) translateY(-50%)",
                  transformStyle: "preserve-3d",
                  opacity: opacityHero,
                  filter: blurHero,
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
                className="absolute bottom-12 left-8 z-10 max-w-sm md:bottom-24 md:left-24"
                style={{
                  transform: "translate3d(0px, 0px, -100px)",
                  transformStyle: "preserve-3d",
                  opacity: opacityHero,
                  filter: blurHero,
                }}
              >
                <BalancedText
                  text="Orchestrating space, time, and identity into cinematic digital products. Scroll to explore the craft."
                  className="text-subhead"
                  maxWidth={400}
                  font="300 24px Inter"
                />
              </motion.div>
            </motion.div>

            {/* FRAME 1: MANIFESTO */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 1 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Z-anchored wrapper ΓÇö same depth plane as manifesto text */}
              <motion.div
                className="absolute inset-0"
                style={{
                  transform: "translate3d(0px, 0px, -1800px)",
                  opacity: opacityManifesto,
                  filter: blurManifesto,
                }}
              >
                {/* Sine wave image carousel ΓÇö drag left/right to advance */}
                <div
                  onPointerDown={handleDragStart}
                  onPointerMove={handleDragMove}
                  onPointerUp={handleDragEnd}
                  onPointerCancel={handleDragEnd}
                  className="absolute top-0 left-0 w-full h-[55vh] overflow-hidden pointer-events-auto touch-none select-none"
                >
                  <div className="relative w-full h-full">
                    {CAROUSEL_IMAGES.map((img, i) => (
                      <SineCard
                        key={`${i}-${img.src}`}
                        img={img}
                        index={i}
                        total={CAROUSEL_IMAGES.length}
                        offset={smoothOffset}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Manifesto Text ΓÇö bottom left */}
              <motion.div
                className="absolute bottom-12 left-8 z-30 md:bottom-16 md:left-16 max-w-lg text-left"
                style={{
                  transform: "translate3d(0px, 0px, -1800px)",
                  transformStyle: "preserve-3d",
                  opacity: opacityManifesto,
                  filter: blurManifesto,
                }}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase mb-4">
                  Manifesto
                </p>
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase leading-[0.95] text-primary">
                  Motion Is The <br />
                  <span className="italic font-light text-tech-blue">Language</span> Of <br />
                  Intention.
                </h2>
              </motion.div>
            </motion.div>

            {/* FRAME 2: CAPABILITIES */}
            <motion.div
              style={{
                pointerEvents: activeFrame === 2 ? "auto" : "none",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: "translate3d(0px, 0px, -3300px)",
                  transformStyle: "preserve-3d",
                  opacity: opacityCapabilities,
                  filter: blurCapabilities,
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 md:gap-x-24 gap-y-10 md:gap-y-14">
                  {CAPABILITIES.map((cap) => (
                    <div key={cap} className="text-left">
                      <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-primary whitespace-nowrap">
                        {cap}
                      </h2>
                    </div>
                  ))}
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
                const x = idx % 2 === 0 ? "-20vw" : "20vw";
                const y = idx < 2 ? "-14vh" : "14vh";
                const z = -4700 + idx * 50;
                return (
                  <motion.div
                    key={test.brand}
                    className="absolute left-1/2 top-1/2 w-[85vw] md:w-[34vw] border border-border-neutral/20 p-6 md:p-8 bg-surface/50 backdrop-blur-xl pointer-events-auto"
                    style={{
                      transform: `translate3d(${x}, ${y}, ${z}px) translate(-50%, -50%)`,
                      opacity: opacityTestimonials,
                      filter: blurTestimonials,
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
                  transform: "translate3d(0px, 0px, -6300px) translate(-50%, -50%)",
                  opacity: opacityStats,
                  filter: blurStats,
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
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function SineCard({
  img,
  index,
  total,
  offset,
  isMobile,
}: {
  img: { src: string; alt: string };
  index: number;
  total: number;
  offset: any;
  isMobile: boolean;
}) {
  const spread = isMobile ? 500 : 1200;
  const yAmp = isMobile ? 80 : 200;

  const x = useTransform(offset, (v: number) => {
    const raw = (index / total + v * 0.05) % 1;
    const relPos = ((raw % 1) + 1.5) % 1 - 0.5;
    return relPos * spread;
  });

  const y = useTransform(offset, (v: number) => {
    const raw = (index / total + v * 0.05) % 1;
    const relPos = ((raw % 1) + 1.5) % 1 - 0.5;
    return Math.sin(relPos * Math.PI) * yAmp;
  });

  const s = useTransform(offset, (v: number) => {
    const raw = (index / total + v * 0.05) % 1;
    const relPos = Math.abs(((raw % 1) + 1.5) % 1 - 0.5);
    return Math.max(0.35, 0.8 - relPos * 0.9);
  });

  const zIdx = useTransform(offset, (v: number) => {
    const raw = (index / total + v * 0.05) % 1;
    const relPos = Math.abs(((raw % 1) + 1.5) % 1 - 0.5);
    return Math.round(100 - relPos * 180);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-[45%] w-[55px] md:w-[80px] aspect-[4/5] will-change-transform"
      style={{ x, y, scale: s, zIndex: zIdx }}
    >
      <div className="relative w-full h-full overflow-hidden bg-surface/10">
        <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" loading="lazy" />
      </div>
    </motion.div>
  );
}
