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
					<div className="h-6 w-32 animate-pulse rounded bg-muted" />
					{/* Title skeleton */}
					<div className="h-8 w-64 animate-pulse rounded bg-muted" />
					{/* Customer skeleton */}
					<div className="h-4 w-48 animate-pulse rounded bg-muted" />
				</div>
				{/* Action buttons skeleton */}
				<div className="flex gap-2">
					<div className="h-10 w-24 animate-pulse rounded bg-muted" />
					<div className="h-10 w-24 animate-pulse rounded bg-muted" />
				</div>
			</div>

			{/* Stats cards skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						className="h-24 animate-pulse rounded-lg border bg-card p-4"
						key={i}
					>
						<div className="space-y-2">
							<div className="h-4 w-20 animate-pulse rounded bg-muted" />
							<div className="h-6 w-16 animate-pulse rounded bg-muted" />
						</div>
					</div>
				))}
			</div>

			{/* Tabs skeleton */}
			<div className="space-y-4">
				<div className="flex gap-4 border-b">
					{[1, 2, 3, 4].map((i) => (
						<div
							className="h-10 w-24 animate-pulse rounded-t bg-muted"
							key={i}
						/>
					))}
				</div>

				{/* Content skeleton */}
				<div className="space-y-4">
					{/* Contract details card */}
					<div className="h-64 animate-pulse rounded-lg border bg-card p-6">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
								<div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
							</div>
						</div>
					</div>

					{/* Signer details card */}
					<div className="h-48 animate-pulse rounded-lg border bg-card p-6">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="grid gap-4 md:grid-cols-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
							</div>
						</div>
					</div>

					{/* Related records card */}
					<div className="h-32 animate-pulse rounded-lg border bg-card p-6">
						<div className="space-y-4">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="flex gap-4">
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
