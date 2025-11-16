/**
 * Settings > Customers Skeleton - Loading State
 *
 * Matches the customers settings layout (header + cards + overview)
 * to avoid layout shifts while data streams in.
 */
export function CustomersSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            className="h-32 animate-pulse rounded-lg border bg-card p-6"
            key={i}
          >
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview card skeleton */}
      <div className="h-32 animate-pulse rounded-lg border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="size-5 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
