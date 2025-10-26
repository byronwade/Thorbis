"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JobStatusPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Job Status</h1>
        <p className="text-muted-foreground">
          Track job progress, status updates, and completion metrics
        </p>
      </div>

      {/* Status Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">In Progress</CardTitle>
            <svg
              className="size-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Clock</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">12</div>
            <p className="text-muted-foreground text-xs">
              Average: 2.3h duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Completed</CardTitle>
            <svg
              className="size-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>CheckCircle</title>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">18</div>
            <p className="text-muted-foreground text-xs">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Pending</CardTitle>
            <svg
              className="size-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>AlertCircle</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">6</div>
            <p className="text-muted-foreground text-xs">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Overdue</CardTitle>
            <svg
              className="size-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>AlertTriangle</title>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">2</div>
            <p className="text-muted-foreground text-xs">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Tracking */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Job Status Updates</CardTitle>
            <CardDescription>
              Real-time job status and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  jobId: "JOB-001",
                  customer: "ABC Corporation",
                  service: "HVAC Maintenance",
                  technician: "John Smith",
                  status: "In Progress",
                  progress: "75%",
                  lastUpdate: "2024-01-25 2:45 PM",
                  eta: "30 minutes",
                },
                {
                  jobId: "JOB-002",
                  customer: "XYZ Industries",
                  service: "Plumbing Repair",
                  technician: "Sarah Johnson",
                  status: "Completed",
                  progress: "100%",
                  lastUpdate: "2024-01-25 2:30 PM",
                  eta: "Completed",
                },
                {
                  jobId: "JOB-003",
                  customer: "TechStart Inc",
                  service: "Electrical Service",
                  technician: "Mike Davis",
                  status: "Pending",
                  progress: "0%",
                  lastUpdate: "2024-01-25 1:00 PM",
                  eta: "4:15 PM",
                },
                {
                  jobId: "JOB-004",
                  customer: "Global Systems",
                  service: "AC Maintenance",
                  technician: "Lisa Wilson",
                  status: "In Progress",
                  progress: "45%",
                  lastUpdate: "2024-01-25 2:15 PM",
                  eta: "1.5 hours",
                },
                {
                  jobId: "JOB-005",
                  customer: "123 Manufacturing",
                  service: "Heater Repair",
                  technician: "Tom Brown",
                  status: "Overdue",
                  progress: "25%",
                  lastUpdate: "2024-01-24 3:00 PM",
                  eta: "2 hours",
                },
              ].map((job, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">{job.jobId}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {job.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          job.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : job.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : job.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {job.service} • {job.technician}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: job.progress }}
                        />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {job.progress}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{job.lastUpdate}</p>
                    <p className="text-muted-foreground text-xs">
                      ETA: {job.eta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status Analytics</CardTitle>
            <CardDescription>
              Job completion and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Completion Rate</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">94%</p>
                  <p className="text-muted-foreground text-xs">
                    +2% from last week
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Duration</p>
                  <p className="text-muted-foreground text-xs">Per job</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2.3h</p>
                  <p className="text-muted-foreground text-xs">
                    -0.2h from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">On-Time Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Scheduled vs actual
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">89%</p>
                  <p className="text-muted-foreground text-xs">
                    +3% from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Status Updates</p>
                  <p className="text-muted-foreground text-xs">
                    Per job average
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">3.2</p>
                  <p className="text-muted-foreground text-xs">
                    +0.3 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Customer Satisfaction</p>
                  <p className="text-muted-foreground text-xs">
                    Based on status
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">4.8</p>
                  <p className="text-muted-foreground text-xs">out of 5.0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
