"use client";

/**
 * Gantt View Switcher Component
 * Toggle between Day/Week/Month views
 */

import { Calendar, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GanttViewType = "day" | "week" | "month";

type GanttViewSwitcherProps = {
  view: GanttViewType;
  onViewChange: (view: GanttViewType) => void;
};

export function GanttViewSwitcher({
  view,
  onViewChange,
}: GanttViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-1">
      <Button
        className={cn(
          "h-7 px-3 text-xs",
          view === "day" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewChange("day")}
        size="sm"
        variant={view === "day" ? "default" : "ghost"}
      >
        <Calendar className="mr-1.5 size-3" />
        Day
      </Button>
      <Button
        className={cn(
          "h-7 px-3 text-xs",
          view === "week" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewChange("week")}
        size="sm"
        variant={view === "week" ? "default" : "ghost"}
      >
        <LayoutGrid className="mr-1.5 size-3" />
        Week
      </Button>
      <Button
        className={cn(
          "h-7 px-3 text-xs",
          view === "month" && "bg-primary text-primary-foreground"
        )}
        onClick={() => onViewChange("month")}
        size="sm"
        variant={view === "month" ? "default" : "ghost"}
      >
        <LayoutGrid className="mr-1.5 size-3" />
        Month
      </Button>
    </div>
  );
}
