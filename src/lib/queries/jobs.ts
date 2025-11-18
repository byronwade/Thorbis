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

export const getJobsPageData = cache(
	async (
		page: number,
		pageSize: number = JOBS_PAGE_SIZE,
		searchQuery = "",
		companyIdOverride?: string,
	): Promise<JobsPageResult> => {
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
	},
);
