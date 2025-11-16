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
					<div className="h-28 animate-pulse rounded-lg border bg-muted/40 p-4" key={i}>
						<div className="mb-4 flex items-center justify-between">
							<div className="h-4 w-24 rounded bg-muted" />
							<div className="size-5 rounded-full bg-muted" />
						</div>
						<div className="h-6 w-16 rounded bg-muted" />
						<div className="mt-2 h-3 w-24 rounded bg-muted" />
					</div>
				))}
			</div>

			{/* Main content skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				{/* Active Jobs list */}
				<div className="col-span-4 space-y-4 rounded-lg border bg-card p-4">
					<div className="space-y-2">
						<div className="h-5 w-32 animate-pulse rounded bg-muted" />
						<div className="h-4 w-48 animate-pulse rounded bg-muted" />
					</div>
					<div className="space-y-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div className="flex items-center gap-4 rounded-md border p-3" key={i}>
								<div className="size-10 animate-pulse rounded-full bg-muted" />
								<div className="flex-1 space-y-2">
									<div className="h-4 w-40 animate-pulse rounded bg-muted" />
									<div className="h-3 w-32 animate-pulse rounded bg-muted" />
									<div className="h-3 w-28 animate-pulse rounded bg-muted" />
								</div>
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							</div>
						))}
					</div>
				</div>

				{/* Summary card */}
				<div className="col-span-3 space-y-4 rounded-lg border bg-card p-4">
					<div className="space-y-2">
						<div className="h-5 w-32 animate-pulse rounded bg-muted" />
						<div className="h-4 w-40 animate-pulse rounded bg-muted" />
					</div>
					{[1, 2, 3, 4].map((i) => (
						<div className="flex items-center justify-between rounded-md bg-muted/40 p-3" key={i}>
							<div className="space-y-2">
								<div className="h-4 w-28 animate-pulse rounded bg-muted" />
								<div className="h-3 w-20 animate-pulse rounded bg-muted" />
							</div>
							<div className="space-y-2 text-right">
								<div className="h-4 w-10 animate-pulse rounded bg-muted" />
								<div className="h-3 w-16 animate-pulse rounded bg-muted" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
