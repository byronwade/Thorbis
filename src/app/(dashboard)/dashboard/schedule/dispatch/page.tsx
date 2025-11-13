/**
 * Schedule > Dispatch Page - Server Component
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
export const revalidate = 300; // Revalidate every 5 minutes

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Dispatch Board</h1>
        <p className="text-muted-foreground">
          Real-time view of technician locations and job assignments
        </p>
      </div>

      {/* Dispatch Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Jobs</CardTitle>
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
              <title>Briefcase</title>
              <rect height="13" rx="2" width="20" x="2" y="6" />
              <path d="M12 6V2M6 6V2M18 6V2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">18</div>
            <p className="text-muted-foreground text-xs">3 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Available Techs
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
              <title>Users</title>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">6</div>
            <p className="text-muted-foreground text-xs">2 on break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Dispatch
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
              <title>Clock</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">5</div>
            <p className="text-muted-foreground text-xs">Average wait: 12min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Response Time</CardTitle>
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
              <title>Zap</title>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8min</div>
            <p className="text-muted-foreground text-xs">
              -2min from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Technician Status</CardTitle>
            <CardDescription>
              Real-time location and availability of technicians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  status: "On Job",
                  location: "123 Main St",
                  job: "HVAC Repair",
                },
                {
                  name: "Sarah Johnson",
                  status: "Available",
                  location: "Office",
                  job: "Ready for dispatch",
                },
                {
                  name: "Mike Davis",
                  status: "On Break",
                  location: "Office",
                  job: "Break until 2:30 PM",
                },
                {
                  name: "Lisa Wilson",
                  status: "En Route",
                  location: "456 Oak Ave",
                  job: "Plumbing Service",
                },
                {
                  name: "Tom Brown",
                  status: "On Job",
                  location: "789 Pine St",
                  job: "Electrical Repair",
                },
              ].map((tech, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-3"
                  key={index}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {tech.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-none">
                      {tech.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {tech.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{tech.status}</p>
                    <p className="text-muted-foreground text-xs">{tech.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pending Jobs</CardTitle>
            <CardDescription>
              Jobs waiting for technician assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "JOB-001",
                  customer: "ABC Company",
                  service: "AC Maintenance",
                  priority: "High",
                  eta: "15 min",
                },
                {
                  id: "JOB-002",
                  customer: "XYZ Corp",
                  service: "Heater Repair",
                  priority: "Medium",
                  eta: "30 min",
                },
                {
                  id: "JOB-003",
                  customer: "123 Industries",
                  service: "Duct Cleaning",
                  priority: "Low",
                  eta: "45 min",
                },
              ].map((job, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-3"
                  key={index}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">{job.id}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-none">
                      {job.customer}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {job.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium text-xs ${job.priority === "High" ? "text-destructive" : job.priority === "Medium" ? "text-warning" : "text-success"}`}
                    >
                      {job.priority}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      ETA: {job.eta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
