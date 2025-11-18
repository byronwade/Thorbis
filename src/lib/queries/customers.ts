import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const CUSTOMERS_PAGE_SIZE = 50;

const CUSTOMER_SELECT = `
  id,
  display_name,
  first_name,
  last_name,
  company_name,
  email,
  phone,
  address,
  city,
  state,
  zip_code,
  status,
  archived_at,
  deleted_at,
  last_job_date,
  total_revenue
`;

export type CustomerListRecord = {
	id: string;
	display_name: string | null;
	first_name: string | null;
	last_name: string | null;
	company_name: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zip_code: string | null;
	status: string | null;
	archived_at: string | null;
	deleted_at: string | null;
	last_job_date: string | null;
	total_revenue: number | null;
};

export type CustomersPageResult = {
	customers: CustomerListRecord[];
	totalCount: number;
};

/**
 * Fetch a single page of customers using the service role for maximum performance.
 * Server-side pagination keeps payloads to ~50 rows (10-20x smaller than previous implementation).
 */
export async function getCustomersPageData(
		page: number,
		pageSize: number = CUSTOMERS_PAGE_SIZE,
	) : Promise<CustomersPageResult> {
	"use cache";
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { customers: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		const { data, error, count } = await supabase
			.from("customers")
			.select(CUSTOMER_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("display_name", { ascending: true })
			.range(start, end);

		if (error) {
			throw new Error(`Failed to load customers: ${error.message}`);
		}

		return {
			customers: data ?? [],
			totalCount: count ?? 0,
		};
}

export type CustomerSummaryStats = {
	total: number;
	active: number;
	inactive: number;
	prospect: number;
	totalRevenueCents: number;
};

/**
 * Aggregated customer metrics used by dashboard stats cards.
 * Backed by a Postgres RPC (customer_dashboard_metrics) so the database does the heavy lifting.
 */
export async function getCustomerStats() : Promise<CustomerSummaryStats | null> {
	"use cache";
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return null;
		}

		const supabase = await createServiceSupabaseClient();
		const { data, error } = await supabase.rpc("customer_dashboard_metrics", {
			p_company_id: companyId,
		});

		if (error) {
			throw new Error(`Failed to load customer stats: ${error.message}`);
		}

		const metrics = data?.[0];
		const total = Number(metrics?.total_customers ?? 0);
		const active = Number(metrics?.active_customers ?? 0);
		const prospect = Number(metrics?.prospect_customers ?? 0);
		const totalRevenueCents = Number(metrics?.total_revenue_cents ?? 0);
		const inactive = Math.max(total - active - prospect, 0);

		return {
			total,
			active,
			inactive,
			prospect,
			totalRevenueCents,
		};
}
