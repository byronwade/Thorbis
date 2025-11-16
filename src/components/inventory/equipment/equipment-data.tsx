"use cache";

/**
 * Equipment Data - Async Server Component
 *
 * Displays equipment tracking content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven equipment management.
 */

import { Hammer, MapPin, QrCode, Shield, Wrench } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function EquipmentData() {
	// Future: Fetch equipment inventory
	// const equipment = await fetchEquipment();

	return (
		<ComingSoonShell
			description="Track trucks, tools, and equipment with GPS location, maintenance schedules, and usage logs"
			icon={Wrench}
			title="Equipment Tracking"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Asset tracking */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Hammer className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Asset Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track all your tools, equipment, and vehicles with detailed records and serial numbers
						</p>
					</div>

					{/* GPS location */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<MapPin className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">GPS Location</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							See real-time location of trucks and equipment to optimize dispatching and prevent theft
						</p>
					</div>

					{/* QR code tagging */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<QrCode className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">QR Code Tagging</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Tag equipment with QR codes for instant check-in/check-out and maintenance logs
						</p>
					</div>

					{/* Maintenance tracking */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Shield className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Maintenance Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Schedule preventive maintenance, track repairs, and maintain service records for all equipment
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Protect Your Assets</h3>
					<p className="mb-6 text-muted-foreground">Know where your equipment is and keep it in top condition</p>
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
