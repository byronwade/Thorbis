/**
 * Marketing Analytics Data - Async Server Component
 *
 * Displays marketing analytics content (Coming Soon variant).
 * This component is wrapped in Suspense for PPR pattern,
 * allowing future expansion to data-driven analytics.
 */

import {
  BarChart3,
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function MarketingAnalyticsData() {
  // Future: Fetch marketing analytics data
  // const analytics = await fetchMarketingAnalytics();

  return (
    <ComingSoonShell
      description="Track marketing performance, measure ROI, and optimize your campaigns with data-driven insights"
      icon={BarChart3}
      title="Marketing Analytics"
    >
      {/* Feature cards */}
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* ROI tracking */}
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">ROI Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Measure return on investment for every marketing channel and
              campaign to maximize profitability
            </p>
          </div>

          {/* Conversion analytics */}
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <MousePointerClick className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Conversion Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track lead-to-customer conversion rates and identify bottlenecks
              in your sales funnel
            </p>
          </div>

          {/* Customer acquisition */}
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Customer Acquisition</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze customer acquisition costs (CAC) and lifetime value (LTV)
              by marketing channel
            </p>
          </div>

          {/* Performance trends */}
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Performance Trends</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Identify trends and patterns in your marketing data to forecast
              future performance
            </p>
          </div>
        </div>

        {/* CTA section */}
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Data-Driven Marketing</h3>
          <p className="mb-6 text-muted-foreground">
            Make informed decisions with comprehensive marketing analytics
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="rounded-lg border border-primary/20 bg-background px-6 py-2 font-medium transition-colors hover:bg-primary/5"
              type="button"
            >
              Learn More
            </button>
            <button
              className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              type="button"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    </ComingSoonShell>
  );
}
