import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

export const MAINTENANCE_PLANS_PAGE_SIZE = 50;

const MAINTENANCE_PLANS_SELECT = `
  id,
  company_id,
  plan_number,
  name,
  frequency,
  next_service_date,
  amount,
  status,
  customer:customers!maintenance_plans_customer_id_fkey (
    id,
    display_name,
    first_name,
    last_name
  )
`;

type CustomerRelation = {
	id: string;
	display_name: string | null;
	first_name: string | null;
	last_name: string | null;
} | null;

export type MaintenancePlanQueryResult =
	Database["public"]["Tables"]["maintenance_plans"]["Row"] & {
		customer: CustomerRelation | CustomerRelation[] | null;
	};

export type MaintenancePlansPageResult = {
	plans: MaintenancePlanQueryResult[];
	totalCount: number;
};

export async function getMaintenancePlansPageData(
	page: number,
	pageSize: number = MAINTENANCE_PLANS_PAGE_SIZE,
	companyIdOverride?: string,
): Promise<MaintenancePlansPageResult> {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { plans: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("maintenance_plans")
		.select(MAINTENANCE_PLANS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to fetch maintenance plans: ${error.message}`);
	}

	return {
		plans: (data ?? []) as MaintenancePlanQueryResult[],
		totalCount: count ?? 0,
	};
}

/**
 * Fetch complete maintenance plan data including customer, property, and tags
 * Uses React.cache() for request-level deduplication
 */
export const getMaintenancePlanComplete = cache(
	async (maintenancePlanId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();

		const { data, error } = await supabase.rpc(
			"get_maintenance_plan_complete",
			{
				p_maintenance_plan_id: maintenancePlanId,
				p_company_id: companyId,
			},
		);

		if (error) {
			console.error("Error fetching maintenance plan:", error);
			return null;
		}

		return data?.[0]?.maintenance_plan_data || null;
	},
);
