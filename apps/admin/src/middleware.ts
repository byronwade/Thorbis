import { NextResponse, type NextRequest } from "next/server";

/**
 * Security Headers for Admin Dashboard
 */
const SECURITY_HEADERS = {
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
	"Content-Security-Policy": [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: https: blob:",
		"font-src 'self' data:",
		"connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.convex.cloud wss://*.convex.cloud https://*.convex.site",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; "),
};

// Better Auth session cookie names
const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Check if user has a Better Auth session
 * Full validation happens on the client/server side with Better Auth
 */
function hasSessionCookie(request: NextRequest): boolean {
	const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
	return !!sessionToken && sessionToken.length > 0;
}

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	const isLoginPage = request.nextUrl.pathname === "/login";
	const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
	const isApiRoute = request.nextUrl.pathname.startsWith("/api");

	// Skip auth check for API routes (they handle their own auth)
	if (isApiRoute) {
		return applySecurityHeaders(response);
	}

	const hasSession = hasSessionCookie(request);

	// Verify session for protected routes
	if (isProtectedRoute) {
		if (!hasSession) {
			// No session - redirect to login
			const url = request.nextUrl.clone();
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}
		// Session exists - let Better Auth handle full verification on client side
	}

	// If authenticated user tries to access login page, redirect to dashboard
	if (isLoginPage && hasSession) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard";
		return NextResponse.redirect(url);
	}

	return applySecurityHeaders(response);
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
	Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
		response.headers.set(key, value);
	});
	return response;
}

export const config = {
	matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};
