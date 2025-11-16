/**
 * Pricebook Stats - Fast Server Component
 *
 * Fetches and displays pricebook summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export async function PricebookStats() {
  const supabase = await createClient();
  const companyId = await getActiveCompanyId();

  // Future: Fetch real pricebook statistics
  // const { data: stats } = await supabase
  //   .from("price_book_items")
  //   .select("*")
  //   .eq("company_id", companyId);

  // Placeholder stats for now
  const stats = {
    totalServices: 0,
    partsCatalog: 0,
    laborRates: 0,
    servicePackages: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-sm text-muted-foreground">Total Services</h3>
        <p className="mt-2 font-bold text-2xl">{stats.totalServices}</p>
        <p className="mt-1 text-muted-foreground text-xs">Service offerings</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-sm text-muted-foreground">Parts Catalog</h3>
        <p className="mt-2 font-bold text-2xl">{stats.partsCatalog}</p>
        <p className="mt-1 text-muted-foreground text-xs">Parts available</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-sm text-muted-foreground">Labor Rates</h3>
        <p className="mt-2 font-bold text-2xl">{stats.laborRates}</p>
        <p className="mt-1 text-muted-foreground text-xs">Rate tiers</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-sm text-muted-foreground">Service Packages</h3>
        <p className="mt-2 font-bold text-2xl">{stats.servicePackages}</p>
        <p className="mt-1 text-muted-foreground text-xs">Package deals</p>
      </div>
    </div>
  );
}
