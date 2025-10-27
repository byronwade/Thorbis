"use client"

export const dynamic = "force-dynamic"

import { usePageLayout } from "@/hooks/use-page-layout"
import { TechnicianScheduleChart } from "@/components/schedule/technician-schedule-chart"
import { useEffect, useState, createContext, useContext } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import type { ScheduleView } from "@/components/schedule/schedule-view-toggle"

// Create context for schedule view
const ScheduleViewContext = createContext<{
  view: ScheduleView
  setView: (view: ScheduleView) => void
} | null>(null)

export function useScheduleView() {
  const context = useContext(ScheduleViewContext)
  if (!context) {
    throw new Error("useScheduleView must be used within ScheduleViewProvider")
  }
  return context
}

export default function SchedulePage() {
  const { setOpen } = useSidebar()
  const [view, setView] = useState<ScheduleView>("timeline")

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
    <ScheduleViewContext.Provider value={{ view, setView }}>
      <div className="h-full w-full overflow-hidden">
        <TechnicianScheduleChart />
      </div>
    </ScheduleViewContext.Provider>
  )
}
