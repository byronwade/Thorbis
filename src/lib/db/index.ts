import { createClient } from "@/lib/supabase/server";

/**
 * Get Supabase client for database operations
 * This uses Supabase directly instead of Drizzle ORM
 */
export async function getSupabaseClient() {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error(
			"Supabase client not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
		);
	}
	return supabase;
}

/**
 * Re-export types from schema
 * Note: Schema types are kept for TypeScript compatibility
 * but database operations should use Supabase client directly
 */
export type {
	NewPost,
	NewUser,
	Post,
	User,
} from "./schema";
