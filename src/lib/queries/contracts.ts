import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

export const CONTRACTS_PAGE_SIZE = 50;

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
	"use cache";
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { contracts: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
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

export async function getContractsStatusSummary(
	companyIdOverride?: string,
): Promise<ContractStatusRow[]> {
	"use cache";
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return [];
	}

	const supabase = await createServiceSupabaseClient();
	const { data, error } = await supabase
		.from("contracts")
		.select("status, archived_at, deleted_at")
		.eq("company_id", companyId);

	if (error) {
		throw new Error(`Failed to fetch contract stats: ${error.message}`);
	}

	return (data ?? []) as ContractStatusRow[];
}
