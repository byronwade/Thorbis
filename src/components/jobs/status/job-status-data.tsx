/**
 * Job Status Data - Async Server Component
 *
 * Displays job status tracking content.
 * This component is wrapped in Suspense for PPR pattern.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function JobStatusData() {
  // Future: Fetch real job status updates
  // const jobs = await fetchJobStatuses();

  const sampleJobs = [
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
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Job Status Updates</CardTitle>
          <CardDescription>Real-time job status and progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleJobs.map((job, index) => (
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
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
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
                  <p className="text-muted-foreground text-xs">ETA: {job.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Status Analytics</CardTitle>
          <CardDescription>Job completion and performance metrics</CardDescription>
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
                <p className="text-muted-foreground text-xs">+2% from last week</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent p-3">
              <div>
                <p className="font-medium text-sm">Average Duration</p>
                <p className="text-muted-foreground text-xs">Per job</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">2.3h</p>
                <p className="text-muted-foreground text-xs">-0.2h from last month</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent p-3">
              <div>
                <p className="font-medium text-sm">On-Time Rate</p>
                <p className="text-muted-foreground text-xs">Scheduled vs actual</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">89%</p>
                <p className="text-muted-foreground text-xs">+3% from last month</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent p-3">
              <div>
                <p className="font-medium text-sm">Status Updates</p>
                <p className="text-muted-foreground text-xs">Per job average</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">3.2</p>
                <p className="text-muted-foreground text-xs">+0.3 from last month</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent p-3">
              <div>
                <p className="font-medium text-sm">Customer Satisfaction</p>
                <p className="text-muted-foreground text-xs">Based on status</p>
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
  );
}
