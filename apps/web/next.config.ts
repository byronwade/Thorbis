import type { NextConfig } from "next";

// Only load bundle analyzer when ANALYZE=true to avoid build overhead
const SECONDS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_MONTH = 30;
const THIRTY_DAYS_IN_SECONDS = DAYS_PER_MONTH * SECONDS_PER_DAY;
const ONE_DAY_IN_SECONDS = SECONDS_PER_DAY;

const withBundleAnalyzer =
	process.env.ANALYZE === "true"
		? require("@next/bundle-analyzer")({
				enabled: true,
				openAnalyzer: false,
			})
		: (baseConfig: NextConfig) => baseConfig;

// PWA removed - was disabled by default and unused

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
		// TODO: Re-enable after fixing Next.js TypeScript integration issue
		// Standalone `tsc --noEmit` passes but Next.js build hangs on TypeScript
		ignoreBuildErrors: true,
	},

	// Experimental performance optimizations
	experimental: {
		// Tree-shake heavy packages - reduces bundle size and build time
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-icons",
			"recharts",
			"date-fns",
			"@supabase/supabase-js",
			"ai",
			"zod",
			"@react-email/components",
			"xlsx",
		],
	},

	// Turbopack config - required for Next.js 16 when webpack config is present
	turbopack: {
		resolveAlias: {
			"@": "./src",
			"@stratos/ui": "../../packages/ui/src",
			"@stratos/database": "../../packages/database/src",
			"@stratos/auth": "../../packages/auth/src",
			"@stratos/shared": "../../packages/shared/src",
		},
	},

	// React Strict Mode - helps catch side effects and deprecated APIs
	// Note: Causes 2x renders in development (intentional for catching issues)
	// If you see continuous POST loops with Suspense, check useEffect dependencies
	reactStrictMode: true,

	// Optimize development server performance
	devIndicators: {
		position: "bottom-right",
	},

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
	transpilePackages: [
		"shiki",
		"@stratos/ui",
		"@stratos/database",
		"@stratos/auth",
		"@stratos/shared",
	],
	serverExternalPackages: ["prettier"], // Allow prettier to be used by @react-email/render
	webpack: (webpackConfig) => {
		// Keep webpack running to display all errors instead of bailing on the first failure
		webpackConfig.bail = false;
		// Optimize webpack performance
		webpackConfig.cache = {
			type: "filesystem",
			buildDependencies: {
				config: [__filename],
			},
		};
		return webpackConfig;
	},

	// Optimize build output
	outputFileTracingExcludes: {
		"*": ["node_modules/@swc/core*", "node_modules/webpack"],
	},

	// DISABLED: Complex headers - temporarily disabled for testing
	// async headers() { ... },
};

// Conditionally wrap configs only when needed
let mergedConfig = nextConfig;

// Bundle analyzer - enabled via ANALYZE=true environment variable
// Usage: ANALYZE=true pnpm build
mergedConfig = withBundleAnalyzer(mergedConfig);

// DISABLED: Vercel Workflow was causing 123-second hangs and Turbopack crashes
// "Discovering workflow directives" was taking 50-123 seconds per build
// Re-enable only if needed for specific workflow features
// const workflowEnabledConfig = withWorkflow(mergedConfig);

// TEMPORARILY DISABLED: withBotId to diagnose build hang
// Wrap with BotID protection (outermost wrapper for security)
// Use function form to ensure proper initialization
// export default withBotId((phase, defaultConfig) => {
// 	// Return config synchronously to prevent build hangs
// 	return mergedConfig;
// });

// Temporary: Export config directly without withBotId to test if it's causing the hang
export default mergedConfig;
