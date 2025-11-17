/**
 * Dashboard Skeleton - Loading State
 *
 * Matches the exact layout of the dashboard to prevent layout shifts.
 * Displays while dashboard content is loading.
 */
export function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Stats skeleton - 4 cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...new Array(4)].map((_, i) => (
					<div className="bg-card animate-pulse rounded-lg border p-6" key={i}>
						<div className="bg-muted h-4 w-24 rounded" />
						<div className="bg-muted mt-2 h-8 w-32 rounded" />
						<div className="bg-muted mt-2 h-3 w-20 rounded" />
					</div>
				))}
			</div>

			{/* Content skeleton - 2 columns */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Left column */}
				<div className="space-y-6">
					{/* Operations card */}
					<div className="bg-card animate-pulse rounded-lg border p-6">
						<div className="bg-muted h-6 w-32 rounded" />
						<div className="mt-4 space-y-3">
							{[...new Array(5)].map((_, i) => (
								<div className="bg-muted h-16 rounded" key={i} />
							))}
						</div>
					</div>

					{/* Schedule card */}
					<div className="bg-card animate-pulse rounded-lg border p-6">
						<div className="bg-muted h-6 w-32 rounded" />
						<div className="mt-4 space-y-3">
							{[...new Array(4)].map((_, i) => (
								<div className="bg-muted h-16 rounded" key={i} />
							))}
						</div>
					</div>
				</div>

				{/* Right column */}
				<div className="space-y-6">
					{/* Communications card */}
					<div className="bg-card animate-pulse rounded-lg border p-6">
						<div className="bg-muted h-6 w-32 rounded" />
						<div className="mt-4 space-y-3">
							{[...new Array(5)].map((_, i) => (
								<div className="bg-muted h-16 rounded" key={i} />
							))}
						</div>
					</div>

					{/* Financial card */}
					<div className="bg-card animate-pulse rounded-lg border p-6">
						<div className="bg-muted h-6 w-32 rounded" />
						<div className="mt-4 space-y-3">
							{[...new Array(4)].map((_, i) => (
								<div className="bg-muted h-16 rounded" key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
