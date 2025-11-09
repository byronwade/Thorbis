"use client";

import { format } from "date-fns";
import { CalendarIcon, Plus, SlidersHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ScheduleViewToggle } from "./schedule-view-toggle";

export function ScheduleToolbarActions() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const view = useScheduleViewStore((state) => state.view);
  const setView = useScheduleViewStore((state) => state.setView);

  // Prevent hydration mismatch by only rendering selects after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Left Group: View Toggle */}
      <ScheduleViewToggle onViewChange={setView} view={view} />

      {/* Middle Group: Date Picker with Calendar (Priority Control) */}
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
            <span className="font-medium">{format(date, "MMM dd, yyyy")}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            initialFocus
            mode="single"
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                // TODO: Apply date filter to schedule
              }
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>

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
                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Technician
                  </label>
                  <Select
                    defaultValue="all"
                    onValueChange={(id) => {
                      // TODO: Apply technician filter to schedule
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-williams">
                        Sarah Williams
                      </SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-sm">
                    Status
                  </label>
                  <Select
                    defaultValue="all"
                    onValueChange={(status) => {
                      // TODO: Apply status filter to schedule
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

                <div className="flex items-center justify-between pt-2">
                  <button
                    className="text-muted-foreground text-sm hover:text-foreground"
                    onClick={() => {
                      // TODO: Clear all filters
                    }}
                    type="button"
                  >
                    Clear all
                  </button>
                  <button
                    className="rounded-md bg-foreground px-3 py-1.5 font-medium text-background text-sm hover:opacity-90"
                    onClick={() => {
                      // TODO: Apply filters to schedule
                    }}
                    type="button"
                  >
                    Apply
                  </button>
                </div>
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

        <ImportExportDropdown dataType="schedule" />
      </div>
    </div>
  );
}
