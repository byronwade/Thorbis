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
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Active Jobs</h1>
				<p className="text-muted-foreground">
					Manage active work orders, job assignments, and technician tasks
				</p>
			</div>

			{children}
		</div>
	);
}
