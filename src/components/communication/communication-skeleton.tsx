/**
 * Communication Skeleton - Loading State
 *
 * Matches the exact layout of the communication page to prevent layout shifts.
 */
export function CommunicationSkeleton() {
  return (
    <div className="flex h-full gap-4">
      {/* Left sidebar skeleton */}
      <div className="w-80 space-y-4 border-r p-4">
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          {[...new Array(10)].map((_, i) => (
            <div className="h-20 animate-pulse rounded bg-muted" key={i} />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 space-y-4 p-4">
        <div className="h-16 animate-pulse rounded bg-muted" />
        <div className="flex-1 space-y-2">
          {[...new Array(8)].map((_, i) => (
            <div className="h-16 animate-pulse rounded bg-muted" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
