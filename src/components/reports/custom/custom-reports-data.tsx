/**
 * Custom Reports Data - Async Server Component
 *
 * Displays custom reports content (Coming Soon variant).
 */

import { Download, Filter, LayoutDashboard, Share2 } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function CustomReportsData() {
	return (
		<ComingSoonShell
			description="Build custom reports with drag-and-drop interface to analyze exactly what matters to your business"
			icon={LayoutDashboard}
			title="Custom Reports"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<LayoutDashboard className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Drag & Drop Builder</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Create custom reports with an intuitive drag-and-drop interface -
							no technical skills required
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Filter className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Advanced Filtering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Filter data by date range, customer, technician, service type, and
							more
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Download className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Multiple Formats</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export to PDF, Excel, CSV, or share interactive dashboards with
							your team
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Share2 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Report Sharing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Share reports with team members, clients, or external stakeholders
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Your Data, Your Way</h3>
					<p className="text-muted-foreground mb-6">
						Build reports tailored to your specific needs
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
