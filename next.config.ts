import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The sidebar footer (Log out) sits bottom-left, so keep the dev badge off it.
  devIndicators: { position: "bottom-right" },
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
