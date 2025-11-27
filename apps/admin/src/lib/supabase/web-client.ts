import { createClient } from "@supabase/supabase-js";

/**
 * Web Database Client - Full Admin Access
 *
 * This client connects to the main Thorbis web database with SERVICE ROLE permissions.
 * It bypasses all Row Level Security (RLS) policies and has full read/write access.
 *
 * ⚠️ SECURITY WARNING:
 * - ONLY use this on the server side (Server Components, Server Actions, API Routes)
 * - NEVER expose this client or its credentials to the browser
 * - NEVER use in Client Components
 * - Always log admin actions to admin_audit_logs table
 *
 * Use cases:
 * - View customer data for support tickets
 * - Edit/fix customer records (invoices, jobs, payments)
 * - Issue refunds
 * - Troubleshoot data issues
 * - Migrate/bulk update customer data
 * - Generate reports across all customers
 */

/**
 * Create a Supabase client for the web database with service role access.
 *
 * @returns Supabase client with full access to web database (bypasses RLS)
 *
 * @example
 * // Server Action - View customer data
 * "use server";
 * import { createWebClient } from "@/lib/supabase/web-client";
 *
 * export async function getCustomerData(customerId: string) {
 *   const supabase = createWebClient();
 *   const { data, error } = await supabase
 *     .from("customers")
 *     .select("*")
 *     .eq("id", customerId)
 *     .single();
 *
 *   return data;
 * }
 *
 * @example
 * // Server Action - Issue refund
 * "use server";
 * import { createWebClient } from "@/lib/supabase/web-client";
 * import { logAdminAction } from "@/lib/admin/audit";
 *
 * export async function issueRefund(paymentId: string, amount: number, adminUserId: string) {
 *   const supabase = createWebClient();
 *
 *   // Update payment status
 *   const { error } = await supabase
 *     .from("payments")
 *     .update({
 *       status: "refunded",
 *       refund_amount: amount,
 *       refunded_at: new Date().toISOString()
 *     })
 *     .eq("id", paymentId);
 *
 *   // Log the action
 *   await logAdminAction(adminUserId, "refund_issued", "payment", paymentId, {
 *     amount,
 *     timestamp: new Date().toISOString()
 *   });
 *
 *   return { success: !error };
 * }
 */
export const createWebClient = () => {
	const supabaseUrl = process.env.WEB_SUPABASE_URL;
	const serviceRoleKey = process.env.WEB_SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl) {
		throw new Error("Missing WEB_SUPABASE_URL environment variable");
	}

	if (!serviceRoleKey) {
		throw new Error("Missing WEB_SUPABASE_SERVICE_ROLE_KEY environment variable");
	}

	return createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
};

/**
 * Type-safe helper to get the web client.
 * Alias for createWebClient() with better semantics.
 */
export const getWebDatabaseClient = createWebClient;
