/**
 * Services Data - Async Server Component
 *
 * Displays service pricing content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { Calendar, TrendingUp, Users, Wrench } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

("use cache");

export async function ServicesData() {
	return (
		<ComingSoonShell
			description="Define and manage pricing for all your services with flexible rate structures and custom packages"
			icon={Wrench}
			title="Service Pricing"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Wrench className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Service Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Maintain a complete catalog of services with descriptions, durations, and pricing tiers
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Dynamic Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Adjust pricing based on time of day, urgency, location, and customer type
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Customer-Specific Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set custom rates for VIP customers, contracts, and service agreements
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Seasonal Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Implement seasonal rates and promotional pricing for peak and off-peak periods
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Price Smarter, Not Harder</h3>
					<p className="mb-6 text-muted-foreground">Maximize revenue with intelligent pricing strategies</p>
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
