"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

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
      <div className="max-w-[900px] 3xl:max-w-[1200px] 4xl:max-w-[1500px] mx-auto px-8 3xl:px-16 4xl:px-24 w-full perspective-[3000px]">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className="relative w-full cursor-pointer preserve-3d"
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: isFlipped ? 0 : [0, -15, 0],
            opacity: 1,
          }}
          transition={{
            y: { repeat: isFlipped ? 0 : Infinity, duration: 6, ease: "easeInOut" },
            opacity: { duration: 1.2 },
          }}
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
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-8 py-3 3xl:px-12 3xl:py-5 4xl:px-16 4xl:py-7 h-[50px] 3xl:h-[70px] 4xl:h-[90px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className="text-xl md:text-2xl 3xl:text-3xl 4xl:text-4xl font-display font-bold tracking-tighter uppercase italic leading-none whitespace-nowrap">
                  Contact
                </h1>
              </div>

              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-background/40 backdrop-blur-md overflow-hidden min-h-[450px] 3xl:min-h-[580px] 4xl:min-h-[700px]">
                <div className="lg:col-span-4 p-6 md:p-10 3xl:p-12 4xl:p-16 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between">
                  <div className="space-y-6 3xl:space-y-10 4xl:space-y-12">
                    <div className="space-y-3">
                      <a
                        href="mailto:quannguyenhere@gmail.com"
                        className="group block text-lg md:text-xl 3xl:text-2xl 4xl:text-3xl font-display font-bold uppercase tracking-tight pointer-events-auto py-3 px-2 -my-3 -mx-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="group-hover:text-tech-blue transition-colors duration-300 leading-tight">
                          QUANNGUYENHERE<br />@GMAIL.COM
                        </span>
                        <div className="h-[1px] w-0 group-hover:w-full bg-tech-blue transition-all duration-700 mt-1" />
                      </a>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 3xl:gap-5">
                        {socialLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between text-[11px] 3xl:text-sm 4xl:text-base font-mono tracking-[0.3em] transition-colors duration-300 pointer-events-auto py-3 px-4 -my-3 -mx-4"
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

                  <div className="pt-8 space-y-6">
                    <p className="text-[11px] 3xl:text-sm 4xl:text-base font-sans font-light leading-relaxed opacity-60 max-w-[240px] 3xl:max-w-[320px]">
                      Multimedia creative designer at the intersection of
                      architecture, motion, and code.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 p-8 md:p-12 lg:p-14 3xl:p-16 4xl:p-20 flex flex-col justify-center items-center relative bg-primary/[0.01] group">
                  <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg 3xl:max-w-xl 4xl:max-w-2xl aspect-square">
                    <Image
                      src="/assets/portrait_sitting.jpg"
                      alt="Minh Quan Portrait"
                      fill
                      priority
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
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
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-8 py-3 3xl:px-12 3xl:py-5 4xl:px-16 4xl:py-7 h-[50px] 3xl:h-[70px] 4xl:h-[90px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className="text-xl md:text-2xl 3xl:text-3xl 4xl:text-4xl font-display font-bold tracking-tighter uppercase italic leading-none whitespace-nowrap">
                  About
                </h1>
              </div>

              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-surface/95 backdrop-blur-2xl overflow-hidden min-h-[450px] 3xl:min-h-[580px] 4xl:min-h-[700px]">
                <div className="lg:col-span-4 p-6 md:p-10 3xl:p-12 4xl:p-16 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between">
                  <div className="space-y-6 3xl:space-y-10 4xl:space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-3xl 3xl:text-5xl 4xl:text-6xl font-display uppercase tracking-tighter leading-none italic">
                        Quan Nguyen
                      </h2>
                      <p className="text-[10px] 3xl:text-sm 4xl:text-base font-mono tracking-widest opacity-40 uppercase">
                        Multimedia Designer
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-4 3xl:space-y-6">
                        {experience.map((exp, i) => (
                          <div key={i} className="space-y-1 group">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] 3xl:text-sm 4xl:text-base font-display font-bold tracking-wider uppercase group-hover:text-tech-blue transition-colors duration-300">
                                {exp.company}
                              </span>
                              <span className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono opacity-30">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-[9px] 3xl:text-xs 4xl:text-sm font-sans opacity-60 uppercase tracking-wide">
                              {exp.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <p className="text-[10px] 3xl:text-xs 4xl:text-sm font-mono uppercase tracking-wide opacity-60 leading-relaxed max-w-[240px]">
                      FPT University // BBA Multimedia Communications
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 p-8 md:p-12 lg:p-14 3xl:p-16 4xl:p-20 flex flex-col justify-center space-y-8 3xl:space-y-10 4xl:space-y-12 relative">
                  <div className="space-y-6 3xl:space-y-8 4xl:space-y-10 relative z-10 max-w-2xl 3xl:max-w-3xl 4xl:max-w-4xl">
                    <p className="text-xl md:text-2xl 3xl:text-4xl 4xl:text-5xl font-display font-light leading-relaxed opacity-90 italic">
                      &ldquo;I&apos;m a Multimedia Communications creative obsessed with
                      telling stories with a purpose.&rdquo;
                    </p>

                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 3xl:gap-12 4xl:gap-16">
                      <p className="text-[13px] 3xl:text-lg 4xl:text-xl font-sans font-light leading-relaxed opacity-60">
                        Since 2020, I&apos;ve been working as a Freelance Motion
                        Graphics Designer, bringing brands&apos; messages to life
                        with dynamic and bold visuals.
                      </p>
                      <p className="text-[13px] 3xl:text-lg 4xl:text-xl font-sans font-light leading-relaxed opacity-60">
                        My approach combines strategic communications with
                        high-end aesthetic execution. I believe that every frame
                        should serve a narrative.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 3xl:pt-8 flex justify-between items-center relative z-10 opacity-60">
                    <div className="flex gap-12">
                      <p className="text-[10px] 3xl:text-sm 4xl:text-base font-mono uppercase tracking-[0.2em]">
                        Motion Graphics
                      </p>
                      <p className="text-[10px] 3xl:text-sm 4xl:text-base font-mono uppercase tracking-[0.2em]">
                        Visual Systems
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
