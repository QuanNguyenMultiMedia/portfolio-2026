"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import SectionHeader from "@/components/SectionHeader";
import { takes } from "@/data/takes";
import { designSystem, motionSystem } from "@/lib/designSystem";

export default function TakesPage() {
  return (
    <PageWrapper slideDirection="none">
      <div className={designSystem.spacing.pagePadding}>
        <motion.div
          {...motionSystem.variants.headerSlideIn}
          className={designSystem.spacing.headerSpacing}
        >
          <h1 className={designSystem.typography.pageHeroTitle}>
            Takes
          </h1>
        </motion.div>
        
        <div className={designSystem.spacing.listContainer}>
          {takes.map((post, idx) => (
            <motion.div
              key={post.slug}
              {...motionSystem.variants.slideIn(idx)}
            >
              <Link
                href={`/takes/${post.slug}`}
                className={`${designSystem.spacing.listRow} ${
                  idx % 2 === 1 ? designSystem.spacing.staggeredIndent : ""
                }`}
              >
                <div className={`md:col-span-2 ${designSystem.typography.meta}`}>
                  {`ESSAY_${String(idx + 1).padStart(2, "0")} // ${post.topic} // ${post.date.split(" ").pop()}`}
                </div>

                <div className="md:col-span-7 space-y-6 3xl:space-y-8">
                  <h2 className={designSystem.typography.titleLarge}>
                    {post.title}
                  </h2>
                  <p className={designSystem.typography.body}>
                    {post.excerpt}
                  </p>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <span className={designSystem.components.arrowLarge}>
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
