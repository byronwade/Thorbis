"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Job {
  id: string
  title: string
  customer: string
  startTime: string
  endTime: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  location: string
  technician: string
}

const mockJobs: Job[] = [
  {
    id: "j1",
    title: "HVAC Maintenance",
    customer: "ABC Corp",
    startTime: "08:00",
    endTime: "10:30",
    status: "completed",
    priority: "medium",
    location: "123 Main St",
    technician: "John Doe",
  },
  {
    id: "j2",
    title: "Emergency Repair",
    customer: "XYZ Inc",
    startTime: "11:00",
    endTime: "14:00",
    status: "in-progress",
    priority: "urgent",
    location: "456 Oak Ave",
    technician: "John Doe",
  },
  {
    id: "j6",
    title: "Equipment Replacement",
    customer: "Manufacturing Co",
    startTime: "07:30",
    endTime: "12:00",
    status: "in-progress",
    priority: "high",
    location: "987 Industrial Pkwy",
    technician: "Mike Johnson",
  },
  {
    id: "j4",
    title: "System Inspection",
    customer: "Global Systems",
    startTime: "09:00",
    endTime: "11:00",
    status: "completed",
    priority: "low",
    location: "321 Elm St",
    technician: "Jane Smith",
  },
  {
    id: "j17",
    title: "Emergency Service",
    customer: "Hospital",
    startTime: "07:00",
    endTime: "10:00",
    status: "completed",
    priority: "urgent",
    location: "579 Medical Plaza",
    technician: "James Wilson",
  },
]

const statusColors = {
  scheduled: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
  "in-progress": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-300",
  completed: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-300",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300",
}

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

export function ScheduleListView() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-3">
        {mockJobs.map((job) => (
          <Card key={job.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", priorityColors[job.priority])} />
                  <h3 className="font-semibold text-sm">{job.title}</h3>
                  <Badge variant="outline" className={cn("text-xs", statusColors[job.status])}>
                    {job.status === "in-progress" ? "In Progress" : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                  <span>{job.customer}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.technician}</span>
                </div>
              </div>
              <div className="shrink-0 text-right text-xs">
                <div className="font-medium">{job.startTime} - {job.endTime}</div>
                <div className="text-muted-foreground">
                  {(() => {
                    const [startH, startM] = job.startTime.split(":").map(Number)
                    const [endH, endM] = job.endTime.split(":").map(Number)
                    const duration = (endH * 60 + endM) - (startH * 60 + startM)
                    const hours = Math.floor(duration / 60)
                    const mins = duration % 60
                    return `${hours}h ${mins}m`
                  })()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
