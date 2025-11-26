/**
 * Job Status Skeleton - Loading State
 *
 * Matches the exact layout of job status data to prevent layout shifts.
 * Displays while content is loading.
 */

export function JobStatusSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
			{/* Job status list skeleton */}
			<div className="bg-card col-span-4 space-y-4 rounded-lg border p-6">
				<div className="space-y-2">
					<div className="bg-muted h-6 w-40 animate-pulse rounded" />
					<div className="bg-muted h-4 w-72 animate-pulse rounded" />
				</div>

				<div className="space-y-4">
					{[...new Array(5)].map((_, i) => (
						<div
							className="flex items-center gap-4 rounded-lg border p-4"
							key={i}
						>
							<div className="bg-muted size-12 animate-pulse rounded-full" />
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<div className="bg-muted h-4 w-32 animate-pulse rounded" />
									<div className="bg-muted h-5 w-24 animate-pulse rounded-full" />
								</div>
								<div className="bg-muted h-3 w-48 animate-pulse rounded" />
								<div className="flex items-center gap-2">
									<div className="bg-muted h-2 flex-1 animate-pulse rounded-full" />
									<div className="bg-muted h-3 w-8 animate-pulse rounded" />
								</div>
							</div>
							<div className="space-y-1 text-right">
								<div className="bg-muted ml-auto h-4 w-32 animate-pulse rounded" />
								<div className="bg-muted ml-auto h-3 w-24 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Analytics skeleton */}
			<div className="bg-card col-span-3 space-y-4 rounded-lg border p-6">
				<div className="space-y-2">
					<div className="bg-muted h-6 w-40 animate-pulse rounded" />
					<div className="bg-muted h-4 w-64 animate-pulse rounded" />
				</div>

				<div className="space-y-4">
					{[...new Array(5)].map((_, i) => (
						<div
							className="bg-accent flex items-center justify-between rounded-lg p-3"
							key={i}
						>
							<div className="space-y-1">
								<div className="bg-muted h-4 w-32 animate-pulse rounded" />
								<div className="bg-muted h-3 w-24 animate-pulse rounded" />
							</div>
							<div className="space-y-1 text-right">
								<div className="bg-muted ml-auto h-4 w-12 animate-pulse rounded" />
								<div className="bg-muted ml-auto h-3 w-24 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
