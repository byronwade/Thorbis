"use client";

import { AlertCircle, ArrowRight, Clock, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Alert = {
  id: string;
  type: "critical" | "warning";
  category: "overdue" | "running-late" | "callback";
  title: string;
  description: string;
  count?: number;
  action?: string;
};

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    category: "overdue",
    title: "Overdue Jobs",
    description: "Jobs past scheduled completion",
    count: 2,
    action: "View Jobs",
  },
  {
    id: "2",
    type: "warning",
    category: "running-late",
    title: "Behind Schedule",
    description: "Technicians running late",
    count: 3,
    action: "Adjust",
  },
  {
    id: "3",
    type: "warning",
    category: "callback",
    title: "Missed Calls",
    description: "Callbacks needed today",
    count: 5,
    action: "Call Now",
  },
];

const categoryIcons = {
  overdue: AlertCircle,
  "running-late": Clock,
  callback: PhoneOff,
};

export function OperationalAlerts() {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-xl">Needs Attention</h2>
        <p className="text-muted-foreground text-sm">
          {alerts.length} {alerts.length === 1 ? "item" : "items"} require
          action
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => {
          const Icon = categoryIcons[alert.category];

          return (
            <div
              className={cn(
                "group relative rounded-lg border bg-card p-6 transition-all hover:shadow-md",
                alert.type === "critical" &&
                  "border-red-200 dark:border-red-900/50"
              )}
              key={alert.id}
            >
              {/* Count Badge */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div className="text-right">
                  <div className="font-bold text-3xl tabular-nums leading-none">
                    {alert.count}
                  </div>
                  <div className="mt-1 text-muted-foreground text-xs uppercase tracking-wide">
                    {alert.type}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm leading-none">
                  {alert.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Action */}
              {alert.action && (
                <button
                  className="mt-4 flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  type="button"
                >
                  <span className="font-medium">{alert.action}</span>
                  <ArrowRight className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
