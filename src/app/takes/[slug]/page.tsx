"use client";

import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { takes } from "@/data/takes";
import Link from "next/link";

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
      <div className="fixed top-16 left-16 md:top-24 md:left-24 3xl:top-32 3xl:left-32 4xl:top-40 4xl:left-40 z-50 pointer-events-auto">
        <Link href="/takes" className="group flex items-center gap-4 py-2">
          <div className="relative w-8 h-8 3xl:w-12 3xl:h-12 4xl:w-16 4xl:h-16 flex items-center justify-center">
            <div className="absolute inset-0 border border-foreground/20 group-hover:border-foreground/60 transition-colors" />
            <span className="text-[10px] 3xl:text-xs 4xl:text-sm font-sans group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </div>
          <span className="text-[10px] 3xl:text-xs 4xl:text-sm font-sans tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
            Back To Essays
          </span>
        </Link>
      </div>

      {/* Main Content Area — table layout: media rows (left), text rows (right), never both */}
      <main className="pt-40 pb-32 px-16 md:pr-[256px] 3xl:pt-60 3xl:pb-48 3xl:px-32 3xl:pr-[384px] 4xl:pt-80 4xl:pb-64 4xl:px-48 4xl:pr-[512px] relative z-10">
        <div className="space-y-14 3xl:space-y-20 4xl:space-y-28">
          {/* --- Media Row --- */}
          {post.image && (
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-4 col-start-2 3xl:col-span-5 3xl:col-start-2 4xl:col-span-6 4xl:col-start-2">
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
            <div className="col-span-4 col-start-8 3xl:col-span-5 3xl:col-start-7 4xl:col-span-5 4xl:col-start-7">
              <header>
                <h1 className="text-2xl md:text-3xl 3xl:text-4xl 4xl:text-5xl">{post.title}</h1>
                <div className="mt-4 font-sans text-xs 3xl:text-sm 4xl:text-base uppercase tracking-widest opacity-40">
                  {post.date}
                </div>
              </header>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-8">
            <div className="col-span-4 col-start-8 3xl:col-span-5 3xl:col-start-7 4xl:col-span-5 4xl:col-start-7">
              <p className="italic opacity-60 text-xs md:text-sm 3xl:text-base 4xl:text-lg">
                ( {post.excerpt} )
              </p>
            </div>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-x-8">
              <div className="col-span-4 col-start-8 3xl:col-span-5 3xl:col-start-7 4xl:col-span-5 4xl:col-start-7 text-body 3xl:text-xl 3xl:leading-relaxed 4xl:text-2xl 4xl:leading-relaxed">
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
