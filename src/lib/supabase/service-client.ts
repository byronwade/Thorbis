"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Creates a Supabase client using the service role key.
 * This bypasses RLS and is intended for background jobs / automation.
 *
 * @returns Supabase client with service role, or null if not configured
 */
export async function createServiceSupabaseClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		return null;
	}

	return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
		auth: {
			persistSession: false,
		},
	});
}

export type ServiceSupabaseClient = Awaited<
	ReturnType<typeof createServiceSupabaseClient>
>;
