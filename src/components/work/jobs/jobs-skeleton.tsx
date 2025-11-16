/**
 * Jobs Skeleton - Loading State
 *
 * Matches the list layout used by other Work pages (search + table rows)
 * to keep the UX consistent and avoid layout shifts.
 */
export function JobsSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search and filters skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Table / list skeleton */}
      <div className="flex-1 space-y-2">
        {[...Array(10)].map((_, i) => (
          <div
            className="flex items-center gap-4 rounded-md border p-3"
            key={i}
          >
            {/* Job number + title */}
            <div className="h-8 flex-1 animate-pulse rounded bg-muted" />
            {/* Customer */}
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
            {/* Status */}
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            {/* Scheduled date */}
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            {/* Amount */}
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
