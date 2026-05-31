import { playItems } from "@/data/play";
import PlayPageClient from "./PlayPageClient";

export async function generateStaticParams() {
  return playItems.map((p) => ({
    slug: p.slug,
  }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayPageClient params={params} />;
}
