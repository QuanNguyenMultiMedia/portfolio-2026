"use client";

import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { playItems } from "@/data/play";

export default function PlayPage() {
  return (
    <PageWrapper>
      <div className="pr-40 md:pr-64">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary/10 border border-primary/10">
          {playItems.map((exp) => (
            <div
              key={exp.slug}
              className="bg-background p-12 space-y-8 group hover:bg-primary hover:text-background transition-colors duration-500"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-display uppercase leading-tight">
                  {exp.title}
                </h2>
                <div className="flex gap-2">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-primary/5 group-hover:bg-background/10 rounded-none text-[8px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-lg font-light opacity-70 group-hover:opacity-90">
                {exp.description}
              </p>

              <div className="pt-8 border-t border-primary/5 group-hover:border-background/20 transition-colors">
                <Link
                  href={`/play/${exp.slug}`}
                  className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 group-hover:italic"
                >
                  LAUNCH_SANDBOX{" "}
                  <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
