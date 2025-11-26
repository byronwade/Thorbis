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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Profit Margins</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track profit margins by service, part, and category to identify
							most profitable offerings
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Pricing Trends</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor pricing trends over time and identify opportunities for
							rate adjustments
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<PieChart className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Revenue Mix</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze revenue distribution across services, parts, and labor to
							optimize your offerings
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart3 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Competitive Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Compare your pricing to market rates and ensure competitive
							positioning
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Price with Confidence</h3>
					<p className="text-muted-foreground mb-6">
						Data-driven pricing strategies that maximize profitability
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
