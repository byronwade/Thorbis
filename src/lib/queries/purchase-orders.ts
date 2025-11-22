import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

export const PURCHASE_ORDERS_PAGE_SIZE = 50;

const PURCHASE_ORDERS_SELECT = `
  id,
  company_id,
  po_number,
  vendor,
  title,
  status,
  priority,
  total_amount,
  created_at,
  expected_delivery,
  auto_generated,
  archived_at,
  job_id
`;

export type PurchaseOrderRecord =
	Database["public"]["Tables"]["purchase_orders"]["Row"];

export type PurchaseOrdersPageResult = {
	purchaseOrders: PurchaseOrderRecord[];
	totalCount: number;
};

export async function getPurchaseOrdersPageData(
	page: number,
	pageSize: number = PURCHASE_ORDERS_PAGE_SIZE,
	companyIdOverride?: string,
): Promise<PurchaseOrdersPageResult> {
	// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
	// which uses cookies(). The query is already fast enough without page-level caching.
	const companyId = companyIdOverride ?? (await getActiveCompanyId());
	if (!companyId) {
		return { purchaseOrders: [], totalCount: 0 };
	}

	const supabase = await createServiceSupabaseClient();
	const start = (Math.max(page, 1) - 1) * pageSize;
	const end = start + pageSize - 1;

	const { data, error, count } = await supabase
		.from("purchase_orders")
		.select(PURCHASE_ORDERS_SELECT, { count: "exact" })
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.range(start, end);

	if (error) {
		throw new Error(`Failed to fetch purchase orders: ${error.message}`);
	}

	return {
		purchaseOrders: (data ?? []) as PurchaseOrderRecord[],
		totalCount: count ?? 0,
	};
}

/**
 * Fetch complete purchase order data including vendor, job, and tags
 * Uses React.cache() for request-level deduplication
 */
const getPurchaseOrderComplete = cache(
	async (purchaseOrderId: string, companyId: string) => {
		const supabase = await createServiceSupabaseClient();

		const { data, error } = await supabase.rpc("get_purchase_order_complete", {
			p_purchase_order_id: purchaseOrderId,
			p_company_id: companyId,
		});

		if (error) {
			console.error("Error fetching purchase order:", error);
			return null;
		}

		return data?.[0]?.purchase_order_data || null;
	},
);
