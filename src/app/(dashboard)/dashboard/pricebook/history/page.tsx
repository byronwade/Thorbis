/**
 * Pricebook > History Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function PriceHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Price History</h1>
        <p className="text-muted-foreground">
          Track price changes and historical pricing data
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Price History tracking coming soon...
        </p>
      </div>
    </div>
  );
}
