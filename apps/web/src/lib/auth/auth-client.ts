/**
 * Better Auth Client Configuration
 * Client-side auth utilities for React components
 */
import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Auth client instance with Convex integration
 * Use this in client components for authentication actions
 */
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".convex.cloud", ".convex.site") || "",
	plugins: [convexClient()],
});

// Export commonly used auth methods
export const {
	signIn,
	signUp,
	signOut,
	useSession,
	getSession,
} = authClient;

// Type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
