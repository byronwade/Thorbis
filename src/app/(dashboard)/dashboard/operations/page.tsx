/**
 * Operations Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 900; // Revalidate every 15 minutes

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl text-foreground">Operations</h1>
        <p className="text-muted-foreground">
          Manage field operations, technicians, and equipment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Field Operations</h3>
          <p className="text-muted-foreground text-sm">
            Overview of active field operations and status.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Technician Management</h3>
          <p className="text-muted-foreground text-sm">
            Manage technician schedules and assignments.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Equipment Tracking</h3>
          <p className="text-muted-foreground text-sm">
            Track equipment location and maintenance status.
          </p>
        </div>
      </div>
    </div>
  );
}
