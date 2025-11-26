/**
 * Coming Soon Page Skeleton
 *
 * Loading state for coming soon page.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function ComingSoonSkeleton() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-4 w-96" />
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton key={i} className="h-24 rounded-lg" />
				))}
			</div>
		</div>
	);
}
