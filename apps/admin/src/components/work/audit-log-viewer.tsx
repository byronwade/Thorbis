"use client";

import { useState } from "react";
import { Download, Filter, Search, Calendar } from "lucide-react";
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
import { AuditLogEntry, AuditLogStats } from "@/actions/audit";
import { formatRelativeTime } from "@/lib/formatters";

type AuditLogViewerProps = {
	logs: AuditLogEntry[];
	stats: AuditLogStats;
};

/**
 * Audit Log Viewer Component
 *
 * Displays audit logs with filtering, search, and export capabilities.
 */
export function AuditLogViewer({ logs, stats }: AuditLogViewerProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [actionFilter, setActionFilter] = useState<string>("all");
	const [resourceFilter, setResourceFilter] = useState<string>("all");

	const filteredLogs = logs.filter((log) => {
		const matchesSearch = searchQuery
			? log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.admin_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.resource_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
			: true;
		const matchesAction = actionFilter === "all" || log.action === actionFilter;
		const matchesResource = resourceFilter === "all" || log.resource_type === resourceFilter;
		return matchesSearch && matchesAction && matchesResource;
	});

	const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).sort();
	const uniqueResources = Array.from(new Set(logs.map((l) => l.resource_type).filter(Boolean))).sort();

	const handleExport = async () => {
		// TODO: Implement CSV export
		alert("Export functionality coming soon");
	};

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Actions</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-xs text-muted-foreground">Last 30 days</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.recentActivity}</div>
						<p className="text-xs text-muted-foreground">Last 24 hours</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Action</CardTitle>
						<Filter className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.byAction.length > 0 ? stats.byAction[0].count : 0}
						</div>
						<p className="text-xs text-muted-foreground truncate">
							{stats.byAction.length > 0 ? stats.byAction[0].action : "No actions"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Admin</CardTitle>
						<Filter className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.byAdmin.length > 0 ? stats.byAdmin[0].count : 0}
						</div>
						<p className="text-xs text-muted-foreground truncate">
							{stats.byAdmin.length > 0 ? stats.byAdmin[0].admin_email : "No admins"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search audit logs..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={actionFilter} onValueChange={setActionFilter}>
							<SelectTrigger className="w-full md:w-[200px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by action" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Actions</SelectItem>
								{uniqueActions.map((action) => (
									<SelectItem key={action} value={action}>
										{action}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={resourceFilter} onValueChange={setResourceFilter}>
							<SelectTrigger className="w-full md:w-[200px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by resource" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Resources</SelectItem>
								{uniqueResources.map((resource) => (
									<SelectItem key={resource} value={resource}>
										{resource}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button onClick={handleExport} variant="outline" size="sm">
							<Download className="h-4 w-4 mr-2" />
							Export
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Audit Log List */}
			<Card>
				<CardHeader>
					<CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredLogs.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No audit logs found</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredLogs.map((log) => (
								<div
									key={log.id}
									className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="font-medium text-sm">{log.action}</p>
											{log.resource_type && (
												<Badge variant="outline" className="text-xs">
													{log.resource_type}
												</Badge>
											)}
											{log.company_name && (
												<Badge variant="outline" className="text-xs">
													{log.company_name}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-muted-foreground">
											{log.admin_email && (
												<span>
													<strong>Admin:</strong> {log.admin_email}
												</span>
											)}
											{log.resource_id && (
												<span>
													<strong>ID:</strong> {log.resource_id.substring(0, 8)}...
												</span>
											)}
											{log.session_id && (
												<span>
													<strong>Session:</strong> {log.session_id.substring(0, 8)}...
												</span>
											)}
											{log.ip_address && (
												<span>
													<strong>IP:</strong> {log.ip_address}
												</span>
											)}
											<span className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												{formatRelativeTime(log.created_at)}
											</span>
										</div>
										{Object.keys(log.details || {}).length > 0 && (
											<details className="mt-2">
												<summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
													View details
												</summary>
												<pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
													{JSON.stringify(log.details, null, 2)}
												</pre>
											</details>
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

