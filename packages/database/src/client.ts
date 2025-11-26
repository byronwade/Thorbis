import { createBrowserClient } from "@supabase/ssr";

/**
 * Create a Supabase client for use in the browser
 * This is useful for Supabase Auth, Storage, Realtime, etc.
 *
 * SESSION ISOLATION: This client uses default Supabase cookie names.
 * The admin app uses prefixed cookies (admin_*) to isolate its sessions.
 * This ensures admin and contractor sessions don't conflict.
 */
export function createClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!(supabaseUrl && supabaseAnonKey)) {
		// Return a mock client for development
		return null;
	}

	return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
