/**
 * Inventory Stats - Fast Server Component
 *
 * Fetches and displays inventory summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function InventoryStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	// Fetch real inventory statistics
	let totalItems = 0;
	let lowStock = 0;
	let outOfStock = 0;
	let totalValue = 0;

	if (companyId) {
		// Get inventory items with their price book data for value calculation
		const { data: inventoryData, error } = await supabase
			.from("inventory")
			.select(
				`
				id,
				quantity_on_hand,
				quantity_reserved,
				reorder_point,
				cost_per_unit,
				price_book_items!inner(company_id)
			`,
			)
			.eq("price_book_items.company_id", companyId)
			.is("deleted_at", null);

		if (!error && inventoryData) {
			totalItems = inventoryData.length;

			for (const item of inventoryData) {
				const available =
					(item.quantity_on_hand || 0) - (item.quantity_reserved || 0);

				// Out of stock: no available inventory
				if (available <= 0) {
					outOfStock++;
				}
				// Low stock: available is at or below reorder point
				else if (available <= (item.reorder_point || 0)) {
					lowStock++;
				}

				// Calculate value (cost_per_unit is in cents)
				totalValue += (item.cost_per_unit || 0) * (item.quantity_on_hand || 0);
			}

			// Convert cents to dollars
			totalValue = Math.round(totalValue / 100);
		}
	}

	const stats = {
		totalItems,
		lowStock,
		outOfStock,
		totalValue,
	};

	return (
		<div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
			<div className="bg-card rounded-lg border p-4 md:p-6">
				<h3 className="text-muted-foreground text-xs md:text-sm font-medium">
					Total Items
				</h3>
				<p className="mt-2 text-xl md:text-2xl font-bold">{stats.totalItems}</p>
				<p className="text-muted-foreground mt-1 text-xs">
					Inventory items tracked
				</p>
			</div>

			<div className="bg-card rounded-lg border p-4 md:p-6">
				<h3 className="text-muted-foreground text-xs md:text-sm font-medium">
					Low Stock
				</h3>
				<p className="mt-2 text-xl md:text-2xl font-bold text-yellow-600">
					{stats.lowStock}
				</p>
				<p className="text-muted-foreground mt-1 text-xs">
					Items need reordering
				</p>
			</div>

			<div className="bg-card rounded-lg border p-4 md:p-6">
				<h3 className="text-muted-foreground text-xs md:text-sm font-medium">
					Out of Stock
				</h3>
				<p className="mt-2 text-xl md:text-2xl font-bold text-red-600">
					{stats.outOfStock}
				</p>
				<p className="text-muted-foreground mt-1 text-xs">Items unavailable</p>
			</div>

			<div className="bg-card rounded-lg border p-4 md:p-6">
				<h3 className="text-muted-foreground text-xs md:text-sm font-medium">
					Total Value
				</h3>
				<p className="mt-2 text-xl md:text-2xl font-bold">
					${stats.totalValue.toLocaleString()}
				</p>
				<p className="text-muted-foreground mt-1 text-xs">
					Inventory asset value
				</p>
			</div>
		</div>
	);
}
