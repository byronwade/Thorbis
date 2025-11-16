/**
 * Inventory Data - Async Server Component
 *
 * Displays inventory dashboard content.
 * This component is wrapped in Suspense for PPR pattern.
 */

import { AlertTriangle, BarChart3, Package, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

"use cache";

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
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Stock tracking */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Real-Time Stock Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor inventory levels in real-time with automatic updates from job completions and purchases
						</p>
					</div>

					{/* Low stock alerts */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<AlertTriangle className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Low Stock Alerts</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Get notified when items fall below minimum stock levels and automate reordering
						</p>
					</div>

					{/* Analytics */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Usage Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze inventory turnover, identify slow-moving items, and optimize stock levels
						</p>
					</div>

					{/* Cost tracking */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Cost Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track purchase costs, calculate profit margins, and manage inventory valuation
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Optimize Your Inventory</h3>
					<p className="mb-6 text-muted-foreground">Never run out of parts and reduce carrying costs</p>
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
