import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

// Only load bundle analyzer when ANALYZE=true to avoid build overhead
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({
        enabled: true,
        openAnalyzer: false,
      })
    : (config: NextConfig) => config;

const isPwaEnabled = process.env.NEXT_PUBLIC_ENABLE_PWA === "true";

const withPWA = isPwaEnabled
  ? require("next-pwa")({
      dest: "public",
      disable: false,
      register: true,
      skipWaiting: true,
      buildExcludes: [/app-build-manifest\.json$/], // Exclude from build for faster builds
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
    })
  : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  // PERFORMANCE: Static generation RE-ENABLED! ✅
  // Fixed Zustand SSR issues by adding skipHydration: true to all persisted stores
  // This allows Next.js to generate static pages for massive performance gains

  // BUILD OPTIMIZATIONS: Faster compilation and smaller bundles
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Keep error/warn logs in production
          }
        : false,
  },

  // TypeScript optimizations
  typescript: {
    // Speed up builds by skipping type checking during build (use CI/CD for type checking)
    // Set to false if you want Next.js to type-check during build (slower)
    ignoreBuildErrors: false, // Keep false for safety, but can set true for faster builds
  },

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    // This enables tree-shaking for these packages
    optimizePackageImports: [
      // Icons and utilities
      "lucide-react",
      "date-fns",
      "zod",

      // Heavy dependencies
      "recharts",
      "@react-pdf/renderer",
      "@tiptap/react",
      "@tiptap/core",
      "@tiptap/starter-kit",
      "@tiptap/extension-link",
      "@tiptap/extension-image",
      "@tiptap/extension-table",

      // Supabase
      "@supabase/supabase-js",
      "@supabase/ssr",

      // All Radix UI components (complete list)
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",

      // Form libraries
      "react-hook-form",

      // Other heavy dependencies
      "framer-motion",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@uidotdev/usehooks",
      "jotai",
      "ai",
    ],
    // Enable faster refresh for better DX
    optimizeCss: true,
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
    // Optimize image loading
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Build output optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  webpack: (config) => {
    // Keep webpack running to display all errors instead of bailing on the first failure
    config.bail = false;
    return config;
  },
};

// Conditionally wrap configs only when needed
let config = nextConfig;

// Only apply bundle analyzer when ANALYZE=true
config = withBundleAnalyzer(config);

// Apply PWA (already optimized to skip in dev)
config = withPWA(config);

// Wrap with BotID protection (outermost wrapper for security)
export default withBotId(config);
