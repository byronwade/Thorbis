/**
 * Marketing Analytics Data - Async Server Component
 *
 * Displays marketing analytics content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven analytics.
 */

import { BarChart3, DollarSign, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function MarketingAnalyticsData() {
	// Future: Fetch marketing analytics data
	// const analytics = await fetchMarketingAnalytics();

	return (
		<ComingSoonShell
			description="Track marketing performance, measure ROI, and optimize your campaigns with data-driven insights"
			icon={BarChart3}
			title="Marketing Analytics"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* ROI tracking */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">ROI Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Measure return on investment for every marketing channel and campaign to maximize
							profitability
						</p>
					</div>

					{/* Conversion analytics */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MousePointerClick className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Conversion Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track lead-to-customer conversion rates and identify bottlenecks in your sales funnel
						</p>
					</div>

					{/* Customer acquisition */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Customer Acquisition</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze customer acquisition costs (CAC) and lifetime value (LTV) by marketing channel
						</p>
					</div>

					{/* Performance trends */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Performance Trends</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Identify trends and patterns in your marketing data to forecast future performance
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Data-Driven Marketing</h3>
					<p className="text-muted-foreground mb-6">
						Make informed decisions with comprehensive marketing analytics
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
