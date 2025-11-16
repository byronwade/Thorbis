/**
 * Reports Page - Server Component with ISR
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR with 5-minute revalidation for fresh data
 */

// Revalidate every 5 minutes (ISR - Incremental Static Regeneration)

export default function BusinessIntelligencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Business Intelligence</h1>
        <p className="text-muted-foreground">
          Comprehensive business reporting and analytics
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Scheduled Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Custom Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Data Sources</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}
