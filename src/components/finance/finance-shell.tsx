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
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-semibold text-2xl">Finance Dashboard</h1>
				<p className="text-muted-foreground">Manage accounts, allocate funds, and track financial goals</p>
			</div>

			{children}
		</div>
	);
}
