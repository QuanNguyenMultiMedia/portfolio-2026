// Server Component: one page of the garden (a take or a play piece), rendered by its kind. Play crosses the client boundary in PlayEntry.
import { notFound, redirect } from "next/navigation";
import { garden, findEntry, neighbours, opensInPlace } from "@/data/garden";
import TakeEntry from "@/components/garden/TakeEntry";
import PlayEntry from "@/components/garden/PlayEntry";

export const generateStaticParams = () => garden.filter((e) => !opensInPlace(e)).map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const entry = findEntry((await params).slug);
  return entry ? { title: `${entry.title} | Minh Quân`, description: entry.summary } : {};
}

export default async function GardenEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = findEntry((await params).slug);
  if (!entry) notFound();
  // freebies and photos have no page: they open over the bed
  if (opensInPlace(entry)) redirect(`/garden?open=${entry.slug}`);

  switch (entry.kind) {
    case "takes":
      return <TakeEntry post={entry.item} />;
    case "play": {
      const { prev, next, index, count } = neighbours(entry);
      return <PlayEntry project={entry.item} prevProject={prev} nextProject={next} index={index} count={count} />;
    }
    default:
      notFound();
  }
}
