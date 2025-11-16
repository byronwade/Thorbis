import type { ReactNode } from "react";

/**
 * Schedule Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/schedule/*
 *
 * Schedule is a full-screen application with no sidebar or toolbar.
 * It renders edge-to-edge with its own internal navigation.
 *
 * Performance: Pure server component, minimal overhead
 */
export default function ScheduleLayout({ children }: { children: ReactNode }) {
	// Schedule has no chrome - just render children full-screen
	return <>{children}</>;
}
