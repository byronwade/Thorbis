/**
 * Inventory Data - Async Server Component
 *
 * Displays inventory dashboard content.
 * This component is wrapped in Suspense for PPR pattern.
 */

import { AlertTriangle, BarChart3, Package, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function InventoryData() {
	// Future: Fetch inventory items
	// const items = await fetchInventoryItems();

	return (
		<ComingSoonShell
			description="Track parts, equipment, and materials with real-time stock levels and automated reordering"
			icon={Package}
			title="Inventory Management"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-6 md:space-y-8 p-4 md:p-0">
				{/* Features grid */}
				<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
					{/* Stock tracking */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-4 md:p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-10 md:size-12 items-center justify-center rounded-lg">
							<Package className="text-primary size-5 md:size-6" />
						</div>
						<h3 className="text-base md:text-lg font-semibold">
							Real-Time Stock Tracking
						</h3>
						<p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
							Monitor inventory levels in real-time with automatic updates from
							job completions and purchases
						</p>
					</div>

					{/* Low stock alerts */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-4 md:p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-10 md:size-12 items-center justify-center rounded-lg">
							<AlertTriangle className="text-primary size-5 md:size-6" />
						</div>
						<h3 className="text-base md:text-lg font-semibold">
							Low Stock Alerts
						</h3>
						<p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
							Get notified when items fall below minimum stock levels and
							automate reordering
						</p>
					</div>

					{/* Analytics */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-4 md:p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-10 md:size-12 items-center justify-center rounded-lg">
							<BarChart3 className="text-primary size-5 md:size-6" />
						</div>
						<h3 className="text-base md:text-lg font-semibold">
							Usage Analytics
						</h3>
						<p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
							Analyze inventory turnover, identify slow-moving items, and
							optimize stock levels
						</p>
					</div>

					{/* Cost tracking */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-4 md:p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-10 md:size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-5 md:size-6" />
						</div>
						<h3 className="text-base md:text-lg font-semibold">
							Cost Tracking
						</h3>
						<p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
							Track purchase costs, calculate profit margins, and manage
							inventory valuation
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-6 md:p-8 text-center">
					<h3 className="mb-3 text-lg md:text-xl font-semibold">
						Optimize Your Inventory
					</h3>
					<p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
						Never run out of parts and reduce carrying costs
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
						<button
							className="border-primary/20 bg-background hover:bg-primary/5 rounded-lg border px-6 py-2.5 md:py-2 font-medium transition-colors h-10 md:h-auto"
							type="button"
						>
							Learn More
						</button>
						<button
							className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 md:py-2 font-medium transition-colors h-10 md:h-auto"
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
