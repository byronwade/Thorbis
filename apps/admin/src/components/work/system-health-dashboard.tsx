import {
	Activity,
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Clock,
	Database,
	Server,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SystemHealthMetrics } from "@/actions/system-health";
import { formatNumber } from "@/lib/formatters";

type SystemHealthDashboardProps = {
	metrics: SystemHealthMetrics;
};

/**
 * System Health Dashboard
 *
 * Displays platform-wide system health metrics including database status,
 * API performance, integration health, and error tracking.
 */
export function SystemHealthDashboard({ metrics }: SystemHealthDashboardProps) {
	return (
		<div className="space-y-6">
			{/* Database Status */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Database className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Database</CardTitle>
						</div>
						<StatusBadge status={metrics.database.status} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Response Time</p>
							<p className="text-2xl font-bold">{metrics.database.responseTimeMs}ms</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Status</p>
							<p className="text-2xl font-bold capitalize">{metrics.database.status}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Active Connections</p>
							<p className="text-2xl font-bold">
								{metrics.database.activeConnections || "N/A"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* API Metrics */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Server className="h-5 w-5 text-muted-foreground" />
							<CardTitle>API Performance</CardTitle>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Total Calls (24h)</p>
							<p className="text-2xl font-bold">{formatNumber(metrics.api.totalCalls)}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Error Rate</p>
							<div className="flex items-center gap-2">
								<p className="text-2xl font-bold">{metrics.api.errorRate.toFixed(2)}%</p>
								{metrics.api.errorRate > 5 ? (
									<AlertTriangle className="h-4 w-4 text-destructive" />
								) : (
									<CheckCircle2 className="h-4 w-4 text-green-500" />
								)}
							</div>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Avg Latency</p>
							<p className="text-2xl font-bold">{metrics.api.avgLatencyMs}ms</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Slow Calls</p>
							<p className="text-2xl font-bold">{formatNumber(metrics.api.slowCalls)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Integration Health */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Activity className="h-5 w-5 text-muted-foreground" />
						<CardTitle>Integrations</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Object.entries(metrics.integrations).map(([name, health]) => (
							<div
								key={name}
								className="flex items-center justify-between p-4 rounded-lg border"
							>
								<div>
									<p className="font-medium capitalize">{name}</p>
									<p className="text-sm text-muted-foreground">
										{new Date(health.lastCheck).toLocaleString()}
									</p>
									{health.errorRate !== undefined && (
										<p className="text-xs text-muted-foreground mt-1">
											Error rate: {health.errorRate.toFixed(2)}%
										</p>
									)}
								</div>
								<StatusBadge status={health.status} />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recent Errors */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Recent Errors</CardTitle>
						</div>
						<Badge variant={metrics.errors.critical > 0 ? "destructive" : "secondary"}>
							{metrics.errors.critical} critical
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{metrics.errors.recent.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No recent errors</p>
						</div>
					) : (
						<div className="space-y-3">
							{metrics.errors.recent.map((error) => (
								<div
									key={error.id}
									className="flex items-start gap-3 p-3 rounded-lg border"
								>
									{error.severity === "critical" ? (
										<AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
									) : (
										<AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
									)}
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm">{error.message}</p>
										<div className="flex items-center gap-2 mt-1">
											<Badge
												variant={error.severity === "critical" ? "destructive" : "secondary"}
												className="text-xs"
											>
												{error.severity}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{new Date(error.created_at).toLocaleString()}
											</span>
										</div>
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
		degraded: { variant: "secondary" as const, icon: AlertTriangle, label: "Degraded" },
		down: { variant: "destructive" as const, icon: AlertCircle, label: "Down" },
		unknown: { variant: "outline" as const, icon: Clock, label: "Unknown" },
	};

	const config = variants[status as keyof typeof variants] || variants.unknown;
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className="flex items-center gap-1">
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

