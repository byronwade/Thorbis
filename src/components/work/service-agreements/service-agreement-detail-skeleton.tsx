/**
 * Service Agreement Detail Skeleton - PPR Loading State
 *
 * Renders instantly while service agreement data streams in.
 * Provides immediate visual feedback to the user.
 *
 * Performance: Renders in 5-20ms (instant!)
 */

export function ServiceAgreementDetailSkeleton() {
	return (
		<div className="flex h-full w-full flex-col overflow-auto">
			<div className="mx-auto w-full max-w-7xl space-y-6 p-6">
				{/* Header skeleton */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="bg-muted h-8 w-64 animate-pulse rounded" />
							<div className="bg-muted h-4 w-80 animate-pulse rounded" />
						</div>
						<div className="flex gap-2">
							<div className="bg-muted h-10 w-28 animate-pulse rounded" />
							<div className="bg-muted h-10 w-28 animate-pulse rounded" />
						</div>
					</div>
				</div>

				{/* Stats bar skeleton */}
				<div className="grid gap-4 md:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<div className="space-y-2 rounded-lg border p-4" key={i}>
							<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
						</div>
					))}
				</div>

				{/* Main content skeleton */}
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Left column - Agreement details */}
					<div className="space-y-6 lg:col-span-2">
						{/* Customer & Property */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-40 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
								<div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
							</div>
						</div>

						{/* Services included */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-48 animate-pulse rounded" />
							<div className="space-y-3">
								{[1, 2, 3, 4, 5].map((i) => (
									<div className="flex items-center gap-3" key={i}>
										<div className="bg-muted size-5 animate-pulse rounded" />
										<div className="bg-muted h-4 w-64 animate-pulse rounded" />
									</div>
								))}
							</div>
						</div>

						{/* Jobs & Invoices */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-40 animate-pulse rounded" />
							<div className="space-y-3">
								{[1, 2, 3].map((i) => (
									<div className="flex justify-between" key={i}>
										<div className="bg-muted h-4 w-48 animate-pulse rounded" />
										<div className="bg-muted h-4 w-24 animate-pulse rounded" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right column - Status & info */}
					<div className="space-y-6">
						{/* Status */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-24 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
							</div>
						</div>

						{/* Dates */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
							</div>
						</div>

						{/* Pricing */}
						<div className="space-y-4 rounded-lg border p-6">
							<div className="bg-muted h-6 w-24 animate-pulse rounded" />
							<div className="space-y-2">
								{[1, 2, 3].map((i) => (
									<div className="flex justify-between" key={i}>
										<div className="bg-muted h-4 w-24 animate-pulse rounded" />
										<div className="bg-muted h-4 w-32 animate-pulse rounded" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Tabs skeleton */}
				<div className="space-y-4">
					<div className="flex gap-4 border-b">
						{[1, 2, 3, 4].map((i) => (
							<div className="bg-muted h-10 w-28 animate-pulse rounded-t" key={i} />
						))}
					</div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div className="bg-muted h-24 w-full animate-pulse rounded" key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
