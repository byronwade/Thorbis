"use client";

/**
 * Sentiment Indicator Component
 *
 * Real-time display of customer sentiment during calls.
 * Analyzes transcript to detect emotional state and alerts CSR
 * when sentiment drops so they can adjust their approach.
 *
 * Features:
 * - Real-time sentiment score (1-100)
 * - Visual indicator (emoji + color)
 * - Trend direction (improving/declining)
 * - Alert when sentiment drops significantly
 * - History sparkline
 */

import {
	AlertTriangle,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	Frown,
	Meh,
	Smile,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SentimentLevel = "positive" | "neutral" | "negative";

type SentimentData = {
	score: number; // 0-100 (0 = very negative, 100 = very positive)
	level: SentimentLevel;
	trend: "improving" | "stable" | "declining";
	confidence: number; // 0-100
	lastChange?: number; // Change from previous reading
	keywords?: string[]; // Detected emotional keywords
};

type SentimentIndicatorProps = {
	sentiment: SentimentData;
	showTrend?: boolean;
	showKeywords?: boolean;
	compact?: boolean;
	onAlert?: (sentiment: SentimentData) => void;
	className?: string;
};

const sentimentConfig: Record<
	SentimentLevel,
	{
		emoji: string;
		icon: React.ElementType;
		label: string;
		color: string;
		bgColor: string;
		borderColor: string;
	}
> = {
	positive: {
		emoji: "😊",
		icon: Smile,
		label: "Happy",
		color: "text-success",
		bgColor: "bg-success/10",
		borderColor: "border-success/30",
	},
	neutral: {
		emoji: "😐",
		icon: Meh,
		label: "Neutral",
		color: "text-muted-foreground",
		bgColor: "bg-muted",
		borderColor: "border-muted",
	},
	negative: {
		emoji: "😠",
		icon: Frown,
		label: "Frustrated",
		color: "text-destructive",
		bgColor: "bg-destructive/10",
		borderColor: "border-destructive/30",
	},
};

const trendConfig = {
	improving: {
		icon: TrendingUp,
		label: "Improving",
		color: "text-success",
	},
	stable: {
		icon: ArrowRight,
		label: "Stable",
		color: "text-muted-foreground",
	},
	declining: {
		icon: TrendingDown,
		label: "Declining",
		color: "text-destructive",
	},
};

export function SentimentIndicator({
	sentiment,
	showTrend = true,
	showKeywords = false,
	compact = false,
	onAlert,
	className,
}: SentimentIndicatorProps) {
	const [showAlert, setShowAlert] = useState(false);
	const config = sentimentConfig[sentiment.level];
	const trend = trendConfig[sentiment.trend];
	const Icon = config.icon;
	const TrendIcon = trend.icon;

	// Show alert when sentiment drops significantly
	useEffect(() => {
		if (
			sentiment.trend === "declining" &&
			sentiment.lastChange &&
			sentiment.lastChange < -15
		) {
			setShowAlert(true);
			onAlert?.(sentiment);

			// Auto-dismiss after 5 seconds
			const timer = setTimeout(() => setShowAlert(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [sentiment, onAlert]);

	// Calculate sentiment bar width
	const barWidth = useMemo(() => {
		return `${Math.max(0, Math.min(100, sentiment.score))}%`;
	}, [sentiment.score]);

	if (compact) {
		return (
			<TooltipProvider delayDuration={200}>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								"flex items-center gap-1.5 rounded-full border px-2 py-1",
								config.bgColor,
								config.borderColor,
								showAlert && "animate-pulse ring-2 ring-destructive/50",
								className,
							)}
						>
							<span className="text-sm">{config.emoji}</span>
							{showTrend && (
								<TrendIcon className={cn("h-3 w-3", trend.color)} />
							)}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							Customer is {config.label.toLowerCase()} ({sentiment.score}%)
						</p>
						<p className="text-muted-foreground text-xs">
							Trend: {trend.label}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<TooltipProvider delayDuration={200}>
			<div
				className={cn(
					"overflow-hidden rounded-xl border shadow-sm",
					config.bgColor,
					config.borderColor,
					showAlert && "ring-2 ring-destructive/50",
					className,
				)}
			>
				{/* Alert Banner */}
				{showAlert && (
					<div className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/10 px-3 py-2">
						<AlertTriangle className="h-4 w-4 animate-pulse text-destructive" />
						<span className="text-xs font-medium text-destructive">
							Customer sentiment dropping - consider adjusting approach
						</span>
					</div>
				)}

				<div className="p-4">
					{/* Main Display */}
					<div className="flex items-center gap-4">
						{/* Emoji */}
						<div
							className={cn(
								"flex h-14 w-14 items-center justify-center rounded-full text-3xl",
								config.bgColor,
								"ring-2",
								config.borderColor,
							)}
						>
							{config.emoji}
						</div>

						{/* Info */}
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className={cn("text-lg font-bold", config.color)}>
									{config.label}
								</span>
								<Badge
									variant="outline"
									className={cn("text-xs", config.borderColor, config.color)}
								>
									{sentiment.score}%
								</Badge>
							</div>

							{/* Trend */}
							{showTrend && (
								<div className="mt-1 flex items-center gap-1">
									<TrendIcon className={cn("h-3.5 w-3.5", trend.color)} />
									<span className={cn("text-xs", trend.color)}>
										{trend.label}
									</span>
									{sentiment.lastChange !== undefined && (
										<span
											className={cn(
												"text-xs",
												sentiment.lastChange > 0
													? "text-success"
													: sentiment.lastChange < 0
														? "text-destructive"
														: "text-muted-foreground",
											)}
										>
											({sentiment.lastChange > 0 ? "+" : ""}
											{sentiment.lastChange}%)
										</span>
									)}
								</div>
							)}

							{/* Confidence */}
							<p className="text-muted-foreground mt-1 text-[10px]">
								{sentiment.confidence}% confidence
							</p>
						</div>
					</div>

					{/* Sentiment Bar */}
					<div className="mt-4">
						<div className="relative h-2 overflow-hidden rounded-full bg-gradient-to-r from-destructive/20 via-warning/20 to-success/20">
							<div
								className={cn(
									"absolute left-0 top-0 h-full transition-all duration-500",
									sentiment.score > 66
										? "bg-success"
										: sentiment.score > 33
											? "bg-warning"
											: "bg-destructive",
								)}
								style={{ width: barWidth }}
							/>
							{/* Indicator dot */}
							<div
								className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-lg transition-all duration-500"
								style={{ left: barWidth }}
							/>
						</div>
						<div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
							<span>Frustrated</span>
							<span>Neutral</span>
							<span>Happy</span>
						</div>
					</div>

					{/* Keywords */}
					{showKeywords && sentiment.keywords && sentiment.keywords.length > 0 && (
						<div className="mt-3 border-t pt-3">
							<p className="text-muted-foreground mb-1.5 text-[10px] font-medium uppercase">
								Detected Keywords
							</p>
							<div className="flex flex-wrap gap-1">
								{sentiment.keywords.map((keyword, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="text-[10px]"
									>
										{keyword}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</TooltipProvider>
	);
}

/**
 * Compact Sentiment Badge
 *
 * For use in the toolbar or header
 */
type SentimentBadgeProps = {
	sentiment: SentimentData;
	onClick?: () => void;
	className?: string;
};

export function SentimentBadge({
	sentiment,
	onClick,
	className,
}: SentimentBadgeProps) {
	const config = sentimentConfig[sentiment.level];
	const trend = trendConfig[sentiment.trend];
	const TrendIcon = trend.icon;

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						className={cn(
							"flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors",
							config.bgColor,
							config.borderColor,
							"hover:opacity-80",
							onClick && "cursor-pointer",
							className,
						)}
						onClick={onClick}
						type="button"
					>
						<span className="text-base">{config.emoji}</span>
						<span className={cn("text-xs font-medium", config.color)}>
							{sentiment.score}%
						</span>
						<TrendIcon className={cn("h-3 w-3", trend.color)} />
					</button>
				</TooltipTrigger>
				<TooltipContent>
					<p className="font-medium">Customer Sentiment</p>
					<p className="text-muted-foreground text-xs">
						{config.label} • {trend.label}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

/**
 * Calculate sentiment level from score
 */
export function getSentimentLevel(score: number): SentimentLevel {
	if (score >= 66) return "positive";
	if (score >= 33) return "neutral";
	return "negative";
}

/**
 * Calculate sentiment trend from history
 */
export function getSentimentTrend(
	history: number[],
): "improving" | "stable" | "declining" {
	if (history.length < 2) return "stable";

	const recent = history.slice(-3);
	const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
	const older = history.slice(-6, -3);
	const avgOlder =
		older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avgRecent;

	const diff = avgRecent - avgOlder;

	if (diff > 5) return "improving";
	if (diff < -5) return "declining";
	return "stable";
}
