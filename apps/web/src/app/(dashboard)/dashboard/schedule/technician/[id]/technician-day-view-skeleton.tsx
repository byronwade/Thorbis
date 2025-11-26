import { Skeleton } from "@/components/ui/skeleton";

export function TechnicianDayViewSkeleton() {
	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<Skeleton className="h-16 w-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-32" />
					</div>
					<div className="ml-auto flex gap-2">
						<Skeleton className="h-9 w-24" />
						<Skeleton className="h-9 w-24" />
					</div>
				</div>
			</div>

			{/* Stats row */}
			<div className="border-b bg-muted/30 px-6 py-3">
				<div className="flex gap-6">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex items-center gap-2">
							<Skeleton className="h-8 w-8 rounded" />
							<div className="space-y-1">
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-5 w-12" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Main content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Timeline/Route section */}
				<div className="flex-1 border-r p-6">
					<Skeleton className="mb-4 h-6 w-32" />
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex gap-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-64" />
									<Skeleton className="h-4 w-32" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Map section */}
				<div className="w-[500px] p-6">
					<Skeleton className="mb-4 h-6 w-24" />
					<Skeleton className="h-[400px] w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
