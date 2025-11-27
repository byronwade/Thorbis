"use client";

/**
 * Internal Analytics Dashboard Client Component
 *
 * Displays comprehensive internal API and action analytics with charts and data tables.
 */

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Activity,
	Zap,
	Bot,
	Mail,
	Phone,
	AlertTriangle,
	Clock,
	TrendingUp,
	TrendingDown,
	DollarSign,
	XCircle,
} from "lucide-react";

interface OverviewData {
	apiCalls: {
		total: number;
		avgLatencyMs: number;
		errorRate: number;
	};
	actions: {
		total: number;
		successRate: number;
	};
	ai: {
		totalCostCents: number;
		totalTokens: number;
		totalRequests: number;
	};
	communications: {
		emailsSent: number;
		emailOpenRate: number;
		smsSent: number;
		callsConnected: number;
	};
}

interface ApiStat {
	endpoint: string;
	total_calls: number;
	success_count: number;
	error_count: number;
	avg_latency_ms: number;
	p95_latency_ms: number;
	error_rate: number;
}

interface SlowApiCall {
	endpoint: string;
	method: string;
	latencyMs: number;
	status: number;
	createdAt: string;
}

interface ActionStat {
	action_name: string;
	action_category: string;
	total_executions: number;
	success_count: number;
	failure_count: number;
	avg_duration_ms: number;
	success_rate: number;
}

interface FailedAction {
	name: string;
	category: string;
	errorType: string;
	errorMessage: string;
	createdAt: string;
}

interface AISummary {
	provider: string;
	model: string;
	useCase: string;
	totalRequests: number;
	totalTokens: number;
	totalCostCents: number;
	avgLatencyMs: number;
	successRate: number;
}

interface AICostByDay {
	date: string;
	totalCostCents: number;
	totalTokens: number;
	totalRequests: number;
}

interface ApprovalStats {
	totalRequested: number;
	autoApproved: number;
	userApproved: number;
	userRejected: number;
	pending: number;
	approvalRate: number;
}

interface CommunicationStat {
	communicationType: string;
	totalSent: number;
	totalDelivered: number;
	totalOpened: number;
	totalClicked: number;
	totalBounced: number;
	totalReplied: number;
	openRate: number;
	clickRate: number;
	bounceRate: number;
	replyRate: number;
}

interface CallStats {
	totalCalls: number;
	connectedCalls: number;
	failedCalls: number;
	voicemails: number;
	averageDurationSeconds: number;
	totalDurationMinutes: number;
	connectRate: number;
}

interface InternalAnalyticsDashboardProps {
	overview: OverviewData;
	apiStats: ApiStat[];
	slowApiCalls: SlowApiCall[];
	actionStats: ActionStat[];
	failedActions: FailedAction[];
	aiSummary: AISummary[];
	aiCostByDay: AICostByDay[];
	approvalStats: ApprovalStats;
	communicationStats: CommunicationStat[];
	callStats: CallStats;
}

export function InternalAnalyticsDashboard({
	overview,
	apiStats,
	slowApiCalls,
	actionStats,
	failedActions,
	aiSummary,
	aiCostByDay,
	approvalStats,
	communicationStats,
	callStats,
}: InternalAnalyticsDashboardProps) {
	const [activeTab, setActiveTab] = useState("overview");

	const formatCost = (cents: number) => {
		return `$${(cents / 100).toFixed(2)}`;
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	};

	const formatDuration = (ms: number) => {
		if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
		return `${ms}ms`;
	};

	return (
		<div className="space-y-6">
			{/* Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">API Calls (24h)</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(overview.apiCalls.total)}
						</div>
						<div className="flex items-center text-xs text-muted-foreground">
							<Clock className="mr-1 h-3 w-3" />
							Avg: {formatDuration(overview.apiCalls.avgLatencyMs)}
							<span className="ml-2">
								{overview.apiCalls.errorRate > 5 ? (
									<Badge variant="destructive" className="text-xs">
										{overview.apiCalls.errorRate}% errors
									</Badge>
								) : (
									<Badge variant="secondary" className="text-xs">
										{overview.apiCalls.errorRate}% errors
									</Badge>
								)}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Actions (24h)</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(overview.actions.total)}
						</div>
						<div className="flex items-center text-xs text-muted-foreground">
							{overview.actions.successRate >= 95 ? (
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
							) : (
								<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
							)}
							{overview.actions.successRate}% success rate
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">AI Cost (30d)</CardTitle>
						<Bot className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCost(overview.ai.totalCostCents)}
						</div>
						<div className="flex items-center text-xs text-muted-foreground">
							<DollarSign className="mr-1 h-3 w-3" />
							{formatNumber(overview.ai.totalTokens)} tokens •{" "}
							{formatNumber(overview.ai.totalRequests)} requests
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Communications (30d)
						</CardTitle>
						<Mail className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(
								overview.communications.emailsSent +
									overview.communications.smsSent,
							)}
						</div>
						<div className="flex items-center text-xs text-muted-foreground">
							{overview.communications.emailOpenRate}% email open rate •{" "}
							{overview.communications.callsConnected} calls
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="api">API Calls</TabsTrigger>
					<TabsTrigger value="actions">Actions</TabsTrigger>
					<TabsTrigger value="ai">AI Usage</TabsTrigger>
					<TabsTrigger value="comms">Communications</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Slow API Calls */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<AlertTriangle className="h-4 w-4 text-yellow-500" />
									Slow API Calls
								</CardTitle>
								<CardDescription>
									Requests taking longer than 1 second
								</CardDescription>
							</CardHeader>
							<CardContent>
								{slowApiCalls.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No slow API calls detected
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Endpoint</TableHead>
												<TableHead>Latency</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{slowApiCalls.slice(0, 5).map((call, i) => (
												<TableRow key={i}>
													<TableCell className="font-mono text-xs">
														{call.method} {call.endpoint.slice(0, 30)}...
													</TableCell>
													<TableCell className="text-red-500">
														{formatDuration(call.latencyMs)}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																call.status >= 400 ? "destructive" : "secondary"
															}
														>
															{call.status}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>

						{/* Failed Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<XCircle className="h-4 w-4 text-red-500" />
									Failed Actions
								</CardTitle>
								<CardDescription>Recent action failures</CardDescription>
							</CardHeader>
							<CardContent>
								{failedActions.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No failed actions in the last 24 hours
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Action</TableHead>
												<TableHead>Error</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{failedActions.slice(0, 5).map((action, i) => (
												<TableRow key={i}>
													<TableCell>
														<div className="font-medium">{action.name}</div>
														<div className="text-xs text-muted-foreground">
															{action.category}
														</div>
													</TableCell>
													<TableCell className="text-xs text-red-500">
														{action.errorMessage.slice(0, 50)}...
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* API Calls Tab */}
				<TabsContent value="api" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>API Endpoint Statistics</CardTitle>
							<CardDescription>
								Performance metrics by endpoint (last 24 hours)
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Endpoint</TableHead>
										<TableHead className="text-right">Calls</TableHead>
										<TableHead className="text-right">Avg Latency</TableHead>
										<TableHead className="text-right">P95 Latency</TableHead>
										<TableHead className="text-right">Error Rate</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{apiStats.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">
												No API call data available
											</TableCell>
										</TableRow>
									) : (
										apiStats.map((stat, i) => (
											<TableRow key={i}>
												<TableCell className="font-mono text-sm">
													{stat.endpoint}
												</TableCell>
												<TableCell className="text-right">
													{formatNumber(stat.total_calls)}
												</TableCell>
												<TableCell className="text-right">
													{formatDuration(stat.avg_latency_ms)}
												</TableCell>
												<TableCell className="text-right">
													{formatDuration(stat.p95_latency_ms)}
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant={
															stat.error_rate > 5 ? "destructive" : "secondary"
														}
													>
														{stat.error_rate}%
													</Badge>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Actions Tab */}
				<TabsContent value="actions" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Server Action Statistics</CardTitle>
							<CardDescription>
								Execution metrics by action (last 24 hours)
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Action</TableHead>
										<TableHead>Category</TableHead>
										<TableHead className="text-right">Executions</TableHead>
										<TableHead className="text-right">Avg Duration</TableHead>
										<TableHead className="text-right">Success Rate</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{actionStats.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">
												No action data available
											</TableCell>
										</TableRow>
									) : (
										actionStats.map((stat, i) => (
											<TableRow key={i}>
												<TableCell className="font-medium">
													{stat.action_name}
												</TableCell>
												<TableCell>
													<Badge variant="outline">{stat.action_category}</Badge>
												</TableCell>
												<TableCell className="text-right">
													{formatNumber(stat.total_executions)}
												</TableCell>
												<TableCell className="text-right">
													{formatDuration(stat.avg_duration_ms)}
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant={
															stat.success_rate < 95 ? "destructive" : "secondary"
														}
													>
														{stat.success_rate}%
													</Badge>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* AI Usage Tab */}
				<TabsContent value="ai" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">Total Cost</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{formatCost(overview.ai.totalCostCents)}
								</div>
								<p className="text-xs text-muted-foreground">Last 30 days</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">Auto-Approval Rate</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{approvalStats.totalRequested > 0
										? Math.round(
												(approvalStats.autoApproved /
													approvalStats.totalRequested) *
													100,
											)
										: 0}
									%
								</div>
								<p className="text-xs text-muted-foreground">
									{approvalStats.userRejected} user rejections
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">Avg Cost/Request</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{overview.ai.totalRequests > 0
										? formatCost(
												overview.ai.totalCostCents / overview.ai.totalRequests,
											)
										: "$0.00"}
								</div>
								<p className="text-xs text-muted-foreground">
									{formatNumber(overview.ai.totalTokens)} total tokens
								</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Usage by Model</CardTitle>
							<CardDescription>AI model usage breakdown (30 days)</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Provider / Model</TableHead>
										<TableHead>Use Case</TableHead>
										<TableHead className="text-right">Requests</TableHead>
										<TableHead className="text-right">Tokens</TableHead>
										<TableHead className="text-right">Cost</TableHead>
										<TableHead className="text-right">Success</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{aiSummary.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center text-muted-foreground">
												No AI usage data available
											</TableCell>
										</TableRow>
									) : (
										aiSummary.map((summary, i) => (
											<TableRow key={i}>
												<TableCell>
													<div className="font-medium">{summary.model}</div>
													<div className="text-xs text-muted-foreground">
														{summary.provider}
													</div>
												</TableCell>
												<TableCell>
													<Badge variant="outline">{summary.useCase}</Badge>
												</TableCell>
												<TableCell className="text-right">
													{formatNumber(summary.totalRequests)}
												</TableCell>
												<TableCell className="text-right">
													{formatNumber(summary.totalTokens)}
												</TableCell>
												<TableCell className="text-right">
													{formatCost(summary.totalCostCents)}
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant={
															summary.successRate < 95 ? "destructive" : "secondary"
														}
													>
														{summary.successRate}%
													</Badge>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					{/* Cost by Day Chart (simplified) */}
					<Card>
						<CardHeader>
							<CardTitle>Daily AI Cost</CardTitle>
							<CardDescription>Cost trend over the last 30 days</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[200px] flex items-end gap-1">
								{aiCostByDay.slice(-30).map((day, i) => {
									const maxCost = Math.max(
										...aiCostByDay.map((d) => d.totalCostCents),
										1,
									);
									const height = (day.totalCostCents / maxCost) * 100;
									return (
										<div
											key={i}
											className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
											style={{ height: `${Math.max(height, 2)}%` }}
											title={`${day.date}: ${formatCost(day.totalCostCents)}`}
										/>
									);
								})}
							</div>
							<div className="flex justify-between mt-2 text-xs text-muted-foreground">
								<span>30 days ago</span>
								<span>Today</span>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Communications Tab */}
				<TabsContent value="comms" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Email Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									Email Performance
								</CardTitle>
							</CardHeader>
							<CardContent>
								{(() => {
									const emailStat = communicationStats.find(
										(s) => s.communicationType === "email",
									);
									if (!emailStat) {
										return (
											<p className="text-muted-foreground">No email data available</p>
										);
									}
									return (
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">Sent</p>
													<p className="text-2xl font-bold">
														{formatNumber(emailStat.totalSent)}
													</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Delivered</p>
													<p className="text-2xl font-bold">
														{formatNumber(emailStat.totalDelivered)}
													</p>
												</div>
											</div>
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Open Rate</span>
													<span className="font-medium">
														{emailStat.openRate}%
													</span>
												</div>
												<div className="h-2 bg-secondary rounded-full overflow-hidden">
													<div
														className="h-full bg-primary"
														style={{ width: `${emailStat.openRate}%` }}
													/>
												</div>
											</div>
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Click Rate</span>
													<span className="font-medium">
														{emailStat.clickRate}%
													</span>
												</div>
												<div className="h-2 bg-secondary rounded-full overflow-hidden">
													<div
														className="h-full bg-green-500"
														style={{ width: `${emailStat.clickRate}%` }}
													/>
												</div>
											</div>
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Bounce Rate</span>
													<span className="font-medium">
														{emailStat.bounceRate}%
													</span>
												</div>
												<div className="h-2 bg-secondary rounded-full overflow-hidden">
													<div
														className="h-full bg-red-500"
														style={{ width: `${emailStat.bounceRate}%` }}
													/>
												</div>
											</div>
										</div>
									);
								})()}
							</CardContent>
						</Card>

						{/* Call Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Phone className="h-4 w-4" />
									Call Performance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-muted-foreground">Total Calls</p>
											<p className="text-2xl font-bold">
												{formatNumber(callStats.totalCalls)}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Connected</p>
											<p className="text-2xl font-bold">
												{formatNumber(callStats.connectedCalls)}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-4 text-center">
										<div>
											<p className="text-xs text-muted-foreground">Connect Rate</p>
											<p className="text-lg font-medium">{callStats.connectRate}%</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Voicemails</p>
											<p className="text-lg font-medium">{callStats.voicemails}</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">Avg Duration</p>
											<p className="text-lg font-medium">
												{Math.round(callStats.averageDurationSeconds / 60)}m
											</p>
										</div>
									</div>
									<div className="pt-2 border-t">
										<p className="text-sm">
											<span className="text-muted-foreground">Total talk time:</span>{" "}
											<span className="font-medium">
												{Math.round(callStats.totalDurationMinutes / 60)}h{" "}
												{callStats.totalDurationMinutes % 60}m
											</span>
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
