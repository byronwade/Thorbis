"use server";

/**
 * Call Customer Data Actions
 *
 * Server actions for fetching comprehensive customer data during calls.
 * Priority: Database first, Twilio caller lookup as fallback.
 */

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import type {
	CustomerCallData,
	CustomerStats,
	TwilioEnrichmentData,
} from "@/types/call";

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
	recentCommunications: CustomerCallData["recentCommunications"];
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

		// 2. Enrich with Twilio data if customer is not found
		const twilioData = customer
			? undefined
			: await getTwilioEnrichmentData(phoneNumber);

		let source: "database" | "twilio" | "unknown" = "unknown";
		if (customer) {
			source = "database";
		} else if (twilioData) {
			source = "twilio";
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
			recentCommunications: related.recentCommunications,
			twilioData,
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

type TwilioLookupPayload = {
	caller_name?: string | null;
	caller_type?: string | null;
	line_type?: string | null;
	carrier?: { name?: string | null } | null;
	country_code?: string | null;
	national_format?: string | null;
};

async function getTwilioEnrichmentData(
	phoneNumber: string,
): Promise<TwilioEnrichmentData | undefined> {
	// TODO: Implement Twilio Lookup API integration
	// For now, return undefined - customer lookup from database is primary source
	return undefined;
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
		recentCommunications: [],
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
		communicationsResult,
	] = await Promise.all([
		// Jobs (last 10, ordered by created date)
		// Use getJobListSelect() to get core + financial data (total_amount, paid_amount needed for call window)
		supabase
			.from("jobs")
			.select(
				`
				id, job_number, title, description, status, priority, job_type,
				created_at, updated_at, scheduled_date,
				customer_id, property_id, company_id, created_by,
				financial:job_financial(total_amount, paid_amount, deposit_amount)
			`,
			)
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
			.from("appointments")
			.select(
				`
        *,
        job:jobs!appointments_job_id_jobs_id_fk(id, job_number, title),
        property:properties!appointments_property_id_properties_id_fk(id, name, address)
      `,
			)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.gte("start_time", new Date().toISOString())
			.order("start_time", { ascending: true })
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

		// Recent Communications (last 5 for call context)
		supabase
			.from("communications")
			.select(
				"id, type, direction, subject, body, from_address, to_address, created_at, status",
			)
			.eq("customer_id", customerId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(5),
	]);

	// Transform communications data to match RecentCommunication type
	const recentCommunications = (communicationsResult.data || []).map(
		(comm) => ({
			id: comm.id,
			type: comm.type as "sms" | "email" | "call" | "voicemail",
			direction: comm.direction as "inbound" | "outbound",
			subject: comm.subject,
			body: comm.body,
			from_number: comm.from_address,
			to_number: comm.to_address,
			created_at: comm.created_at,
			status: comm.status,
		}),
	);

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
		recentCommunications:
			recentCommunications as CustomerCallData["recentCommunications"],
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
			contracts: related.contracts,
			recentCommunications: related.recentCommunications,
			twilioData: undefined,
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
