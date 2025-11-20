import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

export const APPOINTMENTS_PAGE_SIZE = 50;

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

export async function getAppointmentStats(companyIdOverride?: string) {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return null;
	}

	const supabase = await createServiceSupabaseClient();
	const { data, error } = await supabase
		.from("appointments")
		.select("status, archived_at, deleted_at")
		.eq("company_id", companyId)
		.eq("type", "appointment");

	if (error) {
		throw new Error(`Failed to fetch appointment stats: ${error.message}`);
	}

	const appointments = (data ?? []) as Pick<
		Database["public"]["Tables"]["appointments"]["Row"],
		"status" | "archived_at" | "deleted_at"
	>[];
	const active = appointments.filter(
		(apt) => !(apt.archived_at || apt.deleted_at),
	);

	const countByStatus = (status: string) =>
		active.filter((apt) => (apt.status || "").toLowerCase() === status).length;

	return {
		total: active.length,
		scheduled: countByStatus("scheduled"),
		confirmed: countByStatus("confirmed"),
		in_progress: countByStatus("in_progress"),
		completed: countByStatus("completed"),
		cancelled: countByStatus("cancelled"),
	};
}

/**
 * Fetch complete appointment data including customer, property, job, assigned_user, and tags
 * Uses React.cache() for request-level deduplication
 */
export const getAppointmentComplete = cache(
	async (appointmentId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();

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
