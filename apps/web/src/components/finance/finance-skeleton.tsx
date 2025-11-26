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
					<div
						className="bg-muted/40 h-28 animate-pulse rounded-lg border p-4"
						key={i}
					>
						<div className="mb-4 flex items-center justify-between">
							<div className="bg-muted h-4 w-32 rounded" />
							<div className="bg-muted size-5 rounded-full" />
						</div>
						<div className="bg-muted h-6 w-20 rounded" />
						<div className="bg-muted mt-2 h-3 w-24 rounded" />
					</div>
				))}
			</div>

			{/* Bank accounts + buckets skeleton */}
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="bg-card h-72 animate-pulse rounded-lg border p-4">
					<div className="mb-4 space-y-2">
						<div className="bg-muted h-5 w-40 rounded" />
						<div className="bg-muted h-4 w-64 rounded" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div className="bg-muted/60 h-12 rounded-md" key={i} />
						))}
					</div>
				</div>
				<div className="bg-card h-72 animate-pulse rounded-lg border p-4">
					<div className="mb-4 space-y-2">
						<div className="bg-muted h-5 w-40 rounded" />
						<div className="bg-muted h-4 w-64 rounded" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div className="bg-muted/60 h-10 rounded-md" key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
