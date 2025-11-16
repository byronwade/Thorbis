"use cache";

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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Package2 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Comprehensive parts database with SKUs, vendor pricing, and customer rates
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Markup Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set automatic markups by category, vendor, or individual parts for consistent profitability
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Profit Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track profit margins, identify top performers, and optimize pricing strategies
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Price Updates</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically update pricing when vendor costs change and maintain margin targets
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Optimize Your Parts Pricing</h3>
					<p className="mb-6 text-muted-foreground">Maximize margins while staying competitive</p>
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
