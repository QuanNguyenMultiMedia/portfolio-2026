"use client";

import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { takes } from "@/data/takes";

export default function TakesPage() {
  return (
    <PageWrapper>
      <div className="pt-48 pb-64 pr-8 md:pr-48 3xl:pt-64 3xl:pb-80 3xl:pr-64 4xl:pt-80 4xl:pb-[24rem] 4xl:pr-80">
        <div className="flex flex-col gap-0 border-t border-primary/5">
          {takes.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/takes/${post.slug}`}
              className={`group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 3xl:gap-24 4xl:gap-32 items-center border-b border-primary/5 py-16 md:py-32 3xl:py-48 4xl:py-64 transition-all duration-700 hover:bg-foreground/[0.01] ${
                idx % 2 === 1 ? "md:pl-32 3xl:pl-48 4xl:pl-64" : ""
              }`}
            >
              <div className="md:col-span-2 text-[10px] 3xl:text-xs 4xl:text-sm font-mono tracking-widest uppercase opacity-20 group-hover:opacity-60 transition-opacity">
                {`ESSAY_${String(idx + 1).padStart(2, "0")} // ${post.topic} // ${post.date.split(" ").pop()}`}
              </div>

              <div className="md:col-span-7 space-y-6 3xl:space-y-8">
                <h2 className="text-4xl md:text-7xl lg:text-8xl 3xl:text-[5.5rem] 4xl:text-[7rem] font-display uppercase leading-none tracking-tighter transition-transform duration-300 group-hover:skew-x-[-10deg] origin-left inline-block">
                  {post.title}
                </h2>
                <p className="text-body max-w-[576px] 3xl:max-w-[800px] 3xl:text-xl 4xl:max-w-[1000px] 4xl:text-2xl line-clamp-2 group-hover:opacity-100 transition-opacity">
                  {post.excerpt}
                </p>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <span className="text-2xl 3xl:text-4xl 4xl:text-5xl opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
