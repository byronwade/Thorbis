"use client"

import { LayoutGrid, List, Calendar, MapPin, Bug } from "lucide-react"
import { cn } from "@/lib/utils"

export type ScheduleView = "timeline" | "list" | "calendar" | "map" | "test"

interface ScheduleViewToggleProps {
  view: ScheduleView
  onViewChange: (view: ScheduleView) => void
}

export function ScheduleViewToggle({ view, onViewChange }: ScheduleViewToggleProps) {
  const views = [
    { value: "timeline" as const, icon: LayoutGrid, label: "Timeline" },
    { value: "test" as const, icon: Bug, label: "Debug" },
    // Temporarily disabled old views
    // { value: "list" as const, icon: List, label: "List" },
    // { value: "calendar" as const, icon: Calendar, label: "Calendar" },
    // { value: "map" as const, icon: MapPin, label: "Map" },
  ]

  return (
    <div className="inline-flex items-stretch rounded-lg border bg-background p-1">
      {views.map((item) => {
        const Icon = item.icon
        const isActive = view === item.value

        return (
          <button
            key={item.value}
            type="button"
            className={cn(
              "relative flex min-w-[80px] items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-all",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onViewChange(item.value)}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
