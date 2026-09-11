import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root: a stray package-lock.json in the home directory
    // otherwise makes Turbopack treat ~ as the project root.
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
