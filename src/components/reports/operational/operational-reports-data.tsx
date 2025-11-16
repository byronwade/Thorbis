/**
 * Operational Reports Data - Async Server Component
 *
 * Displays operational reports content (Coming Soon variant).
 */

import { Clock, Settings, TrendingUp, Users } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function OperationalReportsData() {
  return (
    <ComingSoonShell
      description="Track operational efficiency, technician productivity, job completion rates, and resource utilization"
      icon={Settings}
      title="Operational Reports"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Technician Productivity</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Monitor job completion rates, time efficiency, and revenue per
              technician
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Schedule Efficiency</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze route optimization, appointment adherence, and technician
              utilization
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Job Metrics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track completion times, callback rates, and first-time-fix
              percentages
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Resource Utilization</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Optimize equipment usage, parts consumption, and workforce
              allocation
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Optimize Operations</h3>
          <p className="mb-6 text-muted-foreground">
            Identify bottlenecks and improve efficiency
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
