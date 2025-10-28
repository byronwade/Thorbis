/**
 * Analytics Page Loading State
 *
 * Provides skeleton UI while analytics data loads
 */

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-5 w-72 animate-pulse rounded bg-muted" />
      </div>

      {/* Content Skeleton */}
      <div className="h-[400px] animate-pulse rounded-lg border bg-muted" />
    </div>
  );
}
