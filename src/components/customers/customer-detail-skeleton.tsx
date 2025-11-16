/**
 * Customer Detail Skeleton - Loading State
 *
 * Shows a loading skeleton while customer data loads.
 * Matches the layout of the actual customer detail page.
 */
export function CustomerDetailSkeleton() {
	return (
		<div className="flex h-full flex-col gap-6 p-6">
			{/* Header Section */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<div className="h-8 w-64 animate-pulse rounded bg-muted" />
					<div className="h-4 w-48 animate-pulse rounded bg-muted" />
				</div>
				<div className="flex gap-2">
					<div className="h-10 w-24 animate-pulse rounded bg-muted" />
					<div className="h-10 w-24 animate-pulse rounded bg-muted" />
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div className="rounded-lg border border-border bg-card p-4" key={i}>
						<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="flex gap-2 border-border border-b">
				{[1, 2, 3, 4, 5].map((i) => (
					<div className="h-10 w-24 animate-pulse rounded-t bg-muted" key={i} />
				))}
			</div>

			{/* Content Area */}
			<div className="flex-1 space-y-4">
				<div className="h-64 animate-pulse rounded-lg bg-muted" />
				<div className="h-64 animate-pulse rounded-lg bg-muted" />
			</div>
		</div>
	);
}
