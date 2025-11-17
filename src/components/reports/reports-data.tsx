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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<FileText className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Custom Reports</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Build custom reports with drag-and-drop interface to analyze exactly what matters to
							you
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Calendar className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Scheduled Delivery</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically generate and email reports daily, weekly, or monthly to stakeholders
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart3 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Interactive Dashboards</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Visualize data with charts, graphs, and metrics that update in real-time
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Download className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Export Options</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export reports to PDF, Excel, CSV, or integrate with accounting software
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Make Better Decisions</h3>
					<p className="text-muted-foreground mb-6">Turn data into actionable insights</p>
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
