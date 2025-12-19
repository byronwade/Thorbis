import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16+ Proxy - Security Headers & Route Configuration
 *
 * AUTHENTICATION:
 * - Auth is handled by Convex Auth (not in proxy)
 * - Session management happens via Convex backend
 * - Protected routes check auth in components using useConvexAuth()
 *
 * DOMAIN SEPARATION:
 * - Thorbis employees (@thorbis.com, @stratos.com) -> Use admin dashboard
 * - Contractors (all other domains) -> Use contractor dashboard
 *
 * Performance:
 * - Runs on Node.js runtime (not Edge)
 * - Lightweight - just applies security headers
 */

/**
 * Security Headers Configuration
 * Required for Best Practices audit in PageSpeed Insights
 */
const SECURITY_HEADERS = {
	// Content Security Policy - mitigates XSS attacks
	"Content-Security-Policy":
		"default-src 'self'; " +
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.visitors.now https://va.vercel-scripts.com; " +
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
		"img-src 'self' data: https: blob:; " +
		"font-src 'self' data: https://fonts.gstatic.com; " +
		"connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://vitals.vercel-insights.com; " +
		"frame-ancestors 'none'; " +
		"base-uri 'self'; " +
		"form-action 'self';",
	// Strict Transport Security - force HTTPS
	"Strict-Transport-Security":
		"max-age=31536000; includeSubDomains; preload",
	// Cross-Origin Opener Policy - mitigates cross-origin attacks
	"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
	// X-Frame-Options - mitigates clickjacking (redundant with CSP frame-ancestors but better compatibility)
	"X-Frame-Options": "DENY",
	// X-Content-Type-Options - prevents MIME type sniffing
	"X-Content-Type-Options": "nosniff",
	// Referrer Policy - controls referrer information
	"Referrer-Policy": "strict-origin-when-cross-origin",
	// Permissions Policy - restricts browser features
	"Permissions-Policy":
		"camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
};

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
	Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
		response.headers.set(key, value);
	});
	return response;
}

export async function proxy(request: NextRequest) {
	// Add pathname header for server-side layout detection
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-dashboard-pathname", request.nextUrl.pathname);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	// Apply security headers to all responses
	return applySecurityHeaders(response);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - API routes that handle their own auth
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};

export default proxy;
