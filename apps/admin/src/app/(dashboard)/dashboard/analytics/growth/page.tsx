import { Suspense } from "react";
import { getGrowthMetrics } from "@/actions/growth";
import { GrowthDashboard } from "@/components/analytics/growth-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Growth Analytics Page
 *
 * Platform growth metrics including signups, activations, feature adoption, and retention.
 */
async function GrowthData() {
	const result = await getGrowthMetrics();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load growth metrics"}
				</p>
			</div>
		);
	}

	return <GrowthDashboard metrics={result.data} />;
}

export default function GrowthPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Growth Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Track platform growth, signups, activations, and retention
				</p>
			</div>
			<Suspense fallback={<GrowthSkeleton />}>
				<GrowthData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for growth analytics
 */
function GrowthSkeleton() {
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
			{Array.from({ length: 3 }).map((_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<Skeleton className="h-6 w-48 mb-4" />
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, j) => (
								<Skeleton key={j} className="h-12 w-full" />
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

