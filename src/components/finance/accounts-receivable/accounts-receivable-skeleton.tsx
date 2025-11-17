export function AccountsReceivableSkeleton() {
	return (
		<div className="relative space-y-10 py-8 md:py-12">
			<div className="flex justify-center">
				<div className="bg-muted h-9 w-32 animate-pulse rounded-full" />
			</div>
			<div className="flex justify-center">
				<div className="bg-muted size-24 animate-pulse rounded-full" />
			</div>
			<div className="mx-auto max-w-3xl space-y-3 text-center">
				<div className="bg-muted mx-auto h-12 w-96 animate-pulse rounded" />
				<div className="bg-muted mx-auto h-6 w-full max-w-2xl animate-pulse rounded" />
			</div>
			<div className="mx-auto max-w-5xl space-y-8 pt-4">
				<div className="bg-card rounded-lg border p-8 text-center">
					<div className="bg-muted mx-auto mb-3 h-7 w-48 animate-pulse rounded" />
					<div className="bg-muted mx-auto mb-6 h-5 w-64 animate-pulse rounded" />
				</div>
			</div>
		</div>
	);
}
