/**
 * Material Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all material data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Material/Inventory data (with price book item)
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 4 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { MaterialPageContent } from "@/components/work/materials/material-page-content";
import { getActiveCompanyId, isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { generateMaterialStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type MaterialDetailDataProps = {
	materialId: string;
};

export async function MaterialDetailData({ materialId }: MaterialDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		redirect("/dashboard/welcome");
	}

	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// Fetch material with price book item
	const { data: inventoryRow, error: inventoryError } = await supabase
		.from("inventory")
		.select(
			`
      *,
      price_book_item:price_book_items!price_book_item_id(
        id,
        name,
        description,
        sku,
        unit,
        category,
        subcategory
      )
    `
		)
		.eq("id", materialId)
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null)
		.maybeSingle();

	if (inventoryError || !inventoryRow) {
		return notFound();
	}

	// Fetch all related data in parallel
	const [{ data: activities }, { data: notes }, { data: attachments }] = await Promise.all([
		supabase
			.from("activity_log")
			.select("*, user:users!user_id(*)")
			.eq("entity_type", "inventory")
			.eq("entity_id", materialId)
			.order("created_at", { ascending: false })
			.limit(50),
		supabase
			.from("notes")
			.select("*")
			.eq("entity_type", "inventory")
			.eq("entity_id", materialId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "inventory")
			.eq("entity_id", materialId)
			.order("created_at", { ascending: false }),
	]);

	const priceBookItem = Array.isArray(inventoryRow.price_book_item)
		? inventoryRow.price_book_item[0]
		: inventoryRow.price_book_item;

	const material = {
		id: inventoryRow.id,
		itemCode: priceBookItem?.sku || priceBookItem?.name || "Uncoded Item",
		description: priceBookItem?.description || priceBookItem?.name || "Unnamed Material",
		category: priceBookItem?.category
			? priceBookItem.category.charAt(0).toUpperCase() + priceBookItem.category.slice(1)
			: "Uncategorized",
		quantityOnHand: inventoryRow.quantity_on_hand ?? 0,
		quantityAvailable: inventoryRow.quantity_available ?? 0,
		quantityReserved: inventoryRow.quantity_reserved ?? 0,
		minimumQuantity: inventoryRow.minimum_quantity ?? 0,
		maximumQuantity: inventoryRow.maximum_quantity ?? 0,
		reorderPoint: inventoryRow.reorder_point ?? 0,
		reorderQuantity: inventoryRow.reorder_quantity ?? 0,
		unit: priceBookItem?.unit || "each",
		costPerUnit: inventoryRow.cost_per_unit ?? 0,
		totalCostValue: inventoryRow.total_cost_value ?? 0,
		lastPurchaseCost: inventoryRow.last_purchase_cost ?? 0,
		warehouseLocation: inventoryRow.warehouse_location || "",
		primaryLocation: inventoryRow.primary_location || "",
		status:
			(inventoryRow.status as
				| "in-stock"
				| "low-stock"
				| "out-of-stock"
				| "on-order"
				| "inactive") || "in-stock",
		isLowStock: inventoryRow.is_low_stock ?? false,
		notes: inventoryRow.notes || "",
		priceBookItem,
	};

	const materialData = {
		material,
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
	};

	const metrics = {
		quantityOnHand: material.quantityOnHand,
		quantityAvailable: material.quantityAvailable,
		quantityReserved: material.quantityReserved,
		status: material.status,
		totalValue: material.totalCostValue,
		isLowStock: material.isLowStock,
	};

	const stats = generateMaterialStats(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<MaterialPageContent entityData={materialData} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
