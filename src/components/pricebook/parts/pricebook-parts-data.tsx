/**
 * Pricebook Parts Data - Async Server Component
 *
 * Displays parts pricing content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { BarChart, DollarSign, Package2, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function PricebookPartsData() {
	return (
		<ComingSoonShell
			description="Manage comprehensive parts pricing with vendor costs, markups, and profit margin tracking"
			icon={Package2}
			title="Parts & Materials Pricing"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Package2 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Comprehensive parts database with SKUs, vendor pricing, and
							customer rates
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Markup Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set automatic markups by category, vendor, or individual parts for
							consistent profitability
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Profit Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track profit margins, identify top performers, and optimize
							pricing strategies
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Price Updates</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically update pricing when vendor costs change and maintain
							margin targets
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Optimize Your Parts Pricing
					</h3>
					<p className="text-muted-foreground mb-6">
						Maximize margins while staying competitive
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
