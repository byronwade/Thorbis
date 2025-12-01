"use client";

import { useState } from "react";
import {
	AlertTriangle,
	Lock,
	Shield,
	ShieldAlert,
	TrendingUp,
	UserX,
	Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SecurityEvent, SecurityStats } from "@/actions/security";
import { formatRelativeTime } from "@/lib/formatters";

type SecurityDashboardProps = {
	events: SecurityEvent[];
	stats: SecurityStats;
};

/**
 * Security Dashboard Component
 *
 * Displays security events, failed logins, and suspicious activity.
 */
export function SecurityDashboard({ events, stats }: SecurityDashboardProps) {
	const [severityFilter, setSeverityFilter] = useState<string>("all");

	const filteredEvents = events.filter((event) => {
		return severityFilter === "all" || event.severity === severityFilter;
	});

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
						<UserX className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">{stats.failed_logins}</div>
						<p className="text-xs text-muted-foreground">Login attempts</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
						<ShieldAlert className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{stats.suspicious_activity}</div>
						<p className="text-xs text-muted-foreground">Detected events</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Permission Changes</CardTitle>
						<Lock className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{stats.permission_changes}</div>
						<p className="text-xs text-muted-foreground">Access modifications</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
						<AlertTriangle className="h-4 w-4 text-destructive" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-destructive">{stats.critical_incidents}</div>
						<p className="text-xs text-muted-foreground">Require attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Security Events List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Security Events ({filteredEvents.length})</CardTitle>
						<Badge variant="outline" className="flex items-center gap-1">
							<TrendingUp className="h-3 w-3" />
							{stats.recent_activity_24h} in last 24h
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{filteredEvents.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Shield className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No security events found</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredEvents.map((event) => (
								<div
									key={event.id}
									className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									{event.severity === "critical" ? (
										<AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
									) : event.severity === "high" ? (
										<ShieldAlert className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
									) : (
										<Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm">{event.description}</p>
										<div className="flex items-center gap-2 mt-2 flex-wrap">
											<Badge
												variant={
													event.severity === "critical"
														? "destructive"
														: event.severity === "high"
															? "secondary"
															: "outline"
												}
												className="text-xs"
											>
												{event.severity}
											</Badge>
											<Badge variant="outline" className="text-xs capitalize">
												{event.type.replace("_", " ")}
											</Badge>
											{event.admin_email && (
												<Badge variant="outline" className="text-xs">
													{event.admin_email}
												</Badge>
											)}
											{event.ip_address && (
												<span className="text-xs text-muted-foreground">
													IP: {event.ip_address}
												</span>
											)}
											<span className="text-xs text-muted-foreground">
												{formatRelativeTime(event.created_at)}
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



