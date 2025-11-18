import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Returns the preferred Supabase client for scheduling operations.
 * Uses the service role when available (for cross-company visibility)
 * and falls back to the authenticated server client otherwise.
 */
export async function getSchedulingSupabaseClient() {
	try {
		return await createServiceSupabaseClient();
	} catch (error) {
		console.warn(
			"[Schedule] Service role unavailable, falling back to authenticated client",
			error,
		);
		return await createClient();
	}
}
