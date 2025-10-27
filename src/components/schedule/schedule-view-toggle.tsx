"use client"

import { LayoutGrid, List, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ScheduleView = "timeline" | "list" | "calendar"

interface ScheduleViewToggleProps {
  view: ScheduleView
  onViewChange: (view: ScheduleView) => void
}

export function ScheduleViewToggle({ view, onViewChange }: ScheduleViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-2.5 text-xs",
          view === "timeline" && "bg-muted shadow-sm"
        )}
        onClick={() => onViewChange("timeline")}
      >
        <LayoutGrid className="mr-1.5 size-3.5" />
        Timeline
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-2.5 text-xs",
          view === "list" && "bg-muted shadow-sm"
        )}
        onClick={() => onViewChange("list")}
      >
        <List className="mr-1.5 size-3.5" />
        List
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 px-2.5 text-xs",
          view === "calendar" && "bg-muted shadow-sm"
        )}
        onClick={() => onViewChange("calendar")}
      >
        <Calendar className="mr-1.5 size-3.5" />
        Calendar
      </Button>
    </div>
  )
}
