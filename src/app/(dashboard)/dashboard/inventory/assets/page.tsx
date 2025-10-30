/**
 * Inventory > Assets Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function AssetManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Asset Management</h1>
        <p className="text-muted-foreground">Track and manage company assets</p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Asset Management system coming soon...
        </p>
      </div>
    </div>
  );
}
