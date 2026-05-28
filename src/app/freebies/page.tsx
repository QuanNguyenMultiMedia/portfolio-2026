"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { freebies, FreebieItem } from "@/data/freebies";
import HUDLabel from "@/components/HUDLabel";
import SectionHeader from "@/components/SectionHeader";
import TechButton from "@/components/TechButton";
import LogoMark from "@/components/LogoMark";
import Portal from "@/components/Portal";

export default function FreebiesPage() {
  const [selectedItem, setSelectedItem] = useState<FreebieItem | null>(null);
  const [screenSize, setScreenSize] = useState<"mobile" | "laptop" | "3xl" | "4xl">("laptop");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setScreenSize("mobile");
      else if (w >= 2560) setScreenSize("4xl");
      else if (w >= 1920) setScreenSize("3xl");
      else setScreenSize("laptop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable scrolling when popover is open
  useEffect(() => {
    const lenis = (window as any).lenis || (window as any).__lenisInstance;
    if (!lenis) return;
    if (selectedItem) {
      lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis.start();
      document.body.style.overflow = "";
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const panelWidth = screenSize === "4xl" ? 680 : screenSize === "3xl" ? 540 : 420;

  return (
    <>
      <PageWrapper>
        <div className="relative min-h-screen pb-64">
          <SectionHeader
            directory="Free Library // 01"
            title="Boutique"
            subtitle="Curated Downloads"
          />

          {/* Minimal Staggered Grid */}
          <motion.div
            animate={{
              filter: selectedItem ? "blur(20px)" : "blur(0px)",
              opacity: selectedItem ? 0.3 : 1,
              scale: selectedItem ? 0.98 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-x-12 3xl:gap-x-20 4xl:gap-x-28 gap-y-32 md:gap-y-48 relative"
          >
            {freebies.map((item, idx) => {
              const layoutConfig = [
                "md:col-start-2 md:col-span-3",
                "md:col-start-7 md:col-span-4 mt-24",
                "md:col-start-4 md:col-span-3",
                "md:col-start-8 md:col-span-3 mt-12",
                "md:col-start-3 md:col-span-4",
              ][idx % 5];

              return (
                <motion.div
                  key={item.id}
                  layoutId={`container-${item.id}`}
                  className={`${layoutConfig} group cursor-pointer`}
                  onClick={() => setSelectedItem(item)}
                >
                  <motion.div
                    layoutId={`thumb-${item.id}`}
                    className="relative aspect-[4/5] overflow-hidden bg-primary/5 border border-primary/5 mb-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100"
                    />
                  </motion.div>

                  <div className="px-1 mt-6">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-7xl font-display uppercase tracking-tighter leading-[0.85] text-primary font-bold transition-all duration-500 group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </PageWrapper>

      {/* Detail View Overlay inside Portal to completely escape parent containing block transforms */}
      <Portal>
        <AnimatePresence>
          {selectedItem && (
            <>
              {/* Solid Backdrop */}
              <motion.div
                key="freebie-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-background/95 z-[100] cursor-zoom-out backdrop-blur-3xl"
              />

              {/* Image hero — centered, vertically centered within the left area */}
              <div 
                className="hidden md:flex fixed inset-0 z-[102] pointer-events-none items-center justify-center"
                style={{ paddingRight: `${panelWidth}px` }}
              >
                <motion.div
                  layoutId={`thumb-${selectedItem.id}`}
                  className="relative w-[45vw] max-w-[55vh] h-[65vh] overflow-hidden bg-foreground/5 shadow-2xl"
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover grayscale-0"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
                </motion.div>
              </div>

              {/* Logo Mask Interaction */}
              <motion.div
                key="logo-mask"
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: `inset(0 0 0 calc(100% - ${panelWidth}px))` }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="fixed inset-0 z-[110] pointer-events-none hidden md:block"
              >
                <LogoMark
                  variant="auto"
                  animate={false}
                  className="!z-[110]"
                />
              </motion.div>

              {/* Side Detail Panel */}
              <motion.div
                key="freebie-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="fixed top-0 right-0 bottom-0 bg-background/85 backdrop-blur-2xl border-l border-primary/10 z-[101] flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.1)] pointer-events-auto"
                style={{ width: screenSize === "mobile" ? "100%" : `${panelWidth}px` }}
              >
                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-primary/25 pointer-events-none" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-primary/25 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-primary/25 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-primary/25 pointer-events-none" />

                {/* Header */}
                <div className="p-8 md:p-12 pb-4 3xl:p-16 3xl:pb-6 4xl:p-20 4xl:pb-8 flex justify-between items-center border-b border-primary/5">
                  <HUDLabel text={selectedItem.category} className="!opacity-60" />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:opacity-40 transition-opacity z-[111] cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 1L13 13M1 13L13 1"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content Focus */}
                <div className="flex-grow p-8 md:p-12 3xl:p-16 4xl:p-20 flex flex-col justify-start md:justify-center space-y-8 md:space-y-12 3xl:space-y-16 4xl:space-y-24 overflow-y-auto">
                  {/* Mobile Image Preview */}
                  <div className="block md:hidden w-full aspect-[16/10] relative overflow-hidden bg-primary/5 border border-primary/10">
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl 3xl:text-7xl 4xl:text-8xl font-display uppercase tracking-tighter leading-[0.85] text-primary font-bold">
                      {selectedItem.title}
                    </h2>
                    <div className="h-px w-8 bg-primary/20" />
                  </div>

                  <div className="space-y-4 max-w-sm 3xl:max-w-md 4xl:max-w-xl">
                    {selectedItem.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-base md:text-lg 3xl:text-xl 4xl:text-2xl font-light leading-relaxed opacity-70">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono opacity-20 tracking-widest block">
                      COLOR PALETTE // SPEC_2026
                    </span>
                    <div className="flex gap-2">
                      {selectedItem.colors.map((color, i) => (
                        <div key={i} className="group relative">
                          <div
                            className="w-6 h-6 3xl:w-9 3xl:h-9 4xl:w-12 4xl:h-12 border border-primary/15 transition-transform duration-300 hover:scale-110 cursor-help"
                            style={{ backgroundColor: color }}
                          />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 bg-foreground text-background text-[8px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[120]">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="p-8 md:p-12 pt-4 3xl:p-16 3xl:pt-6 4xl:p-20 4xl:pb-8 border-t border-primary/5">
                  <TechButton
                    href={selectedItem.downloadUrl}
                    className="w-full !py-6 3xl:!py-8 4xl:!py-10 3xl:text-lg 4xl:text-xl"
                  >
                    Download // Free
                  </TechButton>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
