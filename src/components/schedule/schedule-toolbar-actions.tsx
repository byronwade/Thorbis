"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";

const jobTypeLegend = [
  {
    label: "Emergency / Urgent",
    classes: "border-red-400 bg-red-50 text-red-700 dark:bg-red-950",
  },
  {
    label: "Callback / Follow Up",
    classes: "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950",
  },
  {
    label: "Meetings / Events",
    classes: "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950",
  },
  {
    label: "Install / New Work",
    classes: "border-green-400 bg-green-50 text-green-700 dark:bg-green-950",
  },
  {
    label: "Service / Maintenance",
    classes: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950",
  },
  {
    label: "Standard / Other",
    classes: "border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-900",
  },
];

const statusLegend = [
  { label: "Scheduled", classes: "bg-blue-500" },
  { label: "Dispatched", classes: "bg-sky-500" },
  { label: "Arrived", classes: "bg-emerald-400" },
  { label: "In Progress", classes: "bg-amber-500 animate-pulse" },
  { label: "Closed", classes: "bg-emerald-600" },
  { label: "Cancelled", classes: "bg-slate-400" },
];

export function ScheduleToolbarActions() {
  const [mounted, setMounted] = useState(false);
  const {
    currentDate,
    setCurrentDate,
    goToToday,
    navigatePrevious,
    navigateNext,
  } = useScheduleViewStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj =
    currentDate instanceof Date ? currentDate : new Date(currentDate);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-md border bg-muted" />
        <div className="h-9 w-[160px] rounded-md border bg-muted" />
        <div className="h-9 w-9 rounded-md border bg-muted" />
        <div className="h-9 w-16 rounded-md border bg-muted" />
        <div className="h-9 w-9 rounded-md border bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
          {/* Date Navigation */}
      <Button onClick={navigatePrevious} size="sm" variant="outline">
              <ChevronLeft className="size-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="size-4" />
                  <span className="font-medium">
              {format(dateObj, "MMM dd, yyyy")}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  onSelect={(newDate) => {
                    if (newDate) {
                      setCurrentDate(newDate);
                    }
                  }}
            selected={dateObj}
                />
              </PopoverContent>
            </Popover>

      <Button onClick={navigateNext} size="sm" variant="outline">
              <ChevronRight className="size-4" />
            </Button>

      <Button onClick={goToToday} size="sm" variant="default">
              Today
            </Button>

          <Popover>
            <PopoverTrigger asChild>
          <Button
            aria-label="Show schedule legend"
            size="icon"
            variant="ghost"
          >
            <HelpCircle className="size-4" />
              </Button>
            </PopoverTrigger>
        <PopoverContent align="end" className="w-64 space-y-4 text-sm">
                  <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Job Type Colors
            </p>
            <div className="space-y-1.5">
              {jobTypeLegend.map((item) => (
                <div
                  className="flex items-center gap-2 rounded-md border bg-card/70 px-2.5 py-1.5 text-xs"
                  key={item.label}
                    >
                  <span className={cn("h-4 w-4 rounded-full border", item.classes)} />
                  <span className="text-foreground">{item.label}</span>
                </div>
                        ))}
            </div>
                  </div>

                <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status Dot Legend
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {statusLegend.map((item) => (
                <div className="flex items-center gap-2" key={item.label}>
                  <span className={cn("h-2.5 w-2.5 rounded-full", item.classes)} />
                  <span>{item.label}</span>
                </div>
              ))}
                  </div>
              </div>
            </PopoverContent>
          </Popover>
    </div>
  );
}
