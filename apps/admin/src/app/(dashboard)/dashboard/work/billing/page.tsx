import { Suspense } from "react";
import { getBillingDashboardStats } from "@/actions/billing";
import { BillingDashboardStats } from "@/components/work/billing-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Billing Dashboard
 * 
 * Platform-wide billing overview and metrics.
 */
async function BillingDashboardData() {
	const result = await getBillingDashboardStats();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load billing stats"}
				</p>
			</div>
		);
	}

	return <BillingDashboardStats stats={result.data} />;
}

export default function BillingDashboardPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Billing Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Platform-wide billing overview and metrics
				</p>
			</div>
			<Suspense
				fallback={
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-32" />
						))}
					</div>
				}
			>
				<BillingDashboardData />
			</Suspense>
		</div>
	);
}

