/**
 * Standard Page Layout
 *
 * Consistent layout wrapper for all dashboard pages.
 * Provides proper spacing, structure, and optional features.
 *
 * Features:
 * - Consistent padding (p-6)
 * - Consistent gap (gap-6)
 * - Optional page header
 * - Optional stats section
 * - Flexible content area
 *
 * Usage:
 * ```typescript
 * <StandardPageLayout
 *   title="Invoices"
 *   description="Manage your invoices"
 *   stats={<InvoicesStats />}
 * >
 *   <InvoicesData />
 * </StandardPageLayout>
 * ```
 */

import type { ReactNode } from "react";

type StandardPageLayoutProps = {
	title?: string;
	description?: string;
	stats?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	spacing?: "sm" | "md" | "lg";
};

const maxWidthMap = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-6xl",
	xl: "max-w-7xl",
	"2xl": "max-w-screen-2xl",
	full: "w-full",
};

const spacingMap = {
	sm: "gap-4",
	md: "gap-6",
	lg: "gap-8",
};

export function StandardPageLayout({
	title,
	description,
	stats,
	actions,
	children,
	maxWidth = "full",
	spacing = "md",
}: StandardPageLayoutProps) {
	const maxWidthClass = maxWidthMap[maxWidth];
	const spacingClass = spacingMap[spacing];

	return (
		<div className={`mx-auto flex h-full w-full ${maxWidthClass} flex-col ${spacingClass} p-6`}>
			{/* Page Header */}
			{(title || description || actions) && (
				<div className="flex items-start justify-between">
					{(title || description) && (
						<div className="space-y-1">
							{title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
							{description && <p className="text-muted-foreground">{description}</p>}
						</div>
					)}
					{actions && <div className="flex gap-2">{actions}</div>}
				</div>
			)}

			{/* Stats Section */}
			{stats && <div>{stats}</div>}

			{/* Main Content */}
			<div className="flex-1 overflow-hidden">{children}</div>
		</div>
	);
}

/**
 * List Page Layout Variant
 *
 * Specialized for list pages with tables/grids.
 * Includes search and filter support.
 */
export function ListPageLayout({
	title,
	description,
	stats,
	search,
	filters,
	actions,
	children,
}: {
	title?: string;
	description?: string;
	stats?: ReactNode;
	search?: ReactNode;
	filters?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
}) {
	return (
		<StandardPageLayout description={description} maxWidth="full" stats={stats} title={title}>
			{/* Toolbar with search/filters/actions */}
			{(search || filters || actions) && (
				<div className="flex items-center justify-between gap-4">
					{/* Left: Search and Filters */}
					<div className="flex flex-1 items-center gap-2">
						{search}
						{filters}
					</div>

					{/* Right: Actions */}
					{actions && <div className="flex gap-2">{actions}</div>}
				</div>
			)}

			{/* Table/Grid Content */}
			{children}
		</StandardPageLayout>
	);
}

/**
 * Detail Page Layout Variant
 *
 * Specialized for detail/form pages.
 * Includes back button and breadcrumbs support.
 */
export function DetailPageLayout({
	title,
	description,
	breadcrumbs,
	actions,
	children,
	maxWidth = "xl",
}: {
	title?: string;
	description?: string;
	breadcrumbs?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}) {
	return (
		<StandardPageLayout maxWidth={maxWidth} spacing="lg">
			{/* Breadcrumbs */}
			{breadcrumbs && <div className="text-sm">{breadcrumbs}</div>}

			{/* Header with Actions */}
			{(title || description || actions) && (
				<div className="flex items-start justify-between border-b pb-6">
					{(title || description) && (
						<div className="space-y-1">
							{title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
							{description && <p className="text-muted-foreground text-lg">{description}</p>}
						</div>
					)}
					{actions && <div className="flex gap-2">{actions}</div>}
				</div>
			)}

			{/* Content */}
			{children}
		</StandardPageLayout>
	);
}
