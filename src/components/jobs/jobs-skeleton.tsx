/**
 * Jobs Page Skeleton - Loading State
 *
 * Matches the Jobs summary layout to avoid layout shift while data streams in.
 */
export function JobsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Stats skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div className="bg-muted/40 h-28 animate-pulse rounded-lg border p-4" key={i}>
						<div className="mb-4 flex items-center justify-between">
							<div className="bg-muted h-4 w-24 rounded" />
							<div className="bg-muted size-5 rounded-full" />
						</div>
						<div className="bg-muted h-6 w-16 rounded" />
						<div className="bg-muted mt-2 h-3 w-24 rounded" />
					</div>
				))}
			</div>

			{/* Main content skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				{/* Active Jobs list */}
				<div className="bg-card col-span-4 space-y-4 rounded-lg border p-4">
					<div className="space-y-2">
						<div className="bg-muted h-5 w-32 animate-pulse rounded" />
						<div className="bg-muted h-4 w-48 animate-pulse rounded" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div className="flex items-center gap-4 rounded-md border p-3" key={i}>
								<div className="bg-muted size-10 animate-pulse rounded-full" />
								<div className="flex-1 space-y-2">
									<div className="bg-muted h-4 w-40 animate-pulse rounded" />
									<div className="bg-muted h-3 w-32 animate-pulse rounded" />
									<div className="bg-muted h-3 w-28 animate-pulse rounded" />
								</div>
								<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							</div>
						))}
					</div>
				</div>

				{/* Summary card */}
				<div className="bg-card col-span-3 space-y-4 rounded-lg border p-4">
					<div className="space-y-2">
						<div className="bg-muted h-5 w-32 animate-pulse rounded" />
						<div className="bg-muted h-4 w-40 animate-pulse rounded" />
					</div>
					{[1, 2, 3, 4].map((i) => (
						<div className="bg-muted/40 flex items-center justify-between rounded-md p-3" key={i}>
							<div className="space-y-2">
								<div className="bg-muted h-4 w-28 animate-pulse rounded" />
								<div className="bg-muted h-3 w-20 animate-pulse rounded" />
							</div>
							<div className="space-y-2 text-right">
								<div className="bg-muted h-4 w-10 animate-pulse rounded" />
								<div className="bg-muted h-3 w-16 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
