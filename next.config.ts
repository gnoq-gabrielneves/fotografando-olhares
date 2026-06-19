import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
