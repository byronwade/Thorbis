/**
 * Job Status Pipeline - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static pipeline visualization rendered on server
 * - CSS transitions work without JavaScript
 * - Reduced JavaScript bundle size
 */

import { cn } from "@/lib/utils";

const pipelineData = [
  { stage: "Scheduled", count: 18, percentage: 22 },
  { stage: "En Route", count: 7, percentage: 9 },
  { stage: "In Progress", count: 12, percentage: 15 },
  { stage: "Completed", count: 24, percentage: 30 },
  { stage: "Invoiced", count: 20, percentage: 24 },
];

export function JobStatusPipeline() {
  const total = pipelineData.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-xl">Job Flow</h2>
        <p className="text-muted-foreground text-sm">
          {total} total jobs today
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        {/* Progress Bar */}
        <div className="flex h-3 overflow-hidden rounded-t-lg">
          <div
            className="bg-blue-500 transition-all"
            style={{ width: `${pipelineData[0].percentage}%` }}
          />
          <div
            className="bg-purple-500 transition-all"
            style={{ width: `${pipelineData[1].percentage}%` }}
          />
          <div
            className="bg-yellow-500 transition-all"
            style={{ width: `${pipelineData[2].percentage}%` }}
          />
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${pipelineData[3].percentage}%` }}
          />
          <div
            className="bg-emerald-600 transition-all"
            style={{ width: `${pipelineData[4].percentage}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 divide-x">
          {pipelineData.map((stage, index) => {
            const colors = [
              "text-blue-600 dark:text-blue-400",
              "text-purple-600 dark:text-purple-400",
              "text-yellow-600 dark:text-yellow-400",
              "text-green-600 dark:text-green-400",
              "text-emerald-600 dark:text-emerald-400",
            ];

            return (
              <div className="p-4 text-center" key={stage.stage}>
                <div
                  className={cn(
                    "font-bold text-2xl tabular-nums",
                    colors[index]
                  )}
                >
                  {stage.count}
                </div>
                <div className="mt-1 font-medium text-sm leading-tight">
                  {stage.stage}
                </div>
                <div className="text-muted-foreground text-xs">
                  {stage.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
