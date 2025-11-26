import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Admin Database Server Client
 *
 * This client connects to the ADMIN Supabase project.
 * Used for admin-specific operations like:
 * - Admin user management
 * - Support tickets
 * - Email campaigns
 * - Platform settings
 *
 * NOTE: This uses the service role key for server-side operations.
 * For session-based auth, use the session management in auth/session.ts
 */
export async function createClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const serviceRoleKey = process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	// Use service role key if available, otherwise fall back to anon key
	const key = serviceRoleKey || anonKey;

	return createSupabaseClient(supabaseUrl, key, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

/**
 * Get the current admin session from cookies
 */
export async function getAdminSession() {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("admin_session")?.value;

	if (!sessionToken) {
		return null;
	}

	// Verify and decode the session token
	const { verifySessionToken } = await import("@/lib/auth/session");
	return verifySessionToken(sessionToken);
}

/**
 * Get the current admin user from the session
 */
export async function getCurrentAdminUser() {
	const session = await getAdminSession();

	if (!session) {
		return null;
	}

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("admin_users")
		.select("*")
		.eq("id", session.userId)
		.single();

	if (error || !data) {
		return null;
	}

	return data;
}

// Re-export the admin client for convenience
export { createAdminClient, getAdminClient } from "./admin-client";
export { createWebReaderClient, getWebReaderClient } from "./web-reader";
