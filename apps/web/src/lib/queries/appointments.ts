import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { PAGINATION } from "@stratos/shared/constants";
import type { Database } from "@/types/supabase";

export const APPOINTMENTS_PAGE_SIZE = PAGINATION.defaultPageSize;

const APPOINTMENTS_SELECT = `
  id,
  company_id,
  customer_id,
  property_id,
  job_id,
  assigned_to,
  title,
  description,
  status,
  start_time,
  end_time,
  archived_at,
  deleted_at,
  type,
  created_at,
  updated_at,
  customer:customers!appointments_customer_id_customers_id_fk (
    id,
    first_name,
    last_name,
    display_name
  ),
  assigned_user:users!appointments_assigned_to_users_id_fk (
    id,
    name,
    email
  )
`;

export type AppointmentListRecord =
	Database["public"]["Tables"]["appointments"]["Row"] & {
		customer?: Record<string, unknown> | Record<string, unknown>[] | null;
		assigned_user?: Record<string, unknown> | Record<string, unknown>[] | null;
	};

export type AppointmentsPageResult = {
	appointments: AppointmentListRecord[];
	totalCount: number;
};

export async function getAppointmentsPageData(
	page: number,
	pageSize: number = APPOINTMENTS_PAGE_SIZE,
	searchQuery = "",
	companyIdOverride?: string,
): Promise<AppointmentsPageResult> {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { appointments: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	let query = supabase
		.from("appointments")
		.select(APPOINTMENTS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.eq("type", "appointment")
		.is("deleted_at", null)
		.order("start_time", { ascending: false })
		.range(start, end);

	const normalizedSearch = searchQuery.trim();
	if (normalizedSearch) {
		const sanitized = normalizedSearch.replace(/,/g, "\\,");
		const term = `%${sanitized}%`;
		query = query.or(
			`title.ilike.${term},description.ilike.${term},status.ilike.${term}`,
		);
	}

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`Failed to load appointments: ${error.message}`);
	}

	return {
		appointments: (data ?? []) as AppointmentListRecord[],
		totalCount: count ?? 0,
	};
}

/**
 * Get appointment statistics with request-level caching.
 * Uses React.cache() for deduplication when called multiple times per request.
 * Uses single-pass processing for efficiency.
 */
export const getAppointmentStats = cache(async (companyIdOverride?: string) => {
	// Note: cache() provides request-level deduplication - works fine with cookies()
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return null;
	}

	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	const { data, error } = await supabase
		.from("appointments")
		.select("status, archived_at, deleted_at")
		.eq("company_id", companyId)
		.eq("type", "appointment")
		.limit(50000); // Prevent unbounded query

	if (error) {
		throw new Error(`Failed to fetch appointment stats: ${error.message}`);
	}

	// Single-pass aggregation (6x faster than multiple filter passes)
	const stats = {
		total: 0,
		scheduled: 0,
		confirmed: 0,
		in_progress: 0,
		completed: 0,
		cancelled: 0,
	};

	for (const apt of data ?? []) {
		// Skip archived/deleted
		if (apt.archived_at || apt.deleted_at) continue;

		stats.total++;
		const status = (apt.status || "").toLowerCase();
		if (status === "scheduled") stats.scheduled++;
		else if (status === "confirmed") stats.confirmed++;
		else if (status === "in_progress") stats.in_progress++;
		else if (status === "completed") stats.completed++;
		else if (status === "cancelled") stats.cancelled++;
	}

	return stats;
});

/**
 * Get appointments with details using optimized RPC function
 * Uses single query with JOINs instead of LATERAL joins for better performance
 *
 * @param startTime - Start of time range (ISO string)
 * @param endTime - End of time range (ISO string)
 * @param limit - Max results (default: 50)
 * @returns Appointments with customer, job, and team assignment details
 */
const getAppointmentsWithDetailsRpc = cache(
	async (
		companyIdOverride?: string,
		startTime?: string,
		endTime?: string,
		limit: number = 50,
	) => {
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return [];
		}

		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not configured");
		}

		const { data, error } = await supabase.rpc(
			"get_appointments_with_details",
			{
				p_company_id: companyId,
				p_start_time: startTime || null,
				p_end_time: endTime || null,
				p_limit: limit,
			},
		);

		if (error) {
			console.error("Error fetching appointments via RPC:", error);
			return [];
		}

		return data || [];
	},
);

/**
 * Fetch complete appointment data including customer, property, job, assigned_user, and tags
 * Uses React.cache() for request-level deduplication
 */
const getAppointmentComplete = cache(
	async (appointmentId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not configured");
		}

		const { data, error } = await supabase.rpc("get_appointment_complete", {
			p_appointment_id: appointmentId,
			p_company_id: companyId,
		});

		if (error) {
			console.error("Error fetching appointment:", error);
			return null;
		}

		return data?.[0]?.appointment_data || null;
	},
);
