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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Zap className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Lead Capture</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically capture leads from your website, phone calls, and marketing campaigns
						</p>
					</div>

					{/* Lead scoring */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Lead Scoring</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Prioritize your best leads with AI-powered scoring and qualification
						</p>
					</div>

					{/* Lead nurturing */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Lead Nurturing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automate follow-ups and nurture leads through your sales funnel
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Want Early Access?</h3>
					<p className="text-muted-foreground mb-6">
						Be the first to know when Lead Management launches
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
