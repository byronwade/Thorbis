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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Turnover Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track inventory turnover rates to identify fast and slow-moving items
						</p>
					</div>

					{/* Profitability insights */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Profitability Insights</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze profit margins by category, vendor, and individual parts to maximize revenue
						</p>
					</div>

					{/* Stock optimization */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Package className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Stock Optimization</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Get recommendations for optimal stock levels based on historical usage and seasonal
							trends
						</p>
					</div>

					{/* Cost analysis */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart3 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Cost Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor carrying costs, shrinkage, and waste to reduce inventory expenses
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Make Smarter Inventory Decisions</h3>
					<p className="text-muted-foreground mb-6">
						Use data to optimize stock levels and maximize profitability
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
