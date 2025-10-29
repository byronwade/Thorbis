import { AppHeader } from "@/components/layout/app-header";
import { IncomingCallNotification } from "@/components/layout/incoming-call-notification";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Dashboard Layout - Server Component
 *
 * No more provider wrappers - all state management uses Zustand stores
 * Cleaner architecture with no provider hell
 *
 * Conditionally hides header/sidebar for TV routes
 */
export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check if we're on a TV route
	const headersList = await headers();
	const pathname = headersList.get("x-pathname") || "";
	const isTVRoute = pathname.includes("/tv-leaderboard");

	// For TV routes, render children directly without header/sidebar
	if (isTVRoute) {
		return <>{children}</>;
	}

	// Normal dashboard layout with header and sidebar
	return (
		<>
			<AppHeader />
			<LayoutWrapper showHeader={true}>{children}</LayoutWrapper>
			<IncomingCallNotification />
		</>
	);
}
