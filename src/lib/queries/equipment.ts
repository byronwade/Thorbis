import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const EQUIPMENT_PAGE_SIZE = 50;

const EQUIPMENT_SELECT = `
  id,
  equipment_number,
  name,
  classification,
  type,
  manufacturer,
  model,
  serial_number,
  status,
  condition,
  install_date,
  last_service_date,
  next_service_due,
  location,
  archived_at,
  deleted_at,
  customer:customers!customer_id (
    display_name,
    first_name,
    last_name
  ),
  property:properties!property_id (
    address,
    city,
    state
  )
`;

export type EquipmentRecord = {
	id: string;
	equipment_number: string | null;
	name: string | null;
	classification: string | null;
	type: string | null;
	manufacturer: string | null;
	model: string | null;
	serial_number: string | null;
	status: string | null;
	condition: string | null;
	install_date: string | null;
	last_service_date: string | null;
	next_service_due: string | null;
	location: string | null;
	archived_at: string | null;
	deleted_at: string | null;
	customer?: Record<string, unknown> | Record<string, unknown>[] | null;
	property?: Record<string, unknown> | Record<string, unknown>[] | null;
};

export type EquipmentPageResult = {
	equipment: EquipmentRecord[];
	totalCount: number;
};

export async function getEquipmentPageData(
		page: number,
		pageSize: number = EQUIPMENT_PAGE_SIZE,
		companyIdOverride?: string,
	) : Promise<EquipmentPageResult> {
	"use cache";
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return { equipment: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		const { data, error, count } = await supabase
			.from("equipment")
			.select(EQUIPMENT_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.range(start, end);

		if (error) {
			throw new Error(`Failed to load equipment: ${error.message}`);
		}

		return {
			equipment: data ?? [],
			totalCount: count ?? 0,
		};
}
