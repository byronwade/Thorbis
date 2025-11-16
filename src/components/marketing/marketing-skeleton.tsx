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
						className="h-24 animate-pulse rounded-lg border bg-muted/40 p-4"
						key={i}
					>
						<div className="mb-3 flex items-center justify-between">
							<div className="h-4 w-24 rounded bg-muted" />
							<div className="size-5 rounded-full bg-muted" />
						</div>
						<div className="h-6 w-16 rounded bg-muted" />
						<div className="mt-2 h-3 w-20 rounded bg-muted" />
					</div>
				))}
			</div>

			{/* Table skeleton */}
			<div className="space-y-2 rounded-lg border bg-card p-3">
				{/* Table header */}
				<div className="flex items-center gap-4 rounded-md bg-muted/40 p-3">
					<div className="h-4 w-6 rounded bg-muted" />
					<div className="h-4 flex-1 rounded bg-muted" />
					<div className="h-4 w-40 rounded bg-muted" />
					<div className="h-4 w-32 rounded bg-muted" />
					<div className="h-4 w-24 rounded bg-muted" />
					<div className="h-4 w-16 rounded bg-muted" />
				</div>

				{/* Table rows */}
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						className="flex items-center gap-4 rounded-md border p-3"
						key={i}
					>
						<div className="h-8 w-6 rounded bg-muted" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-40 rounded bg-muted" />
							<div className="h-3 w-32 rounded bg-muted" />
						</div>
						<div className="h-4 w-32 rounded bg-muted" />
						<div className="h-4 w-24 rounded bg-muted" />
						<div className="h-4 w-20 rounded bg-muted" />
						<div className="h-8 w-8 rounded-full bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}
