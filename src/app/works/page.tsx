"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import PlateOn from "@/components/riso/PlateOn";
import WorkDial from "@/components/WorkDial";
import { projects } from "@/data/projects";
import { t, fx } from "@/lib/designSystem";

export default function WorksPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex] ?? projects[0];
  const cover = activeProject.coverImage || activeProject.screens[0]?.src || "/projects/gom-men.png";

  return (
    <PageWrapper variant="hero">
      <PlateOn />
      <div className="relative w-full max-w-screen-xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto h-full flex flex-col justify-start lg:justify-between gap-4 lg:gap-0 pt-12 md:pt-28 pb-16 lg:pb-24 px-6 md:px-16 3xl:px-24 4xl:px-32 overflow-hidden z-10">
        <motion.div
          {...fx.headerSlideIn}
          className="mb-8 lg:mb-12 space-y-4 3xl:space-y-6 shrink-0 max-md:sr-only" /* phones: the top bar already names the page; the heading stays for screen readers */
        >
          <h1 className={t.sectionHeaderDisplay} data-blurmap="">
            Works
          </h1>
        </motion.div>

        {/* Main Grid conformed to viewport */}
        <div className="relative z-10 w-full max-w-none grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 3xl:gap-24 4xl:gap-32 content-start lg:content-stretch items-start lg:items-stretch flex-1 min-h-0">
          {/* Left Column: Widescreen Viewport & Details */}
          <motion.div
            {...fx.slideIn(0)}
            className="col-span-full lg:col-span-5 min-w-0 flex flex-col justify-between h-full min-h-0 space-y-6 lg:space-y-8 3xl:space-y-12 items-start text-left lg:items-end lg:text-right pb-2"
          >
            <div className="relative -mx-6 w-[calc(100%+48px)] self-stretch lg:self-auto lg:mx-0 lg:w-full aspect-video lg:aspect-auto lg:h-auto lg:flex-1 min-h-0 lg:min-h-[260px] 3xl:min-h-[380px] 4xl:min-h-[480px] bg-transparent border-y lg:border border-primary/25 overflow-hidden group transition-all duration-700 mb-6 lg:mb-0 block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: fx.easeSharp }}
                  className="w-full h-full absolute inset-0"
                >
                  <Image
                    src={cover}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover transition-transform mix-blend-print"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full flex-shrink-0 min-h-[3lh] lg:min-h-[6lh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: fx.easeSharp }}
                  className="flex flex-col gap-3 md:gap-4 shrink-0 w-full items-start text-left lg:items-end lg:text-right"
                >
                  <p className={`${t.bodyProse} max-w-[420px] 3xl:max-w-[540px] 4xl:max-w-[680px] lg:text-right lg:ml-auto`}>
                    {activeProject.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: the works selector (wheel + dial, one component) */}
          <motion.div
            {...fx.slideIn(1)}
            className="col-span-full lg:col-span-7 flex items-center min-w-0"
          >
            <WorkDial
              items={projects}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              onOpen={(i) => router.push(`/works/${projects[i].slug}`)}
            />
          </motion.div>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-28 right-8 z-50 md:bottom-32 md:right-12">
          <Link
            href="/works/builder"
            className="text-[12px] md:text-xs font-sans text-foreground hover:text-tech-blue border border-primary/25 hover:border-tech-blue/30 bg-background px-3 py-1.5 rounded transition-all duration-300 flex items-center gap-1"
          >
            BUILDER ↗
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}
