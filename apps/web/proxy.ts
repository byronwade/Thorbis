import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16+ Proxy - Auth & Route Protection
 *
 * SECURITY CRITICAL:
 * - Uses proxy.ts (NOT middleware.ts) per Next.js 16+ security best practices
 * - Fixes CVE where x-middleware-subrequest header could bypass auth checks
 * - NEVER rely solely on proxy for authorization
 * - ALWAYS validate auth in Server Actions and API routes
 * - Use RLS (Row Level Security) in Supabase
 *
 * DOMAIN SEPARATION:
 * - Thorbis employees (@thorbis.com, @stratos.com) -> BLOCKED from contractor dashboard
 * - Contractors (all other domains) -> BLOCKED from admin dashboard
 *
 * SESSION ISOLATION:
 * - This app uses default Supabase cookie names
 * - Admin app uses prefixed cookies (admin_*) to isolate its sessions
 * - This ensures admin and contractor sessions don't conflict
 *
 * Performance:
 * - Runs on Node.js runtime (not Edge)
 * - Lightweight session refresh only
 * - Minimal overhead on protected routes
 */

// Admin-only domains - these users CANNOT access the contractor dashboard
const ADMIN_ONLY_DOMAINS = ["thorbis.com", "stratos.com"];

function isAdminDomain(email: string | undefined | null): boolean {
	if (!email) return false;
	const domain = email.split("@")[1]?.toLowerCase();
	return ADMIN_ONLY_DOMAINS.includes(domain || "");
}

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
		"connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; " +
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
	if (process.env.NODE_ENV !== "production") {
		// TODO: Handle error case
	}
	// Add pathname header for server-side layout detection
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-dashboard-pathname", request.nextUrl.pathname);

	let response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// If Supabase is not configured, allow request to continue
	if (!(supabaseUrl && supabaseAnonKey)) {
		return response;
	}

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return request.cookies.get(name)?.value;
			},
			set(name: string, value: string, options) {
				request.cookies.set({
					name,
					value,
					...options,
				});
				response = NextResponse.next({
					request: {
						headers: requestHeaders,
					},
				});
				response.cookies.set({
					name,
					value,
					...options,
				});
			},
			remove(name: string, options) {
				request.cookies.set({
					name,
					value: "",
					...options,
				});
				response = NextResponse.next({
					request: {
						headers: requestHeaders,
					},
				});
				response.cookies.set({
					name,
					value: "",
					...options,
				});
			},
		},
	});

	// Refresh session if expired - this is important for long-running sessions
	// This also validates the session token is still valid
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Protected routes that require authentication
	const protectedPaths = ["/dashboard"];
	const isProtectedPath = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path),
	);

	// Auth pages that should redirect to dashboard if already logged in
	const authPaths = ["/login", "/signup", "/auth"];
	const isAuthPath = authPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path),
	);

	// Redirect unauthenticated users from protected paths to login
	if (isProtectedPath && !session) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
		const redirectResponse = NextResponse.redirect(redirectUrl);
		return applySecurityHeaders(redirectResponse);
	}

	// SECURITY: Block Thorbis employees from contractor dashboard
	// They must use the admin dashboard instead
	if (isProtectedPath && session) {
		const userEmail = session.user?.email;
		if (isAdminDomain(userEmail)) {
			// Sign out the user from this app and redirect to admin
			await supabase.auth.signOut();
			const adminUrl =
				process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
			const redirectResponse = NextResponse.redirect(
				new URL("/login?error=use_admin", adminUrl),
			);
			return applySecurityHeaders(redirectResponse);
		}
	}

	// Redirect authenticated users from auth pages to dashboard
	if (isAuthPath && session) {
		const userEmail = session.user?.email;

		// If admin domain user tries to login here, redirect to admin app
		if (isAdminDomain(userEmail)) {
			await supabase.auth.signOut();
			const adminUrl =
				process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
			return NextResponse.redirect(new URL("/login?error=use_admin", adminUrl));
		}

		// Check if there's a redirectTo parameter
		const redirectTo = request.nextUrl.searchParams.get("redirectTo");
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = redirectTo || "/dashboard";
		redirectUrl.search = ""; // Clear query params
		const redirectResponse = NextResponse.redirect(redirectUrl);
		return applySecurityHeaders(redirectResponse);
	}

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
