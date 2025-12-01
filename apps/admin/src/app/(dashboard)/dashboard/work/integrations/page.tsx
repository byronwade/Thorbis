import { Suspense } from "react";
import { getIntegrationConnections, getIntegrationHealth } from "@/actions/integrations";
import { IntegrationsDashboard } from "@/components/work/integrations-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Integrations Dashboard Page
 *
 * Monitor integration connection status, health, and sync times.
 */
async function IntegrationsData() {
	const [connectionsResult, healthResult] = await Promise.all([
		getIntegrationConnections(),
		getIntegrationHealth(),
	]);

	if (connectionsResult.error || healthResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{connectionsResult.error || healthResult.error || "Failed to load integration data"}
				</p>
			</div>
		);
	}

	return (
		<IntegrationsDashboard
			connections={connectionsResult.data || []}
			health={healthResult.data || []}
		/>
	);
}

export default function IntegrationsPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
				<p className="text-muted-foreground text-sm">
					Monitor integration connection status, health, and sync performance
				</p>
			</div>
			<Suspense fallback={<IntegrationsSkeleton />}>
				<IntegrationsData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for integrations dashboard
 */
function IntegrationsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Health Summary */}
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

			{/* Connection List */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-20 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



