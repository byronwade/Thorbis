"use cache";
/**
 * Pricebook Equipment Data - Async Server Component
 *
 * Displays equipment rates content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern.
 */

import { Calendar, DollarSign, TrendingUp, Wrench } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";


export async function PricebookEquipmentData() {
	return (
		<ComingSoonShell
			description="Set rental rates, usage fees, and depreciation tracking for all your equipment and tools"
			icon={Wrench}
			title="Equipment Rates"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Rental Rates</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Define hourly, daily, and weekly rental rates for equipment and specialized tools
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Usage Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track equipment usage hours and automatically calculate rental charges for jobs
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Depreciation</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Calculate depreciation and track asset value over time for accounting purposes
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Wrench className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Maintenance Costs</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track maintenance expenses and factor into equipment rental pricing
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Track Equipment Profitability</h3>
					<p className="mb-6 text-muted-foreground">Ensure every asset contributes to your bottom line</p>
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
