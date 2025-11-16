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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Total Items
        </h3>
        <p className="mt-2 font-bold text-2xl">{stats.totalItems}</p>
        <p className="mt-1 text-muted-foreground text-xs">
          Inventory items tracked
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">Low Stock</h3>
        <p className="mt-2 font-bold text-2xl text-yellow-600">
          {stats.lowStock}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Items need reordering
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Out of Stock
        </h3>
        <p className="mt-2 font-bold text-2xl text-red-600">
          {stats.outOfStock}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">Items unavailable</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Total Value
        </h3>
        <p className="mt-2 font-bold text-2xl">
          ${stats.totalValue.toLocaleString()}
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Inventory asset value
        </p>
      </div>
    </div>
  );
}
