"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus, SlidersHorizontal } from "lucide-react"
import { ScheduleViewToggle } from "./schedule-view-toggle"
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ScheduleToolbarActions() {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const view = useScheduleViewStore((state) => state.view)
  const setView = useScheduleViewStore((state) => state.setView)

  // Prevent hydration mismatch by only rendering selects after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {/* Left Group: View Toggle */}
      <ScheduleViewToggle view={view} onViewChange={setView} />

      {/* Middle Group: Date Picker with Calendar (Priority Control) */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <CalendarIcon className="size-4" />
            <span className="font-medium">{format(date, "MMM dd, yyyy")}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate)
                // TODO: Apply date filter to schedule
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Right Group: Filters in Popover + New Job */}
      <div className="ml-auto flex items-center gap-2">
        {/* Condensed Filters Popover */}
        {mounted && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <SlidersHorizontal className="size-4" />
                <span>Filters</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[280px] p-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Technician
                  </label>
                  <Select defaultValue="all" onValueChange={(id) => {
                    // TODO: Apply technician filter to schedule
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>
                  <Select defaultValue="all" onValueChange={(status) => {
                    // TODO: Apply status filter to schedule
                  }}>
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
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      // TODO: Clear all filters
                    }}
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
                    onClick={() => {
                      // TODO: Apply filters to schedule
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Primary Action: New Job */}
        <button
          type="button"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-sm font-medium text-background transition-all",
            "hover:opacity-90 active:scale-[0.97]"
          )}
          onClick={() => {
            // TODO: Open new job dialog
          }}
        >
          <Plus className="size-4" />
          <span>New Job</span>
        </button>
      </div>
    </div>
  )
}
