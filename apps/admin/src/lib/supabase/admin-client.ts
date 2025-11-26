import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin Database Client (Server-Side Only)
 *
 * This client connects to the ADMIN Supabase database (separate from web database).
 *
 * Database: Admin database (iwudmixxoozwskgolqlz)
 * Tables: admin_users, admin_sessions, companies_registry, support_tickets,
 *         email_campaigns, platform_settings, admin_audit_logs, waitlist
 *
 * ⚠️ SECURITY WARNING:
 * - ONLY use this on the server side (Server Components, Server Actions, API Routes)
 * - NEVER expose this client or its credentials to the browser
 * - NEVER use in Client Components
 * - Uses service role key for full access (bypasses RLS)
 *
 * Use cases:
 * - Admin user authentication and management
 * - Session management
 * - Audit logging
 * - Platform settings
 * - Email campaigns
 * - Support tickets
 * - Company registry (metadata only)
 *
 * Note: For accessing CUSTOMER DATA (jobs, invoices, payments, etc.),
 * use createWebClient() from "./web-client.ts" instead.
 */
export function createAdminClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
	}

	if (!serviceRoleKey) {
		throw new Error(
			"Missing ADMIN_SUPABASE_SERVICE_ROLE_KEY environment variable. " +
				"Get this from Supabase dashboard -> Settings -> API -> service_role key"
		);
	}

	return createSupabaseClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

/**
 * Type-safe admin client singleton for repeated use
 */
let adminClientInstance: ReturnType<typeof createAdminClient> | null = null;

export function getAdminClient() {
	if (!adminClientInstance) {
		adminClientInstance = createAdminClient();
	}
	return adminClientInstance;
}
