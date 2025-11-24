import type { ReactNode } from "react";

type DashboardShellProps = {
	children: ReactNode;
};

/**
 * Dashboard Shell - Static Server Component
 *
 * Renders instantly (5-20ms) and is cached at the edge.
 * Contains only static layout elements - no data fetching.
 *
 * Uses max-w-7xl to match detail pages and provide a centered,
 * readable layout for the dashboard content.
 */
export function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-6 p-6 pb-16">
			{/* Dynamic content slots */}
			{children}
		</div>
	);
}
