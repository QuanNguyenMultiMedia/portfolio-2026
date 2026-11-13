import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { garden, opensInPlace } from "@/data/garden";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://minhquan.works";

  const staticRoutes = [
    "",
    "/contacts",
    "/design-system",
    "/garden",
    "/works",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${baseUrl}/works/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const gardenRoutes = garden.filter((e) => !opensInPlace(e)).map((e) => ({
    url: `${baseUrl}/garden/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...gardenRoutes];
}
