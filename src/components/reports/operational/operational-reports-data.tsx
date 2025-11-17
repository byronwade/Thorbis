/**
 * Operational Reports Data - Async Server Component
 *
 * Displays operational reports content (Coming Soon variant).
 */

import { Clock, Settings, TrendingUp, Users } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function OperationalReportsData() {
	return (
		<ComingSoonShell
			description="Track operational efficiency, technician productivity, job completion rates, and resource utilization"
			icon={Settings}
			title="Operational Reports"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Technician Productivity</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor job completion rates, time efficiency, and revenue per technician
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Clock className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Schedule Efficiency</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze route optimization, appointment adherence, and technician utilization
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Job Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track completion times, callback rates, and first-time-fix percentages
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Settings className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Resource Utilization</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Optimize equipment usage, parts consumption, and workforce allocation
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Optimize Operations</h3>
					<p className="text-muted-foreground mb-6">Identify bottlenecks and improve efficiency</p>
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
