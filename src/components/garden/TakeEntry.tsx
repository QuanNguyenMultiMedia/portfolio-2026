import Image from "next/image";
import type { Take } from "@/data/takes";
import { layout, t } from "@/lib/designSystem";

/** A take in the garden: the essay as an editorial sheet (Server Component). */
export default function TakeEntry({ post }: { post: Take }) {
  // Split content into paragraphs for rendering
  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-black selection:text-white overflow-x-hidden">


      {/* Main Content Area — table layout: media rows (left), text rows (right), never both */}
      <main className={`${layout.detail} relative z-10`}>
        <div className="space-y-16 3xl:space-y-24 4xl:space-y-32">
          {/* --- Media Row --- */}
          {post.image && (
            <div className={`${layout.editorial} rise`} style={{ "--i": 0 } as React.CSSProperties}>
              <div className={layout.mediaCol}>
                <div className="relative w-full aspect-video border border-primary/25 p-2">
                  <div className="relative w-full h-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover transition-all duration-700 mix-blend-print"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Text Rows --- */}
          <div className={`${layout.editorial} rise`} style={{ "--i": 1 } as React.CSSProperties}>
            <div className={layout.textCol}>
              <header>
                 <h1 className={t.cardTitle}>{post.title}</h1>
                <div className={`mt-4 ${t.metaDataLabel} opacity-40`}>
                  {post.date}
                </div>
              </header>
            </div>
          </div>

          <div className={`${layout.editorial} rise`} style={{ "--i": 2 } as React.CSSProperties}>
            <div className={layout.textCol}>
               <p className={`italic opacity-60 ${t.bodyProse}`}>
                ( {post.excerpt} )
              </p>
            </div>
          </div>

          {paragraphs.map((p, idx) => (
            <div key={idx} className={`${layout.editorial} rise`} style={{ "--i": Math.min(idx + 3, 8) } as React.CSSProperties}>
               <div className={`${layout.textCol} ${t.bodyProse} 3xl:text-xl 3xl:leading-relaxed 4xl:text-2xl 4xl:leading-relaxed`}>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
