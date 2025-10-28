/**
 * Customers Page Loading State
 *
 * Provides skeleton UI while customer data loads
 */

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-56 animate-pulse rounded bg-muted" />
        <div className="h-5 w-[500px] animate-pulse rounded bg-muted" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted" />
        ))}
      </div>

      {/* Customer List Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 h-[600px] animate-pulse rounded-lg border bg-muted" />
        <div className="col-span-3 h-[600px] animate-pulse rounded-lg border bg-muted" />
      </div>
    </div>
  );
}
