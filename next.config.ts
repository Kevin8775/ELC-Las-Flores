import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GH_PAGES === "true" ? "/ELC-Las-Flores" : undefined,
  assetPrefix: process.env.GH_PAGES === "true" ? "/ELC-Las-Flores/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
