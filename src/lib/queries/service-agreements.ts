import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

export const SERVICE_AGREEMENTS_PAGE_SIZE = 50;

const SERVICE_AGREEMENTS_SELECT = `
  id,
  company_id,
  agreement_number,
  plan_number,
  name,
  plan_type,
  type,
  start_date,
  end_date,
  status,
  value,
  archived_at,
  deleted_at,
  customer:customers!service_plans_customer_id_fkey (
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

export type ServiceAgreementRecord =
	Database["public"]["Tables"]["service_plans"]["Row"] & {
		customer: CustomerRelation | CustomerRelation[] | null;
	};

export type ServiceAgreementsPageResult = {
	agreements: ServiceAgreementRecord[];
	totalCount: number;
};

export async function getServiceAgreementsPageData(
	page: number,
	pageSize: number = SERVICE_AGREEMENTS_PAGE_SIZE,
	companyIdOverride?: string,
): Promise<ServiceAgreementsPageResult> {
	"use cache";
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { agreements: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("service_plans")
		.select(SERVICE_AGREEMENTS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.eq("type", "contract")
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to fetch service agreements: ${error.message}`);
	}

	return {
		agreements: (data ?? []) as ServiceAgreementRecord[],
		totalCount: count ?? 0,
	};
}
