import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
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
    // Disabled experimental filesystem cache for dev as it causes heavy disk I/O, cache corruption, and freezes/timeouts on macOS.
    turbopackFileSystemCacheForDev: false,
  },

  // Removed aggressive 60s onDemandEntries page disposal to prevent constant CPU-intensive recompilation of heavy 3D and media modules (Three.js, R3F, GSAP, Mux).

  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

export default nextConfig;
