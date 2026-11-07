"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { takes } from "@/data/takes";
import { layout, t, fx, motion as motionTokens } from "@/lib/designSystem";

export default function TakesPage() {
  return (
    <PageWrapper>
      <div className={layout.page}>
        <motion.div
          {...fx.headerSlideIn}
          className="mb-16 space-y-4 3xl:space-y-6"
        >
          <h1 className={t.sectionHeaderDisplay}>
            Takes
          </h1>
        </motion.div>
        
        <div className="flex flex-col gap-0">
          {takes.map((post, idx) => (
            <motion.div
              key={post.slug}
              {...fx.slideIn(idx)}
            >
              <Link
                href={`/takes/${post.slug}`}
                className={layout.listRow}
              >
                <div className={`md:col-span-2 ${t.metaDataLabel}`}>
                  {post.topic} · {post.date.split(" ").pop()}
                </div>

                <div className="md:col-span-7 space-y-6 3xl:space-y-8">
                  <h2 className={`${t.cardTitle} ${motionTokens.skewHover}`}>
                    {post.title}
                  </h2>
                  <p className={`${t.bodyProse} max-w-[420px] 3xl:max-w-[560px] 4xl:max-w-[700px] group-hover:opacity-100 transition-opacity`}>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
