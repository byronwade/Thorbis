import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: [
		"@stratos/ui",
		"@stratos/database",
		"@stratos/auth",
		"@stratos/shared",
	],
	experimental: {
		optimizePackageImports: ["@stratos/ui", "lucide-react"],
	},
	turbopack: {
		resolveAlias: {
			// Admin app's own @/ alias
			"@/*": "./src/*",
			// Package aliases
			"@stratos/ui": "../../packages/ui/src",
			"@stratos/database": "../../packages/database/src",
			"@stratos/auth": "../../packages/auth/src",
			"@stratos/shared": "../../packages/shared/src",
			// Web app aliases (for shared components that use @/ imports)
			"@web/*": "../web/src/*",
		},
	},
};

export default nextConfig;
