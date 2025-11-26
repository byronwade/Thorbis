/**
 * Services Data - Async Server Component
 *
 * Displays service pricing content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { Calendar, TrendingUp, Users, Wrench } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function ServicesData() {
	return (
		<ComingSoonShell
			description="Define and manage pricing for all your services with flexible rate structures and custom packages"
			icon={Wrench}
			title="Service Pricing"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Wrench className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Service Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Maintain a complete catalog of services with descriptions,
							durations, and pricing tiers
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Dynamic Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Adjust pricing based on time of day, urgency, location, and
							customer type
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Customer-Specific Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set custom rates for VIP customers, contracts, and service
							agreements
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Calendar className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Seasonal Pricing</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Implement seasonal rates and promotional pricing for peak and
							off-peak periods
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Price Smarter, Not Harder
					</h3>
					<p className="text-muted-foreground mb-6">
						Maximize revenue with intelligent pricing strategies
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
