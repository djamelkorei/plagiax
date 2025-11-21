import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "."),
  },
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "120mb",
    },
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
