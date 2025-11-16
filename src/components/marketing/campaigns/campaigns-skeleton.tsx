/**
 * Campaigns Skeleton - Loading State
 *
 * Matches the exact layout of campaigns data to prevent layout shifts.
 * Displays while content is loading.
 */

export function CampaignsSkeleton() {
  return (
    <div className="relative space-y-10 py-8 md:py-12">
      {/* Status badge skeleton */}
      <div className="flex justify-center">
        <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Icon skeleton */}
      <div className="flex justify-center">
        <div className="size-24 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Title and description skeleton */}
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <div className="mx-auto h-12 w-96 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>

      {/* Feature cards skeleton */}
      <div className="mx-auto max-w-5xl space-y-8 pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* First 3 cards */}
          {[...Array(3)].map((_, i) => (
            <div className="space-y-3 rounded-lg border bg-card p-6" key={i}>
              <div className="size-12 animate-pulse rounded-lg bg-muted" />
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}

          {/* Full-width card */}
          <div className="space-y-3 rounded-lg border bg-card p-6 md:col-span-3">
            <div className="size-12 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto mb-3 h-7 w-56 animate-pulse rounded bg-muted" />
          <div className="mx-auto mb-6 h-5 w-64 animate-pulse rounded bg-muted" />
          <div className="flex justify-center gap-4">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      {/* Footer message skeleton */}
      <div className="flex justify-center pt-8">
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
