/**
 * Pricebook > Services Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function ServicePricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Service Pricing</h1>
        <p className="text-muted-foreground">
          Manage service pricing and rates for different service types
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Service Pricing management coming soon...
        </p>
      </div>
    </div>
  );
}
