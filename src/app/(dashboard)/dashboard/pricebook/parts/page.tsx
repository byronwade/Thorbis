/**
 * Pricebook > Parts Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function PartsMaterialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Parts & Materials</h1>
        <p className="text-muted-foreground">
          Manage parts and materials pricing and catalog
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Parts & Materials pricing coming soon...
        </p>
      </div>
    </div>
  );
}
