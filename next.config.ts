import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false, // Don't auto-open browser
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "supabase-api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/.*/i,
      handler: "NetworkOnly", // Never cache auth requests for security
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  // PERFORMANCE: Static generation RE-ENABLED! ✅
  // Fixed Zustand SSR issues by adding skipHydration: true to all persisted stores
  // This allows Next.js to generate static pages for massive performance gains
  // output: "standalone", // REMOVED - no longer needed

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "@supabase/supabase-js",
      "zod",
    ],
  },

  // Empty turbopack config to silence webpack warning
  turbopack: {},

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

// Wrap with BotID protection (outermost wrapper for security)
export default withBotId(withPWA(withBundleAnalyzer(nextConfig)));
