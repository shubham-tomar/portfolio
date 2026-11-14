import type { NextConfig } from "next";

// GitHub Pages serves this repo from /portfolio, so the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/portfolio. Locally (and on Vercel) it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
