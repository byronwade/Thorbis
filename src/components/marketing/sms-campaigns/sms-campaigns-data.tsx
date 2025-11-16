"use cache";

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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Zap className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Bulk SMS Messaging</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send promotional offers, announcements, and updates to thousands of customers instantly
						</p>
					</div>

					{/* Automated campaigns */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Automated Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Schedule messages in advance and set up automated drip campaigns to nurture leads
						</p>
					</div>

					{/* Appointment reminders */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Bell className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Appointment Reminders</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Reduce no-shows with automatic appointment reminders and confirmation requests
						</p>
					</div>

					{/* Targeted messaging */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Target className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Targeted Segments</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send personalized messages to specific customer segments based on location, service history, and
							preferences
						</p>
					</div>
				</div>

				{/* Stats preview */}
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-lg border border-primary/10 bg-card/50 p-6 text-center backdrop-blur-sm">
						<div className="mb-2 font-bold text-3xl text-primary">98%</div>
						<div className="text-muted-foreground text-sm">Open Rate</div>
					</div>
					<div className="rounded-lg border border-primary/10 bg-card/50 p-6 text-center backdrop-blur-sm">
						<div className="mb-2 font-bold text-3xl text-primary">90s</div>
						<div className="text-muted-foreground text-sm">Avg. Response Time</div>
					</div>
					<div className="rounded-lg border border-primary/10 bg-card/50 p-6 text-center backdrop-blur-sm">
						<div className="mb-2 font-bold text-3xl text-primary">5x</div>
						<div className="text-muted-foreground text-sm">ROI vs Email</div>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Start Texting Your Customers</h3>
					<p className="mb-6 text-muted-foreground">Drive more bookings and revenue with SMS marketing</p>
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
