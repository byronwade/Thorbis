/**
 * Skeleton UI for generic work "new" routes (e.g. appointments/contracts).
 * Used as a Suspense fallback while loading creation forms.
 */
export function WorkNewSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<div className="bg-muted h-8 w-64 animate-pulse rounded" />
				<div className="flex gap-2">
					<div className="bg-muted h-8 w-24 animate-pulse rounded" />
					<div className="bg-muted h-8 w-24 animate-pulse rounded" />
				</div>
			</div>
			<div className="space-y-3">
				{[...new Array(6)].map((_, index) => (
					<div className="space-y-2" key={index}>
						<div className="bg-muted h-4 w-40 animate-pulse rounded" />
						<div className="bg-muted h-9 w-full animate-pulse rounded" />
					</div>
				))}
			</div>
		</div>
	);
}
