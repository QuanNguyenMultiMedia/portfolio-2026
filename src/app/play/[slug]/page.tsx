import PlayPageClient from "./PlayPageClient";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayPageClient params={params} />;
}
