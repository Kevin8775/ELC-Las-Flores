import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GH_PAGES === "true" ? "/ELC-Las-Flores" : undefined,
  assetPrefix: process.env.GH_PAGES === "true" ? "/ELC-Las-Flores/" : undefined,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
