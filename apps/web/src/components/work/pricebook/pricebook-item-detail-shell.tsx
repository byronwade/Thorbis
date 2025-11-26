import type { ReactNode } from "react";

type PriceBookItemDetailShellProps = {
	children: ReactNode;
};

/**
 * Price Book Item Detail Shell - Static Server Component
 *
 * Renders instantly (5-20ms) and is cached at the edge.
 * Contains only static layout elements - no data fetching.
 */
export function PriceBookItemDetailShell({
	children,
}: PriceBookItemDetailShellProps) {
	return (
		<div className="flex h-full w-full flex-col overflow-auto">
			<div className="flex-1">
				<div className="mx-auto max-w-7xl space-y-6 p-6">{children}</div>
			</div>
		</div>
	);
}
