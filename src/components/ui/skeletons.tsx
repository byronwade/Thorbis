import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

/**
 * Reusable skeleton components for loading states
 * Used with Suspense boundaries for streaming SSR
 */

export function KPICardSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="size-9 rounded-lg" />
			</CardHeader>
			<CardContent className="space-y-2">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-3 w-40" />
				<Skeleton className="h-3 w-28" />
			</CardContent>
		</Card>
	);
}

export function ChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-4 w-64" />
			</CardHeader>
			<CardContent>
				<Skeleton className={`w-full ${height}`} />
			</CardContent>
		</Card>
	);
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
			</CardHeader>
			<CardContent className="space-y-3">
				{Array.from({ length: rows }).map((_, i) => (
					<div className="flex items-center gap-4" key={i}>
						<Skeleton className="size-10 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="space-y-8">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-6 w-96" />
			</div>

			{/* KPI Cards Skeleton */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KPICardSkeleton />
				<KPICardSkeleton />
				<KPICardSkeleton />
				<KPICardSkeleton />
			</div>

			{/* Charts Skeleton */}
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<ChartSkeleton />
				</div>
				<div className="lg:col-span-1">
					<TableSkeleton rows={4} />
				</div>
			</div>
		</div>
	);
}
