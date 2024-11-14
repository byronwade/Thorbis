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
		],

		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};

export default nextConfig;
