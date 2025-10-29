import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware - Sets pathname header for server components
 *
 * Purpose: Allows server components to detect current route
 * Used by: Dashboard layout to conditionally hide header/sidebar for TV routes
 */
export function middleware(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-pathname", request.nextUrl.pathname);

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

// Only run middleware on dashboard routes
export const config = {
	matcher: ["/dashboard/:path*"],
};
