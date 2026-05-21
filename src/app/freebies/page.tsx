"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { freebies, FreebieItem } from "@/data/freebies";
import WaveGradientBar from "@/components/WaveGradientBar";
import HUDLabel from "@/components/HUDLabel";
import SectionHeader from "@/components/SectionHeader";
import TechButton from "@/components/TechButton";
import LogoMark from "@/components/LogoMark";

export default function FreebiesPage() {
  const [selectedItem, setSelectedItem] = useState<FreebieItem | null>(null);

  return (
    <PageWrapper>
      <div className="relative min-h-screen pb-64">
        <SectionHeader
          directory="Archive // 01"
          title="Boutique"
          subtitle="Digital Assets"
        />

        {/* Minimal Staggered Grid */}
        <motion.div
          animate={{
            filter: selectedItem ? "blur(20px)" : "blur(0px)",
            opacity: selectedItem ? 0.3 : 1,
            scale: selectedItem ? 0.98 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-32 md:gap-y-48 relative"
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
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100"
                  />
                </motion.div>

                <div className="px-1 mt-6">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-tighter leading-[0.85] text-primary font-bold transition-all duration-500 group-hover:text-primary">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detail View Overlay */}
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

              {/* Hero Centered Thumbnail */}
              <div className="fixed inset-0 z-[102] pointer-events-none flex items-center pr-0 md:pr-[420px] justify-center">
                <motion.div
                  layoutId={`thumb-${selectedItem.id}`}
                  className="relative w-[85vw] h-[50vh] md:w-[45vw] md:h-[65vh] overflow-hidden bg-foreground/5 shadow-2xl"
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover grayscale-0"
                    priority
                  />
                  {/* Inner Bloom/Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
                </motion.div>
              </div>

              {/* Logo Mask Interaction */}
              <motion.div
                key="logo-mask"
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 calc(100% - 420px))" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="fixed inset-0 z-[110] pointer-events-none hidden md:block"
              >
                <LogoMark
                  variant="inverted"
                  className="!right-16 md:!right-24 !top-16 md:!top-24 scale-110 origin-right"
                />
              </motion.div>

              {/* Side Detail Panel */}
              <motion.div
                key="freebie-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[420px] bg-background border-l border-primary/10 z-[101] flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.1)]"
              >
                {/* Minimal Header */}
                <div className="p-8 md:p-12 pb-0 flex justify-between items-start">
                  <HUDLabel
                    text={selectedItem.category}
                    className="!opacity-40"
                  />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 hover:opacity-40 transition-opacity z-[111] pointer-events-auto"
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
                <div className="flex-grow p-8 md:p-12 flex flex-col justify-center space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-display uppercase tracking-tighter leading-[0.85] text-primary font-bold">
                      {selectedItem.title}
                    </h2>
                    <div className="h-px w-8 bg-primary/20" />
                  </div>

                  <p className="text-lg font-light leading-relaxed opacity-70 max-w-xs">
                    {selectedItem.description}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[8px] font-mono opacity-20 tracking-widest block">
                      TECH_SPEC // 2026_EDITION
                    </span>
                    <div className="flex gap-1">
                      {selectedItem.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-0.5"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="p-8 md:p-12 pt-0">
                  <TechButton
                    href={selectedItem.downloadUrl}
                    className="w-full !py-6"
                  >
                    Download_Asset
                  </TechButton>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
