/**
 * Stats Cards Skeleton - Reusable Loading State
 *
 * Displays skeleton loading state for statistics cards.
 * Used across multiple dashboard pages for consistent loading UX.
 *
 * Performance:
 * - Renders instantly (< 5ms)
 * - Prevents layout shift while stats load
 * - Matches exact layout of stats cards
 *
 * @param count - Number of stat cards to display (default: 4)
 */

type StatsCardsSkeletonProps = {
  count?: number;
  className?: string;
};

export function StatsCardsSkeleton({
  count = 4,
  className,
}: StatsCardsSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className || ""}`}
    >
      {[...new Array(count)].map((_, i) => (
        <div className="animate-pulse rounded-lg border bg-card p-6" key={i}>
          {/* Card label */}
          <div className="h-4 w-24 rounded bg-muted" />

          {/* Card value */}
          <div className="mt-2 h-8 w-32 rounded bg-muted" />

          {/* Card description/trend */}
          <div className="mt-2 h-3 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
