/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "placehold.co",
				protocol: "https",
			},
			{
				hostname: "github.com",
				protocol: "https",
			},
			{
				hostname: "nextjs.org",
				protocol: "https",
			},
			{
				hostname: "picsum.photos",
				protocol: "https",
			},
		],

		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	experimental: {
		// Add experimental features if needed
	},
	transpilePackages: ["@thorbis/events", "@thorbis/components-app"],
	webpack: (config) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			path: false,
		};
		return config;
	},
};

export default nextConfig;
