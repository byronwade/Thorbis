import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const INVOICES_PAGE_SIZE = 50;

const INVOICE_SELECT = `
  id,
  invoice_number,
  status,
  total_amount,
  paid_amount,
  balance_amount,
  created_at,
  due_date,
  archived_at,
  deleted_at,
  customers:customers!customer_id (
    display_name,
    first_name,
    last_name
  )
`;

export type InvoiceListRecord = {
	id: string;
	invoice_number: string | null;
	status: string | null;
	total_amount: number | null;
	paid_amount: number | null;
	balance_amount: number | null;
	created_at: string;
	due_date: string | null;
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

export type InvoicesPageResult = {
	invoices: InvoiceListRecord[];
	totalCount: number;
};

export async function getInvoicesPageData(
	page: number,
	pageSize: number = INVOICES_PAGE_SIZE,
): Promise<InvoicesPageResult> {
	"use cache";
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return { invoices: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("invoices")
		.select(INVOICE_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to load invoices: ${error.message}`);
	}

	return {
		invoices: data ?? [],
		totalCount: count ?? 0,
	};
}
