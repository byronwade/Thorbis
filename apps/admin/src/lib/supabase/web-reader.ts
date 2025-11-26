import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Web Database Reader Client (Server-Side Only)
 *
 * This client connects to the WEB Supabase project for READ-ONLY access to:
 * - Companies (customer businesses)
 * - Users (customer employees)
 * - Jobs, Invoices, Estimates
 * - Customers (customer's clients)
 * - Properties, Equipment
 * - All other business data
 *
 * This is used by admin for:
 * - Support/debugging customer issues
 * - Viewing company data for support tickets
 * - Accessing customer data when needed
 *
 * IMPORTANT: This should only be used for READ operations.
 * Never write to the web database from the admin app.
 */
export function createWebReaderClient() {
	const supabaseUrl = process.env.WEB_SUPABASE_URL;
	const serviceRoleKey = process.env.WEB_SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl) {
		throw new Error("Missing WEB_SUPABASE_URL environment variable");
	}

	if (!serviceRoleKey) {
		throw new Error("Missing WEB_SUPABASE_SERVICE_ROLE_KEY environment variable");
	}

	return createSupabaseClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

/**
 * Type-safe web reader client singleton for repeated use
 */
let webReaderInstance: ReturnType<typeof createWebReaderClient> | null = null;

export function getWebReaderClient() {
	if (!webReaderInstance) {
		webReaderInstance = createWebReaderClient();
	}
	return webReaderInstance;
}

// =============================================================================
// READ-ONLY HELPER FUNCTIONS
// =============================================================================
// These functions provide convenient access to web database tables

/**
 * Get a company from the web database by ID
 */
export async function getWebCompany(companyId: string) {
	const client = getWebReaderClient();
	const { data, error } = await client
		.from("companies")
		.select("*")
		.eq("id", companyId)
		.single();

	if (error) throw error;
	return data;
}

/**
 * Get all companies from the web database
 */
export async function getWebCompanies(options?: {
	limit?: number;
	offset?: number;
	status?: string;
}) {
	const client = getWebReaderClient();
	let query = client.from("companies").select("*", { count: "exact" });

	if (options?.status) {
		query = query.eq("status", options.status);
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	if (options?.offset) {
		query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
	}

	const { data, error, count } = await query.order("created_at", { ascending: false });

	if (error) throw error;
	return { data, count };
}

/**
 * Get users for a company from the web database
 */
export async function getWebCompanyUsers(companyId: string) {
	const client = getWebReaderClient();
	const { data, error } = await client
		.from("team_members")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

/**
 * Get jobs for a company from the web database
 */
export async function getWebCompanyJobs(companyId: string, options?: { limit?: number }) {
	const client = getWebReaderClient();
	let query = client
		.from("jobs")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) throw error;
	return data;
}

/**
 * Get customers for a company from the web database
 */
export async function getWebCompanyCustomers(companyId: string, options?: { limit?: number }) {
	const client = getWebReaderClient();
	let query = client
		.from("customers")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) throw error;
	return data;
}

/**
 * Get invoices for a company from the web database
 */
export async function getWebCompanyInvoices(companyId: string, options?: { limit?: number }) {
	const client = getWebReaderClient();
	let query = client
		.from("invoices")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) throw error;
	return data;
}

/**
 * Search across web database (for support purposes)
 */
export async function searchWebDatabase(searchTerm: string, options?: { limit?: number }) {
	const client = getWebReaderClient();
	const limit = options?.limit || 10;

	// Search companies
	const { data: companies } = await client
		.from("companies")
		.select("id, name, slug")
		.or(`name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`)
		.limit(limit);

	// Search customers
	const { data: customers } = await client
		.from("customers")
		.select("id, first_name, last_name, email, company_id")
		.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
		.limit(limit);

	return {
		companies: companies || [],
		customers: customers || [],
	};
}
