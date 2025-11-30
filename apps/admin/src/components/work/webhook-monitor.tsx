"use client";

import { useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Clock, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WebhookStatus } from "@/actions/integrations";
import { formatNumber } from "@/lib/formatters";
import { formatRelativeTime } from "@/lib/formatters";

type WebhookMonitorProps = {
	webhooks: WebhookStatus[];
};

/**
 * Webhook Monitor Component
 *
 * Displays webhook delivery status, success rates, and failure tracking.
 */
export function WebhookMonitor({ webhooks }: WebhookMonitorProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredWebhooks = webhooks.filter((webhook) => {
		return searchQuery
			? webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
				webhook.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
			: true;
	});

	const totalWebhooks = webhooks.length;
	const activeWebhooks = webhooks.filter((w) => w.status === "active").length;
	const failedWebhooks = webhooks.filter((w) => w.status === "error").length;
	const avgSuccessRate =
		webhooks.length > 0
			? webhooks.reduce((sum, w) => sum + w.success_rate, 0) / webhooks.length
			: 0;

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalWebhooks}</div>
						<p className="text-xs text-muted-foreground">Configured webhooks</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active</CardTitle>
						<CheckCircle2 className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{activeWebhooks}</div>
						<p className="text-xs text-muted-foreground">Operating normally</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Failed</CardTitle>
						<AlertCircle className="h-4 w-4 text-destructive" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-destructive">{failedWebhooks}</div>
						<p className="text-xs text-muted-foreground">Need attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
						<p className="text-xs text-muted-foreground">Last 30 days</p>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<Card>
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search webhooks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Webhook List */}
			<Card>
				<CardHeader>
					<CardTitle>Webhook Status ({filteredWebhooks.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredWebhooks.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No webhooks found</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredWebhooks.map((webhook) => (
								<div
									key={webhook.id}
									className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="font-medium text-sm truncate">{webhook.url}</p>
											<StatusBadge status={webhook.status} />
											{webhook.company_name && (
												<Badge variant="outline" className="text-xs">
													{webhook.company_name}
												</Badge>
											)}
										</div>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
											<div>
												<p className="text-xs text-muted-foreground">Success Rate</p>
												<div className="flex items-center gap-2 mt-1">
													<p className="font-medium">
														{webhook.success_rate >= 95 ? (
															<span className="text-green-600">
																{webhook.success_rate.toFixed(1)}%
															</span>
														) : webhook.success_rate >= 80 ? (
															<span className="text-orange-600">
																{webhook.success_rate.toFixed(1)}%
															</span>
														) : (
															<span className="text-destructive">
																{webhook.success_rate.toFixed(1)}%
															</span>
														)}
													</p>
													{webhook.success_rate < 95 && (
														<TrendingDown className="h-3 w-3 text-orange-500" />
													)}
												</div>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Total Deliveries</p>
												<p className="font-medium mt-1">{formatNumber(webhook.total_deliveries)}</p>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Failed</p>
												<p className="font-medium text-destructive mt-1">
													{formatNumber(webhook.failed_deliveries)}
												</p>
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Last Delivery</p>
												{webhook.last_delivery_at ? (
													<div className="flex items-center gap-1 mt-1">
														<Clock className="h-3 w-3 text-muted-foreground" />
														<span className="text-xs text-muted-foreground">
															{formatRelativeTime(webhook.last_delivery_at)}
														</span>
													</div>
												) : (
													<p className="text-xs text-muted-foreground mt-1">Never</p>
												)}
											</div>
										</div>
										{webhook.last_error && (
											<p className="text-xs text-destructive mt-2 truncate">
												Last error: {webhook.last_error}
											</p>
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
		active: { variant: "default" as const, icon: CheckCircle2, label: "Active" },
		inactive: { variant: "outline" as const, icon: Clock, label: "Inactive" },
		error: { variant: "destructive" as const, icon: AlertCircle, label: "Error" },
	};

	const config = variants[status as keyof typeof variants] || variants.inactive;
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className="flex items-center gap-1">
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

