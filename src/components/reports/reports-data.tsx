/**
 * Reports Data - Async Server Component
 *
 * Displays business intelligence dashboard content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { BarChart3, Calendar, Download, FileText } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function ReportsData() {
	return (
		<ComingSoonShell
			description="Generate comprehensive reports, track KPIs, and gain actionable insights across your entire business"
			icon={BarChart3}
			title="Business Intelligence"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<FileText className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Custom Reports</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Build custom reports with drag-and-drop interface to analyze
							exactly what matters to you
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Scheduled Delivery</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically generate and email reports daily, weekly, or monthly
							to stakeholders
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart3 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Interactive Dashboards</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Visualize data with charts, graphs, and metrics that update in
							real-time
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Download className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Export Options</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export reports to PDF, Excel, CSV, or integrate with accounting
							software
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Make Better Decisions</h3>
					<p className="mb-6 text-muted-foreground">
						Turn data into actionable insights
					</p>
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
