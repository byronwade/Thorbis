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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Bell className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Real-Time Alerts</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Instantly know when parts fall below minimum stock levels before you run out
						</p>
					</div>

					{/* Multi-channel notifications */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MessageSquare className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Multi-Channel Notifications</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Receive alerts via email, SMS, and in-app notifications so you never miss a critical
							update
						</p>
					</div>

					{/* Customizable thresholds */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingDown className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Customizable Thresholds</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Set different minimum stock levels for each item based on usage patterns and lead
							times
						</p>
					</div>

					{/* Automated ordering */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Mail className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Automated Ordering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically generate purchase orders when stock levels trigger reorder points
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Never Run Out of Parts</h3>
					<p className="text-muted-foreground mb-6">
						Stay ahead of stockouts with intelligent alerts
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
