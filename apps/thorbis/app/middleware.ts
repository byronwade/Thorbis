import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
		const isApiPath = req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/api/github");

		if ((isAdminPath || isApiPath) && !token) {
			const loginUrl = new URL("/login", req.url);
			loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ req, token }) => {
				if (req.nextUrl.pathname.startsWith("/admin")) {
					return !!token;
				}
				return true;
			},
		},
		pages: {
			signIn: "/login",
		},
	}
);

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*", "/api/github/:path*"],
};
