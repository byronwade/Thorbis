"use client"

export const dynamic = "force-dynamic"

import { usePageLayout } from "@/hooks/use-page-layout"
import { TimelineView } from "@/components/schedule/timeline-view"
import { ListView } from "@/components/schedule/list-view"
import { CalendarView } from "@/components/schedule/calendar-view"
import { MapView } from "@/components/schedule/map-view"
import { useScheduleView } from "@/components/schedule/schedule-view-provider"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export default function SchedulePage() {
  const { setOpen } = useSidebar()
  const { view } = useScheduleView()

  // Auto-close sidebar on mount
  useEffect(() => {
    setOpen(false)
  }, [setOpen])

  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: true,
    showSidebar: true,
    fixedHeight: true,
  })

  return (
    <div className="h-full w-full overflow-hidden">
      {view === "timeline" && <TimelineView />}
      {view === "list" && <ListView />}
      {view === "calendar" && <CalendarView />}
      {view === "map" && <MapView />}
    </div>
  )
}
