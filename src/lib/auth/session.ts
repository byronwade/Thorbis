/**
 * Session Management Utilities - Server Component Helpers
 *
 * Features:
 * - Get current authenticated user
 * - Get current session
 * - Require authentication (throw error if not authenticated)
 * - Check user permissions and roles
 * - Server Component compatible
 */

import type { Session, User } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Get Current User - Cached for performance
 *
 * Returns the currently authenticated user or null if not authenticated.
 * Cached per request to avoid multiple database calls.
 *
 * SECURITY: Uses getUser() instead of getSession() to verify the session
 * is authentic by contacting the Supabase Auth server. Session data from
 * cookies cannot be trusted without server-side verification.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return null;
		}

		// Use getUser() to authenticate with Supabase Auth server
		// This verifies the session is valid and not tampered with
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		// Handle error - could be AuthSessionMissingError or network error
		if (error) {
			// AuthSessionMissingError is expected when user is not authenticated
			// Don't log this as an error, just return null
			if (error.name === "AuthSessionMissingError") {
				return null;
			}
			return null;
		}

		return user;
	} catch (error) {
		// Catch any unexpected errors (network issues, etc.)
		// The error might be thrown instead of returned in some cases
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "AuthSessionMissingError"
		) {
			return null;
		}
		return null;
	}
});

/**
 * Get Session - Cached for performance
 *
 * Returns the current session or null if not authenticated.
 * Cached per request to avoid multiple database calls.
 */
export const getSession = cache(async (): Promise<Session | null> => {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return null;
		}

		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) {
			return null;
		}

		return session;
	} catch (_error) {
		return null;
	}
});

/**
 * Require User - Throw error if not authenticated
 *
 * Use this in Server Components or Server Actions that require authentication.
 * Will throw an error that can be caught by error boundaries.
 */
export async function requireUser(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("Authentication required. Please log in to continue.");
	}

	return user;
}

/**
 * Require Session - Throw error if no session
 *
 * Use this when you need both user and session data (e.g., access token).
 */
export async function requireSession(): Promise<Session> {
	const session = await getSession();

	if (!session) {
		throw new Error("Active session required. Please log in to continue.");
	}

	return session;
}

/**
 * Check if user is authenticated
 *
 * Returns true if user is authenticated, false otherwise.
 * Useful for conditional rendering in Server Components.
 */
export async function isAuthenticated(): Promise<boolean> {
	const user = await getCurrentUser();
	return user !== null;
}

/**
 * Get User Metadata
 *
 * Returns user metadata from Supabase Auth.
 * Useful for accessing additional user properties stored in auth.users.
 */
export async function getUserMetadata<T = Record<string, any>>(): Promise<T | null> {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	return (user.user_metadata as T) || null;
}

/**
 * Check User Email Verified
 *
 * Returns true if user's email is verified, false otherwise.
 */
export async function isEmailVerified(): Promise<boolean> {
	const user = await getCurrentUser();

	if (!user) {
		return false;
	}

	return user.email_confirmed_at !== undefined;
}

/**
 * Get User ID
 *
 * Returns the user's ID or null if not authenticated.
 * Convenient helper for getting just the user ID.
 */
export async function getUserId(): Promise<string | null> {
	const user = await getCurrentUser();
	return user?.id || null;
}

/**
 * Get User Email
 *
 * Returns the user's email or null if not authenticated.
 */
export async function getUserEmail(): Promise<string | null> {
	const user = await getCurrentUser();
	return user?.email || null;
}

/**
 * Get Access Token
 *
 * Returns the current access token for API calls.
 * Useful for calling external APIs that require authentication.
 */
export async function getAccessToken(): Promise<string | null> {
	const session = await getSession();
	return session?.access_token || null;
}

/**
 * Refresh Session
 *
 * Manually refresh the session to get a new access token.
 * Usually not needed as Supabase handles this automatically.
 */
export async function refreshSession(): Promise<Session | null> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return null;
		}

		const {
			data: { session },
			error,
		} = await supabase.auth.refreshSession();

		if (error) {
			return null;
		}

		return session;
	} catch (_error) {
		return null;
	}
}
