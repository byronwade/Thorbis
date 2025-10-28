"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GanttFeatureList,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
  type GanttStatus,
  type Range,
} from "@/components/ui/shadcn-io/gantt"
import { cn } from "@/lib/utils"
import { useSchedule } from "@/hooks/use-schedule"
import { useViewStore } from "@/stores/view-store"
import { ZoomControls } from "./zoom-controls"
import { calculateDuration, formatDuration } from "@/lib/schedule-utils"
import type { Job } from "./schedule-types"

/**
 * Enhanced Timeline View with:
 * - Continuous zoom (5% - 500%)
 * - Dynamic headers based on zoom
 * - Real-time conflict detection
 * - Drag and drop support
 * - Current time marker
 */

// Status color mapping
const statusColorMap: Record<Job["status"], string> = {
  scheduled: "#3b82f6",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  cancelled: "#ef4444",
}

const priorityBorderColors = {
  low: "border-slate-500",
  medium: "border-blue-500",
  high: "border-orange-500",
  urgent: "border-red-500",
}

const technicianStatusColors = {
  available: "bg-green-500",
  "on-job": "bg-amber-500",
  "on-break": "bg-orange-500",
  offline: "bg-slate-500",
}

// Convert Job to GanttFeature
function jobToGanttFeature(job: Job): GanttFeature {
  const status: GanttStatus = {
    id: job.status,
    name: job.status,
    color: statusColorMap[job.status],
  }

  return {
    id: job.id,
    name: job.title,
    startAt: job.startTime,
    endAt: job.endTime,
    status,
  }
}

// Calculate Gantt range from zoom level
function getGanttRange(zoom: number): Range {
  if (zoom < 50) return "quarterly"  // Year/Quarter view
  if (zoom < 100) return "monthly"   // Monthly view
  return "daily"                      // Daily/Weekly/Hourly view
}

// Calculate column width from zoom level
function getColumnWidth(zoom: number): number {
  if (zoom < 50) return 100  // Quarterly
  if (zoom < 100) return 150 // Monthly
  return 50                   // Daily
}

// Component that renders the timeline content
function TimelineContent() {
  const { technicians, getJobsForTechnician, moveJob, selectJob, selectedJobId } = useSchedule()
  const { zoom, showConflicts } = useViewStore()

  // Convert schedule data to Gantt format
  const ganttData = useMemo(() => {
    return technicians.map((tech) => {
      const jobs = getJobsForTechnician(tech.id)
      const features = jobs.map(jobToGanttFeature)

      return {
        technician: tech,
        features,
      }
    })
  }, [technicians, getJobsForTechnician])

  // Handle job move (drag and drop)
  const handleJobMove = (jobId: string, newStartAt: Date, newEndAt: Date | null) => {
    if (!newEndAt) return

    // Find which technician this job belongs to
    const job = ganttData
      .flatMap((data) => data.features)
      .find((f) => f.id === jobId)

    if (!job) return

    // Find the original job to get the technician ID
    const originalJob = ganttData
      .find((data) => data.features.some((f) => f.id === jobId))

    if (!originalJob) return

    // Update the job
    moveJob(jobId, originalJob.technician.id, newStartAt, newEndAt)
  }

  return (
    <>
      <GanttSidebar>
        <GanttSidebarGroup name="Technicians">
          {ganttData.map(({ technician }) => (
            <div key={technician.id} className="border-b border-border/50 last:border-b-0">
              <div className="flex items-start gap-3 p-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                  {technician.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-semibold text-xs">{technician.name}</h4>
                    <div
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        technicianStatusColors[technician.status]
                      )}
                    />
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">{technician.role}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Badge className="text-[10px]" variant="outline">
                      {getJobsForTechnician(technician.id).length} jobs
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </GanttSidebarGroup>
      </GanttSidebar>

      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {ganttData.map(({ technician, features }) => (
            <GanttFeatureRow
              features={features}
              key={technician.id}
              onMove={handleJobMove}
            >
              {(feature) => {
                const jobs = getJobsForTechnician(technician.id)
                const job = jobs.find((j) => j.id === feature.id)
                if (!job) return null

                const duration = calculateDuration(job.startTime, job.endTime)
                const isSelected = selectedJobId === job.id

                return (
                  <div
                    className={cn(
                      "flex h-full w-full flex-col gap-0.5 px-1 cursor-pointer transition-all",
                      isSelected && "ring-2 ring-primary ring-offset-1"
                    )}
                    onClick={() => selectJob(job.id)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="line-clamp-1 flex-1 font-semibold text-[10px] leading-tight">
                        {job.title}
                      </p>
                      <div
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          priorityBorderColors[job.priority].replace("border-", "bg-")
                        )}
                      />
                    </div>
                    <p className="line-clamp-1 text-[9px] text-muted-foreground">
                      {job.customer.name}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-[9px]">
                      <Clock className="size-2.5" />
                      <span className="font-medium">
                        {formatDuration(duration)}
                      </span>
                    </div>
                  </div>
                )
              }}
            </GanttFeatureRow>
          ))}
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </>
  )
}

export function TimelineViewV2() {
  const [mounted, setMounted] = useState(false)
  const { zoom, currentDate, goToToday, setCurrentDate } = useViewStore()
  const { isLoading, error } = useSchedule()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate Gantt configuration from zoom level
  const ganttRange = useMemo(() => getGanttRange(zoom), [zoom])
  const columnWidth = useMemo(() => getColumnWidth(zoom), [zoom])

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b bg-background p-3">
          <div className="flex items-center gap-4">
            <ZoomControls />
          </div>
          <Button onClick={goToToday} size="sm" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground">Loading schedule...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b bg-background p-3">
          <div className="flex items-center gap-4">
            <ZoomControls />
          </div>
          <Button onClick={goToToday} size="sm" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading schedule</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background p-3">
        <div className="flex items-center gap-4">
          <ZoomControls />
        </div>
        <Button onClick={goToToday} size="sm" variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </Button>
      </div>

      {/* Gantt Chart */}
      <GanttProvider
        range={ganttRange}
        zoom={zoom}
      >
        <TimelineContent />
      </GanttProvider>
    </div>
  )
}
