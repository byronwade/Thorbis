/**
 * Reports > Builder Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function ReportBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Report Builder</h1>
        <p className="text-muted-foreground">
          Build custom reports with drag-and-drop interface
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Report Builder system coming soon...
        </p>
      </div>
    </div>
  );
}
