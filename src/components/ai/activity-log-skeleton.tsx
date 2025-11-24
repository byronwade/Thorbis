"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ActivityLogSkeleton() {
	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			{/* Stats cards */}
			<div className="grid grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="p-4 border rounded-lg">
						<Skeleton className="h-4 w-20 mb-2" />
						<Skeleton className="h-8 w-16" />
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="flex gap-2">
				<Skeleton className="h-9 w-32" />
				<Skeleton className="h-9 w-32" />
				<Skeleton className="h-9 w-40" />
			</div>

			{/* Activity list */}
			<div className="border rounded-lg divide-y">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="p-4 flex items-center gap-4">
						<Skeleton className="size-8 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-3 w-32" />
						</div>
						<Skeleton className="h-8 w-20" />
					</div>
				))}
			</div>
		</div>
	);
}
