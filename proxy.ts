import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy - Authentication and Route Protection (Next.js 16+)
 *
 * Features:
 * - Protects dashboard routes (requires authentication)
 * - Sets pathname header for server components
 * - Handles session refresh automatically
 * - Redirects unauthenticated users to login
 * - Allows public routes (marketing pages)
 *
 * Next.js 16+ Migration:
 * - Renamed from middleware.ts to proxy.ts
 * - Renamed function from middleware to proxy
 * - Runs on Node.js runtime (not Edge)
 * - Clarifies network boundary behavior
 */
export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Skip auth check if Supabase is not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!(supabaseUrl && supabaseAnonKey)) {
    console.warn("Supabase not configured - skipping auth proxy");
    return response;
  }

  // Create Supabase client for proxy
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

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/auth");

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!session && isDashboardRoute) {
    const redirectUrl = new URL("/login", request.url);
    // Preserve the original destination for redirect after login
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Run proxy on all dashboard routes and auth routes
export const config = {
  matcher: [
    "/dashboard/:path*", // Protected dashboard routes
    "/login", // Auth routes (redirect if already logged in)
    "/register", // Auth routes (redirect if already logged in)
    "/auth/:path*", // Auth callback routes
  ],
};
