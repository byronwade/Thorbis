/**
 * Finance Page Skeleton - Loading State
 *
 * Matches the Finance dashboard layout to avoid layout shift while
 * data streams in under PPR.
 */
export function FinanceSkeleton() {
	return (
		<div className="space-y-6">
			{/* Stats skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div className="h-28 animate-pulse rounded-lg border bg-muted/40 p-4" key={i}>
						<div className="mb-4 flex items-center justify-between">
							<div className="h-4 w-32 rounded bg-muted" />
							<div className="size-5 rounded-full bg-muted" />
						</div>
						<div className="h-6 w-20 rounded bg-muted" />
						<div className="mt-2 h-3 w-24 rounded bg-muted" />
					</div>
				))}
			</div>

			{/* Bank accounts + buckets skeleton */}
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="h-72 animate-pulse rounded-lg border bg-card p-4">
					<div className="mb-4 space-y-2">
						<div className="h-5 w-40 rounded bg-muted" />
						<div className="h-4 w-64 rounded bg-muted" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div className="h-12 rounded-md bg-muted/60" key={i} />
						))}
					</div>
				</div>
				<div className="h-72 animate-pulse rounded-lg border bg-card p-4">
					<div className="mb-4 space-y-2">
						<div className="h-5 w-40 rounded bg-muted" />
						<div className="h-4 w-64 rounded bg-muted" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div className="h-10 rounded-md bg-muted/60" key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
