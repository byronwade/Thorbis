import { Mail, Phone, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunicationStats, ProviderHealth } from "@/actions/communications";
import { formatNumber } from "@/lib/formatters";

type CommunicationsAnalyticsProps = {
	stats: CommunicationStats[];
	health: ProviderHealth[];
};

/**
 * Communications Analytics Component
 *
 * Displays email/SMS delivery rates and provider health.
 */
export function CommunicationsAnalytics({ stats, health }: CommunicationsAnalyticsProps) {
	return (
		<div className="space-y-6">
			{/* Provider Health */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{health.map((h) => (
					<Card key={h.provider}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="capitalize">{h.provider}</CardTitle>
								<StatusBadge status={h.status} />
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Error Rate</span>
									<span className="font-medium">{h.error_rate.toFixed(2)}%</span>
								</div>
								{h.avg_latency_ms && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Avg Latency</span>
										<span className="font-medium">{h.avg_latency_ms}ms</span>
									</div>
								)}
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Total Events</span>
									<span className="font-medium">{formatNumber(h.total_events)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Communication Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Delivery Statistics</CardTitle>
				</CardHeader>
				<CardContent>
					{stats.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Mail className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No communication statistics available</p>
						</div>
					) : (
						<div className="space-y-4">
							{stats.map((stat) => (
								<div key={stat.provider} className="p-4 rounded-lg border">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<Mail className="h-5 w-5 text-muted-foreground" />
											<p className="font-medium capitalize">{stat.provider}</p>
										</div>
										<Badge
											variant={stat.delivery_rate >= 95 ? "default" : stat.delivery_rate >= 80 ? "secondary" : "destructive"}
										>
											{stat.delivery_rate.toFixed(1)}% delivered
										</Badge>
									</div>
									<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
										<div>
											<p className="text-xs text-muted-foreground">Total Sent</p>
											<p className="font-medium">{formatNumber(stat.total_sent)}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Delivered</p>
											<p className="font-medium text-green-600">{formatNumber(stat.delivered)}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Failed</p>
											<p className="font-medium text-destructive">{formatNumber(stat.failed)}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Bounced</p>
											<p className="font-medium text-orange-600">{formatNumber(stat.bounced)}</p>
										</div>
										{stat.avg_latency_ms && (
											<div>
												<p className="text-xs text-muted-foreground">Avg Latency</p>
												<p className="font-medium">{stat.avg_latency_ms}ms</p>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
	const variants = {
		healthy: { variant: "default" as const, icon: CheckCircle2, label: "Healthy" },
		degraded: { variant: "secondary" as const, icon: AlertCircle, label: "Degraded" },
		down: { variant: "destructive" as const, icon: AlertCircle, label: "Down" },
	};

	const config = variants[status as keyof typeof variants] || variants.healthy;
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className="flex items-center gap-1">
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

