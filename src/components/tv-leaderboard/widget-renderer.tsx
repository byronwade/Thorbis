/**
 * Widget Renderer - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Pure switch/case logic rendered on server
 * - Widget children are already Server Components
 * - Reduced JavaScript bundle size
 */

import type { Widget } from "./widget-types";
import { LeaderboardWidget } from "./widgets/leaderboard-widget";
import { CompanyGoalsWidget } from "./widgets/company-goals-widget";
import { TopPerformerWidget } from "./widgets/top-performer-widget";
import { RevenueChartWidget } from "./widgets/revenue-chart-widget";
import { JobsCompletedWidget } from "./widgets/jobs-completed-widget";
import { AvgTicketWidget } from "./widgets/avg-ticket-widget";
import { CustomerRatingWidget } from "./widgets/customer-rating-widget";
import { DailyStatsWidget } from "./widgets/daily-stats-widget";
import { WeeklyStatsWidget } from "./widgets/weekly-stats-widget";
import { MonthlyStatsWidget } from "./widgets/monthly-stats-widget";

type WidgetRendererProps = {
  widget: Widget;
  data: any;
};

export function WidgetRenderer({ widget, data }: WidgetRendererProps) {
  switch (widget.type) {
    case "leaderboard":
      return <LeaderboardWidget data={{ technicians: data.technicians }} />;
    case "company-goals":
      return <CompanyGoalsWidget data={data.companyGoals} />;
    case "top-performer":
      return <TopPerformerWidget data={data.topPerformer} />;
    case "revenue-chart":
      return <RevenueChartWidget data={data.revenueTrend} />;
    case "jobs-completed":
      return <JobsCompletedWidget data={data.jobsCompleted} />;
    case "avg-ticket":
      return <AvgTicketWidget data={data.avgTicket} />;
    case "customer-rating":
      return <CustomerRatingWidget data={data.customerRating} />;
    case "daily-stats":
      return <DailyStatsWidget data={data.dailyStats} />;
    case "weekly-stats":
      return <WeeklyStatsWidget data={data.weeklyStats} />;
    case "monthly-stats":
      return <MonthlyStatsWidget data={data.monthlyStats} />;
    default:
      return null;
  }
}
