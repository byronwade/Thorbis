import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardAuthWrapper } from "@/components/layout/dashboard-auth-wrapper";
import { IncomingCallNotificationWrapper } from "@/components/layout/incoming-call-notification-wrapper";

/**
 * Dashboard Layout - Server Component with PPR
 *
 * Uses Partial Prerendering (PPR) to optimize performance:
 * - Static shell (header) renders instantly (5-20ms)
 * - Auth checks happen in the background (non-blocking)
 * - Content streams in progressively
 *
 * The AppHeader is rendered immediately (static).
 * Auth checks happen via DashboardAuthWrapper but don't block rendering.
 *
 * Performance: Instant header, progressive content loading
 */
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Header with company context - wrapped in Suspense for PPR */}
      <Suspense fallback={<HeaderSkeleton />}>
        <AppHeader />
      </Suspense>

      {/* Incoming call notifications */}
      <IncomingCallNotificationWrapper />

      {/* Auth wrapper handles redirects but doesn't block rendering */}
      <Suspense fallback={null}>
        <DashboardAuthWrapper />
      </Suspense>

      {/* Page content - each page has its own Suspense boundaries */}
      {children}
    </>
  );
}

// Header skeleton - renders instantly while header loads
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Logo skeleton */}
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />

          {/* Nav skeleton */}
          <div className="hidden md:flex md:gap-2">
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Right side skeleton */}
        <div className="flex items-center gap-2">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="size-8 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </header>
  );
}
