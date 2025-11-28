import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { PAGINATION } from "@stratos/shared/constants";
import type { Database } from "@/types/supabase";

export const CONTRACTS_PAGE_SIZE = PAGINATION.defaultPageSize;

const CONTRACTS_SELECT = `
  id,
  company_id,
  contract_number,
  title,
  status,
  contract_type,
  signer_name,
  signer_email,
  signer_company,
  signer_title,
  archived_at,
  deleted_at,
  created_at,
  updated_at,
  valid_from,
  valid_until,
  sent_at,
  signed_at,
  viewed_at,
  invoice:invoices!contracts_invoice_id_invoices_id_fk (
    id,
    invoice_number,
    customer:customers!invoices_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  ),
  estimate:estimates!contracts_estimate_id_estimates_id_fk (
    id,
    estimate_number,
    customer:customers!estimates_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  ),
  job:jobs!contracts_job_id_jobs_id_fk (
    id,
    job_number,
    title,
    customer:customers!jobs_customer_id_customers_id_fk (
      id,
      display_name,
      first_name,
      last_name,
      company_name,
      email
    )
  )
`;

type CustomerFields = {
	id: string;
	display_name: string | null;
	first_name: string | null;
	last_name: string | null;
	company_name: string | null;
	email: string | null;
};

type InvoiceRelation = {
	id: string;
	invoice_number: string;
	customer?: CustomerFields[] | CustomerFields | null;
} | null;

type EstimateRelation = {
	id: string;
	estimate_number: string;
	customer?: CustomerFields[] | CustomerFields | null;
} | null;

type JobRelation = {
	id: string;
	job_number: string | null;
	title: string | null;
	customer?: CustomerFields[] | CustomerFields | null;
} | null;

export type ContractQueryResult =
	Database["public"]["Tables"]["contracts"]["Row"] & {
		invoice: InvoiceRelation;
		estimate: EstimateRelation;
		job: JobRelation;
	};

export type ContractsPageResult = {
	contracts: ContractQueryResult[];
	totalCount: number;
};

export async function getContractsPageData(
	page: number,
	pageSize: number = CONTRACTS_PAGE_SIZE,
	companyIdOverride?: string,
): Promise<ContractsPageResult> {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { contracts: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("contracts")
		.select(CONTRACTS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to fetch contracts: ${error.message}`);
	}

	return {
		contracts: (data ?? []) as ContractQueryResult[],
		totalCount: count ?? 0,
	};
}

type ContractStatusRow = Pick<
	Database["public"]["Tables"]["contracts"]["Row"],
	"status" | "archived_at" | "deleted_at"
>;

export const getContractsStatusSummary = cache(
	async (companyIdOverride?: string): Promise<ContractStatusRow[]> => {
		// Note: cache() provides request-level deduplication - works fine with cookies()
		// "use cache" directive would NOT work here due to cookies() usage
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return [];
		}

		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not configured");
		}
		const { data, error } = await supabase
			.from("contracts")
			.select("status, archived_at, deleted_at")
			.eq("company_id", companyId);

		if (error) {
			throw new Error(`Failed to fetch contract stats: ${error.message}`);
		}

		return (data ?? []) as ContractStatusRow[];
	},
);

/**
 * Fetch complete contract data including related entities and tags
 * Uses React.cache() for request-level deduplication
 */
export const getContractComplete = cache(
	async (contractId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not configured");
		}

		const { data, error } = await supabase.rpc("get_contract_complete", {
			p_contract_id: contractId,
			p_company_id: companyId,
		});

		if (error) {
			console.error("Error fetching contract:", error);
			return null;
		}

		return data?.[0]?.contract_data || null;
	},
);
