/**
 * Pricebook Data - Async Server Component
 *
 * Displays pricebook dashboard content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { Book, DollarSign, Package, Settings } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function PricebookData() {
	// Future: Fetch pricebook items and pricing data
	// const items = await fetchPricebookItems();

	return (
		<ComingSoonShell
			description="Manage your complete pricing catalog with services, parts, labor rates, and custom packages"
			icon={Book}
			title="Price Book Management"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Service pricing */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Service Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Define pricing for all your services with tier-based rates and
							custom packages
						</p>
					</div>

					{/* Parts catalog */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Package className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Manage parts inventory with costs, markups, and vendor pricing
						</p>
					</div>

					{/* Labor rates */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Settings className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Labor Rates</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set hourly rates, overtime pricing, and emergency service premiums
						</p>
					</div>

					{/* Dynamic pricing */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Book className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Dynamic Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Adjust pricing based on location, time, customer type, and demand
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Maximize Your Profitability
					</h3>
					<p className="text-muted-foreground mb-6">
						Smart pricing strategies for every job
					</p>
					<div className="flex justify-center gap-4">
						<button
							className="border-primary/20 bg-background hover:bg-primary/5 rounded-lg border px-6 py-2 font-medium transition-colors"
							type="button"
						>
							Learn More
						</button>
						<button
							className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors"
							type="button"
						>
							Request Access
						</button>
					</div>
				</div>
			</div>
		</ComingSoonShell>
	);
}
