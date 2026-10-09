import type { NextConfig } from "next";

const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  output: isExport ? "export" : "standalone",
  trailingSlash: isExport,
  typescript: isExport ? { ignoreBuildErrors: true } : undefined,
  images: {
    unoptimized: isExport,
  },
  ...(!isExport
    ? {
        outputFileTracingIncludes: {
          "/*": ["./data/**/*"],
        },
      }
    : {}),
};

export default nextConfig;
