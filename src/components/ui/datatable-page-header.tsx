/**
 * DataTablePageHeader Component
 *
 * Standardized header for datatable pages with built-in padding.
 * Used with full-width datatables that have no page padding.
 *
 * Features:
 * - Consistent padding (px-4 py-6 or px-6 py-8)
 * - Title and description
 * - Right-aligned action buttons
 * - Responsive layout
 * - Optional stats/metrics section
 */

import type { ReactNode } from "react";

type DataTablePageHeaderProps = {
	/** Page title */
	title: string;
	/** Page description */
	description?: string;
	/** Action buttons (right-aligned) */
	actions?: ReactNode;
	/** Stats or metrics section below header */
	stats?: ReactNode;
	/** Size variant */
	size?: "default" | "large";
	/** Custom padding */
	padding?: "default" | "large" | "none";
};

export function DataTablePageHeader({
	title,
	description,
	actions,
	stats,
	size = "default",
	padding = "default",
}: DataTablePageHeaderProps) {
	const paddingClass =
		padding === "large"
			? "px-6 py-8"
			: padding === "none"
				? ""
				: "px-4 py-6";

	const titleSize =
		size === "large" ? "text-3xl font-bold" : "text-2xl font-semibold";

	return (
		<div className={`border-b bg-background ${paddingClass}`}>
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className={`tracking-tight ${titleSize}`}>{title}</h1>
					{description && (
						<p className="text-muted-foreground text-sm">{description}</p>
					)}
				</div>
				{actions && (
					<div className="flex items-center gap-2 shrink-0">{actions}</div>
				)}
			</div>

			{stats && <div className="mt-6">{stats}</div>}
		</div>
	);
}
