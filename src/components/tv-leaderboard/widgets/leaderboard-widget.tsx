/**
 * Leaderboard Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Top 5 technicians with full details (rank, avatar, name, trend, revenue, jobs)
 * - COMFORTABLE (200-400px): Top 3 technicians with compact layout
 * - COMPACT (120-200px): Top 1 technician with minimal info
 * - TINY (<120px): Just #1's revenue
 */

import { TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { formatCurrency, formatNumber, getTrendClass } from "@/lib/utils/responsive-utils";
import {
	ResponsiveContent,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

type Technician = {
	id: string;
	name: string;
	avatar: string;
	stats: {
		revenue: number;
		revenueChange: number;
		jobsCompleted: number;
		jobsChange: number;
		avgTicket: number;
		avgTicketChange: number;
		customerRating: number;
		ratingChange: number;
	};
};

type LeaderboardWidgetProps = {
	data: {
		technicians: Technician[];
	};
};

function TrophyIcon({ rank }: { rank: number }) {
	if (rank >= 3) {
		return null;
	}
	const colors = ["text-warning", "text-muted-foreground", "text-warning"];
	return <Trophy className={`size-3.5 ${colors[rank]}`} />;
}

export function LeaderboardWidget({ data }: LeaderboardWidgetProps) {
	const { technicians } = data;

	return (
		<ResponsiveWidgetWrapper className="from-primary/10 to-primary/5 bg-gradient-to-br">
			<ResponsiveContent className="flex flex-col gap-3">
				{/* Header - adapts across stages */}
				<div className="flex items-center gap-2">
					<ResponsiveIcon>
						<Trophy className="text-warning" />
					</ResponsiveIcon>
					<ShowAt stage="full">
						<ResponsiveText variant="title">Top Technicians</ResponsiveText>
					</ShowAt>
					<ShowAt stage="comfortable">
						<ResponsiveText className="font-semibold" variant="body">
							Leaders
						</ResponsiveText>
					</ShowAt>
				</div>

				{/* FULL Stage: Top 5 technicians with full details */}
				<ShowAt stage="full">
					<div className="space-y-2">
						{technicians.slice(0, 5).map((tech, idx) => {
							const isPositive = tech.stats.revenueChange >= 0;
							const TrendIcon = isPositive ? TrendingUp : TrendingDown;

							return (
								<div
									className="border-primary/10 bg-primary/5 flex items-center gap-2 rounded-lg border p-2"
									key={tech.id}
								>
									{/* Rank + Trophy */}
									<div className="flex w-10 items-center gap-1.5">
										<TrophyIcon rank={idx} />
										<ResponsiveText className="font-bold" variant="body">
											{idx + 1}
										</ResponsiveText>
									</div>

									{/* Avatar */}
									<div className="bg-primary/20 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
										{tech.avatar}
									</div>

									{/* Name + Trend */}
									<div className="min-w-0 flex-1">
										<ResponsiveText className="truncate font-semibold" variant="body">
											{tech.name}
										</ResponsiveText>
										<span
											className={`inline-flex items-center gap-0.5 text-xs ${getTrendClass(tech.stats.revenueChange)}`}
										>
											<TrendIcon className="size-3" />
											{isPositive ? "+" : ""}
											{tech.stats.revenueChange.toFixed(1)}%
										</span>
									</div>

									{/* Revenue + Jobs */}
									<div className="text-right">
										<ResponsiveText className="font-bold" variant="body">
											{formatCurrency(tech.stats.revenue, "comfortable")}
										</ResponsiveText>
										<ResponsiveText className="text-muted-foreground" variant="caption">
											{formatNumber(tech.stats.jobsCompleted, "comfortable")} jobs
										</ResponsiveText>
									</div>
								</div>
							);
						})}
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: Top 3 technicians compact */}
				<ShowAt stage="comfortable">
					<div className="space-y-2">
						{technicians.slice(0, 3).map((tech, idx) => (
							<div
								className="border-primary/10 bg-primary/5 flex items-center gap-2 rounded-lg border p-1.5"
								key={tech.id}
							>
								{/* Rank */}
								<div className="flex w-8 items-center gap-1">
									<TrophyIcon rank={idx} />
									<ResponsiveText className="font-bold" variant="caption">
										{idx + 1}
									</ResponsiveText>
								</div>

								{/* Avatar */}
								<div className="bg-primary/20 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
									{tech.avatar}
								</div>

								{/* Name */}
								<div className="min-w-0 flex-1">
									<ResponsiveText className="truncate font-semibold" variant="caption">
										{tech.name}
									</ResponsiveText>
								</div>

								{/* Revenue */}
								<ResponsiveText className="font-bold" variant="caption">
									{formatCurrency(tech.stats.revenue, "comfortable")}
								</ResponsiveText>
							</div>
						))}
					</div>
				</ShowAt>

				{/* COMPACT Stage: Top 1 only */}
				<ShowAt stage="compact">
					{technicians[0] && (
						<div className="flex flex-col items-center justify-center gap-1">
							<div className="flex items-center gap-1">
								<Trophy className="text-warning size-3" />
								<ResponsiveText className="font-bold" variant="caption">
									#1
								</ResponsiveText>
							</div>
							<div className="bg-primary/20 text-primary flex size-6 items-center justify-center rounded-full text-[10px] font-bold">
								{technicians[0].avatar}
							</div>
							<ResponsiveText className="font-bold" variant="body">
								{formatCurrency(technicians[0].stats.revenue, "compact")}
							</ResponsiveText>
						</div>
					)}
				</ShowAt>

				{/* TINY Stage: Just #1's revenue */}
				<ShowAt stage="tiny">
					{technicians[0] && (
						<div className="flex h-full items-center justify-center">
							<ResponsiveText className="text-warning font-bold" variant="display">
								{formatCurrency(technicians[0].stats.revenue, "tiny")}
							</ResponsiveText>
						</div>
					)}
				</ShowAt>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
