/**
 * Marketing Page Skeleton - Loading State
 *
 * Matches the marketing leads layout (stats row + full-width table)
 * to avoid layout shifts while data streams in.
 */
export function MarketingSkeleton() {
	return (
		<div className="space-y-4">
			{/* Stats skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						className="bg-muted/40 h-24 animate-pulse rounded-lg border p-4"
						key={i}
					>
						<div className="mb-3 flex items-center justify-between">
							<div className="bg-muted h-4 w-24 rounded" />
							<div className="bg-muted size-5 rounded-full" />
						</div>
						<div className="bg-muted h-6 w-16 rounded" />
						<div className="bg-muted mt-2 h-3 w-20 rounded" />
					</div>
				))}
			</div>

			{/* Table skeleton */}
			<div className="bg-card space-y-2 rounded-lg border p-3">
				{/* Table header */}
				<div className="bg-muted/40 flex items-center gap-4 rounded-md p-3">
					<div className="bg-muted h-4 w-6 rounded" />
					<div className="bg-muted h-4 flex-1 rounded" />
					<div className="bg-muted h-4 w-40 rounded" />
					<div className="bg-muted h-4 w-32 rounded" />
					<div className="bg-muted h-4 w-24 rounded" />
					<div className="bg-muted h-4 w-16 rounded" />
				</div>

				{/* Table rows */}
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						className="flex items-center gap-4 rounded-md border p-3"
						key={i}
					>
						<div className="bg-muted h-8 w-6 rounded" />
						<div className="flex-1 space-y-2">
							<div className="bg-muted h-4 w-40 rounded" />
							<div className="bg-muted h-3 w-32 rounded" />
						</div>
						<div className="bg-muted h-4 w-32 rounded" />
						<div className="bg-muted h-4 w-24 rounded" />
						<div className="bg-muted h-4 w-20 rounded" />
						<div className="bg-muted h-8 w-8 rounded-full" />
					</div>
				))}
			</div>
		</div>
	);
}
