import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { takes } from "@/data/takes";
import { playItems } from "@/data/play";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfolio-2026.vercel.app";

  const staticRoutes = [
    "",
    "/contacts",
    "/design-system",
    "/freebies",
    "/play",
    "/takes",
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

  const takeRoutes = takes.map((t) => ({
    url: `${baseUrl}/takes/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const playRoutes = playItems.map((p) => ({
    url: `${baseUrl}/play/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...takeRoutes, ...playRoutes];
}
