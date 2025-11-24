import type { ReactNode } from "react";

type FinanceShellProps = {
	children: ReactNode;
};

/**
 * Finance Shell - Static Server Component
 *
 * Renders the static layout (header, description) instantly and
 * wraps the streaming finance content.
 */
export function FinanceShell({ children }: FinanceShellProps) {
	return (
		<div className="space-y-4 md:space-y-6 p-4 md:p-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl md:text-3xl font-semibold">Finance Dashboard</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Manage accounts, allocate funds, and track financial goals
				</p>
			</div>

			{children}
		</div>
	);
}
