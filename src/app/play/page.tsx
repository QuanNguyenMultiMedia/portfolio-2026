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
                <div className={`${ui.cardFooter} flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                  <div className="space-y-3 min-w-0 flex-1 mr-4">
                    <div className="relative w-full overflow-hidden py-1 min-h-[2.8em] max-h-[2.8em] group-hover:max-h-[20rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <h2 
                        className={`${t.playItemName} ${motionTokens.skewHover} leading-[1.2] block line-clamp-2 group-hover:line-clamp-none px-4`}
                        title={exp.title}
                      >
                        {exp.title}
                      </h2>
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
