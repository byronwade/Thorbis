import { createServerClient } from "@supabase/ssr";
import { cache } from "react";

/**
 * Create a Supabase client for use in Server Components
 * This is useful for Supabase Auth, Storage, Realtime, etc.
 *
 * PERFORMANCE: Wrapped with React.cache() to prevent recreating
 * the client on every component render. This dramatically improves
 * performance by reusing the same client instance across the request.
 */
export const createClient = cache(async () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!(supabaseUrl && supabaseAnonKey)) {
		return null;
	}

	// Dynamic import of next/headers to prevent bundling in client components
	const { cookies, headers } = await import("next/headers");

	let cookieStore;

	// Check if we're in a prerendering context by looking at headers
	let headersStore;
	try {
		headersStore = await headers();
		// If we can get headers and there's no x-prerender header, we might be safe
		if (headersStore.get('x-prerender')) {
			return null;
		}
	} catch {
		// If headers() fails, we're likely in prerendering
		return null;
	}

	try {
		cookieStore = await cookies();
	} catch (error) {
		// During prerendering, cookies() may reject - return null
		// This allows PPR to work correctly
		if (error instanceof Error && (
			error.message.includes("During prerendering") ||
			error.message.includes("prerendering") ||
			error.message.includes("cookies()")
		)) {
			return null;
		}
		// For other errors, rethrow
		throw error;
	}

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options) {
				try {
					cookieStore.set(name, value, options);
				} catch {
					// The `set` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
			remove(name: string, _options) {
				try {
					cookieStore.delete(name);
				} catch {
					// The `delete` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
});
