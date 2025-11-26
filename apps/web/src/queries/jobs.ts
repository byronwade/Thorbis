/**
 * Job Queries - Data Fetching Functions (NOT Server Actions)
 *
 * These are regular async functions for fetching data in Server Components.
 * They are NOT Server Actions and should NOT have "use server" directive.
 *
 * Use these for:
 * - Fetching data in Server Components
 * - Reading data without mutations
 * - Server-side rendering
 *
 * DO NOT use for:
 * - Form submissions
 * - Data mutations
 * - Client-side data fetching
 */

import type { PostgrestError } from "@supabase/supabase-js";
import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { getJobWithDomains } from "@/lib/validations/job-domain-schemas";

export type ActionResult<T> = {
	success: boolean;
	data?: T;
	error?: string;
};

type JobDomainName = Parameters<typeof getJobWithDomains>[0][number];

const JOB_DOMAIN_NAMES: JobDomainName[] = [
	"financial",
	"workflow",
	"timeTracking",
	"customerApproval",
	"equipmentService",
	"dispatch",
	"quality",
	"safety",
	"aiEnrichment",
	"multiEntity",
];

const JOB_WITH_DOMAINS_QUERY = getJobWithDomains(JOB_DOMAIN_NAMES);

const DOMAIN_TABLE_CONFIGS = [
	{ key: "financial", table: "job_financial" },
	{ key: "workflow", table: "job_workflow" },
	{ key: "timeTracking", table: "job_time_tracking" },
	{ key: "customerApproval", table: "job_customer_approval" },
	{ key: "equipmentService", table: "job_equipment_service" },
	{ key: "dispatch", table: "job_dispatch" },
	{ key: "quality", table: "job_quality" },
	{ key: "safety", table: "job_safety" },
	{ key: "aiEnrichment", table: "job_ai_enrichment" },
	{ key: "multiEntity", table: "job_multi_entity" },
] as const satisfies Array<{ key: JobDomainName; table: string }>;

function normalizeDomainRecord<T>(
	record: T | T[] | null | undefined,
): T | null {
	if (!record) {
		return null;
	}
	return Array.isArray(record) ? (record[0] ?? null) : record;
}

function buildJobResponse(job: any) {
	const financial =
		normalizeDomainRecord(job.financial ?? job.job_financial) ?? null;
	const timeTracking =
		normalizeDomainRecord(job.timeTracking ?? job.job_time_tracking) ?? null;
	const workflow =
		normalizeDomainRecord(job.workflow ?? job.job_workflow) ?? null;
	const quality = normalizeDomainRecord(job.quality ?? job.job_quality) ?? null;
	const dispatch =
		normalizeDomainRecord(job.dispatch ?? job.job_dispatch) ?? null;
	const safety = normalizeDomainRecord(job.safety ?? job.job_safety) ?? null;
	const customerApproval =
		normalizeDomainRecord(job.customerApproval ?? job.job_customer_approval) ??
		null;
	const equipmentService =
		normalizeDomainRecord(job.equipmentService ?? job.job_equipment_service) ??
		null;
	const aiEnrichment =
		normalizeDomainRecord(job.aiEnrichment ?? job.job_ai_enrichment) ?? null;
	const multiEntity =
		normalizeDomainRecord(job.multiEntity ?? job.job_multi_entity) ?? null;

	return {
		...job,
		financial,
		timeTracking,
		workflow,
		quality,
		dispatch,
		safety,
		customerApproval,
		equipmentService,
		aiEnrichment,
		multiEntity,
		total_amount:
			financial?.total_amount ??
			job.total_amount ??
			job.job_financial?.[0]?.total_amount ??
			null,
		paid_amount:
			financial?.paid_amount ??
			job.paid_amount ??
			job.job_financial?.[0]?.paid_amount ??
			null,
		estimated_labor_hours:
			timeTracking?.estimated_labor_hours ??
			job.estimated_labor_hours ??
			job.job_time_tracking?.[0]?.estimated_labor_hours ??
			null,
		actual_labor_hours:
			timeTracking?.total_labor_hours ??
			timeTracking?.actual_labor_hours ??
			job.actual_labor_hours ??
			job.total_labor_hours ??
			null,
		workflow_stage:
			workflow?.workflow_stage ??
			job.workflow_stage ??
			job.job_workflow?.[0]?.workflow_stage ??
			null,
		priority_score:
			quality?.internal_priority_score ??
			job.priority_score ??
			job.job_quality?.[0]?.internal_priority_score ??
			null,
		ai_categories:
			aiEnrichment?.ai_categories ??
			job.ai_categories ??
			job.job_ai_enrichment?.[0]?.ai_categories ??
			null,
	};
}

async function fetchDomainsIndividually(
	supabaseClient: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	jobId: string,
	companyId: string,
) {
	const results = await Promise.all(
		DOMAIN_TABLE_CONFIGS.map(async ({ key, table }) => {
			const { data, error } = await supabaseClient
				.from(table)
				.select("*")
				.eq("job_id", jobId)
				.eq("company_id", companyId)
				.maybeSingle();

			return {
				key,
				data: data ?? null,
				error: error || null,
			};
		}),
	);

	const domainData: Partial<Record<JobDomainName, any>> = {};
	const domainErrors: Array<{ key: JobDomainName; error: PostgrestError }> = [];

	for (const result of results) {
		domainData[result.key] = result.data;
		if (result.error) {
			domainErrors.push({ key: result.key, error: result.error });
		}
	}

	return {
		data: domainData,
		errors: domainErrors,
	};
}

/**
 * Get job by ID with all domain data
 *
 * ARCHITECTURE: Uses React.cache() for request-level deduplication
 * - Called by multiple components → only 1 DB query
 * - Cannot use "use cache" because we need cookies() for company context
 * - React.cache() gives us deduplication within the same request
 *
 * This is a regular async function, NOT a Server Action
 */
export const getJob = cache(
	async (jobId: string): Promise<ActionResult<any>> => {
		try {
			const supabase = await createClient();
			if (!supabase) {
				return {
					success: false,
					error: "Database client not initialized",
				};
			}

			const activeCompanyId = await getActiveCompanyId();
			if (!activeCompanyId) {
				return {
					success: false,
					error: "No active company found",
				};
			}

			// First, try to get just the core job to verify it exists
			const { data: coreJob, error: coreError } = await supabase
				.from("jobs")
				.select("*")
				.eq("id", jobId)
				.eq("company_id", activeCompanyId)
				.is("deleted_at", null)
				.maybeSingle();

			if (coreError) {
				console.error("Error fetching core job:", {
					jobId,
					companyId: activeCompanyId,
					error: coreError,
				});
				return {
					success: false,
					error: coreError.message || "Failed to fetch job",
				};
			}

			if (!coreJob) {
				console.warn("Job not found:", { jobId, companyId: activeCompanyId });
				return {
					success: false,
					error: "Job not found",
				};
			}

			// Attempt to fetch job with domain tables using the regular authed client first
			const { data: jobWithDomains, error: jobDomainsError } = await supabase
				.from("jobs")
				.select(
					`
				${JOB_WITH_DOMAINS_QUERY},
				customer:customers!customer_id(id, first_name, last_name, email, phone, display_name, company_name),
				property:properties!property_id(id, address, city, state, zip_code, customer_id)
			`,
				)
				.eq("id", jobId)
				.eq("company_id", activeCompanyId)
				.is("deleted_at", null)
				.maybeSingle();

			let enrichedJob: any = jobWithDomains ?? null;
			let domainError: PostgrestError | null = jobDomainsError ?? null;

			// Fallback: try again with service role client to bypass incomplete RLS policies
			if (!enrichedJob) {
				const serviceSupabase = await createServiceSupabaseClient();
				if (serviceSupabase) {
					const { data: serviceJob, error: serviceError } =
						await serviceSupabase
							.from("jobs")
							.select(
								`
						${JOB_WITH_DOMAINS_QUERY},
						customer:customers!customer_id(id, first_name, last_name, email, phone, display_name, company_name),
						property:properties!property_id(id, address, city, state, zip_code, customer_id)
					`,
							)
							.eq("id", jobId)
							.eq("company_id", activeCompanyId)
							.is("deleted_at", null)
							.maybeSingle();

					if (serviceJob) {
						enrichedJob = serviceJob;
						domainError = null;
					} else if (serviceError) {
						domainError = serviceError;
					}
				}
			}

			// Final fallback: fetch each domain table individually using the authed client
			if (!enrichedJob) {
				const { data: domainData, errors: domainErrors } =
					await fetchDomainsIndividually(supabase, jobId, activeCompanyId);

				if (domainErrors.length > 0) {
					domainError = domainError ?? domainErrors[0]?.error ?? null;
				}

				// Also fetch customer and property data if they exist
				const [customerData, propertyData] = await Promise.all([
					coreJob.customer_id
						? supabase
								.from("customers")
								.select(
									"id, first_name, last_name, email, phone, display_name, company_name",
								)
								.eq("id", coreJob.customer_id)
								.maybeSingle()
						: { data: null },
					coreJob.property_id
						? supabase
								.from("properties")
								.select("id, address, city, state, zip_code, customer_id")
								.eq("id", coreJob.property_id)
								.maybeSingle()
						: { data: null },
				]);

				enrichedJob = {
					...coreJob,
					...domainData,
					customer: customerData.data,
					property: propertyData.data,
				};
			}

			if (enrichedJob) {
				return {
					success: true,
					data: buildJobResponse(enrichedJob),
				};
			}

			if (domainError) {
				console.error("Error fetching job with domains:", {
					jobId,
					error: domainError,
					errorMessage: domainError?.message,
					errorCode: domainError?.code,
					errorDetails: domainError?.details,
					errorHint: domainError?.hint,
					selectQuery: JOB_WITH_DOMAINS_QUERY,
				});
			}

			// Fall back to the core job data if enriched joins fail entirely
			return {
				success: true,
				data: buildJobResponse(coreJob),
			};
		} catch (error) {
			console.error("Unexpected error in getJob:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	},
);
