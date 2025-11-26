"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Creates a Supabase client using the service role key.
 * This bypasses RLS and is intended for background jobs / automation.
 *
 * Performance Optimization:
 * - Uses SUPABASE_POOLER_URL (Transaction Mode) if available for 30-50% faster queries
 * - Falls back to NEXT_PUBLIC_SUPABASE_URL (Session Mode) if pooler not configured
 * - Transaction Mode supports 10,000+ concurrent connections vs 100 in Session Mode
 *
 * @returns Supabase client with service role, or null if not configured
 */
export async function createServiceSupabaseClient() {
	// Prefer pooler URL for Transaction Mode (better performance)
	const supabaseUrl =
		process.env.SUPABASE_POOLER_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		return null;
	}

	return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
		db: {
			schema: "public",
		},
		global: {
			headers: {
				"x-my-custom-header": "service-role",
			},
		},
	});
}

export type ServiceSupabaseClient = Awaited<
	ReturnType<typeof createServiceSupabaseClient>
>;
