import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  turbopack: {},
};

export default nextConfig;
