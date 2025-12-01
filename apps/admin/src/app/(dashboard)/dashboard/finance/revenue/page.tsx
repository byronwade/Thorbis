import { Suspense } from "react";
import { getRevenueMetrics } from "@/actions/revenue";
import { RevenueDashboard } from "@/components/finance/revenue-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Revenue Analytics Page
 *
 * Platform revenue metrics including MRR, ARR, and growth trends.
 */
async function RevenueData() {
	const result = await getRevenueMetrics();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load revenue metrics"}
				</p>
			</div>
		);
	}

	return <RevenueDashboard metrics={result.data} />;
}

export default function RevenuePage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Revenue Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Track MRR, ARR, revenue growth, and trends by plan
				</p>
			</div>
			<Suspense fallback={<RevenueSkeleton />}>
				<RevenueData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function RevenueSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-6 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			{Array.from({ length: 2 }).map((_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<Skeleton className="h-6 w-48 mb-4" />
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}



