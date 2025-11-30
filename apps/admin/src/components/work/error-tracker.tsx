"use client";

import { useState } from "react";
import {
	AlertCircle,
	AlertTriangle,
	BarChart3,
	Calendar,
	Filter,
	Search,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ErrorLogEntry, ErrorStats, ErrorGroup } from "@/actions/errors";
import { formatRelativeTime } from "@/lib/formatters";

type ErrorTrackerProps = {
	logs: ErrorLogEntry[];
	stats: ErrorStats;
	groups: ErrorGroup[];
};

/**
 * Error Tracker Component
 *
 * Displays error logs, statistics, trends, and grouped errors.
 */
export function ErrorTracker({ logs, stats, groups }: ErrorTrackerProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [severityFilter, setSeverityFilter] = useState<string>("all");
	const [viewMode, setViewMode] = useState<"logs" | "groups">("logs");

	const filteredLogs = logs.filter((log) => {
		const matchesSearch = searchQuery
			? log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
			: true;
		const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
		return matchesSearch && matchesSeverity;
	});

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Errors</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-xs text-muted-foreground">Last 7 days</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Critical</CardTitle>
						<AlertTriangle className="h-4 w-4 text-destructive" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-destructive">{stats.bySeverity.critical}</div>
						<p className="text-xs text-muted-foreground">Requires attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Errors</CardTitle>
						<AlertCircle className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-500">{stats.bySeverity.error}</div>
						<p className="text-xs text-muted-foreground">Standard errors</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Companies</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.byCompany.length > 0 ? stats.byCompany[0].count : 0}
						</div>
						<p className="text-xs text-muted-foreground">
							{stats.byCompany.length > 0 ? stats.byCompany[0].company_name : "No errors"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and View Toggle */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search errors..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={severityFilter} onValueChange={setSeverityFilter}>
							<SelectTrigger className="w-full md:w-[180px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by severity" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Severities</SelectItem>
								<SelectItem value="critical">Critical</SelectItem>
								<SelectItem value="error">Errors</SelectItem>
								<SelectItem value="warning">Warnings</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex gap-2">
							<Button
								variant={viewMode === "logs" ? "default" : "outline"}
								onClick={() => setViewMode("logs")}
								size="sm"
							>
								Logs
							</Button>
							<Button
								variant={viewMode === "groups" ? "default" : "outline"}
								onClick={() => setViewMode("groups")}
								size="sm"
							>
								Groups
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Error Trends Chart */}
			{stats.trends.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Error Trends</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-64 flex items-end gap-2">
							{stats.trends.map((trend) => {
								const maxCount = Math.max(...stats.trends.map((t) => t.count));
								const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
								return (
									<div key={trend.date} className="flex-1 flex flex-col items-center gap-2">
										<div className="w-full bg-primary/20 rounded-t flex items-end">
											<div
												className="w-full bg-primary rounded-t transition-all"
												style={{ height: `${height}%` }}
											/>
										</div>
										<span className="text-xs text-muted-foreground">
											{new Date(trend.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
										<span className="text-xs font-medium">{trend.count}</span>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Error List or Groups */}
			{viewMode === "logs" ? (
				<Card>
					<CardHeader>
						<CardTitle>Error Logs ({filteredLogs.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{filteredLogs.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
								<p>No errors found</p>
							</div>
						) : (
							<div className="space-y-3">
								{filteredLogs.map((error) => (
									<div
										key={error.id}
										className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
									>
										{error.severity === "critical" ? (
											<AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
										) : (
											<AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
										)}
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm">{error.message}</p>
											<div className="flex items-center gap-2 mt-2 flex-wrap">
												<Badge
													variant={error.severity === "critical" ? "destructive" : "secondary"}
													className="text-xs"
												>
													{error.severity}
												</Badge>
												{error.company_name && (
													<Badge variant="outline" className="text-xs">
														{error.company_name}
													</Badge>
												)}
												{error.entity_type && (
													<Badge variant="outline" className="text-xs">
														{error.entity_type}
													</Badge>
												)}
												<span className="text-xs text-muted-foreground flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{formatRelativeTime(error.created_at)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Grouped Errors ({groups.length})</CardTitle>
					</CardHeader>
					<CardContent>
						{groups.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
								<p>No error groups found</p>
							</div>
						) : (
							<div className="space-y-3">
								{groups.map((group, index) => (
									<div
										key={index}
										className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
									>
										{group.severity === "critical" ? (
											<AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
										) : (
											<AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
										)}
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm">{group.message}</p>
											<div className="flex items-center gap-4 mt-2 flex-wrap">
												<Badge
													variant={group.severity === "critical" ? "destructive" : "secondary"}
													className="text-xs"
												>
													{group.severity}
												</Badge>
												<span className="text-xs text-muted-foreground">
													<strong>{group.count}</strong> occurrences
												</span>
												<span className="text-xs text-muted-foreground">
													<strong>{group.affected_companies}</strong> companies
												</span>
												<span className="text-xs text-muted-foreground">
													First: {formatRelativeTime(group.first_seen)}
												</span>
												<span className="text-xs text-muted-foreground">
													Last: {formatRelativeTime(group.last_seen)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

