/**
 * Grid Skeleton - Reusable Loading State
 *
 * Displays skeleton loading state for grid/card layouts.
 * Used across inventory, pricebook, and other grid-view pages.
 *
 * Performance:
 * - Renders instantly (< 5ms)
 * - Prevents layout shift while data loads
 * - Matches exact layout of grid items
 *
 * @param count - Number of grid items to display (default: 12)
 * @param columns - Grid columns configuration (default: responsive 1-4 cols)
 * @param className - Optional additional CSS classes
 */

type GridSkeletonProps = {
	count?: number;
	columns?: {
		base?: number;
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};
	className?: string;
};

export function GridSkeleton({
	count = 12,
	columns = {
		base: 1,
		sm: 2,
		md: 3,
		lg: 4,
	},
	className,
}: GridSkeletonProps) {
	// Build grid classes from columns config
	const gridClasses = [
		columns.base && `grid-cols-${columns.base}`,
		columns.sm && `sm:grid-cols-${columns.sm}`,
		columns.md && `md:grid-cols-${columns.md}`,
		columns.lg && `lg:grid-cols-${columns.lg}`,
		columns.xl && `xl:grid-cols-${columns.xl}`,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={`grid gap-4 ${gridClasses} ${className || ""}`}>
			{[...new Array(count)].map((_, i) => (
				<div className="bg-card animate-pulse rounded-lg border p-6" key={i}>
					{/* Item image/icon */}
					<div className="bg-muted mb-4 h-32 w-full rounded" />

					{/* Item title */}
					<div className="bg-muted mb-2 h-5 w-3/4 rounded" />

					{/* Item description */}
					<div className="bg-muted mb-2 h-4 w-full rounded" />
					<div className="bg-muted mb-4 h-4 w-2/3 rounded" />

					{/* Item metadata */}
					<div className="flex items-center justify-between">
						<div className="bg-muted h-4 w-16 rounded" />
						<div className="bg-muted h-6 w-20 rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}

/**
 * Compact Grid Skeleton - Alternative variant
 *
 * Displays skeleton for compact grid layouts (smaller items).
 */
export function CompactGridSkeleton({
	count = 16,
	columns = {
		base: 2,
		sm: 3,
		md: 4,
		lg: 6,
	},
	className,
}: GridSkeletonProps) {
	const gridClasses = [
		columns.base && `grid-cols-${columns.base}`,
		columns.sm && `sm:grid-cols-${columns.sm}`,
		columns.md && `md:grid-cols-${columns.md}`,
		columns.lg && `lg:grid-cols-${columns.lg}`,
		columns.xl && `xl:grid-cols-${columns.xl}`,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={`grid gap-3 ${gridClasses} ${className || ""}`}>
			{[...new Array(count)].map((_, i) => (
				<div className="bg-card animate-pulse rounded-lg border p-4" key={i}>
					{/* Item icon */}
					<div className="bg-muted mb-3 h-12 w-12 rounded" />

					{/* Item title */}
					<div className="bg-muted mb-2 h-4 w-full rounded" />

					{/* Item value */}
					<div className="bg-muted h-6 w-3/4 rounded" />
				</div>
			))}
		</div>
	);
}

/**
 * Kanban Grid Skeleton - Alternative variant
 *
 * Displays skeleton for kanban-style layouts (columns with cards).
 */
export function KanbanGridSkeleton({
	columns = 4,
	cardsPerColumn = 3,
	className,
}: {
	columns?: number;
	cardsPerColumn?: number;
	className?: string;
}) {
	return (
		<div className={`grid gap-4 md:grid-cols-${columns} ${className || ""}`}>
			{[...new Array(columns)].map((_, columnIndex) => (
				<div className="space-y-4" key={columnIndex}>
					{/* Column header */}
					<div className="bg-card flex items-center justify-between rounded-lg border p-4">
						<div className="bg-muted h-5 w-24 animate-pulse rounded" />
						<div className="bg-muted h-6 w-8 animate-pulse rounded-full" />
					</div>

					{/* Column cards */}
					<div className="space-y-3">
						{[...new Array(cardsPerColumn)].map((_, cardIndex) => (
							<div className="bg-card animate-pulse rounded-lg border p-4" key={cardIndex}>
								<div className="bg-muted mb-2 h-4 w-3/4 rounded" />
								<div className="bg-muted mb-3 h-3 w-full rounded" />
								<div className="flex items-center gap-2">
									<div className="bg-muted h-6 w-6 rounded-full" />
									<div className="bg-muted h-4 w-16 rounded" />
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
