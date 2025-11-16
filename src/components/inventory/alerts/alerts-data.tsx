"use cache";

/**
 * Alerts Data - Async Server Component
 *
 * Displays low stock alerts content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven alert management.
 */

import { AlertTriangle, Bell, Mail, MessageSquare, TrendingDown } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function AlertsData() {
	// Future: Fetch low stock alerts
	// const alerts = await fetchLowStockAlerts();

	return (
		<ComingSoonShell
			description="Get notified when inventory levels drop below minimum thresholds and automate reordering processes"
			icon={AlertTriangle}
			title="Low Stock Alerts"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Real-time alerts */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Bell className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Real-Time Alerts</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Instantly know when parts fall below minimum stock levels before you run out
						</p>
					</div>

					{/* Multi-channel notifications */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<MessageSquare className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Multi-Channel Notifications</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Receive alerts via email, SMS, and in-app notifications so you never miss a critical update
						</p>
					</div>

					{/* Customizable thresholds */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingDown className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Customizable Thresholds</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set different minimum stock levels for each item based on usage patterns and lead times
						</p>
					</div>

					{/* Automated ordering */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Mail className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Automated Ordering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically generate purchase orders when stock levels trigger reorder points
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Never Run Out of Parts</h3>
					<p className="mb-6 text-muted-foreground">Stay ahead of stockouts with intelligent alerts</p>
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
