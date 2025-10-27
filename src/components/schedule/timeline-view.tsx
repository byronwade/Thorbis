"use client"

import { useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockTechnicians, type Job, type Technician } from "./schedule-types"
import { Clock, MapPin } from "lucide-react"

const HOUR_WIDTH = 120
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7 AM to 7 PM

const statusColors = {
  scheduled: "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300",
  "in-progress": "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-300",
  completed: "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300",
  cancelled: "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300",
}

const priorityColors = {
  low: "bg-slate-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const technicianStatusColors = {
  available: "bg-green-500",
  "on-job": "bg-amber-500",
  "on-break": "bg-orange-500",
  offline: "bg-slate-500",
}

function timeToPosition(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  const totalMinutes = (hours - 7) * 60 + minutes
  return (totalMinutes / 60) * HOUR_WIDTH
}

function calculateWidth(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)
  const durationMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes)
  return (durationMinutes / 60) * HOUR_WIDTH
}

export function TimelineView() {
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const bodyScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headerScroll = headerScrollRef.current
    const bodyScroll = bodyScrollRef.current
    if (!headerScroll || !bodyScroll) return

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      return () => {
        target.scrollLeft = source.scrollLeft
      }
    }

    const headerListener = syncScroll(headerScroll, bodyScroll)
    const bodyListener = syncScroll(bodyScroll, headerScroll)

    headerScroll.addEventListener("scroll", headerListener)
    bodyScroll.addEventListener("scroll", bodyListener)

    return () => {
      headerScroll.removeEventListener("scroll", headerListener)
      bodyScroll.removeEventListener("scroll", bodyListener)
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="z-20 flex h-12 shrink-0 border-b bg-background">
        <div className="flex w-[280px] shrink-0 items-center border-r px-4">
          <h3 className="font-semibold text-sm">Technician</h3>
        </div>
        <div ref={headerScrollRef} className="scrollbar-hide flex flex-1 overflow-x-auto">
          <div className="flex min-w-max">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-center justify-center border-r font-medium text-muted-foreground text-xs"
                style={{ width: HOUR_WIDTH }}
              >
                {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Body */}
      <div ref={bodyScrollRef} className="min-h-0 flex-1 overflow-auto">
        <div className="min-w-max divide-y">
          {mockTechnicians.map((tech) => (
            <div key={tech.id} className="flex min-h-[90px] hover:bg-muted/30 transition-colors">
              {/* Technician Info */}
              <div className="sticky left-0 z-10 w-[280px] shrink-0 border-r bg-background p-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                    {tech.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-semibold text-sm">{tech.name}</h4>
                      <div className={cn("size-2 shrink-0 rounded-full", technicianStatusColors[tech.status])} />
                    </div>
                    <p className="truncate text-muted-foreground text-xs">{tech.role}</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {tech.jobs.length} {tech.jobs.length === 1 ? "job" : "jobs"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative flex-1 bg-muted/10">
                {/* Hour Grid Lines */}
                {HOURS.map((hour, index) => (
                  <div
                    key={hour}
                    className={cn(
                      "absolute top-0 bottom-0 border-r",
                      hour === 12 ? "border-border" : "border-border/30"
                    )}
                    style={{ left: index * HOUR_WIDTH }}
                  />
                ))}

                {/* Jobs */}
                {tech.jobs.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "absolute top-2 bottom-2 m-1 rounded-lg border-l-4 p-2.5 shadow-sm transition-all",
                      "hover:shadow-md hover:scale-[1.02] cursor-pointer",
                      statusColors[job.status]
                    )}
                    style={{
                      left: timeToPosition(job.startTime),
                      width: calculateWidth(job.startTime, job.endTime),
                      borderLeftColor: priorityColors[job.priority].replace("bg-", ""),
                    }}
                  >
                    <div className="flex h-full flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="line-clamp-1 font-semibold text-xs leading-tight">{job.title}</h5>
                        <div className={cn("size-1.5 shrink-0 rounded-full", priorityColors[job.priority])} />
                      </div>
                      <p className="line-clamp-1 text-[10px] text-muted-foreground">{job.customer}</p>
                      <div className="mt-auto flex items-center gap-2 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span className="font-medium">{job.startTime} - {job.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
