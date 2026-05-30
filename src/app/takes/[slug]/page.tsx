import Image from "next/image";
import { notFound } from "next/navigation";
import { takes } from "@/data/takes";
import Link from "next/link";
import { layout, ui, t } from "@/lib/designSystem";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = takes.find((t) => t.slug === slug);

  if (!post) {
    notFound();
  }

  // Split content into paragraphs for rendering
  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">


      {/* Main Content Area — table layout: media rows (left), text rows (right), never both */}
      <main className={`${layout.detail} relative z-10`}>
        <div className="space-y-16 3xl:space-y-24 4xl:space-y-32">
          {/* --- Media Row --- */}
          {post.image && (
            <div className={layout.editorial}>
              <div className={layout.mediaCol}>
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
          <div className={layout.editorial}>
            <div className={layout.textCol}>
              <header>
                 <h1 className={t.h1}>{post.title}</h1>
                <div className={`mt-4 ${t.meta} opacity-40`}>
                  {post.date}
                </div>
              </header>
            </div>
          </div>

          <div className={layout.editorial}>
            <div className={layout.textCol}>
               <p className={`italic opacity-60 ${t.body}`}>
                ( {post.excerpt} )
              </p>
            </div>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className={layout.editorial}>
               <div className={`${layout.textCol} ${t.body} 3xl:text-xl 3xl:leading-relaxed 4xl:text-2xl 4xl:leading-relaxed`}>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
