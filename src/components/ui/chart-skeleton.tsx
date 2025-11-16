/**
 * Chart Skeleton - Reusable Loading State
 *
 * Displays skeleton loading state for charts and graphs.
 * Used across analytics and reporting pages for consistent loading UX.
 *
 * Performance:
 * - Renders instantly (< 5ms)
 * - Prevents layout shift while charts load
 * - Matches exact dimensions of chart containers
 *
 * @param height - Chart height in pixels or CSS value (default: 300)
 * @param showLegend - Whether to show legend skeleton (default: true)
 * @param className - Optional additional CSS classes
 */

type ChartSkeletonProps = {
  height?: number | string;
  showLegend?: boolean;
  className?: string;
};

export function ChartSkeleton({
  height = 300,
  showLegend = true,
  className,
}: ChartSkeletonProps) {
  const heightValue = typeof height === "number" ? `${height}px` : height;

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Chart header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        {showLegend && (
          <div className="flex gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        )}
      </div>

      {/* Chart area */}
      <div
        className="animate-pulse rounded-lg border bg-card p-6"
        style={{ height: heightValue }}
      >
        <div className="flex h-full items-end justify-between gap-2">
          {/* Simulated bar chart bars */}
          {[...Array(12)].map((_, i) => (
            <div
              className="w-full rounded-t bg-muted"
              key={i}
              style={{
                height: `${Math.random() * 60 + 40}%`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Chart footer */}
      <div className="flex items-center justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <div className="h-3 w-16 animate-pulse rounded bg-muted" key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Line Chart Skeleton - Alternative variant
 *
 * Displays skeleton for line/area charts.
 */
export function LineChartSkeleton({
  height = 300,
  className,
}: Omit<ChartSkeletonProps, "showLegend">) {
  const heightValue = typeof height === "number" ? `${height}px` : height;

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Chart header */}
      <div className="h-6 w-48 animate-pulse rounded bg-muted" />

      {/* Chart area */}
      <div
        className="animate-pulse rounded-lg border bg-card p-6"
        style={{ height: heightValue }}
      >
        <div className="relative h-full">
          {/* Simulated line chart path */}
          <svg
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              className="text-muted opacity-60"
              d="M 0 80 Q 25 60, 50 70 T 100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Chart footer */}
      <div className="flex items-center justify-between">
        {[...Array(5)].map((_, i) => (
          <div className="h-3 w-12 animate-pulse rounded bg-muted" key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Pie Chart Skeleton - Alternative variant
 *
 * Displays skeleton for pie/donut charts.
 */
export function PieChartSkeleton({
  size = 200,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Chart header */}
      <div className="h-6 w-48 animate-pulse rounded bg-muted" />

      {/* Chart area */}
      <div className="flex items-center justify-center py-8">
        <div
          className="animate-pulse rounded-full bg-muted"
          style={{ width: size, height: size }}
        />
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div className="flex items-center gap-3" key={i}>
            <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
