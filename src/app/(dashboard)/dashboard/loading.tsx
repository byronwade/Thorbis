/**
 * Dashboard Loading State - Server Component
 *
 * Performance optimizations:
 * - Streaming UI with Suspense
 * - Shows immediately while data loads
 * - Prevents layout shift with proper sizing
 */

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
