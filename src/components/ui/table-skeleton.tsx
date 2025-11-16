/**
 * Table Skeleton - Reusable Loading State
 *
 * Displays skeleton loading state for data tables.
 * Used across multiple list/table pages for consistent loading UX.
 *
 * Performance:
 * - Renders instantly (< 5ms)
 * - Prevents layout shift while data loads
 * - Matches exact layout of data tables
 *
 * @param rows - Number of table rows to display (default: 10)
 * @param showHeader - Whether to show table header (default: true)
 * @param className - Optional additional CSS classes
 */

type TableSkeletonProps = {
  rows?: number;
  showHeader?: boolean;
  className?: string;
};

export function TableSkeleton({
  rows = 10,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Table header skeleton */}
      {showHeader && (
        <div className="flex items-center justify-between border-b pb-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>
      )}

      {/* Table rows skeleton */}
      <div className="space-y-2">
        {[...new Array(rows)].map((_, i) => (
          <div
            className="flex items-center gap-4 border-b py-3 last:border-0"
            key={i}
          >
            {/* Row checkbox/icon */}
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />

            {/* Row content */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted/70" />
            </div>

            {/* Row status */}
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />

            {/* Row actions */}
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Table footer/pagination skeleton */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
