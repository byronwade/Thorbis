import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for companies table
 */
export function CompaniesTableSkeleton() {
	return (
		<div className="space-y-4">
			{/* Search bar */}
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-full max-w-sm" />
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<div className="p-4 space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-3 w-32" />
							</div>
							<Skeleton className="h-6 w-20" />
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-6 w-24" />
							<Skeleton className="h-6 w-20" />
							<Skeleton className="h-8 w-8" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



