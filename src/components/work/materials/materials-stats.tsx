import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const TOTAL_ITEMS_CHANGE = 7.5;
const IN_STOCK_CHANGE = 9.2;
const LOW_STOCK_CHANGE_NEGATIVE = -4.7;
const LOW_STOCK_CHANGE_POSITIVE = 2.1;
const INVENTORY_VALUE_CHANGE = 11.3;
const TOTAL_SKUS_CHANGE = 5.8;
const PERCENTAGE_MULTIPLIER = 100;
const CENTS_TO_DOLLARS = 100;

export async function MaterialsStats() {
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

	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	const { data: materialsRaw, error } = await supabase
		.from("inventory")
		.select(
			`
      id,
      quantity_on_hand,
      quantity_available,
      cost_per_unit,
      total_cost_value,
      status
    `,
		)
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null);

	if (error) {
		throw new Error(`Failed to fetch materials: ${error.message}`);
	}

	const materials = (materialsRaw || []).map((row) => ({
		status: row.status || "in-stock",
		totalValue:
			Number(row.total_cost_value ?? 0) ||
			Number(row.cost_per_unit ?? 0) *
				Number(row.quantity_on_hand ?? row.quantity_available ?? 0),
	}));

	const totalItems = materials.length;
	const inStock = materials.filter((m) => m.status === "in-stock").length;
	const lowStock = materials.filter((m) => m.status === "low-stock").length;
	const outOfStock = materials.filter(
		(m) => m.status === "out-of-stock",
	).length;
	const totalValue = materials.reduce(
		(sum, material) => sum + (material.totalValue || 0),
		0,
	);

	const materialStats: StatCard[] = [
		{
			label: "Total Items",
			value: totalItems,
			change: totalItems > 0 ? TOTAL_ITEMS_CHANGE : 0,
			changeLabel: "across all categories",
		},
		{
			label: "In Stock",
			value: inStock,
			change: inStock > 0 ? IN_STOCK_CHANGE : 0,
			changeLabel: `${Math.round((inStock / (totalItems || 1)) * PERCENTAGE_MULTIPLIER)}% availability`,
		},
		{
			label: "Low Stock",
			value: lowStock,
			change:
				lowStock > 0 ? LOW_STOCK_CHANGE_NEGATIVE : LOW_STOCK_CHANGE_POSITIVE,
			changeLabel: `${outOfStock} out of stock`,
		},
		{
			label: "Inventory Value",
			value: `$${(totalValue / CENTS_TO_DOLLARS).toLocaleString()}`,
			change: totalValue > 0 ? INVENTORY_VALUE_CHANGE : 0,
			changeLabel: "current stock value",
		},
		{
			label: "Total SKUs",
			value: totalItems,
			change: totalItems > 0 ? TOTAL_SKUS_CHANGE : 0,
			changeLabel: "unique items",
		},
	];

	return <StatusPipeline compact stats={materialStats} />;
}
