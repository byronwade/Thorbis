import type { ReactNode } from "react";

type CustomersSettingsShellProps = {
	children: ReactNode;
};

/**
 * Settings > Customers Shell - Static Server Component
 *
 * Renders the static header and layout instantly; dynamic content
 * (cards, sections) streams in under PPR.
 */
export function CustomersSettingsShell({
	children,
}: CustomersSettingsShellProps) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-4xl font-bold tracking-tight">Customer Settings</h1>
				<p className="text-muted-foreground mt-2">
					Configure customer management preferences and features
				</p>
			</div>

			{children}
		</div>
	);
}
