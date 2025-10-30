/**
 * Pricebook > Seasonal Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function SeasonalPricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Seasonal Pricing</h1>
        <p className="text-muted-foreground">
          Manage seasonal pricing adjustments and peak/off-peak rates
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Seasonal Pricing management coming soon...
        </p>
      </div>
    </div>
  );
}
