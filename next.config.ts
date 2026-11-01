import type { NextConfig } from "next";

const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  // Dev-only. A Cloudflare quick tunnel is a different host, so Next blocks
  // /_next assets and the page stays on the SSR preloader.
  allowedDevOrigins: ["*.trycloudflare.com"],
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
