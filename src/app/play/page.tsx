"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";
import { layout, t, ui, fx, motion as motionTokens } from "@/lib/designSystem";

export default function PlayPage() {
  return (
    <PageWrapper slideDirection="none">
      <div className={layout.page}>
        {/* Section title / header */}
        <motion.div
          {...fx.headerSlideIn}
          className="mb-16 space-y-4 3xl:space-y-6"
        >
          <h1 className={t.display}>
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
                className="group block w-full"
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
                <div className={ui.cardFooter}>
                  <div className="space-y-1 3xl:space-y-2">
                    <h2 className={`${t.h3} ${motionTokens.skewHover}`}>
                      {exp.title}
                    </h2>
                    <div className="flex gap-2">
                      {exp.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className={`${t.meta} opacity-40 group-hover:opacity-75`}
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`${ui.arrow} text-xl 3xl:text-2xl 4xl:text-3xl`}>
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
