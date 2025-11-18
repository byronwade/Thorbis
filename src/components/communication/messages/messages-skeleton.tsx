export function MessagesSkeleton() {
	return (
		<div className="flex h-[calc(100vh-64px)] flex-col gap-4 p-4">
			<div className="flex gap-4">
				<div className="bg-muted h-12 flex-1 animate-pulse rounded" />
				<div className="bg-muted h-12 w-32 animate-pulse rounded" />
			</div>
			<div className="flex flex-1 gap-4">
				<div className="bg-muted hidden w-80 animate-pulse rounded lg:block" />
				<div className="bg-muted flex-1 animate-pulse rounded" />
			</div>
		</div>
	);
}
