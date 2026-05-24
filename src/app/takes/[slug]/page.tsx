"use client";

import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { takes } from "@/data/takes";
import Link from "next/link";
import WaveGradientBar from "@/components/WaveGradientBar";

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = takes.find((t) => t.slug === slug);

  if (!post) {
    notFound();
  }

  // Split content into paragraphs for rendering
  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
      {/* Back Button */}
      <div className="fixed top-16 left-16 md:top-24 md:left-24 z-50 pointer-events-auto">
        <Link href="/takes" className="group flex items-center gap-4 py-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-foreground/20 group-hover:border-foreground/60 transition-colors" />
            <span className="text-[10px] font-sans group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </div>
          <span className="text-[10px] font-sans tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            Back To Essays
          </span>
        </Link>
      </div>

      {/* Main Content Area — table layout: media rows (left), text rows (right), never both */}
      <main className="pt-40 pb-32 px-16 md:pr-[256px] relative z-10">
        <div className="space-y-14">
          {/* --- Media Row --- */}
          {post.image && (
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-4 col-start-2">
                <div className="relative w-full aspect-video border border-primary/10 p-2">
                  <div className="relative w-full h-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Text Rows --- */}
          <div className="grid grid-cols-12 gap-x-8">
            <div className="col-span-4 col-start-8">
              <header>
                <h1 className="text-2xl md:text-3xl">{post.title}</h1>
                <div className="mt-4 font-sans text-xs uppercase tracking-widest opacity-40">
                  {post.date}
                </div>
              </header>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-8">
            <div className="col-span-4 col-start-8">
              <p className="italic opacity-60 text-xs md:text-sm">
                ( {post.excerpt} )
              </p>
            </div>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-x-8">
              <div className="col-span-4 col-start-8 text-body">
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
