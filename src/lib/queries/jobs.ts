import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const JOBS_PAGE_SIZE = 50;

const JOBS_SELECT = `
  id,
  company_id,
  property_id,
  customer_id,
  assigned_to,
  job_number,
  title,
  description,
  status,
  priority,
  job_type,
  service_type,
  scheduled_start,
  scheduled_end,
  notes,
  metadata,
  created_at,
  updated_at,
  archived_at,
  deleted_at,
  customers:customers!customer_id (
    first_name,
    last_name,
    email,
    phone
  ),
  properties:properties!property_id (
    address,
    city,
    state,
    zip_code
  ),
  financial:job_financial (
    total_amount,
    paid_amount
  ),
  timeTracking:job_time_tracking (
    actual_start,
    actual_end
  )
`;

export type JobListRecord = {
	id: string;
	company_id: string;
	property_id: string | null;
	customer_id: string | null;
	assigned_to: string | null;
	job_number: string | null;
	title: string | null;
	description: string | null;
	status: string | null;
	priority: string | null;
	job_type: string | null;
	service_type: string | null;
	scheduled_start: string | null;
	scheduled_end: string | null;
	notes: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
	updated_at: string;
	archived_at: string | null;
	deleted_at: string | null;
	customers?: unknown;
	properties?: unknown;
	financial?: unknown;
	timeTracking?: unknown;
};

export type JobsPageResult = {
	jobs: JobListRecord[];
	totalCount: number;
};

export async function getJobsPageData(
	page: number,
	pageSize: number = JOBS_PAGE_SIZE,
	searchQuery = "",
	companyIdOverride?: string,
): Promise<JobsPageResult> {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { jobs: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	let query = supabase
		.from("jobs")
		.select(JOBS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.range(start, end);

	const normalizedSearch = searchQuery.trim();
	if (normalizedSearch) {
		const sanitized = normalizedSearch.replace(/,/g, "\\,");
		const term = `%${sanitized}%`;
		query = query.or(
			`job_number.ilike.${term},title.ilike.${term},description.ilike.${term},status.ilike.${term},priority.ilike.${term}`,
		);
	}

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`Failed to load jobs: ${error.message}`);
	}

	return {
		jobs: data ?? [],
		totalCount: count ?? 0,
	};
}

/**
 * Get jobs filtered by tags with request-level caching
 *
 * Uses React.cache() for request-level deduplication.
 * Uses composite index idx_job_tags_composite for fast tag filtering.
 *
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of jobs per page (default: 50)
 * @param searchQuery - Optional search query for job_number, title, description
 * @param tagSlugs - Array of tag slugs to filter by (e.g., ["warranty", "emergency"])
 * @returns Jobs matching the tag filter with total count
 */
export const getJobsWithTags = cache(
	async (
		page: number,
		pageSize: number = JOBS_PAGE_SIZE,
		searchQuery = "",
		tagSlugs: string[] = [],
	): Promise<JobsPageResult> => {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { jobs: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		// If no tag filter, use standard query
		if (tagSlugs.length === 0) {
			return getJobsPageData(page, pageSize, searchQuery);
		}

		// Build query with tag filtering
		// Uses INNER JOIN to filter jobs that have at least one of the specified tags
		let query = supabase
			.from("jobs")
			.select(
				`
        ${JOBS_SELECT},
        job_tags!inner(
          tag:tags!inner(
            id,
            name,
            slug,
            color,
            category
          )
        )
      `,
				{ count: "exact" },
			)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.in("job_tags.tag.slug", tagSlugs)
			.order("created_at", { ascending: false })
			.range(start, end);

		// Add search filter if provided
		const normalizedSearch = searchQuery.trim();
		if (normalizedSearch) {
			const sanitized = normalizedSearch.replace(/,/g, "\\,");
			const term = `%${sanitized}%`;
			query = query.or(
				`job_number.ilike.${term},title.ilike.${term},description.ilike.${term},status.ilike.${term},priority.ilike.${term}`,
			);
		}

		const { data, error, count } = await query;

		if (error) {
			throw new Error(`Failed to load jobs with tags: ${error.message}`);
		}

		return {
			jobs: data ?? [],
			totalCount: count ?? 0,
		};
	},
);

/**
 * Fetch complete job data including customer, property, equipment, and tags
 * Uses React.cache() for request-level deduplication
 */
export const getJobComplete = cache(
	async (jobId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();

		const { data, error } = await supabase.rpc("get_job_complete", {
			p_job_id: jobId,
			p_company_id: companyId,
		});

		if (error) {
			console.error("Error fetching job:", error);
			return null;
		}

		return data?.[0]?.job_data || null;
	},
);
