import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const ESTIMATES_PAGE_SIZE = 50;

const ESTIMATE_SELECT = `
  id,
  estimate_number,
  title,
  status,
  total_amount,
  created_at,
  valid_until,
  archived_at,
  deleted_at,
  customers:customers!customer_id (
    display_name,
    first_name,
    last_name
  )
`;

export type EstimateListRecord = {
	id: string;
	estimate_number: string | null;
	title: string | null;
	status: string | null;
	total_amount: number | null;
	created_at: string;
	valid_until: string | null;
	archived_at: string | null;
	deleted_at: string | null;
	customers?:
		| {
				first_name?: string | null;
				last_name?: string | null;
				display_name?: string | null;
		  }
		| {
				first_name?: string | null;
				last_name?: string | null;
				display_name?: string | null;
		  }[]
		| null;
};

export type EstimatesPageResult = {
	estimates: EstimateListRecord[];
	totalCount: number;
};

export async function getEstimatesPageData(
		page: number,
		pageSize: number = ESTIMATES_PAGE_SIZE,
	) : Promise<EstimatesPageResult> {
	"use cache";
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { estimates: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		const { data, error, count } = await supabase
			.from("estimates")
			.select(ESTIMATE_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.range(start, end);

		if (error) {
			throw new Error(`Failed to load estimates: ${error.message}`);
		}

		return {
			estimates: data ?? [],
			totalCount: count ?? 0,
		};
}
