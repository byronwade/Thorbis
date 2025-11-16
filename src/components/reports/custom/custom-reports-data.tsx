"use cache";
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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<LayoutDashboard className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Drag & Drop Builder</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Create custom reports with an intuitive drag-and-drop interface - no technical skills required
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Filter className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Advanced Filtering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Filter data by date range, customer, technician, service type, and more
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Download className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Multiple Formats</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export to PDF, Excel, CSV, or share interactive dashboards with your team
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Share2 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Report Sharing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Share reports with team members, clients, or external stakeholders
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Your Data, Your Way</h3>
					<p className="mb-6 text-muted-foreground">Build reports tailored to your specific needs</p>
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
