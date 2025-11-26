/**
 * Job Templates Skeleton - Loading State
 *
 * Matches the exact layout of job templates data to prevent layout shifts.
 * Displays while content is loading.
 */

export function JobTemplatesSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
			{/* Templates list skeleton */}
			<div className="bg-card col-span-4 space-y-4 rounded-lg border p-6">
				<div className="space-y-2">
					<div className="bg-muted h-6 w-36 animate-pulse rounded" />
					<div className="bg-muted h-4 w-80 animate-pulse rounded" />
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
									<div className="bg-muted h-4 w-40 animate-pulse rounded" />
									<div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
								</div>
								<div className="bg-muted h-3 w-56 animate-pulse rounded" />
								<div className="bg-muted h-3 w-64 animate-pulse rounded" />
							</div>
							<div className="space-y-1 text-right">
								<div className="bg-muted ml-auto h-4 w-16 animate-pulse rounded" />
								<div className="bg-muted ml-auto h-3 w-20 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Analytics skeleton */}
			<div className="bg-card col-span-3 space-y-4 rounded-lg border p-6">
				<div className="space-y-2">
					<div className="bg-muted h-6 w-44 animate-pulse rounded" />
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
								<div className="bg-muted h-3 w-28 animate-pulse rounded" />
							</div>
							<div className="space-y-1 text-right">
								<div className="bg-muted ml-auto h-4 w-12 animate-pulse rounded" />
								<div className="bg-muted ml-auto h-3 w-28 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
