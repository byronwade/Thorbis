/**
 * Property Detail Skeleton - PPR Loading State
 *
 * Renders instantly while property data streams in.
 * Provides immediate visual feedback to the user.
 *
 * Performance: Renders in 5-20ms (instant!)
 */

export function PropertyDetailSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded bg-muted" />
              <div className="h-4 w-96 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Stats bar skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div className="space-y-2 rounded-lg border p-4" key={i}>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Map skeleton */}
        <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />

        {/* Main content skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Property details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer info */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Jobs history */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div className="flex justify-between" key={i}>
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div className="space-y-2" key={i}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Quick info */}
          <div className="space-y-6">
            {/* Property info */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Upcoming schedules */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    className="h-4 w-full animate-pulse rounded bg-muted"
                    key={i}
                  />
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="space-y-4 rounded-lg border p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div className="flex justify-between" key={i}>
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <div className="flex gap-4 border-b">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                className="h-10 w-24 animate-pulse rounded-t bg-muted"
                key={i}
              />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                className="h-20 w-full animate-pulse rounded bg-muted"
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
