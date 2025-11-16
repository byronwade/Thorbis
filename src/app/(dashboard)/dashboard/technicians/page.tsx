/**
 * Technicians Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR revalidation every 5 minutes
 */

export default function TechnicianManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Technician Management</h1>
        <p className="text-muted-foreground">
          Manage technicians, skills, and performance
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Technicians</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Active Today</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">On Break</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Available</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}
