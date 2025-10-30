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
import { AvgTicketWidget } from "./widgets/avg-ticket-widget";
import { BonusTrackerWidget } from "./widgets/bonus-tracker-widget";
import { CompanyGoalsWidget } from "./widgets/company-goals-widget";
import { CompanyRandomizerWidget } from "./widgets/company-randomizer-widget";
import { CustomerRatingWidget } from "./widgets/customer-rating-widget";
import { DailyStatsWidget } from "./widgets/daily-stats-widget";
import { InspirationalQuoteWidget } from "./widgets/inspirational-quote-widget";
import { JobsCompletedWidget } from "./widgets/jobs-completed-widget";
import { LeaderboardWidget } from "./widgets/leaderboard-widget";
import { MonthlyStatsWidget } from "./widgets/monthly-stats-widget";
import { PerformanceScaleWidget } from "./widgets/performance-scale-widget";
import { PrizeWheelWidget } from "./widgets/prize-wheel-widget";
import { RevenueChartWidget } from "./widgets/revenue-chart-widget";
import { TopPerformerWidget } from "./widgets/top-performer-widget";
import { WeeklyStatsWidget } from "./widgets/weekly-stats-widget";

type WidgetRendererProps = {
  widget: Widget;
  data: Record<string, unknown>;
};

export function WidgetRenderer({ widget, data }: WidgetRendererProps) {
  switch (widget.type) {
    case "leaderboard":
      return (
        <LeaderboardWidget data={{ technicians: data.technicians as never }} />
      );
    case "company-goals":
      return <CompanyGoalsWidget data={data.companyGoals as never} />;
    case "top-performer":
      return <TopPerformerWidget data={data.topPerformer as never} />;
    case "revenue-chart":
      return <RevenueChartWidget data={data.revenueTrend as never} />;
    case "jobs-completed":
      return <JobsCompletedWidget data={data.jobsCompleted as never} />;
    case "avg-ticket":
      return <AvgTicketWidget data={data.avgTicket as never} />;
    case "customer-rating":
      return <CustomerRatingWidget data={data.customerRating as never} />;
    case "daily-stats":
      return <DailyStatsWidget data={data.dailyStats as never} />;
    case "weekly-stats":
      return <WeeklyStatsWidget data={data.weeklyStats as never} />;
    case "monthly-stats":
      return <MonthlyStatsWidget data={data.monthlyStats as never} />;
    case "inspirational-quote":
      return <InspirationalQuoteWidget />;
    case "bonus-tracker":
      return <BonusTrackerWidget data={data.bonusTracker as never} />;
    case "prize-wheel":
      return (
        <PrizeWheelWidget currentPrize={(data.prizeOptions as never)?.[0]} />
      );
    case "performance-scale":
      return <PerformanceScaleWidget data={data.performanceScale as never} />;
    case "company-randomizer":
      return (
        <CompanyRandomizerWidget selected={data.randomizerCategory as never} />
      );
    default:
      return null;
  }
}
