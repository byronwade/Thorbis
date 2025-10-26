"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JobStatus = "quoted" | "scheduled" | "in_progress" | "completed" | "cancelled";

interface JobProcessIndicatorProps {
  currentStatus: JobStatus;
  className?: string;
}

const statusSteps = [
  { key: "quoted", label: "Quoted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
] as const;

function getStatusIndex(status: JobStatus): number {
  if (status === "cancelled") return -1;
  return statusSteps.findIndex((step) => step.key === status);
}

export function JobProcessIndicator({ currentStatus, className }: JobProcessIndicatorProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className={cn("rounded-lg border border-destructive bg-destructive/10 p-4", className)}>
        <div className="flex items-center justify-center gap-2">
          <div className="size-8 rounded-full bg-destructive/20 flex items-center justify-center">
            <div className="size-2 rounded-full bg-destructive" />
          </div>
          <span className="font-medium text-destructive">Job Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="relative flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}

                <div className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-background transition-colors">
                  {isCompleted ? (
                    <div className="flex size-full items-center justify-center rounded-full border-primary bg-primary">
                      <Check className="size-4 text-primary-foreground" />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex size-full items-center justify-center rounded-full border-primary bg-primary">
                      <div className="size-2 rounded-full bg-primary-foreground" />
                    </div>
                  ) : (
                    <div className="size-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {index < statusSteps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent ? "text-foreground" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
