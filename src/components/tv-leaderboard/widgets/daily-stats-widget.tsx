/**
 * Daily Stats Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): All 4 metrics in 2x2 grid with icons and labels
 * - COMFORTABLE (200-400px): Top 2 metrics (Revenue + Jobs) with icons
 * - COMPACT (120-200px): Revenue only with label
 * - TINY (<120px): Just the revenue number
 */

import { Briefcase, Calendar, DollarSign, Star } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils/responsive-utils";
import {
	ResponsiveContent,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

type DailyStatsWidgetProps = {
	data: {
		revenue: number;
		jobs: number;
		avgTicket: number;
		rating: number;
	};
};

export function DailyStatsWidget({ data }: DailyStatsWidgetProps) {
	return (
		<ResponsiveWidgetWrapper className="bg-gradient-to-br from-green-500/10 to-green-500/5">
			<ResponsiveContent className="flex flex-col gap-3">
				{/* Header - adapts across stages */}
				<div className="flex items-center gap-2">
					<ResponsiveIcon>
						<Calendar className="text-success" />
					</ResponsiveIcon>
					<ShowAt stage="full">
						<ResponsiveText variant="title">Today's Performance</ResponsiveText>
					</ShowAt>
					<ShowAt stage="comfortable">
						<ResponsiveText className="font-semibold" variant="body">
							Today
						</ResponsiveText>
					</ShowAt>
				</div>

				{/* FULL Stage: All 4 metrics in 2x2 grid */}
				<ShowAt stage="full">
					<div className="grid flex-1 grid-cols-2 gap-2">
						{/* Revenue */}
						<div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<DollarSign className="size-3.5" />
								Revenue
							</div>
							<ResponsiveText className="mt-1 font-bold" variant="display">
								{formatCurrency(data.revenue, "comfortable")}
							</ResponsiveText>
						</div>

						{/* Jobs */}
						<div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<Briefcase className="size-3.5" />
								Jobs
							</div>
							<ResponsiveText className="mt-1 font-bold" variant="display">
								{formatNumber(data.jobs, "comfortable")}
							</ResponsiveText>
						</div>

						{/* Avg Ticket */}
						<div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<DollarSign className="size-3.5" />
								Avg Ticket
							</div>
							<ResponsiveText className="mt-1 font-bold" variant="display">
								{formatCurrency(data.avgTicket, "comfortable")}
							</ResponsiveText>
						</div>

						{/* Rating */}
						<div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
							<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<Star className="size-3.5" />
								Rating
							</div>
							<ResponsiveText className="mt-1 font-bold" variant="display">
								{data.rating.toFixed(1)}
							</ResponsiveText>
						</div>
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: Top 2 metrics only */}
				<ShowAt stage="comfortable">
					<div className="space-y-2">
						{/* Revenue */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<DollarSign className="size-3.5 text-success" />
								<ResponsiveText variant="caption">Revenue</ResponsiveText>
							</div>
							<ResponsiveText className="font-bold" variant="body">
								{formatCurrency(data.revenue, "comfortable")}
							</ResponsiveText>
						</div>

						{/* Jobs */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<Briefcase className="size-3.5 text-primary" />
								<ResponsiveText variant="caption">Jobs</ResponsiveText>
							</div>
							<ResponsiveText className="font-bold" variant="body">
								{formatNumber(data.jobs, "comfortable")}
							</ResponsiveText>
						</div>
					</div>
				</ShowAt>

				{/* COMPACT Stage: Revenue only */}
				<ShowAt stage="compact">
					<div className="flex flex-col items-center justify-center gap-1">
						<ResponsiveText className="text-muted-foreground" variant="caption">
							Revenue
						</ResponsiveText>
						<ResponsiveText
							className="font-bold text-success"
							variant="display"
						>
							{formatCurrency(data.revenue, "compact")}
						</ResponsiveText>
					</div>
				</ShowAt>

				{/* TINY Stage: Just the number */}
				<ShowAt stage="tiny">
					<div className="flex h-full items-center justify-center">
						<ResponsiveText
							className="font-bold text-success"
							variant="display"
						>
							{formatCurrency(data.revenue, "tiny")}
						</ResponsiveText>
					</div>
				</ShowAt>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
