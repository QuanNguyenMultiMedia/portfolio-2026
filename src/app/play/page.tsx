"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";
import { designSystem, motionSystem } from "@/lib/designSystem";

export default function PlayPage() {
  return (
    <PageWrapper slideDirection="none">
      <div className={designSystem.spacing.pagePadding}>
        {/* Section title / header */}
        <motion.div
          {...motionSystem.variants.headerSlideIn}
          className={designSystem.spacing.headerSpacing}
        >
          <h1 className={designSystem.typography.pageHeroTitle}>
            PLAY
          </h1>
        </motion.div>

        <div className={designSystem.spacing.gridSmall}>
          {playItems.map((exp, idx) => (
            <motion.div
              key={exp.slug}
              {...motionSystem.variants.slideIn(idx)}
            >
              <Link
                href={`/play/${exp.slug}`}
                className="group block w-full"
              >
                {/* Top Frame: Thumbnail */}
                <div className={designSystem.components.frameThumbnailSmall}>
                  <div className="relative w-full aspect-video overflow-hidden bg-surface/5">
                    <img
                      src={exp.src}
                      alt={exp.title}
                      referrerPolicy="no-referrer"
                      className={designSystem.components.imgThumbnailSmall}
                    />
                  </div>
                </div>

                {/* Bottom Frame: Name (connected immediately) */}
                <div className={designSystem.components.frameDetailsSmall}>
                  <div className="space-y-1 3xl:space-y-2">
                    <h2 className={designSystem.typography.titleSmall}>
                      {exp.title}
                    </h2>
                    <div className="flex gap-2">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className={designSystem.typography.tag}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={designSystem.components.arrowSmall}>
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
