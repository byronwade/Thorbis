/**
 * Finance > General Ledger Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 900; // Revalidate every 15 minutes

export default function GeneralLedgerPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">General Ledger</h1>
        <p className="text-muted-foreground">
          View and manage your general ledger entries
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          General Ledger management coming soon...
        </p>
      </div>
    </div>
  );
}
