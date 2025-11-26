/**
 * Security.txt Route
 *
 * Standard location for security vulnerability disclosure information.
 * Signals professionalism and builds trust with security-conscious customers.
 *
 * @see https://securitytxt.org/
 */

import { SEO_URLS } from "@/lib/seo/config";

export const dynamic = "force-static";
export const revalidate = 86400; // Daily

export async function GET() {
	const expires = new Date();
	expires.setFullYear(expires.getFullYear() + 1);

	const content = `# Thorbis Security Policy
# https://securitytxt.org/

Contact: mailto:security@thorbis.com
Contact: ${SEO_URLS.site}/security
Expires: ${expires.toISOString()}
Preferred-Languages: en
Canonical: ${SEO_URLS.site}/.well-known/security.txt
Policy: ${SEO_URLS.site}/legal/security-policy

# We take security seriously. If you discover a vulnerability,
# please report it responsibly to security@thorbis.com.
# We commit to acknowledging reports within 48 hours.
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
