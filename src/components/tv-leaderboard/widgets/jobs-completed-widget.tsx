/**
 * Jobs Completed Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Title, icon, large number, full trend with icon
 * - COMFORTABLE (200-400px): Title + icon inline, number, compact trend
 * - COMPACT (120-200px): Icon + number only
 * - TINY (<120px): Just the number
 */

import { Briefcase, TrendingDown, TrendingUp } from "lucide-react";
import { formatNumber, formatPercentage, getTrendClass } from "@/lib/utils/responsive-utils";
import {
	ResponsiveContent,
	ResponsiveFlex,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

type JobsCompletedWidgetProps = {
	data: {
		total: number;
		change: number;
	};
};

export function JobsCompletedWidget({ data }: JobsCompletedWidgetProps) {
	const isPositive = data.change >= 0;
	const TrendIcon = isPositive ? TrendingUp : TrendingDown;

	return (
		<ResponsiveWidgetWrapper className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
			<ResponsiveContent className="flex flex-col justify-between">
				{/* FULL Stage: Title and icon separate */}
				<ShowAt stage="full">
					<div className="flex items-center justify-between">
						<ResponsiveText variant="title">Jobs Completed</ResponsiveText>
						<ResponsiveIcon>
							<Briefcase className="text-primary" />
						</ResponsiveIcon>
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: Title + icon inline, more compact */}
				<ShowAt stage="comfortable">
					<ResponsiveFlex className="justify-between">
						<ResponsiveText className="text-muted-foreground font-medium" variant="body">
							Jobs
						</ResponsiveText>
						<ResponsiveIcon>
							<Briefcase className="text-primary" />
						</ResponsiveIcon>
					</ResponsiveFlex>
				</ShowAt>

				{/* COMPACT Stage: Just icon at top */}
				<ShowAt stage="compact">
					<div className="flex justify-center">
						<ResponsiveIcon>
							<Briefcase className="text-primary" />
						</ResponsiveIcon>
					</div>
				</ShowAt>

				{/* Main data - shows on all stages */}
				<div className="flex flex-col items-center justify-center @[120px]:items-start @[200px]:items-start">
					{/* Number - uses fluid typography */}
					<ResponsiveText className="font-bold" variant="display">
						{/* Show abbreviated on tiny, full on others */}
						<span className="hidden @[120px]:inline">
							{formatNumber(data.total, "comfortable")}
						</span>
						<span className="@[120px]:hidden">{formatNumber(data.total, "tiny")}</span>
					</ResponsiveText>

					{/* Trend - adaptive visibility and format */}
					<div className="mt-1">
						{/* FULL + COMFORTABLE: Show icon + percentage */}
						<ShowAt stage="full-comfortable">
							<span
								className={`inline-flex items-center gap-1 text-sm ${getTrendClass(data.change)}`}
							>
								<TrendIcon className="size-4" />
								{isPositive ? "+" : ""}
								{formatPercentage(data.change, "comfortable")}
							</span>
						</ShowAt>

						{/* COMPACT: Show just percentage with arrow */}
						<ShowAt stage="compact">
							<span className={`text-xs ${getTrendClass(data.change)}`}>
								{isPositive ? "↑" : "↓"}
								{formatPercentage(data.change, "compact")}
							</span>
						</ShowAt>

						{/* TINY: No trend shown */}
					</div>
				</div>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
