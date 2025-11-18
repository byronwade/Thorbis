/**
 * Call Logs Data - Async Server Component
 *
 * Displays call logs content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven call history.
 */

import {
	BarChart2,
	Download,
	Phone,
	Search,
	VoicemailIcon,
} from "lucide-react";
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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Phone className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Complete Call History</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							View all incoming, outgoing, and missed calls with timestamps,
							duration, and caller information
						</p>
					</div>

					{/* Call recordings */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<VoicemailIcon className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Call Recordings</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically record calls for quality assurance, training, and
							compliance purposes
						</p>
					</div>

					{/* Search & filter */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Search className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Advanced Search</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Find specific calls quickly with powerful search filters by date,
							customer, technician, or outcome
						</p>
					</div>

					{/* Call analytics */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart2 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Call Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze call volume, duration, peak times, and conversion rates to
							optimize your team
						</p>
					</div>

					{/* Export reports */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm md:col-span-2">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Download className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Export & Reports</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Export call logs and generate detailed reports for accounting,
							compliance, and business intelligence
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Never Miss a Detail</h3>
					<p className="text-muted-foreground mb-6">
						Track and analyze every customer conversation
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
