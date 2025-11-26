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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Hammer className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Asset Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track all your tools, equipment, and vehicles with detailed
							records and serial numbers
						</p>
					</div>

					{/* GPS location */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MapPin className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">GPS Location</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							See real-time location of trucks and equipment to optimize
							dispatching and prevent theft
						</p>
					</div>

					{/* QR code tagging */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<QrCode className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">QR Code Tagging</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Tag equipment with QR codes for instant check-in/check-out and
							maintenance logs
						</p>
					</div>

					{/* Maintenance tracking */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Shield className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Maintenance Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Schedule preventive maintenance, track repairs, and maintain
							service records for all equipment
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Protect Your Assets</h3>
					<p className="text-muted-foreground mb-6">
						Know where your equipment is and keep it in top condition
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
