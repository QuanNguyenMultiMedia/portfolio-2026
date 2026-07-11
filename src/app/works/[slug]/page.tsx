import ProjectPageClient from "./ProjectPageClient";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProjectPageClient params={params} />;
}
