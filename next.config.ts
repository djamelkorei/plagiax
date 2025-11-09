import type {NextConfig} from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '.'),
  },
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  }
};

export default nextConfig;
