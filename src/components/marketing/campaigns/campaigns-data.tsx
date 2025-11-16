"use cache";

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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Mail className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Email Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Design beautiful emails, automate follow-ups, and track open rates and clicks
						</p>
					</div>

					{/* SMS campaigns */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<MessageSquare className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">SMS Campaigns</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send targeted text messages with appointment reminders and promotional offers
						</p>
					</div>

					{/* Direct mail */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Direct Mail</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Send postcards and flyers to targeted neighborhoods and customer segments
						</p>
					</div>

					{/* Campaign analytics */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm md:col-span-3">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Campaign Analytics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track ROI, conversion rates, and customer engagement across all your marketing campaigns
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Ready to Grow Your Business?</h3>
					<p className="mb-6 text-muted-foreground">Start running profitable marketing campaigns</p>
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
