import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin Database Browser Client
 *
 * This client connects to the ADMIN Supabase project from the browser.
 * Used for client-side operations that need database access.
 *
 * NOTE: Most admin operations should use Server Actions/Components.
 * Use this client sparingly for real-time subscriptions or
 * client-side data fetching when absolutely necessary.
 */
export function createClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	);
}
