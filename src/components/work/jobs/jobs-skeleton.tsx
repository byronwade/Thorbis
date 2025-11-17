/**
 * Jobs Skeleton - Loading State
 *
 * Matches the list layout used by other Work pages (search + table rows)
 * to keep the UX consistent and avoid layout shifts.
 */
export function JobsSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4">
			{/* Search and filters skeleton */}
			<div className="flex items-center gap-4">
				<div className="bg-muted h-10 w-64 animate-pulse rounded" />
				<div className="bg-muted h-10 w-32 animate-pulse rounded" />
				<div className="bg-muted h-10 w-32 animate-pulse rounded" />
			</div>

			{/* Table / list skeleton */}
			<div className="flex-1 space-y-2">
				{[...new Array(10)].map((_, i) => (
					<div className="flex items-center gap-4 rounded-md border p-3" key={i}>
						{/* Job number + title */}
						<div className="bg-muted h-8 flex-1 animate-pulse rounded" />
						{/* Customer */}
						<div className="bg-muted h-8 w-40 animate-pulse rounded" />
						{/* Status */}
						<div className="bg-muted h-8 w-24 animate-pulse rounded" />
						{/* Scheduled date */}
						<div className="bg-muted h-8 w-32 animate-pulse rounded" />
						{/* Amount */}
						<div className="bg-muted h-8 w-24 animate-pulse rounded" />
					</div>
				))}
			</div>
		</div>
	);
}
