import { Suspense } from "react";
import { getSecurityEvents, getSecurityStats } from "@/actions/security";
import { SecurityDashboard } from "@/components/work/security-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Security Dashboard Page
 *
 * Monitor security events, failed logins, and suspicious activity.
 */
async function SecurityData() {
	const [eventsResult, statsResult] = await Promise.all([
		getSecurityEvents({ limit: 100 }),
		getSecurityStats(),
	]);

	if (eventsResult.error || statsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{eventsResult.error || statsResult.error || "Failed to load security data"}
				</p>
			</div>
		);
	}

	return (
		<SecurityDashboard
			events={eventsResult.data || []}
			stats={statsResult.data || {
				total_events: 0,
				failed_logins: 0,
				suspicious_activity: 0,
				permission_changes: 0,
				api_key_anomalies: 0,
				critical_incidents: 0,
				recent_activity_24h: 0,
			}}
		/>
	);
}

export default function SecurityPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Security Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Monitor security events, failed logins, and suspicious activity
				</p>
			</div>
			<Suspense fallback={<SecuritySkeleton />}>
				<SecurityData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for security dashboard
 */
function SecuritySkeleton() {
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

			{/* Events List */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
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



