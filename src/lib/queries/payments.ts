import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const PAYMENTS_PAGE_SIZE = 50;

const PAYMENT_SELECT = `
  id,
  company_id,
  payment_number,
  amount,
  payment_method,
  status,
  processed_at,
  created_at,
  updated_at,
  archived_at,
  deleted_at,
  invoice_id,
  job_id,
  customer_id,
  customers:customers!customer_id (
    display_name,
    first_name,
    last_name
  )
`;

export type PaymentListRecord = {
	id: string;
	company_id: string;
	payment_number: string | null;
	amount: number | null;
	payment_method: string | null;
	status: string | null;
	processed_at: string | null;
	created_at: string;
	updated_at: string;
	archived_at: string | null;
	deleted_at: string | null;
	invoice_id: string | null;
	job_id: string | null;
	customer_id: string | null;
	customers?:
		| {
				display_name?: string | null;
				first_name?: string | null;
				last_name?: string | null;
		  }
		| {
				display_name?: string | null;
				first_name?: string | null;
				last_name?: string | null;
		  }[]
		| null;
};

export type PaymentsPageResult = {
	payments: PaymentListRecord[];
	totalCount: number;
};

export const getPaymentsPageData = cache(
	async (
		page: number,
		pageSize: number = PAYMENTS_PAGE_SIZE,
	): Promise<PaymentsPageResult> => {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { payments: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		const { data, error, count } = await supabase
			.from("payments")
			.select(PAYMENT_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.order("processed_at", { ascending: false, nullsFirst: false })
			.order("created_at", { ascending: false })
			.range(start, end);

		if (error) {
			throw new Error(`Failed to load payments: ${error.message}`);
		}

		return {
			payments: data ?? [],
			totalCount: count ?? 0,
		};
	},
);
