/**
 * Price Book Item Detail Skeleton - Loading State
 *
 * Matches the exact layout of the price book item detail page to prevent layout shifts.
 */
export function PriceBookItemDetailSkeleton() {
	return (
		<>
			{/* Header skeleton */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<div className="bg-muted h-9 w-64 animate-pulse rounded" />
					<div className="bg-muted h-6 w-20 animate-pulse rounded" />
					<div className="bg-muted h-6 w-16 animate-pulse rounded" />
				</div>
				<div className="bg-muted h-5 w-48 animate-pulse rounded" />
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Pricing Card skeleton */}
					<div className="bg-card h-64 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="grid gap-6 sm:grid-cols-3">
								<div className="bg-muted h-24 animate-pulse rounded-lg" />
								<div className="bg-muted h-24 animate-pulse rounded-lg" />
								<div className="bg-muted h-24 animate-pulse rounded-lg" />
							</div>
						</div>
					</div>

					{/* Description skeleton */}
					<div className="bg-card h-32 animate-pulse rounded-lg border p-6">
						<div className="space-y-2">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="bg-muted h-4 w-full animate-pulse rounded" />
							<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
						</div>
					</div>

					{/* Price History skeleton */}
					<div className="bg-card h-96 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							{[1, 2].map((i) => (
								<div className="bg-muted h-32 animate-pulse rounded-lg" key={i} />
							))}
						</div>
					</div>
				</div>

				{/* Sidebar skeleton */}
				<div className="space-y-6">
					{/* Item Details skeleton */}
					<div className="bg-card h-64 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-24 animate-pulse rounded" />
							<div className="bg-muted h-12 w-full animate-pulse rounded" />
							<div className="bg-muted h-4 w-full animate-pulse rounded" />
							<div className="bg-muted h-4 w-full animate-pulse rounded" />
						</div>
					</div>

					{/* Tags skeleton */}
					<div className="bg-card h-32 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-24 animate-pulse rounded" />
							<div className="flex flex-wrap gap-2">
								{[1, 2, 3, 4].map((i) => (
									<div className="bg-muted h-6 w-20 animate-pulse rounded" key={i} />
								))}
							</div>
						</div>
					</div>

					{/* Quick Stats skeleton */}
					<div className="bg-card h-40 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-24 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
