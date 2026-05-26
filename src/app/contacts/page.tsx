"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
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
    company: "Upwork",
    role: "Freelance Motion Graphic Designer",
    period: "2020 – Present",
  },
  {
    company: "“Z Cũng Viết”",
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

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const springTiltX = useSpring(tiltX, springConfig);
  const springTiltY = useSpring(tiltY, springConfig);

  const transformOrigin = useTransform(
    [pivotX, pivotY],
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
    animate(pivotX, 50, { duration: 1.2, ease: [0.23, 1, 0.32, 1] });
    animate(pivotY, 50, { duration: 1.2, ease: [0.23, 1, 0.32, 1] });
    setIsFlipped(!isFlipped);

    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <PageWrapper className="h-screen overflow-hidden flex flex-col justify-center py-0">
      <div className="max-w-[1300px] mx-auto px-8 w-full perspective-[3000px]">
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
            className="relative w-full"
          >
            {/* FRONT SIDE */}
            <div
              className="backface-hidden w-full relative z-10 preserve-3d"
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-8 py-3 h-[50px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase italic leading-none whitespace-nowrap">
                  Contact
                </h1>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-background/40 backdrop-blur-md overflow-hidden">
                <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between min-h-[450px]">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <a
                        href="mailto:quannguyenhere@gmail.com"
                        className="group block text-xl md:text-2xl font-medium tracking-tight pointer-events-auto py-4 px-2 -my-4 -mx-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="group-hover:text-tech-blue transition-colors duration-300 uppercase leading-tight">
                          QUANNGUYENHERE<br />@GMAIL.COM
                        </span>
                        <div className="h-[1px] w-0 group-hover:w-full bg-tech-blue transition-all duration-700 mt-1" />
                      </a>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col gap-5">
                        {socialLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between text-[11px] font-mono tracking-[0.3em] transition-colors duration-300 pointer-events-auto py-3 px-4 -my-3 -mx-4"
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

                  <div className="pt-10 space-y-8">
                    <p className="text-[11px] font-light leading-relaxed opacity-60 max-w-[260px]">
                      Multimedia creative designer at the intersection of
                      architecture, motion, and code.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 relative h-[400px] lg:h-auto p-12 bg-primary/[0.01] flex items-center justify-center group">
                  <div className="relative w-full h-full max-w-lg aspect-square">
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
              className="backface-hidden absolute inset-0 w-full preserve-3d"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 border-b-0 px-8 py-3 h-[50px] inline-flex items-center absolute top-0 right-0 -translate-y-full">
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase italic leading-none whitespace-nowrap">
                  About
                </h1>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-primary/10 bg-surface/95 backdrop-blur-2xl overflow-hidden min-h-[550px]">
                <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between">
                  <div className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display uppercase tracking-tighter leading-none italic">
                        Quan Nguyen
                      </h2>
                      <p className="text-[10px] font-mono tracking-widest opacity-40 uppercase">
                        Multimedia Designer
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-6">
                        {experience.map((exp, i) => (
                          <div key={i} className="space-y-1 group">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] font-bold tracking-wider uppercase group-hover:text-tech-blue transition-colors duration-300">
                                {exp.company}
                              </span>
                              <span className="text-[8px] font-mono opacity-30">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-[9px] opacity-60 uppercase tracking-wide">
                              {exp.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-10">
                    <p className="text-[10px] uppercase tracking-wide opacity-60 leading-relaxed max-w-[240px]">
                      FPT University // BBA Multimedia Communications
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 p-12 md:p-24 lg:p-32 flex flex-col justify-center space-y-16 relative">
                  <div className="space-y-12 relative z-10 max-w-3xl">
                    <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90 italic">
                      &ldquo;I&apos;m a Multimedia Communications creative obsessed with
                      telling stories with a purpose.&rdquo;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <p className="text-[13px] font-light leading-relaxed opacity-60">
                        Since 2020, I&apos;ve been working as a Freelance Motion
                        Graphics Designer, bringing brands&apos; messages to life
                        with dynamic and bold visuals.
                      </p>
                      <p className="text-[13px] font-light leading-relaxed opacity-60">
                        My approach combines strategic communications with
                        high-end aesthetic execution. I believe that every frame
                        should serve a narrative.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-between items-center relative z-10 opacity-60">
                    <div className="flex gap-12">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
                        Motion Graphics
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
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
