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

import { unstable_cache } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { getJobWithDomains } from "@/lib/validations/job-domain-schemas";

export type ActionResult<T> = {
	success: boolean;
	data?: T;
	error?: string;
};

/**
 * Get job by ID with all domain data (internal implementation)
 * This is a regular async function, NOT a Server Action
 */
async function getJobInternal(
	jobId: string,
	companyId: string,
): Promise<ActionResult<any>> {
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

		// Fetch job with ALL domain data
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select(
				getJobWithDomains([
					"financial",
					"timeTracking",
					"customer",
					"property",
					"ai",
					"workflow",
					"priority",
					"dispatch",
					"quality",
					"permit",
					"multiEntity",
				]),
			)
			.eq("id", jobId)
			.eq("company_id", activeCompanyId)
			.is("deleted_at", null)
			.single();

		if (jobError) {
			console.error("Error fetching job:", jobError);
			return {
				success: false,
				error: jobError.message || "Failed to fetch job",
			};
		}

		if (!job) {
			return {
				success: false,
				error: "Job not found",
			};
		}

		// Transform domain tables to nested structure for backwards compatibility
		const transformedJob = {
			...job,
			// Flatten domain data into main job object for easier access
			total_amount: job.financial?.total_amount,
			paid_amount: job.financial?.paid_amount,
			estimated_labor_hours: job.timeTracking?.estimated_labor_hours,
			actual_labor_hours: job.timeTracking?.actual_labor_hours,
			workflow_stage: job.workflow?.workflow_stage,
			priority_score: job.priority?.priority_score,
			ai_categories: job.ai?.ai_categories,
		};

		return {
			success: true,
			data: transformedJob,
		};
	} catch (error) {
		console.error("Unexpected error in getJob:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Get job by ID with all domain data (cached)
 * Cached wrapper around getJobInternal to prevent repeated fetches
 */
export async function getJob(jobId: string): Promise<ActionResult<any>> {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return {
			success: false,
			error: "No active company found",
		};
	}

	// Cache the job data for 60 seconds, revalidate when invalidated via revalidatePath
	const getCachedJob = unstable_cache(
		async (jId: string, cId: string) => getJobInternal(jId, cId),
		["job", jobId, companyId],
		{
			revalidate: 60,
			tags: [`job-${jobId}`, `company-${companyId}-jobs`],
		},
	);

	return getCachedJob(jobId, companyId);
}
