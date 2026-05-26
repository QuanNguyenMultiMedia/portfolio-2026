"use client";

import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { takes } from "@/data/takes";

export default function TakesPage() {
  return (
    <PageWrapper>
      <div className="pt-48 pb-64 pr-8 md:pr-48">
        <div className="flex flex-col gap-0 border-t border-primary/5">
          {takes.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/takes/${post.slug}`}
              className={`group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center border-b border-primary/5 py-16 md:py-32 transition-all duration-700 hover:bg-foreground/[0.01] ${
                idx % 2 === 1 ? "md:pl-32" : ""
              }`}
            >
              <div className="md:col-span-2 text-[10px] font-mono tracking-widest uppercase opacity-20 group-hover:opacity-60 transition-opacity">
                {`ESSAY_${String(idx + 1).padStart(2, "0")} // ${post.topic} // ${post.date.split(" ").pop()}`}
              </div>

              <div className="md:col-span-7 space-y-6">
                <h2 className="text-5xl md:text-8xl font-display uppercase leading-[0.85] tracking-tighter transition-all duration-700 group-hover:italic">
                  {post.title}
                </h2>
                <p className="text-body max-w-[576px] line-clamp-2 group-hover:opacity-100 transition-opacity">
                  {post.excerpt}
                </p>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <span className="text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500">
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
