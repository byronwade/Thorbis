"use cache";

/**
 * Price Analytics Data - Async Server Component
 *
 * Displays price analytics content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { BarChart3, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function PriceAnalyticsData() {
	return (
		<ComingSoonShell
			description="Analyze pricing performance, track profitability, and optimize your rates with data-driven insights"
			icon={BarChart3}
			title="Price Analytics"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Profit Margins</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track profit margins by service, part, and category to identify most profitable offerings
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Pricing Trends</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor pricing trends over time and identify opportunities for rate adjustments
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<PieChart className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Revenue Mix</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze revenue distribution across services, parts, and labor to optimize your offerings
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Competitive Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Compare your pricing to market rates and ensure competitive positioning
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Price with Confidence</h3>
					<p className="mb-6 text-muted-foreground">Data-driven pricing strategies that maximize profitability</p>
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
