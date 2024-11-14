import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: {
		signIn: "/login",
		error: "/login",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isAdminPath = nextUrl.pathname.startsWith("/admin");

			if (isAdminPath) {
				if (isLoggedIn) return true;
				return false; // Redirect unauthenticated users to login page
			}

			return true;
		},
	},
	providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;
