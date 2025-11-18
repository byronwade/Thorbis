/**
 * SMS Campaigns Data - Async Server Component
 *
 * Displays SMS campaigns content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven SMS campaign management.
 */

import { Bell, Calendar, MessageSquare, Target, Zap } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function SmsCampaignsData() {
	// Future: Fetch SMS campaign statistics
	// const stats = await fetchSmsCampaignStats();

	return (
		<ComingSoonShell
			description="Reach customers instantly with targeted SMS marketing campaigns and automated messaging"
			icon={MessageSquare}
			title="SMS Campaigns"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Bulk SMS */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Zap className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Bulk SMS Messaging</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send promotional offers, announcements, and updates to thousands
							of customers instantly
						</p>
					</div>

					{/* Automated campaigns */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Calendar className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Automated Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Schedule messages in advance and set up automated drip campaigns
							to nurture leads
						</p>
					</div>

					{/* Appointment reminders */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Bell className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Appointment Reminders</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Reduce no-shows with automatic appointment reminders and
							confirmation requests
						</p>
					</div>

					{/* Targeted messaging */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Target className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Targeted Segments</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send personalized messages to specific customer segments based on
							location, service history, and preferences
						</p>
					</div>
				</div>

				{/* Stats preview */}
				<div className="grid gap-4 md:grid-cols-3">
					<div className="border-primary/10 bg-card/50 rounded-lg border p-6 text-center backdrop-blur-sm">
						<div className="text-primary mb-2 text-3xl font-bold">98%</div>
						<div className="text-muted-foreground text-sm">Open Rate</div>
					</div>
					<div className="border-primary/10 bg-card/50 rounded-lg border p-6 text-center backdrop-blur-sm">
						<div className="text-primary mb-2 text-3xl font-bold">90s</div>
						<div className="text-muted-foreground text-sm">
							Avg. Response Time
						</div>
					</div>
					<div className="border-primary/10 bg-card/50 rounded-lg border p-6 text-center backdrop-blur-sm">
						<div className="text-primary mb-2 text-3xl font-bold">5x</div>
						<div className="text-muted-foreground text-sm">ROI vs Email</div>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Start Texting Your Customers
					</h3>
					<p className="text-muted-foreground mb-6">
						Drive more bookings and revenue with SMS marketing
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
