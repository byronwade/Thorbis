"use client";

/**
 * Convex Provider for the admin app
 * Provides Convex client context with Better Auth integration
 */
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { type ReactNode, useMemo } from "react";
import { authClient } from "@/lib/auth/better-auth/auth-client";

// Get Convex URL - may be undefined during static generation
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

interface ConvexProviderProps {
	children: ReactNode;
	initialToken?: string | null;
}

/**
 * ConvexProvider wraps the application with Convex client context and Better Auth
 * During build time when NEXT_PUBLIC_CONVEX_URL is not available, it renders children without Convex context
 */
export function ConvexProvider({ children, initialToken }: ConvexProviderProps) {
	const client = useMemo(() => {
		// Return null if URL is not available (during static generation)
		if (!convexUrl) {
			return null;
		}
		return new ConvexReactClient(convexUrl);
	}, []);

	// If no client (missing URL during build), just render children without Convex context
	if (!client) {
		return <>{children}</>;
	}

	return (
		<ConvexBetterAuthProvider
			client={client}
			authClient={authClient}
			initialToken={initialToken}
		>
			{children}
		</ConvexBetterAuthProvider>
	);
}

/**
 * ConvexProviderWithoutAuth - Use when auth is not needed (public pages)
 * This still provides Convex context but without auth
 */
export function ConvexProviderWithoutAuth({ children }: ConvexProviderProps) {
	const client = useMemo(() => {
		if (!convexUrl) {
			return null;
		}
		return new ConvexReactClient(convexUrl);
	}, []);

	if (!client) {
		return <>{children}</>;
	}

	return (
		<ConvexBetterAuthProvider
			client={client}
			authClient={authClient}
		>
			{children}
		</ConvexBetterAuthProvider>
	);
}
