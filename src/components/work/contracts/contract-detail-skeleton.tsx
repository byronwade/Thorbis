/**
 * Contract Detail Skeleton - Loading State
 *
 * Matches the exact layout of the contract detail page to prevent layout shifts.
 */
export function ContractDetailSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header section */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					{/* Contract number skeleton */}
					<div className="bg-muted h-6 w-32 animate-pulse rounded" />
					{/* Title skeleton */}
					<div className="bg-muted h-8 w-64 animate-pulse rounded" />
					{/* Customer skeleton */}
					<div className="bg-muted h-4 w-48 animate-pulse rounded" />
				</div>
				{/* Action buttons skeleton */}
				<div className="flex gap-2">
					<div className="bg-muted h-10 w-24 animate-pulse rounded" />
					<div className="bg-muted h-10 w-24 animate-pulse rounded" />
				</div>
			</div>

			{/* Stats cards skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{[1, 2, 3, 4, 5].map((i) => (
					<div className="bg-card h-24 animate-pulse rounded-lg border p-4" key={i}>
						<div className="space-y-2">
							<div className="bg-muted h-4 w-20 animate-pulse rounded" />
							<div className="bg-muted h-6 w-16 animate-pulse rounded" />
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
					{/* Contract details card */}
					<div className="bg-card h-64 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
								<div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
							</div>
						</div>
					</div>

					{/* Signer details card */}
					<div className="bg-card h-48 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="grid gap-4 md:grid-cols-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
							</div>
						</div>
					</div>

					{/* Related records card */}
					<div className="bg-card h-32 animate-pulse rounded-lg border p-6">
						<div className="space-y-4">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="flex gap-4">
								<div className="bg-muted h-4 w-24 animate-pulse rounded" />
								<div className="bg-muted h-4 w-24 animate-pulse rounded" />
								<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
