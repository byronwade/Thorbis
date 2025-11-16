/**
 * Performance Reports Data - Async Server Component
 *
 * Displays performance reports content (Coming Soon variant).
 */

import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { TrendingUp, Target, Award, Zap } from "lucide-react";

export async function PerformanceReportsData() {
  return (
    <ComingSoonShell
      title="Performance Reports"
      icon={TrendingUp}
      description="Track KPIs, monitor team performance, and measure progress toward business goals"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">KPI Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Monitor key performance indicators and measure progress toward strategic goals
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Team Performance</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Evaluate technician performance, identify top performers, and areas for improvement
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Growth Metrics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track revenue growth, customer acquisition, and market share expansion
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Efficiency Metrics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Measure operational efficiency, resource utilization, and productivity trends
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Measure What Matters</h3>
          <p className="mb-6 text-muted-foreground">
            Data-driven insights to achieve your business goals
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="rounded-lg border border-primary/20 bg-background px-6 py-2 font-medium transition-colors hover:bg-primary/5"
            >
              Learn More
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    </ComingSoonShell>
  );
}
