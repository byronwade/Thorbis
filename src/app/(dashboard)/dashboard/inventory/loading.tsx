/**
 * Inventory Page Loading State
 *
 * Provides skeleton UI while inventory data loads
 */

export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-5 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="h-32 animate-pulse rounded-lg border bg-muted"
            key={i}
          />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="h-[600px] animate-pulse rounded-lg border bg-muted" />
    </div>
  );
}
