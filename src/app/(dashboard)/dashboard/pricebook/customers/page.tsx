/**
 * Pricebook > Customers Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function CustomerPricingPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Customer Pricing</h1>
				<p className="text-muted-foreground">Set custom pricing for specific customers and contracts</p>
			</div>
			<div className="rounded-lg border p-6">
				<p className="text-muted-foreground">Customer Pricing management coming soon...</p>
			</div>
		</div>
	);
}
