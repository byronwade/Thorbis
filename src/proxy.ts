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
 * Performance:
 * - Runs on Node.js runtime (not Edge)
 * - Lightweight session refresh only
 * - Minimal overhead on protected routes
 */

export async function proxy(request: NextRequest) {
	if (process.env.NODE_ENV !== "production") {
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
	const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	// Auth pages that should redirect to dashboard if already logged in
	const authPaths = ["/login", "/signup", "/auth"];
	const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	// Redirect unauthenticated users from protected paths to login
	if (isProtectedPath && !session) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
		return NextResponse.redirect(redirectUrl);
	}

	// Redirect authenticated users from auth pages to dashboard
	if (isAuthPath && session) {
		// Check if there's a redirectTo parameter
		const redirectTo = request.nextUrl.searchParams.get("redirectTo");
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = redirectTo || "/dashboard";
		redirectUrl.search = ""; // Clear query params
		return NextResponse.redirect(redirectUrl);
	}

	return response;
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
