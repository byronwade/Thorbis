/**
 * Pricebook Stats - Fast Server Component
 *
 * Fetches and displays pricebook summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function PricebookStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	let totalServices = 0;
	let partsCatalog = 0;
	let laborRates = 0;
	let servicePackages = 0;

	if (companyId) {
		// Fetch price book items by type
		const { data: priceBookItems, error } = await supabase
			.from("price_book_items")
			.select("id, item_type")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (!error && priceBookItems) {
			for (const item of priceBookItems) {
				switch (item.item_type) {
					case "service":
						totalServices++;
						break;
					case "part":
					case "material":
						partsCatalog++;
						break;
					case "labor":
						laborRates++;
						break;
					case "package":
					case "bundle":
						servicePackages++;
						break;
				}
			}
		}
	}

	const stats = {
		totalServices,
		partsCatalog,
		laborRates,
		servicePackages,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Total Services
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.totalServices}</p>
				<p className="text-muted-foreground mt-1 text-xs">Service offerings</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Parts Catalog
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.partsCatalog}</p>
				<p className="text-muted-foreground mt-1 text-xs">Parts available</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Labor Rates
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.laborRates}</p>
				<p className="text-muted-foreground mt-1 text-xs">Rate tiers</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Service Packages
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.servicePackages}</p>
				<p className="text-muted-foreground mt-1 text-xs">Package deals</p>
			</div>
		</div>
	);
}
