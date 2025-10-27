"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ScheduleView } from "./schedule-view-toggle"

type ScheduleViewContextType = {
  view: ScheduleView
  setView: (view: ScheduleView) => void
}

const ScheduleViewContext = createContext<ScheduleViewContextType | null>(null)

export function useScheduleView() {
  const context = useContext(ScheduleViewContext)
  if (!context) {
    throw new Error("useScheduleView must be used within ScheduleViewProvider")
  }
  return context
}

type ScheduleViewProviderProps = {
  children: ReactNode
}

export function ScheduleViewProvider({ children }: ScheduleViewProviderProps) {
  const [view, setView] = useState<ScheduleView>("timeline")

  return (
    <ScheduleViewContext.Provider value={{ view, setView }}>
      {children}
    </ScheduleViewContext.Provider>
  )
}
