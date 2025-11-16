"use cache";

/**
 * Call Logs Data - Async Server Component
 *
 * Displays call logs content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven call history.
 */

import { BarChart2, Download, Phone, Search, VoicemailIcon } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";


export async function CallLogsData() {
	// Future: Fetch call log statistics
	// const stats = await fetchCallLogStats();

	return (
		<ComingSoonShell
			description="Track every customer interaction with comprehensive call logging, recording, and analytics"
			icon={Phone}
			title="Call Logs & Analytics"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Call history */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Phone className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Complete Call History</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							View all incoming, outgoing, and missed calls with timestamps, duration, and caller information
						</p>
					</div>

					{/* Call recordings */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<VoicemailIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Call Recordings</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically record calls for quality assurance, training, and compliance purposes
						</p>
					</div>

					{/* Search & filter */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Search className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Advanced Search</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Find specific calls quickly with powerful search filters by date, customer, technician, or outcome
						</p>
					</div>

					{/* Call analytics */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart2 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Call Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze call volume, duration, peak times, and conversion rates to optimize your team
						</p>
					</div>

					{/* Export reports */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm md:col-span-2">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Download className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Export & Reports</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export call logs and generate detailed reports for accounting, compliance, and business intelligence
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Never Miss a Detail</h3>
					<p className="mb-6 text-muted-foreground">Track and analyze every customer conversation</p>
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
