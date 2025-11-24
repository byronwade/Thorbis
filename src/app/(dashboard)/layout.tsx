import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardAuthWrapper } from "@/components/layout/dashboard-auth-wrapper";
import { IncomingCallNotificationWrapper } from "@/components/layout/incoming-call-notification-wrapper";
import { MobileBottomTabsWrapper } from "@/components/layout/mobile-bottom-tabs-wrapper";
import { NotificationsInitializer } from "@/components/layout/notifications-initializer";

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
		<div data-dashboard-layout className="flex h-full flex-col overflow-hidden">
			{/* Header with company context - wrapped in Suspense for PPR */}
			<Suspense fallback={<HeaderSkeleton />}>
				<AppHeader />
			</Suspense>

			{/* Desktop + toast notifications bootstrap */}
			<NotificationsInitializer />

			{/* Incoming call notifications */}
			<IncomingCallNotificationWrapper />

			{/* Auth wrapper handles redirects but doesn't block rendering */}
			<Suspense fallback={null}>
				<DashboardAuthWrapper />
			</Suspense>

			{/* Page content - each page has its own Suspense boundaries */}
			<main className="flex-1 flex flex-col overflow-y-auto pb-16 lg:pb-0">
				{children}
			</main>

			{/* Mobile Bottom Tab Bar - Native iOS/Android style navigation */}
			<MobileBottomTabsWrapper />
		</div>
	);
}

// Header skeleton - renders instantly while header loads
function HeaderSkeleton() {
	return (
		<header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="flex h-14 items-center px-4">
				<div className="flex flex-1 items-center gap-4">
					{/* Logo skeleton */}
					<div className="bg-muted h-8 w-32 animate-pulse rounded" />

					{/* Nav skeleton */}
					<div className="hidden md:flex md:gap-2">
						<div className="bg-muted h-8 w-20 animate-pulse rounded" />
						<div className="bg-muted h-8 w-20 animate-pulse rounded" />
						<div className="bg-muted h-8 w-20 animate-pulse rounded" />
					</div>
				</div>

				{/* Right side skeleton */}
				<div className="flex items-center gap-2">
					<div className="bg-muted size-8 animate-pulse rounded-full" />
					<div className="bg-muted size-8 animate-pulse rounded-full" />
				</div>
			</div>
		</header>
	);
}
