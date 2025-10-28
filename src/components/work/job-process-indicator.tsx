/**
 * Job Process Indicator - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static status visualization rendered on server
 * - CSS animations (animate-pulse, animate-ping) work without JavaScript
 * - Reduced JavaScript bundle size
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JobStatus =
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

type JobProcessIndicatorProps = {
  currentStatus: JobStatus;
  className?: string;
  dates?: {
    quoted?: Date | null;
    scheduled?: Date | null;
    inProgress?: Date | null;
    completed?: Date | null;
  };
};

const statusSteps = [
  { key: "quoted", label: "Quoted", dateKey: "quoted" as const },
  { key: "scheduled", label: "Scheduled", dateKey: "scheduled" as const },
  { key: "in_progress", label: "In Progress", dateKey: "inProgress" as const },
  { key: "completed", label: "Completed", dateKey: "completed" as const },
] as const;

function formatStepDate(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatStepTime(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getStatusIndex(status: JobStatus): number {
  if (status === "cancelled") {
    return -1;
  }
  return statusSteps.findIndex((step) => step.key === status);
}

export function JobProcessIndicator({
  currentStatus,
  className,
  dates,
}: JobProcessIndicatorProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive bg-destructive/10 p-4",
          className
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-destructive/20">
            <div className="size-2 rounded-full bg-destructive" />
          </div>
          <span className="font-medium text-destructive">Job Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-card p-8 shadow-sm", className)}>
      <div className="relative flex items-start justify-between gap-2">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const _isUpcoming = index > currentIndex;

          return (
            <div className="flex flex-1 flex-col items-center" key={step.key}>
              {/* Step Container */}
              <div className="relative flex w-full items-center justify-center">
                {/* Connecting Line - Left Side */}
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute top-5 right-1/2 h-[2px] w-full transition-all duration-300",
                      isCompleted
                        ? "bg-gradient-to-r from-primary to-primary"
                        : "bg-muted"
                    )}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={cn(
                    "relative z-10 flex size-10 items-center justify-center rounded-full border-2 bg-background shadow-sm transition-all duration-300",
                    isCompleted || isCurrent
                      ? "scale-110 border-primary"
                      : "border-muted"
                  )}
                >
                  {isCompleted ? (
                    <div className="flex size-full items-center justify-center rounded-full bg-primary">
                      <Check
                        className="size-5 text-primary-foreground"
                        strokeWidth={2.5}
                      />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative flex size-full items-center justify-center rounded-full bg-primary">
                      <div className="size-2.5 animate-pulse rounded-full bg-primary-foreground shadow-lg" />
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary-foreground opacity-75" />
                    </div>
                  ) : (
                    <div className="size-2.5 rounded-full bg-muted" />
                  )}
                </div>

                {/* Connecting Line - Right Side */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-1/2 h-[2px] w-full transition-all duration-300",
                      isCompleted
                        ? "bg-gradient-to-l from-primary to-primary"
                        : "bg-muted"
                    )}
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-4 text-center">
                <p
                  className={cn(
                    "font-semibold text-sm transition-all duration-300",
                    isCurrent
                      ? "scale-105 text-foreground"
                      : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-primary" />
                )}
                {/* Date and Time */}
                {dates?.[step.dateKey] && (
                  <div className="mt-2 space-y-0.5">
                    <p
                      className={cn(
                        "text-xs transition-all duration-300",
                        isCurrent
                          ? "text-foreground/80"
                          : isCompleted
                            ? "text-muted-foreground/80"
                            : "text-muted-foreground/40"
                      )}
                    >
                      {formatStepDate(dates[step.dateKey])}
                    </p>
                    <p
                      className={cn(
                        "text-xs transition-all duration-300",
                        isCurrent
                          ? "text-foreground/60"
                          : isCompleted
                            ? "text-muted-foreground/60"
                            : "text-muted-foreground/30"
                      )}
                    >
                      {formatStepTime(dates[step.dateKey])}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
