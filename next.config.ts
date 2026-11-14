import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },

  experimental: {
    // route enter/exit: React <ViewTransition> around the page slot (layout.tsx, styles/riso.css)
    viewTransition: true,
    // Disabled experimental filesystem cache for dev on macOS as it causes heavy disk I/O, cache corruption, and freezes/timeouts.
    // Enabled on Windows and Linux for significant performance improvement.
    turbopackFileSystemCacheForDev: process.platform === "darwin" ? false : true,
  },

  // Removed aggressive 60s onDemandEntries page disposal to prevent constant CPU-intensive recompilation of heavy 3D and media modules (Three.js, R3F, GSAP).

  // The site is served only at www.minhquan.works: on Vercel, every other host (*.vercel.app aliases, deployment
  // URLs) redirects there, path and query kept. Local dev and `next start` are untouched.
  async redirects() {
    // Takes, Play and Freebies grew into one garden: old links land on the same entry (or the bed, filtered).
    const garden = ["takes", "play", "freebies"].flatMap((kind) => [
      { source: `/${kind}`, destination: `/garden?kind=${kind}`, permanent: true },
      { source: `/${kind}/:slug`, destination: "/garden/:slug", permanent: true },
    ]);
    if (!process.env.VERCEL) return garden;
    return [...garden, {
      source: "/:path*",
      missing: [{ type: "host", value: "(www\\.)?minhquan\\.works" }],
      destination: "https://www.minhquan.works/:path*",
      permanent: true,
    }];
  },

  // Dev-only routes (/design-system, /works/builder) are guarded in their server page.tsx via notFound().
  turbopack: {
    root: path.resolve(__dirname),
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

export default nextConfig;
