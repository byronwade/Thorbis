import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
		"connect-src 'self' https://*.supabase.co wss://*.supabase.co",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; "),
};

const SESSION_COOKIE_NAME = "admin_session";

/**
 * Verify JWT token from cookie
 */
async function verifyToken(token: string): Promise<boolean> {
	try {
		const secret = process.env.ADMIN_JWT_SECRET;
		if (!secret) {
			console.error("Missing ADMIN_JWT_SECRET");
			return false;
		}

		const secretKey = new TextEncoder().encode(secret);
		const { payload } = await jwtVerify(token, secretKey);

		// Check if token is expired
		if (payload.exp && payload.exp * 1000 < Date.now()) {
			return false;
		}

		return true;
	} catch (error) {
		console.error("Token verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Get session cookie
	const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

	const isLoginPage = request.nextUrl.pathname === "/login";
	const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
	const isApiRoute = request.nextUrl.pathname.startsWith("/api");

	// Skip auth check for API routes (they handle their own auth)
	if (isApiRoute) {
		return applySecurityHeaders(response);
	}

	// Verify session for protected routes
	if (isProtectedRoute) {
		if (!sessionToken) {
			// No session - redirect to login
			const url = request.nextUrl.clone();
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}

		const isValidSession = await verifyToken(sessionToken);

		if (!isValidSession) {
			// Invalid session - clear cookie and redirect to login
			const url = request.nextUrl.clone();
			url.pathname = "/login";
			const redirectResponse = NextResponse.redirect(url);
			redirectResponse.cookies.delete(SESSION_COOKIE_NAME);
			return redirectResponse;
		}
	}

	// If authenticated user tries to access login page, redirect to dashboard
	if (isLoginPage && sessionToken) {
		const isValidSession = await verifyToken(sessionToken);

		if (isValidSession) {
			const url = request.nextUrl.clone();
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}
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
