/**
 * Inventory Analytics Data - Async Server Component
 *
 * Displays inventory analytics content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven analytics.
 */

import { BarChart3, DollarSign, Package, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function InventoryAnalyticsData() {
	// Future: Fetch inventory analytics
	// const analytics = await fetchInventoryAnalytics();

	return (
		<ComingSoonShell
			description="Optimize your inventory with data-driven insights on turnover, profitability, and stock performance"
			icon={BarChart3}
			title="Inventory Analytics"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Turnover analysis */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Turnover Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track inventory turnover rates to identify fast and slow-moving
							items
						</p>
					</div>

					{/* Profitability insights */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Profitability Insights</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze profit margins by category, vendor, and individual parts
							to maximize revenue
						</p>
					</div>

					{/* Stock optimization */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Stock Optimization</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Get recommendations for optimal stock levels based on historical
							usage and seasonal trends
						</p>
					</div>

					{/* Cost analysis */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Cost Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor carrying costs, shrinkage, and waste to reduce inventory
							expenses
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">
						Make Smarter Inventory Decisions
					</h3>
					<p className="mb-6 text-muted-foreground">
						Use data to optimize stock levels and maximize profitability
					</p>
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
