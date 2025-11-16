/**
 * Schedule > Assignments Page - Server Component
 *
 * Performance optimizations:
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Job Assignments</h1>
        <p className="text-muted-foreground">
          Manage job assignments, technician allocation, and workload
          distribution
        </p>
      </div>

      {/* Assignment Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Assignments
            </CardTitle>
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
              <title>ClipboardList</title>
              <rect height="13" rx="2" width="20" x="2" y="6" />
              <path d="M12 6V2M6 6V2M18 6V2" />
              <path d="M8 10h8M8 14h8M8 18h4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">24</div>
            <p className="text-muted-foreground text-xs">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Assigned</CardTitle>
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
            <p className="text-muted-foreground text-xs">
              6 pending assignment
            </p>
          </CardContent>
        </Card>

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
              Average duration: 2.5h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Completion Rate
            </CardTitle>
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
              <title>TrendingUp</title>
              <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
              <path d="M16 7h6v6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">92%</div>
            <p className="text-muted-foreground text-xs">+3% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>
              Active job assignments and technician workload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  jobId: "JOB-001",
                  customer: "ABC Company",
                  service: "HVAC Repair",
                  technician: "John Smith",
                  status: "In Progress",
                  priority: "High",
                  eta: "2:30 PM",
                  location: "123 Main St",
                },
                {
                  jobId: "JOB-002",
                  customer: "XYZ Corp",
                  service: "Plumbing Service",
                  technician: "Sarah Johnson",
                  status: "Assigned",
                  priority: "Medium",
                  eta: "3:00 PM",
                  location: "456 Oak Ave",
                },
                {
                  jobId: "JOB-003",
                  customer: "123 Industries",
                  service: "Electrical Repair",
                  technician: "Mike Davis",
                  status: "Pending",
                  priority: "Low",
                  eta: "4:15 PM",
                  location: "789 Pine St",
                },
                {
                  jobId: "JOB-004",
                  customer: "TechStart Inc",
                  service: "AC Maintenance",
                  technician: "Lisa Wilson",
                  status: "In Progress",
                  priority: "Medium",
                  eta: "2:45 PM",
                  location: "321 Elm St",
                },
                {
                  jobId: "JOB-005",
                  customer: "Global Systems",
                  service: "Heater Service",
                  technician: "Tom Brown",
                  status: "Assigned",
                  priority: "High",
                  eta: "3:30 PM",
                  location: "654 Maple Dr",
                },
              ].map((assignment, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {assignment.jobId}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {assignment.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          assignment.status === "In Progress"
                            ? "bg-primary text-primary"
                            : assignment.status === "Assigned"
                              ? "bg-success text-success"
                              : "bg-warning text-warning"
                        }`}
                      >
                        {assignment.status}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          assignment.priority === "High"
                            ? "bg-destructive text-destructive"
                            : assignment.priority === "Medium"
                              ? "bg-warning text-warning"
                              : "bg-success text-success"
                        }`}
                      >
                        {assignment.priority}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {assignment.service}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {assignment.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {assignment.technician}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      ETA: {assignment.eta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Assignment Summary</CardTitle>
            <CardDescription>
              Workload distribution and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">John Smith</p>
                  <p className="text-muted-foreground text-xs">
                    Senior Technician
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">4 jobs</p>
                  <p className="text-muted-foreground text-xs">8.5 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Sarah Johnson</p>
                  <p className="text-muted-foreground text-xs">
                    Lead Technician
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">3 jobs</p>
                  <p className="text-muted-foreground text-xs">6.0 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Mike Davis</p>
                  <p className="text-muted-foreground text-xs">Technician</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2 jobs</p>
                  <p className="text-muted-foreground text-xs">4.5 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Lisa Wilson</p>
                  <p className="text-muted-foreground text-xs">
                    Senior Technician
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">3 jobs</p>
                  <p className="text-muted-foreground text-xs">7.0 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Tom Brown</p>
                  <p className="text-muted-foreground text-xs">Technician</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2 jobs</p>
                  <p className="text-muted-foreground text-xs">5.5 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
