export function UjobsSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<div className="h-8 w-48 animate-pulse rounded bg-muted" />
				<div className="flex gap-2">
					<div className="h-8 w-24 animate-pulse rounded bg-muted" />
					<div className="h-8 w-24 animate-pulse rounded bg-muted" />
				</div>
			</div>
			<div className="space-y-2">
				{[...new Array(10)].map((_, i) => (
					<div className="flex items-center gap-4" key={i}>
						<div className="h-12 w-12 animate-pulse rounded bg-muted" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
							<div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
						</div>
						<div className="h-8 w-20 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}
