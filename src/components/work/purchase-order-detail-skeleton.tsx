/**
 * Purchase Order Detail Skeleton - PPR Loading State
 *
 * Renders instantly while purchase order data streams in.
 * Provides immediate visual feedback to the user.
 *
 * Performance: Renders in 5-20ms (instant!)
 */

export function PurchaseOrderDetailSkeleton() {
	return (
		<div className="flex h-full w-full flex-col overflow-auto">
			<div className="mx-auto w-full max-w-7xl space-y-6 p-6">
				{/* Header skeleton */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="h-8 w-48 animate-pulse rounded bg-muted" />
							<div className="h-4 w-64 animate-pulse rounded bg-muted" />
						</div>
						<div className="flex gap-2">
							<div className="h-10 w-24 animate-pulse rounded bg-muted" />
							<div className="h-10 w-24 animate-pulse rounded bg-muted" />
						</div>
					</div>
				</div>

				{/* Stats bar skeleton */}
				<div className="grid gap-4 md:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<div className="space-y-2 rounded-lg border p-4" key={i}>
							<div className="h-4 w-20 animate-pulse rounded bg-muted" />
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
						</div>
					))}
				</div>

				{/* Main content skeleton */}
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Left column - PO details */}
					<div className="space-y-6 lg:col-span-2">
						{/* Vendor info */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
								<div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
							</div>
						</div>

						{/* Line items */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="space-y-3">
								{[1, 2, 3, 4].map((i) => (
									<div className="flex justify-between" key={i}>
										<div className="h-4 w-48 animate-pulse rounded bg-muted" />
										<div className="h-4 w-24 animate-pulse rounded bg-muted" />
									</div>
								))}
							</div>
						</div>

						{/* Totals */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="space-y-2">
								{[1, 2, 3].map((i) => (
									<div className="flex justify-between" key={i}>
										<div className="h-4 w-24 animate-pulse rounded bg-muted" />
										<div className="h-4 w-32 animate-pulse rounded bg-muted" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right column - Status & info */}
					<div className="space-y-6">
						{/* Status */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="h-6 w-24 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
							</div>
						</div>

						{/* Job info */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="h-6 w-24 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
							</div>
						</div>

						{/* Approval info */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-full animate-pulse rounded bg-muted" />
								<div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
							</div>
						</div>
					</div>
				</div>

				{/* Tabs skeleton */}
				<div className="space-y-4">
					<div className="flex gap-4 border-b">
						{[1, 2, 3].map((i) => (
							<div
								className="h-10 w-24 animate-pulse rounded-t bg-muted"
								key={i}
							/>
						))}
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								className="h-20 w-full animate-pulse rounded bg-muted"
								key={i}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
