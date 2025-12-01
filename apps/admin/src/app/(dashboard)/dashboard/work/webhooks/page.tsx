import { Suspense } from "react";
import { getWebhookStatus } from "@/actions/integrations";
import { WebhookMonitor } from "@/components/work/webhook-monitor";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Webhook Monitoring Page
 *
 * Monitor webhook delivery status, success rates, and failure tracking.
 */
async function WebhookData() {
	const result = await getWebhookStatus();

	if (result.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load webhook data"}
				</p>
			</div>
		);
	}

	return <WebhookMonitor webhooks={result.data || []} />;
}

export default function WebhooksPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Webhook Monitoring</h1>
				<p className="text-muted-foreground text-sm">
					Monitor webhook delivery success rates, failures, and retry queues
				</p>
			</div>
			<Suspense fallback={<WebhooksSkeleton />}>
				<WebhookData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for webhook monitoring
 */
function WebhooksSkeleton() {
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

			{/* Search */}
			<Card>
				<CardContent className="p-4">
					<Skeleton className="h-10 w-full" />
				</CardContent>
			</Card>

			{/* Webhook List */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-32 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



