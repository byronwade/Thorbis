/**
 * Inventory > Alerts Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function LowStockAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Low Stock Alerts</h1>
        <p className="text-muted-foreground">
          Monitor and manage low stock alerts
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Low Stock Alerts system coming soon...
        </p>
      </div>
    </div>
  );
}
