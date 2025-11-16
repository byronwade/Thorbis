"use cache";

/**
 * Technician Analytics Data - Async Server Component
 *
 * Displays technician analytics content (Coming Soon variant).
 */

import { BarChart3, Star, TrendingUp, Users } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function TechnicianAnalyticsData() {
	return (
		<ComingSoonShell
			description="Track performance metrics, revenue generation, customer satisfaction, and productivity trends"
			icon={BarChart3}
			title="Technician Analytics"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Revenue per Technician</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track revenue generation, job value averages, and upsell performance
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Star className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Customer Satisfaction</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor customer ratings, reviews, and feedback for each technician
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Productivity Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze jobs completed, time efficiency, and first-time-fix rates
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Team Comparisons</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Compare performance across team members to identify top performers
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Optimize Team Performance</h3>
					<p className="mb-6 text-muted-foreground">Data-driven insights to improve technician productivity</p>
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
