import { projects } from "@/data/projects";
import ProjectPageClient from "./ProjectPageClient";

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProjectPageClient params={params} />;
}
