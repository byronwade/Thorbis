import { notFound } from "next/navigation";
import { MaterialsKanban } from "@/components/work/materials-kanban";
import {
	type Material,
	MaterialsTable,
} from "@/components/work/materials-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getMaterialsPageData,
	MATERIALS_PAGE_SIZE,
} from "@/lib/queries/materials";

type PriceBookItemRow = {
	id: string;
	company_id: string;
	name: string | null;
	description: string | null;
	sku: string | null;
	category: string | null;
	subcategory: string | null;
	unit: string | null;
	is_active: boolean | null;
};

type InventoryRow = {
	id: string;
	updated_at: string | null;
	quantity_on_hand: number | null;
	quantity_reserved: number | null;
	quantity_available: number | null;
	minimum_quantity: number | null;
	cost_per_unit: number | null;
	total_cost_value: number | null;
	status: string | null;
	warehouse_location: string | null;
	primary_location: string | null;
	is_low_stock: boolean | null;
	low_stock_alert_sent: boolean | null;
	notes: string | null;
	deleted_at: string | null;
	price_book_item: PriceBookItemRow | PriceBookItemRow[] | null;
};

export async function MaterialsData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { materials: materialsRaw, totalCount } = await getMaterialsPageData(
		currentPage,
		MATERIALS_PAGE_SIZE,
		activeCompanyId,
	);

	const inventoryRows = materialsRaw as InventoryRow[];

	const materials = inventoryRows.reduce<Material[]>((accumulator, row) => {
		const item = Array.isArray(row.price_book_item)
			? (row.price_book_item[0] ?? null)
			: row.price_book_item;

		if (!item) {
			return accumulator;
		}

		const quantityAvailable = Number(
			row.quantity_available ?? row.quantity_on_hand ?? 0,
		);
		const unitCost = Number(row.cost_per_unit ?? 0);
		const totalValue =
			Number(row.total_cost_value ?? 0) ||
			unitCost * Number(row.quantity_on_hand ?? quantityAvailable ?? 0);

		const isActive = item.is_active !== false;
		const archivedAt = isActive
			? null
			: (row.deleted_at ?? row.updated_at ?? null);

		const categoryLabel = [item.category, item.subcategory]
			.filter(Boolean)
			.join(" • ");

		const material: Material = {
			id: row.id,
			itemCode: item.sku || item.name || "Uncoded Item",
			description: item.description || item.name || "Unnamed Material",
			category: categoryLabel || "Uncategorized",
			quantity: quantityAvailable,
			unit: item.unit || "each",
			unitCost,
			totalValue,
			status: (row.status as Material["status"]) || "in-stock",
			archived_at: archivedAt,
			deleted_at: row.deleted_at ?? null,
		};

		accumulator.push(material);
		return accumulator;
	}, []);

	return (
		<WorkDataView
			kanban={<MaterialsKanban materials={materials} />}
			section="materials"
			table={
				<MaterialsTable
					currentPage={currentPage}
					itemsPerPage={MATERIALS_PAGE_SIZE}
					materials={materials}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
