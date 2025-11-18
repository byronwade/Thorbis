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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Revenue per Technician</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track revenue generation, job value averages, and upsell
							performance
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Star className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Customer Satisfaction</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor customer ratings, reviews, and feedback for each
							technician
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart3 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Productivity Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze jobs completed, time efficiency, and first-time-fix rates
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Team Comparisons</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Compare performance across team members to identify top performers
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Optimize Team Performance
					</h3>
					<p className="text-muted-foreground mb-6">
						Data-driven insights to improve technician productivity
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
