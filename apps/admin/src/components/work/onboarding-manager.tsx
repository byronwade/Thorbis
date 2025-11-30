"use client";

import { useState, useEffect } from "react";
import {
	UserPlus,
	Search,
	RefreshCcw,
	CheckCircle,
	Clock,
	AlertTriangle,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OnboardingProgress, OnboardingStats, getOnboardingProgress, getOnboardingStats } from "@/actions/onboarding";
import { formatRelativeTime, formatNumber, formatPercent } from "@/lib/formatters";

type OnboardingManagerProps = {
	initialProgress: OnboardingProgress[];
	initialStats: OnboardingStats;
};

/**
 * Onboarding Manager Component
 *
 * Tracks and displays company onboarding progress.
 */
export function OnboardingManager({ initialProgress, initialStats }: OnboardingManagerProps) {
	const [progress, setProgress] = useState(initialProgress);
	const [stats, setStats] = useState(initialStats);
	const [loading, setLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	const fetchProgress = async () => {
		setLoading(true);
		const [progressResult, statsResult] = await Promise.all([
			getOnboardingProgress(50),
			getOnboardingStats(),
		]);

		if (progressResult.data) setProgress(progressResult.data);
		if (statsResult.data) setStats(statsResult.data);
		setLoading(false);
	};

	useEffect(() => {
		fetchProgress();
	}, [statusFilter]);

	const filteredProgress = progress.filter((item) => {
		const matchesStatus = statusFilter === "all" || item.status === statusFilter;
		const matchesSearch =
			searchQuery === "" ||
			item.company_name.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const getStatusBadgeVariant = (status: OnboardingProgress["status"]) => {
		switch (status) {
			case "completed":
				return "default";
			case "in_progress":
				return "default";
			case "stalled":
				return "destructive";
			case "not_started":
				return "secondary";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">In Progress</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.in_progress)}</div>
						<p className="text-xs text-muted-foreground">Companies onboarding</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.completed_this_week)}</div>
						<p className="text-xs text-muted-foreground">Finished onboarding</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.avg_completion_time_days)}</div>
						<p className="text-xs text-muted-foreground">Days to complete</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatPercent(stats.completion_rate)}</div>
						<p className="text-xs text-muted-foreground">Of all companies</p>
					</CardContent>
				</Card>
			</div>

			{/* Onboarding Table */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5 text-muted-foreground" /> Onboarding Progress
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="not_started">Not Started</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="stalled">Stalled</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
							</SelectContent>
						</Select>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search companies..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button variant="outline" size="sm" onClick={fetchProgress} disabled={loading}>
							<RefreshCcw className={loading ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Company</TableHead>
								<TableHead>Progress</TableHead>
								<TableHead>Current Step</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Started</TableHead>
								<TableHead>Completed</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProgress.length > 0 ? (
								filteredProgress.map((item) => (
									<TableRow key={item.company_id}>
										<TableCell className="font-medium">{item.company_name}</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">
														{formatPercent(item.completion_percentage)}
													</span>
													<span className="text-xs text-muted-foreground">
														{item.steps_completed}/{item.total_steps} steps
													</span>
												</div>
												<div className="w-full bg-muted rounded-full h-2">
													<div
														className="h-2 rounded-full bg-primary transition-all"
														style={{ width: `${item.completion_percentage}%` }}
													/>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-sm">{item.current_step || "Not started"}</TableCell>
										<TableCell>
											<Badge variant={getStatusBadgeVariant(item.status)}>
												{item.status.replace(/_/g, " ")}
											</Badge>
										</TableCell>
										<TableCell className="text-xs">
											{formatRelativeTime(item.started_at)}
										</TableCell>
										<TableCell className="text-xs">
											{item.completed_at ? formatRelativeTime(item.completed_at) : "—"}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
										No onboarding data found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

