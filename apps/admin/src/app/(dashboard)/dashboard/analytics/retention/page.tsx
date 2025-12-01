import { Suspense } from "react";
import { getGrowthMetrics } from "@/actions/growth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

/**
 * Retention Analytics Page
 *
 * Customer retention metrics and cohort analysis.
 */
async function RetentionData() {
	const result = await getGrowthMetrics();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load retention metrics"}
				</p>
			</div>
		);
	}

	const retention = result.data.retention;
	const avgRetention = retention.cohorts.length > 0
		? retention.cohorts.reduce((sum, c) => sum + c.retention_rate, 0) / retention.cohorts.length
		: 0;

	return (
		<div className="space-y-6">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Average Retention</span>
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">{avgRetention.toFixed(1)}%</p>
						<p className="text-xs text-muted-foreground mt-1">Across all cohorts</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Total Cohorts</span>
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">{retention.cohorts.length}</p>
						<p className="text-xs text-muted-foreground mt-1">Months tracked</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Total Signups</span>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">
							{formatNumber(retention.cohorts.reduce((sum, c) => sum + c.signups, 0))}
						</p>
						<p className="text-xs text-muted-foreground mt-1">All cohorts</p>
					</CardContent>
				</Card>
			</div>

			{/* Retention Cohorts */}
			<Card>
				<CardContent className="p-6">
					<h3 className="text-lg font-semibold mb-4">Retention Cohorts</h3>
					<div className="space-y-4">
						{retention.cohorts.map((cohort, index) => {
							const isImproving = index > 0 && cohort.retention_rate > retention.cohorts[index - 1].retention_rate;
							const isDeclining = index > 0 && cohort.retention_rate < retention.cohorts[index - 1].retention_rate;

							return (
								<div key={cohort.month} className="flex items-center justify-between p-4 rounded-lg border">
									<div>
										<p className="font-medium">{cohort.month}</p>
										<p className="text-sm text-muted-foreground">
											{formatNumber(cohort.signups)} signups
										</p>
									</div>
									<div className="flex items-center gap-4">
										<div className="text-right">
											<p className="text-2xl font-bold">{cohort.retention_rate.toFixed(1)}%</p>
											<p className="text-xs text-muted-foreground">Retention</p>
										</div>
										{isImproving && (
											<TrendingUp className="h-5 w-5 text-green-500" />
										)}
										{isDeclining && (
											<TrendingDown className="h-5 w-5 text-red-500" />
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function RetentionPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Retention Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Track customer retention and cohort performance
				</p>
			</div>
			<Suspense fallback={<RetentionSkeleton />}>
				<RetentionData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function RetentionSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



