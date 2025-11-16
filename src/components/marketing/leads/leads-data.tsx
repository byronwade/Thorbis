/**
 * Leads Data - Async Server Component
 *
 * Displays lead management content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven content.
 */

import { Target, TrendingUp, Users, Zap } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function LeadsData() {
	// Future: Fetch lead statistics
	// const stats = await fetchLeadStats();

	return (
		<ComingSoonShell
			description="Capture, track, and convert leads into customers with our powerful lead management system"
			icon={Target}
			title="Lead Management"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-3">
					{/* Lead capture */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Zap className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Lead Capture</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically capture leads from your website, phone calls, and marketing campaigns
						</p>
					</div>

					{/* Lead scoring */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Lead Scoring</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Prioritize your best leads with AI-powered scoring and qualification
						</p>
					</div>

					{/* Lead nurturing */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Lead Nurturing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automate follow-ups and nurture leads through your sales funnel
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Want Early Access?</h3>
					<p className="mb-6 text-muted-foreground">Be the first to know when Lead Management launches</p>
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
