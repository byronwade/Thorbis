/**
 * Revenue Chart Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): 7-day bar chart with labels
 * - COMFORTABLE (200-400px): 5-day chart compact
 * - COMPACT (120-200px): 3-day chart minimal
 * - TINY (<120px): Latest revenue only
 */

import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils/responsive-utils";
import {
	ResponsiveContent,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

type RevenueChartWidgetProps = {
	data: {
		trend: Array<{ day: string; revenue: number }>;
	};
};

export function RevenueChartWidget({ data }: RevenueChartWidgetProps) {
	const maxRevenue = Math.max(...data.trend.map((d) => d.revenue));
	const latestRevenue = data.trend.at(-1)?.revenue || 0;

	return (
		<ResponsiveWidgetWrapper className="bg-gradient-to-br from-green-500/10 to-green-500/5">
			<ResponsiveContent className="flex flex-col gap-3">
				{/* Header - adapts across stages */}
				<div className="flex items-center gap-2">
					<ResponsiveIcon>
						<TrendingUp className="text-success" />
					</ResponsiveIcon>
					<ShowAt stage="full">
						<ResponsiveText variant="title">Revenue Trend</ResponsiveText>
					</ShowAt>
					<ShowAt stage="comfortable">
						<ResponsiveText className="font-semibold" variant="body">
							Revenue
						</ResponsiveText>
					</ShowAt>
				</div>

				{/* FULL Stage: 7-day bar chart */}
				<ShowAt stage="full">
					<div className="flex h-full items-end gap-1">
						{data.trend.slice(-7).map((item, idx) => {
							const height = (item.revenue / maxRevenue) * 100;
							return (
								<div className="flex flex-1 flex-col items-center gap-1" key={idx}>
									<div className="relative min-h-0 w-full flex-1">
										<div
											className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-green-500 to-green-400 transition-all duration-500"
											style={{ height: `${height}%`, minHeight: "4px" }}
										/>
									</div>
									<ResponsiveText className="text-muted-foreground" variant="caption">
										{item.day}
									</ResponsiveText>
								</div>
							);
						})}
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: 5-day chart */}
				<ShowAt stage="comfortable">
					<div className="flex h-full items-end gap-1">
						{data.trend.slice(-5).map((item, idx) => {
							const height = (item.revenue / maxRevenue) * 100;
							return (
								<div className="flex flex-1 flex-col items-center gap-1" key={idx}>
									<div className="relative min-h-0 w-full flex-1">
										<div
											className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-green-500 to-green-400"
											style={{ height: `${height}%`, minHeight: "4px" }}
										/>
									</div>
									<ResponsiveText className="text-muted-foreground" variant="caption">
										{item.day.slice(0, 1)}
									</ResponsiveText>
								</div>
							);
						})}
					</div>
				</ShowAt>

				{/* COMPACT Stage: 3-day mini chart */}
				<ShowAt stage="compact">
					<div className="flex flex-1 items-end justify-center gap-1">
						{data.trend.slice(-3).map((item, idx) => {
							const height = (item.revenue / maxRevenue) * 100;
							return (
								<div className="flex w-6 flex-col items-center gap-0.5" key={idx}>
									<div className="relative h-16 w-full">
										<div
											className="absolute bottom-0 w-full rounded-t-sm bg-success"
											style={{ height: `${height}%`, minHeight: "4px" }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</ShowAt>

				{/* TINY Stage: Latest revenue only */}
				<ShowAt stage="tiny">
					<div className="flex h-full items-center justify-center">
						<ResponsiveText className="font-bold text-success" variant="display">
							{formatCurrency(latestRevenue, "tiny")}
						</ResponsiveText>
					</div>
				</ShowAt>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
