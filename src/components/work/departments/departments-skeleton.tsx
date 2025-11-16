export function DepartmentsSkeleton() {
	return (
		<div className="relative space-y-10 py-8 md:py-12">
			<div className="flex justify-center">
				<div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
			</div>
			<div className="flex justify-center">
				<div className="size-24 animate-pulse rounded-full bg-muted" />
			</div>
			<div className="mx-auto max-w-3xl space-y-3 text-center">
				<div className="mx-auto h-12 w-96 animate-pulse rounded bg-muted" />
				<div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
			</div>
		</div>
	);
}
