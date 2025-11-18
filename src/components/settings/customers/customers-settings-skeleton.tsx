/**
 * Settings > Customers Skeleton - Loading State
 *
 * Matches the customers settings layout (header + cards + overview)
 * to avoid layout shifts while data streams in.
 */
export function CustomersSettingsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<div>
				<div className="bg-muted h-10 w-64 animate-pulse rounded" />
				<div className="bg-muted mt-2 h-4 w-80 animate-pulse rounded" />
			</div>

			{/* Cards skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						className="bg-card h-32 animate-pulse rounded-lg border p-6"
						key={i}
					>
						<div className="flex items-start gap-4">
							<div className="bg-muted size-12 rounded-lg" />
							<div className="flex-1 space-y-2">
								<div className="bg-muted h-4 w-32 rounded" />
								<div className="bg-muted h-3 w-40 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Overview card skeleton */}
			<div className="bg-card h-32 animate-pulse rounded-lg border p-6">
				<div className="flex items-start gap-3">
					<div className="bg-muted size-5 rounded-full" />
					<div className="flex-1 space-y-2">
						<div className="bg-muted h-4 w-48 rounded" />
						<div className="bg-muted h-3 w-full rounded" />
						<div className="bg-muted h-3 w-3/4 rounded" />
					</div>
				</div>
			</div>
		</div>
	);
}
