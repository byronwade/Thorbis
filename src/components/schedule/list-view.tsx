"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { mockTechnicians, type Job } from "./schedule-types"
import { Clock, MapPin, User, ChevronRight } from "lucide-react"

const statusConfig = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  "in-progress": { label: "In Progress", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20" },
}

const priorityConfig = {
  low: { label: "Low", color: "bg-slate-500" },
  medium: { label: "Medium", color: "bg-blue-500" },
  high: { label: "High", color: "bg-orange-500" },
  urgent: { label: "Urgent", color: "bg-red-500" },
}

export function ListView() {
  // Flatten all jobs with technician info
  const allJobs = mockTechnicians.flatMap((tech) =>
    tech.jobs.map((job) => ({
      ...job,
      technician: tech,
    }))
  )

  // Sort by start time
  const sortedJobs = allJobs.sort((a, b) => {
    const timeA = parseInt(a.startTime.replace(":", ""))
    const timeB = parseInt(b.startTime.replace(":", ""))
    return timeA - timeB
  })

  // Group by status
  const groupedByStatus = {
    "in-progress": sortedJobs.filter((j) => j.status === "in-progress"),
    scheduled: sortedJobs.filter((j) => j.status === "scheduled"),
    completed: sortedJobs.filter((j) => j.status === "completed"),
  }

  return (
    <div className="h-full w-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* In Progress Section */}
        {groupedByStatus["in-progress"].length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="size-2 rounded-full bg-amber-500" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                In Progress ({groupedByStatus["in-progress"].length})
              </h3>
            </div>
            <div className="space-y-3">
              {groupedByStatus["in-progress"].map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Section */}
        {groupedByStatus.scheduled.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Scheduled ({groupedByStatus.scheduled.length})
              </h3>
            </div>
            <div className="space-y-3">
              {groupedByStatus.scheduled.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {groupedByStatus.completed.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Completed ({groupedByStatus.completed.length})
              </h3>
            </div>
            <div className="space-y-3">
              {groupedByStatus.completed.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: Job & { technician: typeof mockTechnicians[0] } }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      {/* Priority Indicator */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", priorityConfig[job.priority].color)} />

      <div className="flex items-start gap-4 p-4 pl-5">
        {/* Technician Avatar */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
          {job.technician.name.split(" ").map((n) => n[0]).join("")}
        </div>

        {/* Job Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-base leading-tight">{job.title}</h4>
              <p className="text-muted-foreground text-sm">{job.customer}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0", statusConfig[job.status].color)}>
              {statusConfig[job.status].label}
            </Badge>
          </div>

          {job.description && (
            <p className="text-muted-foreground text-sm">{job.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="size-4" />
              <span>{job.technician.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" />
              <span className="font-medium">
                {job.startTime} - {job.endTime}
              </span>
              {job.estimatedDuration && (
                <span className="text-muted-foreground text-xs">({job.estimatedDuration})</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" />
              <span>{job.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <div className={cn("mr-1.5 size-1.5 rounded-full", priorityConfig[job.priority].color)} />
              {priorityConfig[job.priority].label} Priority
            </Badge>
          </div>
        </div>

        {/* Arrow Icon */}
        <button
          type="button"
          className="shrink-0 rounded-md p-2 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </Card>
  )
}
