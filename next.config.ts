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
    // Disabled experimental filesystem cache for dev on macOS as it causes heavy disk I/O, cache corruption, and freezes/timeouts.
    // Enabled on Windows and Linux for significant performance improvement.
    turbopackFileSystemCacheForDev: process.platform === "darwin" ? false : true,
  },

  // Removed aggressive 60s onDemandEntries page disposal to prevent constant CPU-intensive recompilation of heavy 3D and media modules (Three.js, R3F, GSAP, Mux).

  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

export default nextConfig;
