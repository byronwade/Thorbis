import { Suspense } from "react";
import { getErrorLogs, getErrorStats, getErrorGroups } from "@/actions/errors";
import { ErrorTracker } from "@/components/work/error-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Error Tracking Page
 *
 * Platform-wide error tracking with logs, statistics, trends, and grouping.
 */
async function ErrorTrackingData() {
	const [logsResult, statsResult, groupsResult] = await Promise.all([
		getErrorLogs({ limit: 100 }),
		getErrorStats(),
		getErrorGroups({ limit: 20 }),
	]);

	if (logsResult.error || statsResult.error || groupsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{logsResult.error || statsResult.error || groupsResult.error || "Failed to load error data"}
				</p>
			</div>
		);
	}

	return (
		<ErrorTracker
			logs={logsResult.data || []}
			stats={statsResult.data || { total: 0, bySeverity: { critical: 0, error: 0, warning: 0 }, byCompany: [], trends: [] }}
			groups={groupsResult.data || []}
		/>
	);
}

export default function ErrorTrackingPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Error Tracking</h1>
				<p className="text-muted-foreground text-sm">
					Monitor and analyze platform errors, trends, and patterns
				</p>
			</div>
			<Suspense fallback={<ErrorTrackingSkeleton />}>
				<ErrorTrackingData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for error tracking
 */
function ErrorTrackingSkeleton() {
	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-4" />
							</div>
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex gap-4">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-[180px]" />
						<Skeleton className="h-10 w-32" />
					</div>
				</CardContent>
			</Card>

			{/* Error List */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-24 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

