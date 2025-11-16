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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Box className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Parts Catalog</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Organize all your parts with SKUs, descriptions, manufacturers, and cross-references
						</p>
					</div>

					{/* Barcode scanning */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Search className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Barcode Scanning</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Scan barcodes to quickly add, remove, or update parts in your inventory
						</p>
					</div>

					{/* Vendor management */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Settings className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Vendor Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track preferred vendors, pricing tiers, and lead times for each part
						</p>
					</div>

					{/* Usage tracking */}
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<BarChart2 className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Usage Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor which parts are used most frequently and optimize your stock levels
						</p>
					</div>
				</div>

				{/* CTA section */}
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Streamline Parts Management</h3>
					<p className="mb-6 text-muted-foreground">Never waste time searching for parts again</p>
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
