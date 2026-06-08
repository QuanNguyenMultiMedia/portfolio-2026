"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";
import { layout, t, ui, fx, motion as motionTokens } from "@/lib/designSystem";

export default function PlayPage() {
  return (
    <PageWrapper>
      <div className={layout.page}>
        {/* Section title / header */}
        <motion.div
          {...fx.headerSlideIn}
          className="mb-16 space-y-4 3xl:space-y-6"
        >
          <h1 className={t.sectionHeaderDisplay}>
            PLAY
          </h1>
        </motion.div>

        <div className={layout.gridSm}>
          {playItems.map((exp, idx) => (
            <motion.div
              key={exp.slug}
              {...fx.slideIn(idx)}
            >
              <Link
                href={`/play/${exp.slug}`}
                className="group flex flex-col w-full self-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {/* Top Frame: Thumbnail */}
                <div className={ui.card}>
                  <div className="relative w-full aspect-video overflow-hidden bg-surface/5">
                    <img
                      src={exp.src}
                      alt={exp.title}
                      referrerPolicy="no-referrer"
                      className={ui.img}
                    />
                  </div>
                </div>

                {/* Bottom Frame: Name (connected immediately) */}
                <div className={`${ui.cardFooter} relative pr-12 md:pr-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                  <div className="space-y-3 min-w-0 flex-1">
                    <div>
                      <h2 
                        className={`${t.playItemName} ${motionTokens.skewHover} leading-[1.2] block`}
                        title={exp.title}
                      >
                        {exp.title}
                      </h2>
                      
                      {/* Expandable description container */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
                        <div className="overflow-hidden">
                          <p className="text-xs md:text-sm text-foreground/50 pt-2 leading-relaxed font-light">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className={`${t.metaDataLabel} opacity-40 group-hover:opacity-75`}
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`${ui.arrow} text-xl 3xl:text-2xl 4xl:text-3xl absolute right-6 top-[22px] 3xl:right-8 3xl:top-[30px] 4xl:right-10 4xl:top-[38px]`}>
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
