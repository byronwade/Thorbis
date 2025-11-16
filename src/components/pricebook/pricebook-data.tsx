"use cache";

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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Service Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Define pricing for all your services with tier-based rates and custom packages
						</p>
					</div>

					{/* Parts catalog */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Manage parts inventory with costs, markups, and vendor pricing
						</p>
					</div>

					{/* Labor rates */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Settings className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Labor Rates</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set hourly rates, overtime pricing, and emergency service premiums
						</p>
					</div>

					{/* Dynamic pricing */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Book className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Dynamic Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Adjust pricing based on location, time, customer type, and demand
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Maximize Your Profitability</h3>
					<p className="mb-6 text-muted-foreground">Smart pricing strategies for every job</p>
					<div className="flex justify-center gap-4">
						<button
							className="rounded-lg border border-primary/20 bg-background px-6 py-2 font-medium transition-colors hover:bg-primary/5"
							type="button"
						>
							Learn More
						</button>
						<button
							className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
