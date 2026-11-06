import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@fami-li/ui", "@fami-li/data"],
  images: { unoptimized: true },
};
export default nextConfig;
