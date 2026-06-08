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
              className="w-fit self-start"
            >
              <Link
                href={`/play/${exp.slug}`}
                className="group flex flex-col w-fit self-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-full md:max-w-[340px] 3xl:max-w-[400px]"
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
                <div className={`${ui.cardFooter} flex items-center justify-between gap-6 w-full min-h-[4.5rem] 3xl:min-h-[5.5rem] 4xl:min-h-[6.5rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                  <div className="min-w-0 flex-1">
                    <h2 
                      className={`${t.cardTitle} ${motionTokens.skewHover} leading-[1.2] block`}
                      title={exp.title}
                    >
                      {exp.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
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
                  <span className={`${ui.arrow} text-xl 3xl:text-2xl 4xl:text-3xl shrink-0`}>
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
