/**
 * Reporting Skeleton - Loading State
 *
 * Matches the analytics dashboard layout structure with toolbar
 */
export function ReportingSkeleton() {
	return (
		<div className="flex w-full flex-col">
			{/* Toolbar Skeleton */}
			<div className="flex flex-col gap-4 border-b bg-background px-6 py-4">
				{/* Top Row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-muted h-8 w-8 animate-pulse rounded" />
						<div className="bg-border h-6 w-px" />
						<div className="space-y-2">
							<div className="bg-muted h-7 w-48 animate-pulse rounded" />
							<div className="bg-muted h-4 w-72 animate-pulse rounded" />
						</div>
					</div>
					<div className="flex items-center gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="bg-muted h-9 w-24 animate-pulse rounded"
							/>
						))}
					</div>
				</div>
				{/* Bottom Row - Date Filters */}
				<div className="flex items-center gap-3">
					<div className="bg-muted h-9 w-48 animate-pulse rounded-lg" />
					<div className="bg-muted h-9 w-32 animate-pulse rounded" />
					<div className="bg-muted h-9 w-56 animate-pulse rounded" />
				</div>
			</div>

			{/* Content Skeleton */}
			<div className="flex w-full flex-col gap-4 p-6">
				{/* KPI Cards Skeleton */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="bg-card border rounded-lg p-4 space-y-3">
							<div className="flex justify-between items-center">
								<div className="bg-muted h-4 w-24 animate-pulse rounded" />
								<div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
							</div>
							<div className="bg-muted h-8 w-28 animate-pulse rounded" />
							<div className="bg-muted h-4 w-32 animate-pulse rounded" />
						</div>
					))}
				</div>

				{/* Charts Skeleton */}
				<div className="grid gap-4 lg:grid-cols-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="bg-card border rounded-lg p-4 space-y-3">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="bg-muted h-[200px] w-full animate-pulse rounded" />
						</div>
					))}
				</div>

				{/* Secondary Metrics Skeleton */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="bg-card border rounded-lg p-4 space-y-3">
							<div className="bg-muted h-5 w-36 animate-pulse rounded" />
							<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							<div className="bg-muted h-12 w-full animate-pulse rounded" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
