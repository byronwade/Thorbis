import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const MATERIALS_PAGE_SIZE = 50;

const MATERIALS_SELECT = `
  id,
  price_book_item_id,
  quantity_on_hand,
  quantity_reserved,
  quantity_available,
  minimum_quantity,
  cost_per_unit,
  total_cost_value,
  updated_at,
  status,
  warehouse_location,
  primary_location,
  is_low_stock,
  low_stock_alert_sent,
  notes,
  deleted_at,
  price_book_item:price_book_items!inventory_price_book_item_id_price_book_items_id_fk (
    id,
    company_id,
    name,
    description,
    sku,
    category,
    subcategory,
    unit,
    is_active
  )
`;

export type MaterialRecord = {
	id: string;
	price_book_item_id: string | null;
	quantity_on_hand: number | null;
	quantity_reserved: number | null;
	quantity_available: number | null;
	minimum_quantity: number | null;
	cost_per_unit: number | null;
	total_cost_value: number | null;
	updated_at: string | null;
	status: string | null;
	warehouse_location: string | null;
	primary_location: string | null;
	is_low_stock: boolean | null;
	low_stock_alert_sent: boolean | null;
	notes: string | null;
	deleted_at: string | null;
	price_book_item?: Record<string, unknown> | Record<string, unknown>[] | null;
};

export type MaterialsPageResult = {
	materials: MaterialRecord[];
	totalCount: number;
};

export const getMaterialsPageData = cache(
	async (
		page: number,
		pageSize: number = MATERIALS_PAGE_SIZE,
		companyIdOverride?: string,
	): Promise<MaterialsPageResult> => {
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return { materials: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		const { data, error, count } = await supabase
			.from("inventory")
			.select(MATERIALS_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("updated_at", { ascending: false })
			.range(start, end);

		if (error) {
			throw new Error(`Failed to fetch materials: ${error.message}`);
		}

		return {
			materials: data ?? [],
			totalCount: count ?? 0,
		};
	},
);
