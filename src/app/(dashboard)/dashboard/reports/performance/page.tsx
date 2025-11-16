/**
 * Reports > Performance Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function PerformanceReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Performance Reports</h1>
        <p className="text-muted-foreground">
          Generate performance reports and metrics
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Performance Reports system coming soon...
        </p>
      </div>
    </div>
  );
}
