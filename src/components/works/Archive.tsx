import Link from "next/link";
import type { Project } from "@/data/projects";
import { t, ui } from "@/lib/designSystem";

// Works archive: past projects kept on the site but off the dial, as a plain list under it.
export default function WorksArchive({ items }: { items: Project[] }) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="works-archive"
      className="relative z-10 w-full max-w-screen-xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 md:px-16 3xl:px-24 4xl:px-32 pt-16 pb-32 md:pb-40"
    >
      <h2 id="works-archive" className={`${t.pageTitle} mb-10 md:mb-16`}>
        Archive
      </h2>
      <ul className="border-t border-primary/25">
        {items.map((p) => (
          <li key={p.slug} className="border-b border-primary/25">
            <Link
              href={`/works/${p.slug}`}
              className="group grid grid-cols-12 gap-x-4 md:gap-x-8 items-baseline py-5 md:py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-blue"
            >
              <span className={`${t.cardTitle} col-span-12 md:col-span-5 transition-colors duration-300 group-hover:text-tech-blue`}>
                {p.title}
              </span>
              <span className={`${t.metaDataLabel} col-span-8 md:col-span-4 mt-2 md:mt-0`}>{p.category}</span>
              <span className={`${t.metaDataLabel} col-span-3 md:col-span-2 md:text-right whitespace-nowrap`}>{p.year}</span>
              <span aria-hidden className={`${ui.arrow} col-span-1 justify-self-end`}>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
