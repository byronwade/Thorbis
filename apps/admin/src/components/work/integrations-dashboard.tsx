import { Activity, AlertCircle, CheckCircle2, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntegrationConnection, IntegrationHealth } from "@/actions/integrations";
import { formatNumber } from "@/lib/formatters";

type IntegrationsDashboardProps = {
	connections: IntegrationConnection[];
	health: IntegrationHealth[];
};

/**
 * Integrations Dashboard Component
 *
 * Displays integration connection status and health metrics.
 */
export function IntegrationsDashboard({ connections, health }: IntegrationsDashboardProps) {
	return (
		<div className="space-y-6">
			{/* Health Summary */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{health.map((h) => (
					<Card key={h.provider}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="capitalize">{h.provider}</CardTitle>
								<StatusBadge
									status={
										h.down > 0
											? "down"
											: h.degraded > 0
												? "degraded"
												: h.healthy > 0
													? "healthy"
													: "unknown"
									}
								/>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Total Connections</span>
									<span className="font-medium">{h.total_connections}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Healthy</span>
									<span className="font-medium text-green-600">{h.healthy}</span>
								</div>
								{h.degraded > 0 && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Degraded</span>
										<span className="font-medium text-orange-600">{h.degraded}</span>
									</div>
								)}
								{h.down > 0 && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Down</span>
										<span className="font-medium text-destructive">{h.down}</span>
									</div>
								)}
								{h.total_errors > 0 && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Total Errors</span>
										<span className="font-medium text-destructive">{h.total_errors}</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Connection List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Integration Connections ({connections.length})</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{connections.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No integration connections found</p>
						</div>
					) : (
						<div className="space-y-3">
							{connections.map((connection) => (
								<div
									key={connection.id}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-4 flex-1 min-w-0">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-medium capitalize">{connection.provider}</p>
												<StatusBadge status={connection.status} />
												{connection.company_name && (
													<Badge variant="outline" className="text-xs">
														{connection.company_name}
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												{connection.last_sync_at && (
													<span className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														Last sync: {new Date(connection.last_sync_at).toLocaleString()}
													</span>
												)}
												{connection.failure_count > 0 && (
													<span className="text-destructive">
														{connection.failure_count} failures
													</span>
												)}
											</div>
											{connection.last_error && (
												<p className="text-xs text-destructive mt-1 truncate">
													{connection.last_error}
												</p>
											)}
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
		connected: { variant: "default" as const, icon: CheckCircle2, label: "Connected" },
		healthy: { variant: "default" as const, icon: CheckCircle2, label: "Healthy" },
		disconnected: { variant: "destructive" as const, icon: AlertCircle, label: "Disconnected" },
		down: { variant: "destructive" as const, icon: AlertCircle, label: "Down" },
		error: { variant: "secondary" as const, icon: AlertCircle, label: "Error" },
		degraded: { variant: "secondary" as const, icon: TrendingDown, label: "Degraded" },
		unknown: { variant: "outline" as const, icon: Clock, label: "Unknown" },
		inactive: { variant: "outline" as const, icon: Clock, label: "Inactive" },
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



