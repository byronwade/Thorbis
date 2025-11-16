export function MaterialsSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search and filters skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Table skeleton */}
      <div className="flex-1 space-y-2">
        {[...new Array(10)].map((_, i) => (
          <div className="flex items-center gap-4" key={i}>
            <div className="h-12 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-12 w-24 animate-pulse rounded bg-muted" />
            <div className="h-12 w-24 animate-pulse rounded bg-muted" />
            <div className="h-12 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
