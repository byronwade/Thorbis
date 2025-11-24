import type { ReactNode } from "react";

type JobsShellProps = {
	children: ReactNode;
};

/**
 * Jobs Shell - Static Server Component
 *
 * Renders instantly (5-20ms) as a static wrapper around the Jobs content.
 * Contains only layout structure and static heading; no data fetching.
 */
export function JobsShell({ children }: JobsShellProps) {
	return (
		<div className="space-y-4 md:space-y-6 p-4 md:p-6">
			<div>
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Active Jobs</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Manage active work orders, job assignments, and technician tasks
				</p>
			</div>

			{children}
		</div>
	);
}
