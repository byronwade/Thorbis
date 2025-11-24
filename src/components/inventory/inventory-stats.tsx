/**
 * Inventory Stats - Fast Server Component
 *
 * Fetches and displays inventory summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function InventoryStats() {
	const _supabase = await createClient();
	const _companyId = await getActiveCompanyId();

	// Future: Fetch real inventory statistics
	// const { data: stats } = await supabase
	//   .from("inventory_items")
	//   .select("*")
	//   .eq("company_id", companyId);

	// Placeholder stats for now
	const stats = {
		totalItems: 0,
		lowStock: 0,
		outOfStock: 0,
		totalValue: 0,
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
				<h3 className="text-muted-foreground text-xs md:text-sm font-medium">Low Stock</h3>
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
