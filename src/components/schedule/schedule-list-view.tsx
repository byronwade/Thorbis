/**
 * Schedule List View - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static schedule list rendered on server
 * - Reduced JavaScript bundle size
 * - Better initial page load performance
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  customer: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
  technician: string;
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
];

const statusColors = {
  scheduled: "bg-primary/10 text-primary border-primary/20 dark:text-primary",
  "in-progress":
    "bg-warning/10 text-warning border-warning/20 dark:text-warning",
  completed: "bg-success/10 text-success border-success/20 dark:text-success",
  cancelled:
    "bg-destructive/10 text-destructive border-destructive/20 dark:text-destructive",
};

const priorityColors = {
  low: "bg-secondary0",
  medium: "bg-primary",
  high: "bg-warning",
  urgent: "bg-destructive",
};

export function ScheduleListView() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-3">
        {mockJobs.map((job) => (
          <Card className="p-4 transition-shadow hover:shadow-md" key={job.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      priorityColors[job.priority]
                    )}
                  />
                  <h3 className="font-semibold text-sm">{job.title}</h3>
                  <Badge
                    className={cn("text-xs", statusColors[job.status])}
                    variant="outline"
                  >
                    {job.status === "in-progress"
                      ? "In Progress"
                      : job.status.charAt(0).toUpperCase() +
                        job.status.slice(1)}
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
                <div className="font-medium">
                  {job.startTime} - {job.endTime}
                </div>
                <div className="text-muted-foreground">
                  {(() => {
                    const [startH, startM] = job.startTime
                      .split(":")
                      .map(Number);
                    const [endH, endM] = job.endTime.split(":").map(Number);
                    const duration = endH * 60 + endM - (startH * 60 + startM);
                    const hours = Math.floor(duration / 60);
                    const mins = duration % 60;
                    return `${hours}h ${mins}m`;
                  })()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
