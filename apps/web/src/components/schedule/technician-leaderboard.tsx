"use client";

/**
 * Technician Leaderboard
 *
 * Gamification display showing technician rankings from:
 * - analytics_technician_leaderboard table
 *
 * Features:
 * - Revenue ranking
 * - Rating ranking
 * - Utilization ranking
 * - Badges for achievements
 * - Period selection (week/month/quarter)
 */

import {
	Award,
	Crown,
	DollarSign,
	Flame,
	Medal,
	RefreshCw,
	Star,
	Target,
	ThumbsUp,
	Timer,
	TrendingUp,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type Period = "week" | "month" | "quarter";

type TechnicianRanking = {
	id: string;
	technicianId: string;
	technicianName: string;
	technicianAvatar?: string;

	// Rankings (1 = best)
	revenueRanking: number;
	ratingRanking: number;
	utilizationRanking: number;
	overallRanking: number;

	// Metrics
	totalRevenue: number;
	totalJobs: number;
	avgRating: number;
	utilizationRate: number;
	firstTimeFixRate: number;
	onTimeRate: number;
	npsScore: number;

	// Badges/Achievements
	badges: string[];

	// Comparison
	rankChange: number; // vs previous period
};

type LeaderboardProps = {
	companyId: string;
	className?: string;
};

// ============================================================================
// Badge Configuration
// ============================================================================

const BADGE_CONFIG: Record<
	string,
	{
		icon: React.ComponentType<{ className?: string }>;
		color: string;
		label: string;
	}
> = {
	top_performer: {
		icon: Crown,
		color: "text-amber-500",
		label: "Top Performer",
	},
	revenue_king: {
		icon: DollarSign,
		color: "text-green-500",
		label: "Revenue King",
	},
	five_star: { icon: Star, color: "text-yellow-500", label: "5-Star Tech" },
	speed_demon: { icon: Zap, color: "text-blue-500", label: "Speed Demon" },
	perfect_attendance: {
		icon: Target,
		color: "text-purple-500",
		label: "Perfect Attendance",
	},
	customer_favorite: {
		icon: ThumbsUp,
		color: "text-pink-500",
		label: "Customer Favorite",
	},
	first_time_fixer: {
		icon: Award,
		color: "text-orange-500",
		label: "First Time Fixer",
	},
	hot_streak: { icon: Flame, color: "text-red-500", label: "Hot Streak" },
	utilization_hero: {
		icon: TrendingUp,
		color: "text-emerald-500",
		label: "Utilization Hero",
	},
	on_time_champion: {
		icon: Timer,
		color: "text-cyan-500",
		label: "On-Time Champion",
	},
};

// ============================================================================
// Component
// ============================================================================

export function TechnicianLeaderboard({
	companyId,
	className,
}: LeaderboardProps) {
	const [period, setPeriod] = useState<Period>("week");
	const [isLoading, setIsLoading] = useState(true);
	const [rankings, setRankings] = useState<TechnicianRanking[]>([]);
	const [activeTab, setActiveTab] = useState("overall");

	// Fetch leaderboard data
	const fetchLeaderboard = useCallback(async () => {
		setIsLoading(true);
		const supabase = createClient();

		// Calculate date range based on period
		const now = new Date();
		let startDate: Date;

		switch (period) {
			case "week":
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case "month":
				startDate = new Date(now.getFullYear(), now.getMonth(), 1);
				break;
			case "quarter": {
				const quarter = Math.floor(now.getMonth() / 3);
				startDate = new Date(now.getFullYear(), quarter * 3, 1);
				break;
			}
		}

		const { data, error } = await supabase
			.from("analytics_technician_leaderboard")
			.select(
				`
				*,
				team_members:technician_id (
					id,
					full_name,
					avatar_url
				)
			`,
			)
			.eq("company_id", companyId)
			.gte("period_start", startDate.toISOString().split("T")[0])
			.order("overall_ranking", { ascending: true });

		if (error) {
			console.error("Failed to fetch leaderboard:", error);
			setIsLoading(false);
			return;
		}

		const rankingsData: TechnicianRanking[] =
			data?.map((row) => {
				const teamMember = row.team_members as {
					id: string;
					full_name: string;
					avatar_url?: string;
				} | null;

				return {
					id: row.id,
					technicianId: row.technician_id,
					technicianName: teamMember?.full_name || "Unknown",
					technicianAvatar: teamMember?.avatar_url,
					revenueRanking: row.revenue_ranking || 0,
					ratingRanking: row.rating_ranking || 0,
					utilizationRanking: row.utilization_ranking || 0,
					overallRanking: row.overall_ranking || 0,
					totalRevenue: row.total_revenue || 0,
					totalJobs: row.total_jobs || 0,
					avgRating: row.avg_rating || 0,
					utilizationRate: row.utilization_rate || 0,
					firstTimeFixRate: row.first_time_fix_rate || 0,
					onTimeRate: row.on_time_rate || 0,
					npsScore: row.nps_score || 0,
					badges: row.badges || [],
					rankChange: row.rank_change || 0,
				};
			}) || [];

		setRankings(rankingsData);
		setIsLoading(false);
	}, [companyId, period]);

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	// Sort rankings based on active tab
	const sortedRankings = [...rankings].sort((a, b) => {
		switch (activeTab) {
			case "revenue":
				return a.revenueRanking - b.revenueRanking;
			case "rating":
				return a.ratingRanking - b.ratingRanking;
			case "utilization":
				return a.utilizationRanking - b.utilizationRanking;
			default:
				return a.overallRanking - b.overallRanking;
		}
	});

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Trophy className="h-5 w-5 text-amber-500" />
							Technician Leaderboard
						</CardTitle>
						<CardDescription>
							Performance rankings and achievements
						</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={period}
							onValueChange={(v) => setPeriod(v as Period)}
						>
							<SelectTrigger className="w-28">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="week">This Week</SelectItem>
								<SelectItem value="month">This Month</SelectItem>
								<SelectItem value="quarter">This Quarter</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="icon"
							onClick={fetchLeaderboard}
							disabled={isLoading}
						>
							<RefreshCw
								className={cn("h-4 w-4", isLoading && "animate-spin")}
							/>
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overall" className="text-xs">
							Overall
						</TabsTrigger>
						<TabsTrigger value="revenue" className="text-xs">
							Revenue
						</TabsTrigger>
						<TabsTrigger value="rating" className="text-xs">
							Rating
						</TabsTrigger>
						<TabsTrigger value="utilization" className="text-xs">
							Utilization
						</TabsTrigger>
					</TabsList>

					<TabsContent value={activeTab} className="mt-4">
						{isLoading ? (
							<div className="space-y-3">
								{[...Array(5)].map((_, i) => (
									<Skeleton key={i} className="h-20" />
								))}
							</div>
						) : sortedRankings.length > 0 ? (
							<ScrollArea className="h-[400px] pr-4">
								<div className="space-y-2">
									{sortedRankings.map((tech, index) => (
										<LeaderboardRow
											key={tech.id}
											technician={tech}
											rank={index + 1}
											activeTab={activeTab}
										/>
									))}
								</div>
							</ScrollArea>
						) : (
							<div className="flex h-40 items-center justify-center text-muted-foreground">
								<p>No leaderboard data available for this period</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

// ============================================================================
// Sub-Components
// ============================================================================

type LeaderboardRowProps = {
	technician: TechnicianRanking;
	rank: number;
	activeTab: string;
};

function LeaderboardRow({ technician, rank, activeTab }: LeaderboardRowProps) {
	const getRankIcon = () => {
		if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
		if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
		if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
		return (
			<span className="flex h-5 w-5 items-center justify-center text-sm font-medium text-muted-foreground">
				{rank}
			</span>
		);
	};

	const getMetricValue = () => {
		switch (activeTab) {
			case "revenue":
				return `$${(technician.totalRevenue / 1000).toFixed(1)}k`;
			case "rating":
				return technician.avgRating.toFixed(1);
			case "utilization":
				return `${technician.utilizationRate.toFixed(0)}%`;
			default:
				return `#${technician.overallRanking}`;
		}
	};

	const getMetricLabel = () => {
		switch (activeTab) {
			case "revenue":
				return "revenue";
			case "rating":
				return "rating";
			case "utilization":
				return "util";
			default:
				return "overall";
		}
	};

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
				rank === 1 && "border-amber-500/50 bg-amber-500/5",
				rank === 2 && "border-gray-400/50 bg-gray-400/5",
				rank === 3 && "border-amber-700/50 bg-amber-700/5",
			)}
		>
			{/* Rank */}
			<div className="flex h-8 w-8 shrink-0 items-center justify-center">
				{getRankIcon()}
			</div>

			{/* Avatar */}
			<Avatar className="h-10 w-10">
				{technician.technicianAvatar && (
					<AvatarImage
						src={technician.technicianAvatar}
						alt={technician.technicianName}
					/>
				)}
				<AvatarFallback className="bg-primary/10">
					{technician.technicianName
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase()
						.slice(0, 2)}
				</AvatarFallback>
			</Avatar>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="font-medium truncate">
						{technician.technicianName}
					</span>
					{technician.rankChange !== 0 && (
						<Badge
							variant="secondary"
							className={cn(
								"text-xs",
								technician.rankChange > 0 && "bg-green-100 text-green-700",
								technician.rankChange < 0 && "bg-red-100 text-red-700",
							)}
						>
							{technician.rankChange > 0 ? "↑" : "↓"}
							{Math.abs(technician.rankChange)}
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-2 mt-0.5">
					<span className="text-xs text-muted-foreground">
						{technician.totalJobs} jobs
					</span>
					<span className="text-xs text-muted-foreground">•</span>
					<span className="text-xs text-muted-foreground">
						{technician.onTimeRate.toFixed(0)}% on-time
					</span>
				</div>
			</div>

			{/* Badges */}
			<TooltipProvider>
				<div className="flex items-center gap-1">
					{technician.badges.slice(0, 3).map((badge) => {
						const config = BADGE_CONFIG[badge];
						if (!config) return null;
						const BadgeIcon = config.icon;
						return (
							<Tooltip key={badge}>
								<TooltipTrigger>
									<div
										className={cn(
											"flex h-6 w-6 items-center justify-center rounded-full bg-muted",
											config.color,
										)}
									>
										<BadgeIcon className="h-3 w-3" />
									</div>
								</TooltipTrigger>
								<TooltipContent>{config.label}</TooltipContent>
							</Tooltip>
						);
					})}
					{technician.badges.length > 3 && (
						<span className="text-xs text-muted-foreground">
							+{technician.badges.length - 3}
						</span>
					)}
				</div>
			</TooltipProvider>

			{/* Primary Metric */}
			<div className="text-right shrink-0">
				<div className="text-lg font-bold">{getMetricValue()}</div>
				<div className="text-xs text-muted-foreground">{getMetricLabel()}</div>
			</div>
		</div>
	);
}

// ============================================================================
// Export
// ============================================================================

export default TechnicianLeaderboard;
