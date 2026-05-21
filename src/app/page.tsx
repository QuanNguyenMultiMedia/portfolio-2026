"use client";

// Third-party
import { motion } from "framer-motion";
import Image from "next/image";

// Internal Components
import BalancedText from "@/components/BalancedText";
import MeasuredHeader from "@/components/MeasuredHeader";
import PageWrapper from "@/components/PageWrapper";
// Note: HUDLabel was imported but not used. Removing to clean up.

const HeroHeadline = () => (
  <header className="absolute top-32 left-8 z-10 md:left-24 md:top-48">
    <div className="flex flex-col gap-0">
      <MeasuredHeader
        text="Minh Quan"
        className="font-display text-7xl font-bold uppercase leading-[0.75] tracking-tighter md:text-[12rem]"
        maxWidth={1400}
        font="800 192px Plus Jakarta Sans"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="mt-4 flex items-center gap-8"
      >
        <span className="font-display text-primary text-4xl font-light italic uppercase tracking-tighter md:text-8xl">
          Digital Visuals
        </span>
      </motion.div>
    </div>
  </header>
);

const HeroPortrait = () => (
  <figure className="absolute right-8 top-24 z-10 hidden aspect-[3/4] w-full max-w-[320px] md:right-48 md:top-32 md:block md:max-w-md">
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      className="border-primary/5 group relative h-full w-full overflow-hidden border"
    >
      <Image
        src="/assets/portrait_standing.jpg"
        alt="Minh Quan - Standing Portrait"
        fill
        priority
        className="object-cover opacity-90 transition-all duration-[2000ms] grayscale group-hover:grayscale-0"
      />
    </motion.div>
  </figure>
);

const HeroBio = () => (
  <article className="absolute bottom-12 left-8 z-10 max-w-sm md:bottom-24 md:left-24">
    <div className="space-y-6">
      <BalancedText
        text="Crafting high-fidelity digital experiences through the lens of architectural precision and cinematic motion design."
        className="text-xl font-light italic leading-snug opacity-80 md:text-2xl"
        maxWidth={450}
        font="300 24px Inter"
        showHUD={false}
      />
    </div>
  </article>
);

export default function Home() {
  return (
    <PageWrapper variant="hero">
      <HeroHeadline />
      <HeroPortrait />
      <HeroBio />
    </PageWrapper>
  );
}
