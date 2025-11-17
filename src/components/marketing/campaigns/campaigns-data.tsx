/**
 * Campaigns Data - Async Server Component
 *
 * Displays campaign management content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven content.
 */

import { Calendar, Mail, Megaphone, MessageSquare, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function CampaignsData() {
	// Future: Fetch campaign statistics
	// const stats = await fetchCampaignStats();

	return (
		<ComingSoonShell
			description="Create and manage email, SMS, and direct mail campaigns to grow your business"
			icon={Megaphone}
			title="Marketing Campaigns"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-3">
					{/* Email campaigns */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Mail className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Email Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Design beautiful emails, automate follow-ups, and track open rates and clicks
						</p>
					</div>

					{/* SMS campaigns */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MessageSquare className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">SMS Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send targeted text messages with appointment reminders and promotional offers
						</p>
					</div>

					{/* Direct mail */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Calendar className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Direct Mail</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send postcards and flyers to targeted neighborhoods and customer segments
						</p>
					</div>

					{/* Campaign analytics */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm md:col-span-3">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Campaign Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track ROI, conversion rates, and customer engagement across all your marketing
							campaigns
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Ready to Grow Your Business?</h3>
					<p className="text-muted-foreground mb-6">Start running profitable marketing campaigns</p>
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
