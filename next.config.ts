import type { NextConfig } from "next";

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

export default nextConfig;
