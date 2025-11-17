/**
 * Team Member Detail Skeleton - Loading State
 *
 * Matches the exact layout of the team member detail page to prevent layout shifts.
 */
export function TeamMemberDetailSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header section */}
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-4">
					{/* Avatar skeleton */}
					<div className="bg-muted size-20 animate-pulse rounded-full" />
					<div className="space-y-2">
						{/* Name skeleton */}
						<div className="bg-muted h-8 w-48 animate-pulse rounded" />
						{/* Role skeleton */}
						<div className="bg-muted h-4 w-32 animate-pulse rounded" />
					</div>
				</div>
				{/* Action buttons skeleton */}
				<div className="flex gap-2">
					<div className="bg-muted h-10 w-24 animate-pulse rounded" />
					<div className="bg-muted h-10 w-24 animate-pulse rounded" />
				</div>
			</div>

			{/* Stats cards skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div className="bg-card h-32 animate-pulse rounded-lg border p-6" key={i}>
						<div className="space-y-2">
							<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							<div className="bg-muted h-8 w-16 animate-pulse rounded" />
							<div className="bg-muted h-3 w-32 animate-pulse rounded" />
						</div>
					</div>
				))}
			</div>

			{/* Tabs skeleton */}
			<div className="space-y-4">
				<div className="flex gap-4 border-b">
					{[1, 2, 3, 4].map((i) => (
						<div className="bg-muted h-10 w-24 animate-pulse rounded-t" key={i} />
					))}
				</div>

				{/* Content skeleton */}
				<div className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div className="bg-card h-24 animate-pulse rounded-lg border p-4" key={i}>
							<div className="space-y-2">
								<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
								<div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
