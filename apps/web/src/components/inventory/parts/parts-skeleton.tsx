/**
 * Parts Skeleton - Loading State
 *
 * Matches the exact layout of parts data to prevent layout shifts.
 * Displays while content is loading.
 */

export function PartsSkeleton() {
	return (
		<div className="relative space-y-10 py-8 md:py-12">
			{/* Status badge skeleton */}
			<div className="flex justify-center">
				<div className="bg-muted h-9 w-32 animate-pulse rounded-full" />
			</div>

			{/* Icon skeleton */}
			<div className="flex justify-center">
				<div className="bg-muted size-24 animate-pulse rounded-full" />
			</div>

			{/* Title and description skeleton */}
			<div className="mx-auto max-w-3xl space-y-3 text-center">
				<div className="bg-muted mx-auto h-12 w-96 animate-pulse rounded" />
				<div className="bg-muted mx-auto h-6 w-full max-w-2xl animate-pulse rounded" />
			</div>

			{/* Feature cards skeleton - 2x2 grid */}
			<div className="mx-auto max-w-5xl space-y-8 pt-4">
				<div className="grid gap-6 md:grid-cols-2">
					{[...new Array(4)].map((_, i) => (
						<div className="bg-card space-y-3 rounded-lg border p-6" key={i}>
							<div className="bg-muted size-12 animate-pulse rounded-lg" />
							<div className="bg-muted h-6 w-40 animate-pulse rounded" />
							<div className="space-y-2">
								<div className="bg-muted h-4 w-full animate-pulse rounded" />
								<div className="bg-muted h-4 w-4/5 animate-pulse rounded" />
							</div>
						</div>
					))}
				</div>

				{/* CTA skeleton */}
				<div className="bg-card rounded-lg border p-8 text-center">
					<div className="bg-muted mx-auto mb-3 h-7 w-64 animate-pulse rounded" />
					<div className="bg-muted mx-auto mb-6 h-5 w-56 animate-pulse rounded" />
					<div className="flex justify-center gap-4">
						<div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
						<div className="bg-muted h-10 w-36 animate-pulse rounded-lg" />
					</div>
				</div>
			</div>

			{/* Footer message skeleton */}
			<div className="flex justify-center pt-8">
				<div className="bg-muted h-4 w-80 animate-pulse rounded" />
			</div>
		</div>
	);
}
