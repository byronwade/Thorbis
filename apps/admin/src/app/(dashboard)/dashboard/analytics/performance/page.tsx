import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Zap, Clock, AlertCircle } from "lucide-react";
import { getSystemHealthMetrics } from "@/actions/system-health";
import { SystemHealthDashboard } from "@/components/work/system-health-dashboard";

/**
 * Performance Analytics Page
 *
 * System performance metrics and health monitoring.
 */
async function PerformanceData() {
	const result = await getSystemHealthMetrics();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load performance metrics"}
				</p>
			</div>
		);
	}

	return <SystemHealthDashboard metrics={result.data} />;
}

export default function PerformancePage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Monitor system performance, API latency, and database health
				</p>
			</div>
			<Suspense fallback={<PerformanceSkeleton />}>
				<PerformanceData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for performance analytics
 */
function PerformanceSkeleton() {
	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
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
		</div>
	);
}

