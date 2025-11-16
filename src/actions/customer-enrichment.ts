// @ts-nocheck
/**
 * Customer Enrichment Server Actions
 *
 * Server-side actions for enriching customer data with external APIs:
 * - Trigger enrichment for a customer
 * - Get cached enrichment data
 * - Refresh expired enrichment
 * - Check enrichment quota/limits
 * - Get usage statistics
 */

"use server";

import { revalidatePath } from "next/cache";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { type CustomerEnrichment, customerEnrichmentService } from "@/lib/services/customer-enrichment";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

type TeamMemberRecord = {
	company_id: string;
	role?: string | null;
};

type CustomerForEnrichment = {
	id: string;
	company_id: string;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	company_name: string | null;
	phone: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zip_code: string | null;
};

type EnrichmentRecord = {
	data_type: string;
	enrichment_data: CustomerEnrichment | null;
};

type EnrichmentGroupedData = {
	combined?: EnrichmentRecord | null;
	person?: EnrichmentRecord | null;
	business?: EnrichmentRecord | null;
	social?: EnrichmentRecord | null;
	property: EnrichmentRecord[];
};

type EnrichmentUsageRecord = {
	enrichments_count: number | null;
	enrichments_limit: number | null;
	tier: string | null;
};

const ISO_MONTH_START_INDEX = 0;
const ISO_MONTH_FORMAT_LENGTH = 7;

const ENRICHMENT_TIER_LIMITS = {
	free: 50,
	pro: 500,
	enterprise: null,
} as const;

const CUSTOMER_ENRICHMENT_SELECT = `
  id,
  company_id,
  email,
  first_name,
  last_name,
  company_name,
  phone,
  address,
  city,
  state,
  zip_code
`;

// ============================================================================
// ENRICHMENT OPERATIONS
// ============================================================================

/**
 * Enrich customer data with external APIs
 */
export async function enrichCustomerData(
	customerId: string,
	forceRefresh = false
): Promise<ActionResult<CustomerEnrichment>> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		const { teamMember, customer, cachedEnrichment } = await resolveCustomerContext(supabase, customerId, forceRefresh);

		if (cachedEnrichment) {
			return cachedEnrichment;
		}

		const enrichmentResult = await customerEnrichmentService.enrichCustomer({
			id: customer.id,
			email: customer.email ?? "",
			firstName: customer.first_name ?? undefined,
			lastName: customer.last_name ?? undefined,
			companyName: customer.company_name ?? undefined,
			phone: customer.phone ?? undefined,
			address: customer.address ?? undefined,
			city: customer.city ?? undefined,
			state: customer.state ?? undefined,
			zipCode: customer.zip_code ?? undefined,
		});

		if (enrichmentResult.enrichmentStatus === "failed") {
			throw new ActionError("Failed to enrich customer data from all sources", ERROR_CODES.SERVICE_INTEGRATION_ERROR);
		}

		await storeEnrichmentResult(supabase, customerId, enrichmentResult);
		await incrementEnrichmentUsage(supabase, teamMember.company_id);

		revalidatePath(`/dashboard/customers/${customerId}`);
		revalidatePath("/dashboard/customers");

		return enrichmentResult;
	});
}

/**
 * Get cached enrichment data for a customer
 */
export async function getEnrichmentData(customerId: string): Promise<ActionResult<EnrichmentGroupedData | null>> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		const { teamMember } = await resolveCompanyMembership(supabase);

		await fetchCustomerForCompany<{ id: string }>(supabase, customerId, teamMember.company_id, "id");

		const { data: enrichmentRows, error } = await supabase
			.from("customer_enrichment_data")
			.select("*")
			.eq("customer_id", customerId)
			.order("created_at", { ascending: false })
			.returns<EnrichmentRecord[]>();

		if (error || !enrichmentRows?.length) {
			return null;
		}

		return buildEnrichmentGrouping(enrichmentRows);
	});
}

/**
 * Refresh enrichment data (force refresh even if not expired)
 */
export async function refreshEnrichment(customerId: string): Promise<ActionResult<CustomerEnrichment>> {
	return await enrichCustomerData(customerId, true);
}

/**
 * Get enrichment usage statistics for company
 */
export async function getEnrichmentUsageStats(): Promise<
	ActionResult<
		Array<{
			month_year: string;
			enrichments_count: number;
			enrichments_limit: number | null;
			api_costs: number;
			tier: string;
			percentage_used: number;
		}>
	>
> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		const { teamMember } = await resolveCompanyMembership(supabase);

		// Get usage stats
		const { data, error } = await supabase.rpc("get_enrichment_stats", {
			p_company_id: teamMember.company_id,
		});

		if (error) {
			throw new ActionError("Failed to fetch usage stats", ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || [];
	});
}

/**
 * Check if company can enrich more customers this month
 */
export async function checkEnrichmentQuota(): Promise<
	ActionResult<{
		canEnrich: boolean;
		current: number;
		limit: number | null;
		tier: string;
	}>
> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		const { teamMember } = await resolveCompanyMembership(supabase);

		// Check if can enrich
		const canEnrich = await assertCanEnrichCompany(supabase, teamMember.company_id, { throwOnLimit: false });

		// Get current usage
		const currentMonth = getCurrentMonthStamp();
		const { data: usageData } = await supabase
			.from("customer_enrichment_usage")
			.select("*")
			.eq("company_id", teamMember.company_id)
			.eq("month_year", currentMonth)
			.single()
			.returns<EnrichmentUsageRecord>();
		const usage = usageData as EnrichmentUsageRecord | null;

		return {
			canEnrich: Boolean(canEnrich),
			current: usage?.enrichments_count ?? 0,
			limit: usage?.enrichments_limit ?? null,
			tier: usage?.tier ?? "free",
		};
	});
}

/**
 * Update enrichment tier limits (admin only)
 */
export async function updateEnrichmentTier(tier: "free" | "pro" | "enterprise"): Promise<ActionResult<void>> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		const { teamMember } = await resolveCompanyMembership(supabase, {
			includeRole: true,
		});

		// Check if user is admin/owner
		if (!["owner", "admin"].includes(teamMember.role ?? "")) {
			throw new ActionError("Only admins can update enrichment tier", ERROR_CODES.OPERATION_NOT_ALLOWED);
		}

		const currentMonth = getCurrentMonthStamp();

		// Upsert usage record with new tier
		const { error } = await supabase.from("customer_enrichment_usage").upsert({
			company_id: teamMember.company_id,
			month_year: currentMonth,
			tier,
			enrichments_limit: ENRICHMENT_TIER_LIMITS[tier],
		});

		if (error) {
			throw new ActionError("Failed to update tier", ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/subscriptions");
	});
}

/**
 * Delete enrichment data for a customer
 */
export async function deleteEnrichmentData(customerId: string): Promise<ActionResult<void>> {
	return await withErrorHandling(async () => {
		const supabase = await getSupabaseServerClient();
		await getAuthenticatedUserId(supabase);

		// Delete enrichment data (RLS will ensure user has access)
		const { error } = await supabase.from("customer_enrichment_data").delete().eq("customer_id", customerId);

		if (error) {
			throw new ActionError("Failed to delete enrichment data", ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath(`/dashboard/customers/${customerId}`);
	});
}

const getSupabaseServerClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
	}
	return supabase as SupabaseServerClient;
};

const getAuthenticatedUserId = async (supabase: SupabaseServerClient): Promise<string> => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	assertAuthenticated(user?.id);
	return user?.id as string;
};

const resolveCompanyMembership = async (
	supabase: SupabaseServerClient,
	options?: { includeRole?: boolean }
): Promise<{ teamMember: TeamMemberRecord }> => {
	const userId = await getAuthenticatedUserId(supabase);
	const teamMember = await loadActiveTeamMember(supabase, userId, options?.includeRole ?? false);
	return { teamMember };
};

const loadActiveTeamMember = async (
	supabase: SupabaseServerClient,
	userId: string,
	includeRole: boolean
): Promise<TeamMemberRecord> => {
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
	}

	const columns = includeRole ? "company_id, role" : "company_id";
	const { data } = await supabase
		.from("team_members")
		.select(columns)
		.eq("user_id", userId)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle()
		.returns<TeamMemberRecord>();

	if (!data?.company_id) {
		throw new ActionError("User not in active company", ERROR_CODES.AUTH_UNAUTHORIZED);
	}

	return data as TeamMemberRecord;
};

const fetchCustomerForCompany = async <TData>(
	supabase: SupabaseServerClient,
	customerId: string,
	companyId: string,
	columns: string
): Promise<TData> => {
	const { data, error } = await supabase
		.from("customers")
		.select(columns)
		.eq("id", customerId)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.single()
		.returns<TData>();

	if (error) {
		throw new ActionError("Customer not found", ERROR_CODES.DB_RECORD_NOT_FOUND);
	}

	assertExists(data, "Customer");
	return data;
};

const getValidCachedEnrichment = async (
	supabase: SupabaseServerClient,
	customerId: string
): Promise<CustomerEnrichment | null> => {
	const { data, error } = await supabase
		.from("customer_enrichment_data")
		.select("enrichment_data, expires_at")
		.eq("customer_id", customerId)
		.eq("data_type", "combined")
		.eq("status", "active")
		.gte("expires_at", new Date().toISOString())
		.order("created_at", { ascending: false })
		.limit(1)
		.single()
		.returns<{ enrichment_data: CustomerEnrichment | null }>();

	if (error) {
		return null;
	}

	return data?.enrichment_data ?? null;
};

const assertCanEnrichCompany = async (
	supabase: SupabaseServerClient,
	companyId: string,
	options?: { throwOnLimit?: boolean }
): Promise<boolean> => {
	const { data, error } = await supabase.rpc("can_enrich_customer", {
		p_company_id: companyId,
	});

	if (error) {
		throw new ActionError("Failed to check enrichment quota", ERROR_CODES.DB_QUERY_ERROR);
	}

	if (!data && options?.throwOnLimit !== false) {
		throw new ActionError(
			"Enrichment limit reached for this month. Upgrade your plan for more enrichments.",
			ERROR_CODES.OPERATION_NOT_ALLOWED
		);
	}

	return Boolean(data);
};

const storeEnrichmentResult = async (
	supabase: SupabaseServerClient,
	customerId: string,
	enrichmentResult: CustomerEnrichment
) => {
	const { error } = await supabase.from("customer_enrichment_data").insert({
		customer_id: customerId,
		data_type: "combined",
		source: enrichmentResult.sources.join(","),
		enrichment_data: enrichmentResult,
		confidence_score: enrichmentResult.overallConfidence,
		cached_at: new Date().toISOString(),
		expires_at: enrichmentResult.expiresAt,
		status: "active",
	});

	if (error) {
		throw new ActionError("Failed to store enrichment data", ERROR_CODES.DB_QUERY_ERROR);
	}
};

const incrementEnrichmentUsage = async (supabase: SupabaseServerClient, companyId: string) => {
	const { error } = await supabase.rpc("increment_enrichment_usage", {
		p_company_id: companyId,
		p_api_cost: 0,
	});

	if (error) {
		throw new ActionError("Failed to update enrichment usage", ERROR_CODES.DB_QUERY_ERROR);
	}
};

const buildEnrichmentGrouping = (rows: EnrichmentRecord[]): EnrichmentGroupedData => ({
	combined: rows.find((row) => row.data_type === "combined") ?? null,
	person: rows.find((row) => row.data_type === "person") ?? null,
	business: rows.find((row) => row.data_type === "business") ?? null,
	social: rows.find((row) => row.data_type === "social") ?? null,
	property: rows.filter((row) => row.data_type === "property"),
});

const getCurrentMonthStamp = (date: Date = new Date()): string =>
	date.toISOString().slice(ISO_MONTH_START_INDEX, ISO_MONTH_FORMAT_LENGTH);

const resolveCustomerContext = async (
	supabase: SupabaseServerClient,
	customerId: string,
	forceRefresh: boolean
): Promise<{
	teamMember: TeamMemberRecord;
	customer: CustomerForEnrichment;
	cachedEnrichment: CustomerEnrichment | null;
}> => {
	const { teamMember } = await resolveCompanyMembership(supabase);
	const customer = await fetchCustomerForCompany<CustomerForEnrichment>(
		supabase,
		customerId,
		teamMember.company_id,
		CUSTOMER_ENRICHMENT_SELECT
	);

	const cachedEnrichment = forceRefresh ? null : await getValidCachedEnrichment(supabase, customerId);

	if (!cachedEnrichment) {
		await assertCanEnrichCompany(supabase, teamMember.company_id);
	}

	return { teamMember, customer, cachedEnrichment };
};
