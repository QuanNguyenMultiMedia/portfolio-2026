"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { takes } from "@/data/takes";
import { layout, t, ui, fx, motion as motionTokens } from "@/lib/designSystem";

export default function TakesPage() {
  return (
    <PageWrapper>
      <div className={layout.page}>
        <motion.div
          {...fx.headerSlideIn}
          className="mb-16 space-y-4 3xl:space-y-6"
        >
          <h1 className={t.display}>
            Takes
          </h1>
        </motion.div>
        
        <div className="flex flex-col gap-0 border-t border-primary/5">
          {takes.map((post, idx) => (
            <motion.div
              key={post.slug}
              {...fx.slideIn(idx)}
            >
              <Link
                href={`/takes/${post.slug}`}
                className={`${layout.listRow} ${
                  idx % 2 === 1 ? "md:pl-24 3xl:pl-36 4xl:pl-48" : ""
                }`}
              >
                <div className={`md:col-span-2 ${t.meta}`}>
                  {`ESSAY_${String(idx + 1).padStart(2, "0")} // ${post.topic} // ${post.date.split(" ").pop()}`}
                </div>

                <div className="md:col-span-7 space-y-6 3xl:space-y-8">
                  <h2 className={`${t.h1} ${motionTokens.skewHover}`}>
                    {post.title}
                  </h2>
                  <p className={`${t.body} max-w-[420px] 3xl:max-w-[560px] 4xl:max-w-[700px] line-clamp-2 group-hover:opacity-100 transition-opacity`}>
                    {post.excerpt}
                  </p>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <span className={`${ui.arrow} text-2xl 3xl:text-4xl 4xl:text-5xl opacity-0 group-hover:opacity-100 group-hover:translate-x-4`}>
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
