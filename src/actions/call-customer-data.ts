"use server";

/**
 * Call Customer Data Actions
 *
 * Server actions for fetching comprehensive customer data during calls.
 * Priority: Database first, Telnyx caller lookup as fallback.
 */

import { createClient } from "@/lib/supabase/server";
import { lookupCallerInfo } from "@/lib/telnyx/number-lookup";
import type { ActionResult } from "@/types/actions";
import type {
	CustomerCallData,
	CustomerStats,
	TelnyxEnrichmentData,
} from "@/types/call-window";

type SupabaseServerClient = Exclude<
	Awaited<ReturnType<typeof createClient>>,
	null
>;

type RelatedCustomerData = {
	jobs: CustomerCallData["jobs"];
	invoices: CustomerCallData["invoices"];
	estimates: CustomerCallData["estimates"];
	appointments: CustomerCallData["appointments"];
	properties: CustomerCallData["properties"];
	equipment: CustomerCallData["equipment"];
	contracts: CustomerCallData["contracts"];
};

/**
 * Get comprehensive customer data for call window
 *
 * @param phoneNumber - Caller's phone number
 * @param companyId - Company ID for database lookup
 * @returns CustomerCallData with all related records
 */
export async function getCustomerCallData(
	phoneNumber: string,
	companyId: string,
): Promise<ActionResult<CustomerCallData>> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Database connection failed",
			};
		}

		const typedSupabase = supabase as SupabaseServerClient;

		// Normalize phone number
		const normalizedPhone = phoneNumber.replace(/\D/g, "");

		// 1. Try database lookup first
		const { data: customer } = await typedSupabase
			.from("customers")
			.select("*")
			.eq("company_id", companyId)
			.or(
				`phone.eq.${phoneNumber},phone.eq.${normalizedPhone},secondary_phone.eq.${phoneNumber},secondary_phone.eq.${normalizedPhone}`,
			)
			.maybeSingle();

		const isKnownCustomer = !!customer;

		// 2. Enrich with Telnyx data if customer is not found
		const telnyxData = customer
			? undefined
			: await getTelnyxEnrichmentData(phoneNumber);

		let source: "database" | "telnyx" | "unknown" = "unknown";
		if (customer) {
			source = "database";
		} else if (telnyxData) {
			source = "telnyx";
		}

		// 3. Fetch related data (jobs, invoices, etc.)
		const related: RelatedCustomerData = customer
			? await fetchRelatedCustomerData(typedSupabase, customer.id)
			: getEmptyRelatedCustomerData();

		// 4. Calculate quick stats
		const stats = buildCustomerStats(customer, related.jobs, related.invoices);

		// 5. Return comprehensive data
		const result: CustomerCallData = {
			customer: customer ?? null,
			isKnownCustomer,
			source,
			stats,
			jobs: related.jobs,
			invoices: related.invoices,
			estimates: related.estimates,
			appointments: related.appointments,
			properties: related.properties,
			equipment: related.equipment,
			contracts: related.contracts,
			telnyxData,
		};

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch customer data",
		};
	}
}

type TelnyxLookupPayload = {
	caller_name?: string | null;
	caller_type?: string | null;
	line_type?: string | null;
	carrier?: { name?: string | null } | null;
	country_code?: string | null;
	national_format?: string | null;
};

async function getTelnyxEnrichmentData(
	phoneNumber: string,
): Promise<TelnyxEnrichmentData | undefined> {
	const lookupResult = await lookupCallerInfo(phoneNumber);

	if (!(lookupResult.success && lookupResult.data)) {
		return;
	}

	const data = lookupResult.data as TelnyxLookupPayload;

	return {
		callerName: data.caller_name || null,
		callerType: data.caller_type || null,
		lineType: data.line_type || null,
		carrier: data.carrier?.name || null,
		country: data.country_code || null,
		nationalFormat: data.national_format || null,
	};
}

function getEmptyRelatedCustomerData(): RelatedCustomerData {
	return {
		jobs: [],
		invoices: [],
		estimates: [],
		appointments: [],
		properties: [],
		equipment: [],
		contracts: [],
	};
}

async function fetchRelatedCustomerData(
	supabase: SupabaseServerClient,
	customerId: string,
): Promise<RelatedCustomerData> {
	const [
		jobsResult,
		invoicesResult,
		estimatesResult,
		appointmentsResult,
		propertiesResult,
		equipmentResult,
	] = await Promise.all([
		// Jobs (last 10, ordered by created date)
		// Use getJobListSelect() to get core + financial data (total_amount, paid_amount needed for call window)
		supabase
			.from("jobs")
			.select(`
				id, job_number, title, description, status, priority, job_type,
				created_at, updated_at, scheduled_date,
				customer_id, property_id, company_id, created_by,
				financial:job_financial(total_amount, paid_amount, deposit_amount)
			`)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),

		// Invoices (unpaid first, then recent)
		supabase
			.from("invoices")
			.select("*")
			.eq("customer_id", customerId)
			.order("status", { ascending: true }) // unpaid first
			.order("created_at", { ascending: false })
			.limit(10),

		// Estimates (pending first, then recent)
		supabase
			.from("estimates")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("status", { ascending: true })
			.order("created_at", { ascending: false })
			.limit(10),

		// Appointments (upcoming only)
		supabase
			.from("schedules")
			.select(`
        *,
        job:jobs!job_id(id, job_number, title),
        property:properties!property_id(id, name, address)
      `)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.gte("scheduled_start", new Date().toISOString())
			.order("scheduled_start", { ascending: true })
			.limit(10),

		// Properties
		supabase
			.from("properties")
			.select("*")
			.eq("primary_contact_id", customerId)
			.order("created_at", { ascending: false })
			.limit(10),

		// Equipment
		supabase
			.from("equipment")
			.select("*")
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
	]);

	return {
		jobs: (jobsResult.data || []) as CustomerCallData["jobs"],
		invoices: (invoicesResult.data || []) as CustomerCallData["invoices"],
		estimates: (estimatesResult.data || []) as CustomerCallData["estimates"],
		appointments: (appointmentsResult.data ||
			[]) as CustomerCallData["appointments"],
		properties: (propertiesResult.data || []) as CustomerCallData["properties"],
		equipment: (equipmentResult.data || []) as CustomerCallData["equipment"],
		// Note: Contracts table may not exist, handle gracefully
		contracts: [] as CustomerCallData["contracts"],
	};
}

function buildCustomerStats(
	customer: CustomerCallData["customer"],
	jobs: CustomerCallData["jobs"],
	invoices: CustomerCallData["invoices"],
): CustomerStats {
	const openInvoices = invoices.filter(
		(invoice) => invoice.status === "unpaid" || invoice.status === "partial",
	);

	return {
		totalJobs: jobs.length,
		activeJobs: jobs.filter(
			(job) => job.status === "in_progress" || job.status === "scheduled",
		).length,
		totalRevenue: customer?.total_revenue || 0,
		openInvoices: openInvoices.length,
		openInvoicesAmount: openInvoices.reduce(
			(sum, invoice) => sum + (invoice.total_amount || 0),
			0,
		),
		customerSince: customer?.created_at || null,
	};
}

/**
 * Get customer data by ID (for outbound calls where we already know the customer)
 */
export async function getCustomerCallDataById(
	customerId: string,
	companyId: string,
): Promise<ActionResult<CustomerCallData>> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Database connection failed",
			};
		}

		const typedSupabase = supabase as SupabaseServerClient;

		// Get customer
		const { data: customer, error: customerError } = await typedSupabase
			.from("customers")
			.select("*")
			.eq("id", customerId)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.single();

		if (customerError || !customer) {
			return {
				success: false,
				error: "Customer not found",
			};
		}

		// Fetch related data (same as above)
		const related = await fetchRelatedCustomerData(typedSupabase, customer.id);

		const stats = buildCustomerStats(customer, related.jobs, related.invoices);

		const result: CustomerCallData = {
			customer,
			isKnownCustomer: true,
			source: "database",
			stats,
			jobs: related.jobs,
			invoices: related.invoices,
			estimates: related.estimates,
			appointments: related.appointments,
			properties: related.properties,
			equipment: related.equipment,
			contracts: [],
			telnyxData: undefined,
		};

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch customer data",
		};
	}
}
