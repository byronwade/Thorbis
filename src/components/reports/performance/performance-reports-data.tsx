/**
 * Performance Reports Data - Async Server Component
 *
 * Displays performance reports content (Coming Soon variant).
 */

import { Award, Target, TrendingUp, Zap } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function PerformanceReportsData() {
	return (
		<ComingSoonShell
			description="Track KPIs, monitor team performance, and measure progress toward business goals"
			icon={TrendingUp}
			title="Performance Reports"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Target className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">KPI Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor key performance indicators and measure progress toward strategic goals
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Award className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Team Performance</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Evaluate technician performance, identify top performers, and areas for improvement
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Growth Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track revenue growth, customer acquisition, and market share expansion
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Zap className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Efficiency Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Measure operational efficiency, resource utilization, and productivity trends
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Measure What Matters</h3>
					<p className="text-muted-foreground mb-6">
						Data-driven insights to achieve your business goals
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
