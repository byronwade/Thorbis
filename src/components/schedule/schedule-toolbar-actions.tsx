"use client";

import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { useGanttSchedulerStore } from "@/lib/stores/gantt-scheduler-store";
import { useViewStore } from "@/stores/view-store";
import { cn } from "@/lib/utils";
import { ScheduleViewToggle } from "./schedule-view-toggle";
import { GanttViewSwitcher } from "./gantt-view-switcher";
import { ZoomControls } from "./zoom-controls";
import { useSchedule } from "@/hooks/use-schedule";

export function ScheduleToolbarActions() {
  const [mounted, setMounted] = useState(false);
  const scheduleView = useScheduleViewStore((state) => state.view);
  const setScheduleView = useScheduleViewStore((state) => state.setView);

  // Gantt scheduler state (only used when view is "gantt")
  const {
    currentDate,
    view: ganttView,
    selectedTechnicianId,
    statusFilter,
    setCurrentDate,
    setView: setGanttView,
    setSelectedTechnicianId,
    setStatusFilter,
    handlePrevious,
    handleNext,
    handleToday,
  } = useGanttSchedulerStore();

  const { technicians } = useSchedule();

  // Timeline view state (only used when view is "timeline")
  const { goToToday } = useViewStore();

  // Prevent hydration mismatch by only rendering selects after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isGanttView = scheduleView === "gantt";
  const isTimelineView = scheduleView === "timeline";

  return (
    <div className="flex items-center gap-3">
      {/* Left Group: View Toggle */}
      <ScheduleViewToggle onViewChange={setScheduleView} view={scheduleView} />

      {/* Timeline-specific controls */}
      {isTimelineView && (
        <>
          <ZoomControls />
          <Button onClick={goToToday} size="sm" variant="outline">
            <CalendarIcon className="mr-2 size-4" />
            Today
          </Button>
        </>
      )}

      {/* Gantt-specific controls */}
      {isGanttView && (
        <>
          {/* Gantt View Switcher (Day/Week/Month) */}
          <GanttViewSwitcher view={ganttView} onViewChange={setGanttView} />

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button onClick={handlePrevious} size="sm" variant="outline">
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
                    {ganttView === "day"
                      ? format(currentDate, "MMM dd, yyyy")
                      : ganttView === "week"
                        ? `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM dd")} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), "MMM dd, yyyy")}`
                        : format(currentDate, "MMMM yyyy")}
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
                  selected={currentDate}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleNext} size="sm" variant="outline">
              <ChevronRight className="size-4" />
            </Button>

            <Button onClick={handleToday} size="sm" variant="outline">
              Today
            </Button>
          </div>
        </>
      )}

      {/* Right Group: Filters in Popover + New Job */}
      <div className="ml-auto flex items-center gap-1">
        {/* Condensed Filters Popover */}
        {mounted && (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost">
                <SlidersHorizontal className="mr-2 size-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[280px] p-4">
              <div className="space-y-4">
                {isGanttView && (
                  <div>
                    <label className="mb-2 block font-medium text-sm">
                      Technician
                    </label>
                    <Select
                      value={selectedTechnicianId || "all"}
                      onValueChange={(id) =>
                        setSelectedTechnicianId(id === "all" ? "" : id)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Technicians</SelectItem>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block font-medium text-sm">Status</label>
                  <Select
                    value={isGanttView ? (statusFilter || "all") : "all"}
                    onValueChange={(status) => {
                      if (isGanttView) {
                        setStatusFilter(status === "all" ? "" : status);
                      }
                      // TODO: Apply status filter to other views
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isGanttView && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      className="text-muted-foreground text-sm hover:text-foreground"
                      onClick={() => {
                        setSelectedTechnicianId("");
                        setStatusFilter("");
                      }}
                      type="button"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Primary Action: New Job */}
        <Button
          onClick={() => {
            // TODO: Open new job dialog
          }}
          size="sm"
          variant="default"
        >
          <Plus className="mr-2 size-4" />
          New Job
        </Button>

        {/* Only render ImportExportDropdown after mount to avoid hydration mismatch */}
        {mounted && <ImportExportDropdown dataType="schedule" />}
      </div>
    </div>
  );
}
