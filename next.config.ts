import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation due to Zustand SSR issues in Next.js 16 + Turbopack
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
