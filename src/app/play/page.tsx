"use client";

import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";

export default function PlayPage() {
  return (
    <PageWrapper>
      <div className="pt-48 pb-64 pr-8 md:pr-48">
        {/* Section title / header */}
        <div className="mb-16 space-y-4">
          <p className="font-mono text-[9px] tracking-[0.4em] text-tech-blue font-bold uppercase">
            // PLAYGROUND_SANDBOX
          </p>
          <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter leading-[0.85]">
            PLAY
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {playItems.map((exp) => (
            <Link
              key={exp.slug}
              href={`/play/${exp.slug}`}
              className="group block w-full"
            >
              {/* Top Frame: Thumbnail */}
              <div className="border border-primary/10 bg-surface/30 p-2.5 transition-colors duration-500 group-hover:border-primary/30">
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
              <div className="border-x border-b border-primary/10 bg-surface/10 px-6 py-5 transition-colors duration-500 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-background flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="font-display text-lg md:text-xl uppercase tracking-wider">
                    {exp.title}
                  </h2>
                  <div className="flex gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[8px] font-mono tracking-widest uppercase opacity-40 group-hover:text-background group-hover:opacity-70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xl opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-500 ease-[0.23,1,0.32,1]">
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
