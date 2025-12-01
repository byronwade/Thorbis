import { Suspense } from "react";
import { getCommunicationStats, getProviderHealth } from "@/actions/communications";
import { CommunicationsAnalytics } from "@/components/work/communications-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Communication Analytics Page
 *
 * Monitor email/SMS delivery rates and provider health.
 */
async function CommunicationsData() {
	const [statsResult, healthResult] = await Promise.all([
		getCommunicationStats(),
		getProviderHealth(),
	]);

	if (statsResult.error || healthResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{statsResult.error || healthResult.error || "Failed to load communication data"}
				</p>
			</div>
		);
	}

	return (
		<CommunicationsAnalytics
			stats={statsResult.data || []}
			health={healthResult.data || []}
		/>
	);
}

export default function CommunicationsPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Communication Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Monitor email/SMS delivery rates and provider health
				</p>
			</div>
			<Suspense fallback={<CommunicationsSkeleton />}>
				<CommunicationsData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for communications analytics
 */
function CommunicationsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-6 w-20" />
							</div>
							<div className="space-y-2">
								{Array.from({ length: 3 }).map((_, j) => (
									<div key={j} className="flex items-center justify-between">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-16" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-4">
						{Array.from({ length: 2 }).map((_, i) => (
							<Skeleton key={i} className="h-32 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



