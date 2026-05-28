"use client";

import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";

export default function PlayPage() {
  return (
    <PageWrapper>
      <div className="pt-48 pb-64 pr-8 md:pr-48 3xl:pt-64 3xl:pb-80 3xl:pr-64 4xl:pt-80 4xl:pb-[24rem] 4xl:pr-80">
        {/* Section title / header */}
        <div className="mb-16 space-y-4 3xl:space-y-6">
          <p className="font-mono text-[9px] 3xl:text-xs 4xl:text-sm tracking-[0.4em] text-tech-blue font-bold uppercase">
            // PLAYGROUND_SANDBOX
          </p>
          <h1 className="text-5xl md:text-8xl 3xl:text-9xl 4xl:text-[10rem] font-display uppercase tracking-tighter leading-[0.85]">
            PLAY
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-12 md:gap-16 3xl:gap-20 4xl:gap-28">
          {playItems.map((exp) => (
            <Link
              key={exp.slug}
              href={`/play/${exp.slug}`}
              className="group block w-full"
            >
              {/* Top Frame: Thumbnail */}
              <div className="border border-primary/10 bg-surface/30 p-2.5 3xl:p-4 4xl:p-6 transition-colors duration-500 group-hover:border-primary/30">
                <div className="relative w-full aspect-video overflow-hidden bg-surface/5">
                  <img
                    src={exp.src}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-[0.23,1,0.32,1]"
                  />
                </div>
              </div>

              {/* Bottom Frame: Name (connected immediately) */}
              <div className="border-x border-b border-primary/10 bg-surface/10 px-6 py-5 3xl:px-8 3xl:py-7 4xl:px-10 4xl:py-9 transition-colors duration-500 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-background flex justify-between items-center">
                <div className="space-y-1 3xl:space-y-2">
                  <h2 className="font-display text-lg md:text-xl 3xl:text-2xl 4xl:text-3xl uppercase tracking-wider">
                    {exp.title}
                  </h2>
                  <div className="flex gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[8px] 3xl:text-[10px] 4xl:text-xs font-mono tracking-widest uppercase opacity-40 group-hover:text-background group-hover:opacity-70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xl 3xl:text-2xl 4xl:text-3xl opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500 ease-[0.23,1,0.32,1]">
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
