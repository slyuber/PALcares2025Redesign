import type { NextConfig } from "next";

// Bundle analyzer for analyzing bundle sizes
// Run with: ANALYZE=true npm run build (or set ANALYZE=true on Windows)
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // ✅ Enables static HTML export (replaces `next export`)
  output: "export",

  // ✅ Required if you're using <Image /> in static builds
  images: {
    unoptimized: true,
  },

  // ⚙️ Optional: only use this if deploying under a subfolder (like GitHub Pages)
  // basePath: "/palcares-app",
};

export default withBundleAnalyzer(nextConfig);
