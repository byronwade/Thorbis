/**
 * Parts Data - Async Server Component
 *
 * Displays parts and materials content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven parts management.
 */

import { BarChart2, Box, Package2, Search, Settings } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function PartsData() {
	// Future: Fetch parts inventory
	// const parts = await fetchParts();

	return (
		<ComingSoonShell
			description="Manage your parts and materials inventory with barcode scanning, vendor management, and automated tracking"
			icon={Package2}
			title="Parts & Materials"
		>
			{/* Feature cards */}
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Features grid */}
				<div className="grid gap-6 md:grid-cols-2">
					{/* Parts catalog */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Box className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Organize all your parts with SKUs, descriptions, manufacturers,
							and cross-references
						</p>
					</div>

					{/* Barcode scanning */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Search className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Barcode Scanning</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Scan barcodes to quickly add, remove, or update parts in your
							inventory
						</p>
					</div>

					{/* Vendor management */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Settings className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Vendor Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track preferred vendors, pricing tiers, and lead times for each
							part
						</p>
					</div>

					{/* Usage tracking */}
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<BarChart2 className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Usage Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor which parts are used most frequently and optimize your
							stock levels
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Streamline Parts Management
					</h3>
					<p className="text-muted-foreground mb-6">
						Never waste time searching for parts again
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
