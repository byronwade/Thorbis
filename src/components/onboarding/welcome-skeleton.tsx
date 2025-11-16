/**
 * Welcome Skeleton - Loading State
 *
 * Shows a beautiful loading state while onboarding data loads.
 * Matches the design of the actual welcome page.
 */
export function WelcomeSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-4xl space-y-8 p-8">
        {/* Logo/Brand Area */}
        <div className="flex justify-center">
          <div className="size-16 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Title */}
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-96 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted" />
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg">
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  className="size-3 animate-pulse rounded-full bg-muted"
                  key={i}
                />
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="h-12 w-full animate-pulse rounded bg-muted" />
              <div className="h-12 w-full animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 animate-pulse rounded bg-muted" />
                <div className="h-12 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-12 w-full animate-pulse rounded bg-muted" />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div className="h-10 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-32 animate-pulse rounded bg-primary/20" />
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="flex justify-center">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
