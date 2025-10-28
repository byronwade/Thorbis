"use client"


/**
 * Schedule Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { TimelineViewV2 } from "@/components/schedule/timeline-view-v2"
import { TestSchedule } from "./test-schedule"
// import { ListView } from "@/components/schedule/list-view"
// import { CalendarView } from "@/components/schedule/calendar-view"
// import { MapView } from "@/components/schedule/map-view"
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

  return (
    <div className="h-full w-full overflow-hidden">
      {view === "timeline" && <TimelineViewV2 />}
      {view === "test" && <TestSchedule />}
      {/* Temporarily disabled old views that use deprecated data model */}
      {/* {view === "list" && <ListView />} */}
      {/* {view === "calendar" && <CalendarView />} */}
      {/* {view === "map" && <MapView />} */}
    </div>
  )
}
