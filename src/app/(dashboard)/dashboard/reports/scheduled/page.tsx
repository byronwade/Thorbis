/**
 * Reports > Scheduled Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 300; // Revalidate every 5 minutes

export default function ScheduledReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Scheduled Reports</h1>
        <p className="text-muted-foreground">
          Manage scheduled and automated reports
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Scheduled Reports system coming soon...
        </p>
      </div>
    </div>
  );
}
