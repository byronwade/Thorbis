import { Suspense } from "react";
import { getSystemHealthMetrics } from "@/actions/system-health";
import { SystemHealthDashboard } from "@/components/work/system-health-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * System Health Dashboard
 *
 * Platform-wide system health monitoring including database status,
 * API performance, integration health, and error tracking.
 */
async function SystemHealthData() {
	const result = await getSystemHealthMetrics();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load system health metrics"}
				</p>
			</div>
		);
	}

	return <SystemHealthDashboard metrics={result.data} />;
}

export default function SystemHealthPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">System Health</h1>
				<p className="text-muted-foreground text-sm">
					Monitor platform-wide system health, API performance, and integration status
				</p>
			</div>
			<Suspense fallback={<SystemHealthSkeleton />}>
				<SystemHealthData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for system health dashboard
 */
function SystemHealthSkeleton() {
	return (
		<div className="space-y-6">
			{/* Database Status Skeleton */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-6 w-20" />
					</div>
					<div className="grid grid-cols-3 gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i}>
								<Skeleton className="h-4 w-24 mb-2" />
								<Skeleton className="h-8 w-16" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* API Metrics Skeleton */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-40 mb-4" />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i}>
								<Skeleton className="h-4 w-24 mb-2" />
								<Skeleton className="h-8 w-16" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Integrations Skeleton */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-24 w-full" />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Errors Skeleton */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-6 w-20" />
					</div>
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-20 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



