"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { t, motion as motionTokens } from "@/lib/designSystem";

function GooeyText({
  lines,
  textClassName,
  className,
}: {
  lines: string[];
  textClassName?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const textEl = containerRef.current;
    if (!textEl) return;

    let mouse: { x: number; y: number } | null = null;
    let frameQueued = false;
    const initialOffsets: { x: number; y: number }[] = [];

    const RADIUS = 104;
    const MAX_BLUR = 6;
    const MAX_SCALE = 1.6;
    const FALLOFF = 2.8;

    const currentChars = () => charsRef.current.filter((ch): ch is HTMLSpanElement => ch !== null);
    const filterWrap = textEl.querySelector('.goo-filter-wrap') as HTMLElement | null;

    function cacheOffsets() {
      const chars = currentChars();
      if (chars.length === 0) return;

      chars.forEach(ch => {
        ch.style.filter = '';
        ch.style.transform = '';
      });

      chars.forEach((ch, idx) => {
        let x = ch.offsetLeft + ch.offsetWidth / 2;
        let y = ch.offsetTop + ch.offsetHeight / 2;
        
        let parent = ch.offsetParent as HTMLElement | null;
        while (parent && parent !== textEl) {
          x += parent.offsetLeft;
          y += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }

        initialOffsets[idx] = { x, y };
      });
    }

    function update() {
      frameQueued = false;
      const chars = currentChars();
      if (chars.length === 0 || initialOffsets.length === 0) return;

      const r = textEl!.getBoundingClientRect();
      const cardPanel = textEl!.closest('.backface-hidden') as HTMLElement | null;
      const isPanelActive = cardPanel ? window.getComputedStyle(cardPanel).pointerEvents !== 'none' : true;

      let isHovered = false;
      if (mouse && isPanelActive) {
        const parentEl = textEl!.parentElement;
        const hr = parentEl ? parentEl.getBoundingClientRect() : r;
        if (
          mouse.x >= hr.left &&
          mouse.x <= hr.right &&
          mouse.y >= hr.top &&
          mouse.y <= hr.bottom
        ) {
          isHovered = true;
        }
      }

      if (filterWrap) {
        filterWrap.style.filter = isHovered ? 'url(#goo)' : 'none';
      }

      chars.forEach((ch, idx) => {
        if (!isHovered || !mouse || !initialOffsets[idx]) {
          ch.style.filter = '';
          ch.style.transform = '';
          return;
        }

        const cx = r.left + initialOffsets[idx].x;
        const cy = r.top + initialOffsets[idx].y;
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS);
        const influence = Math.pow(t, FALLOFF);

        if (influence < 0.001) {
          ch.style.filter = '';
          ch.style.transform = '';
        } else {
          const blurPx = influence * MAX_BLUR;
          const scale = 1 + (MAX_SCALE - 1) * influence;
          ch.style.filter = `blur(${blurPx.toFixed(2)}px)`;
          ch.style.transform = `scale(${scale.toFixed(3)})`;
        }
      });
    }

    function schedule() {
      if (!frameQueued) {
        frameQueued = true;
        requestAnimationFrame(update);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse = {
        x: e.clientX,
        y: e.clientY
      };
      schedule();
    };

    const handleMouseLeave = () => {
      mouse = null;
      schedule();
    };

    const timer = setTimeout(cacheOffsets, 200);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', cacheOffsets);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', cacheOffsets);
    };
  }, [lines]);

  charsRef.current = [];
  let charIndex = 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .goo-row {
          position: relative;
          display: block;
          width: 100%;
        }
        .goo-filter-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .goo-text {
          white-space: nowrap;
          cursor: default;
          user-select: none;
          display: block;
          text-rendering: optimizeLegibility;
        }
        .goo-char {
          display: inline-block;
          will-change: filter, transform;
          transform-origin: center center;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          pointer-events: none;
        }
      `}} />
      <div
        ref={containerRef}
        className={`goo-row select-none ${className || ""}`}
      >
        <div className="goo-filter-wrap" style={{ filter: "none" }}>
          {lines.map((line, lineIdx) => (
            <div
              key={lineIdx}
              className="goo-text flex items-center whitespace-nowrap"
            >
              {line.split("").map((char, charIdx) => {
                const currentIdx = charIndex++;
                return (
                  <span
                    key={charIdx}
                    ref={el => {
                      charsRef.current[currentIdx] = el;
                    }}
                    className={`goo-char ${textClassName || ""}`}
                  >
                    {char === " " ? "\u00a0" : char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const socialLinks = [
  {
    name: "LINKEDIN",
    url: "https://www.linkedin.com/in/quannguyenhere/",
    id: "01",
  },
  { name: "BEHANCE", url: "#", id: "02" },
  { name: "UPWORK", url: "#", id: "03" },
];

const experience = [
  {
    company: "Herond Labs",
    role: "Motion Designer",
    period: "2025 – Present",
  },
  {
    company: "Upwork",
    role: "Freelance Motion Graphic Designer",
    period: "2020 – 2025",
  },
  {
    company: "\u201CZ Cũng Viết\u201D",
    role: "Project Manager & Lead Creative",
    period: "2023",
  },
  {
    company: "Viettel Digital",
    role: "Lead Content Marketing Intern",
    period: "2022",
  },
];

export default function ContactsPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const pivotX = useMotionValue(50);
  const pivotY = useMotionValue(50);

  const springConfig = { damping: 40, stiffness: 250, mass: 0.5 };
  const pivotSpringConfig = { damping: 15, stiffness: 40, mass: 1 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const springTiltX = useSpring(tiltX, springConfig);
  const springTiltY = useSpring(tiltY, springConfig);

  const springPivotX = useSpring(pivotX, pivotSpringConfig);
  const springPivotY = useSpring(pivotY, pivotSpringConfig);

  const transformOrigin = useTransform(
    [springPivotX, springPivotY],
    ([x, y]) => `${x}% ${y}%`,
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * 0.08);
    mouseY.set((e.clientY - centerY) * 0.08);

    tiltY.set((e.clientX - centerX) / 40);
    tiltX.set((e.clientY - centerY) / -40);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    tiltX.set(0);
    tiltY.set(0);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!containerRef.current || isAnimating) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    mouseX.set(0);
    mouseY.set(0);
    tiltX.set(0);
    tiltY.set(0);

    setIsAnimating(true);
    pivotX.set(xPct);
    pivotY.set(yPct);
    setIsFlipped(!isFlipped);

    setTimeout(() => {
      pivotX.set(50);
      pivotY.set(50);
    }, 300);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <PageWrapper className="h-screen overflow-hidden flex flex-col justify-center py-0">
      <div className="max-w-[800px] 3xl:max-w-[1080px] 4xl:max-w-[1300px] mx-auto px-8 3xl:px-16 4xl:px-24 w-full perspective-[3000px]">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className="relative w-full cursor-pointer preserve-3d"
          initial={{ y: 900, rotate: -15, rotateX: 35, opacity: 0 }}
          animate={isEntered
            ? {
                y: isFlipped ? 0 : [0, -15, 0],
                rotate: 0,
                rotateX: 0,
                opacity: 1,
              }
            : {
                y: 0,
                rotate: 0,
                rotateX: 0,
                opacity: 1,
              }
          }
          onAnimationComplete={() => {
            if (!isEntered) setIsEntered(true);
          }}
          transition={isEntered
            ? {
                y: { repeat: isFlipped ? 0 : Infinity, duration: 6, ease: "easeInOut" },
                rotate: { duration: 0.5 },
                rotateX: { duration: 0.5 },
              }
            : {
                type: "spring",
                stiffness: 90,
                damping: 13,
                mass: 0.8,
                opacity: { duration: 0.5 },
              }
          }
          style={{
            x: springX,
            y: springY,
            rotateX: springTiltX,
            rotateY: springTiltY,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            animate={{
              rotateY: isFlipped ? 180 : 0,
            }}
            transition={{
              rotateY: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
            }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: transformOrigin,
            }}
            className="grid grid-cols-1 grid-rows-1 w-full"
          >
            {/* FRONT SIDE */}
            <div
              className="col-start-1 row-start-1 backface-hidden w-full preserve-3d"
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                pointerEvents: isFlipped ? "none" : "auto",
                zIndex: isFlipped ? 0 : 1,
              }}
            >
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-6 py-2 h-[40px] 3xl:px-10 3xl:py-4 3xl:h-[54px] 4xl:px-14 4xl:py-5 4xl:h-[68px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className={`${t.h2} italic leading-none whitespace-nowrap`}>
                  Contact
                </h1>
              </div>

              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-surface/20 backdrop-blur-xl overflow-hidden min-h-[400px] 3xl:min-h-[520px] 4xl:min-h-[620px]">
                <div className="lg:col-span-5 p-5 md:p-8 3xl:p-10 4xl:p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between">
                  <div className="space-y-6 3xl:space-y-10 4xl:space-y-12">
                    <div className="space-y-2">
                      <span className={`${t.subtitle} opacity-50 block`}>CONTACT</span>
                      <a
                        href="mailto:quannguyenhere@gmail.com"
                        className="pointer-events-auto flex flex-col gap-1.5 py-8 -my-5 group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GooeyText
                          lines={["@QUANNGUYENHERE"]}
                          textClassName={`${t.h2} italic leading-none whitespace-nowrap`}
                        />
                      </a>
                    </div>

                    <div className="space-y-4 pt-4">
                      <span className={`${t.subtitle} opacity-50 block`}>SOCIAL CONNECTIONS</span>
                      <div className="flex flex-col gap-4 3xl:gap-5">
                        {socialLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center justify-between ${t.meta} transition-colors duration-300 pointer-events-auto py-2 px-4 -my-2 -mx-4`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="group-hover:text-tech-blue transition-colors">
                              <span className="opacity-20 mr-2">{link.id}</span>
                              {link.name}
                            </span>
                            <div className="w-0 group-hover:w-8 h-[0.5px] bg-tech-blue transition-all duration-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 space-y-3">
                    <span className={`${t.subtitle} opacity-50 block`}>SYNOPSIS</span>
                    <p className={`${t.body} max-w-[240px] 3xl:max-w-[320px] opacity-80`}>
                      Multimedia creative designer at the intersection of
                      architecture, motion, and code.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 p-4 md:p-6 lg:p-8 relative min-h-[300px] lg:min-h-full bg-primary/[0.01] group">
                  <div className="relative w-full h-full min-h-[268px] lg:min-h-0">
                    <Image
                      src="/assets/portrait_sitting.jpg"
                      alt="Minh Quan Portrait"
                      fill
                      priority
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BACK SIDE */}
            <div
              className="col-start-1 row-start-1 backface-hidden w-full preserve-3d"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "preserve-3d",
                pointerEvents: isFlipped ? "auto" : "none",
                zIndex: isFlipped ? 1 : 0,
              }}
            >
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-6 py-2 h-[40px] 3xl:px-10 3xl:py-4 3xl:h-[54px] 4xl:px-14 4xl:py-5 4xl:h-[68px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className={`${t.h2} italic leading-none whitespace-nowrap`}>
                  About
                </h1>
              </div>

              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-surface/20 backdrop-blur-xl overflow-hidden min-h-[400px] 3xl:min-h-[520px] 4xl:min-h-[620px]">
                <div className="lg:col-span-5 p-5 md:p-8 3xl:p-10 4xl:p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between">
                  <div className="space-y-6 3xl:space-y-10 4xl:space-y-12">
                    <div className="space-y-2">
                      <span className={`${t.subtitle} opacity-50 block`}>CREATIVE PROFILE</span>
                      <a
                        href="mailto:quannguyenhere@gmail.com"
                        className="pointer-events-auto flex flex-col gap-1.5 py-8 -my-5 group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GooeyText
                          lines={["@QUANNGUYENHERE"]}
                          textClassName={`${t.h2} italic leading-none whitespace-nowrap`}
                        />
                      </a>
                      <p className="text-[9px] 3xl:text-[11px] 4xl:text-xs font-mono tracking-widest uppercase opacity-50 mt-1">
                        Multimedia Designer
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <span className={`${t.subtitle} opacity-50 block`}>EXPERIENCE</span>
                      <div className="space-y-4 3xl:space-y-6">
                        {experience.map((exp, i) => (
                          <div key={i} className="space-y-1 group">
                            <div className="flex justify-between items-baseline">
                              <span className={`${t.h3} ${motionTokens.skewHover}`}>
                                {exp.company}
                              </span>
                              <span className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-40">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-75 tracking-wide">
                              {exp.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 space-y-2">
                    <span className={`${t.subtitle} opacity-50 block`}>EDUCATION</span>
                    <p className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-75 leading-relaxed max-w-[240px]">
                      FPT University // BBA Multimedia Communications
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 p-6 md:p-8 lg:p-10 3xl:p-12 4xl:p-16 flex flex-col justify-center space-y-6 3xl:space-y-8 relative">
                  <div className="space-y-6 3xl:space-y-8 4xl:space-y-10 relative z-10 max-w-2xl 3xl:max-w-3xl 4xl:max-w-4xl">
                    <div className="space-y-3">
                      <span className={`${t.subtitle} opacity-50 block`}>MANIFESTO</span>
                      <p className={`${t.h2} font-light leading-relaxed opacity-95 italic`}>
                        &ldquo;I&apos;m a Multimedia Communications creative obsessed with
                        telling stories with a purpose.&rdquo;
                      </p>
                    </div>

                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 3xl:gap-12 4xl:gap-16">
                      <p className={`${t.body} opacity-85`}>
                        Since 2020, I&apos;ve been working as a Freelance Motion
                        Graphics Designer, bringing brands&apos; messages to life
                        with dynamic and bold visuals.
                      </p>
                      <p className={`${t.body} opacity-85`}>
                        My approach combines strategic communications with
                        high-end aesthetic execution. I believe that every frame
                        should serve a narrative.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 3xl:pt-8 flex flex-col gap-2 relative z-10">
                    <span className={`${t.subtitle} opacity-50 block`}>DISCIPLINES</span>
                    <div className="flex gap-3">
                      <span className="border border-primary/10 px-3 py-1 text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-75">
                        Motion Graphics
                      </span>
                      <span className="border border-primary/10 px-3 py-1 text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-75">
                        Visual Systems
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="goo" x="-30%" y="-80%" width="160%" height="260%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -6.5"
            />
          </filter>
        </defs>
      </svg>
    </PageWrapper>
  );
}
