/**
 * Dashboard Auth Skeleton - Static Component
 *
 * Loading state shown while authentication and onboarding checks are performed.
 * This renders instantly (5-20ms) while the auth wrapper streams in.
 */
export function DashboardAuthSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo/spinner */}
        <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

        {/* Loading text */}
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
