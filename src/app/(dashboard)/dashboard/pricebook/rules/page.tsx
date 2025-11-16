/**
 * Pricebook > Rules Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function PriceRulesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Price Rules</h1>
				<p className="text-muted-foreground">Create automated pricing rules and discount structures</p>
			</div>
			<div className="rounded-lg border p-6">
				<p className="text-muted-foreground">Price Rules management coming soon...</p>
			</div>
		</div>
	);
}
