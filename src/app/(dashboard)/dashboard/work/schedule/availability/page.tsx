/**
 * Schedule > Availability Page - Server Component
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

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Availability</h1>
        <p className="text-muted-foreground">
          Manage technician availability, time off, and scheduling preferences
        </p>
      </div>

      {/* Availability Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Available Today
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
            <div className="font-bold text-2xl">8</div>
            <p className="text-muted-foreground text-xs">of 12 technicians</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">On Vacation</CardTitle>
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
              <title>Plane</title>
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4.5 20 3.5S18 2 16.5 3L13 6.5 8.5 2 4 6.5l4.5 4.5L3.5 16C2.5 17 2.5 18.5 3.5 19.5s2.5 1.5 3.5.5L11 16l3.5 3.5c1 1 2.5 1 3.5 0s1-2.5 0-3.5z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">2</div>
            <p className="text-muted-foreground text-xs">Return next week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Sick Leave</CardTitle>
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
              <title>Heart</title>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1</div>
            <p className="text-muted-foreground text-xs">
              Expected back tomorrow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Utilization Rate
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
              <title>BarChart</title>
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">85%</div>
            <p className="text-muted-foreground text-xs">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Availability Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Technician Availability</CardTitle>
            <CardDescription>
              Current availability status and schedule preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  status: "Available",
                  shift: "8:00 AM - 5:00 PM",
                  workload: "4 jobs",
                  nextAvailable: "Now",
                  skills: ["HVAC", "Plumbing", "Electrical"],
                },
                {
                  name: "Sarah Johnson",
                  status: "Available",
                  shift: "9:00 AM - 6:00 PM",
                  workload: "3 jobs",
                  nextAvailable: "Now",
                  skills: ["HVAC", "Plumbing"],
                },
                {
                  name: "Mike Davis",
                  status: "On Break",
                  shift: "7:00 AM - 4:00 PM",
                  workload: "2 jobs",
                  nextAvailable: "2:30 PM",
                  skills: ["Electrical", "Plumbing"],
                },
                {
                  name: "Lisa Wilson",
                  status: "Busy",
                  shift: "10:00 AM - 7:00 PM",
                  workload: "5 jobs",
                  nextAvailable: "4:00 PM",
                  skills: ["HVAC", "Electrical", "Plumbing"],
                },
                {
                  name: "Tom Brown",
                  status: "Available",
                  shift: "8:30 AM - 5:30 PM",
                  workload: "2 jobs",
                  nextAvailable: "Now",
                  skills: ["HVAC", "Plumbing"],
                },
                {
                  name: "Alex Chen",
                  status: "Vacation",
                  shift: "N/A",
                  workload: "0 jobs",
                  nextAvailable: "Next Monday",
                  skills: ["HVAC", "Electrical"],
                },
              ].map((tech, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {tech.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {tech.name}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          tech.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : tech.status === "On Break"
                              ? "bg-yellow-100 text-yellow-800"
                              : tech.status === "Busy"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tech.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {tech.shift}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Skills: {tech.skills.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{tech.workload}</p>
                    <p className="text-muted-foreground text-xs">
                      Next: {tech.nextAvailable}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>Weekly availability overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Monday</p>
                  <p className="text-muted-foreground text-xs">8 available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12 jobs</p>
                  <p className="text-muted-foreground text-xs">
                    8:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Tuesday</p>
                  <p className="text-muted-foreground text-xs">10 available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">15 jobs</p>
                  <p className="text-muted-foreground text-xs">
                    7:30 AM - 7:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Wednesday</p>
                  <p className="text-muted-foreground text-xs">9 available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">13 jobs</p>
                  <p className="text-muted-foreground text-xs">
                    8:00 AM - 6:30 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Thursday</p>
                  <p className="text-muted-foreground text-xs">11 available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">18 jobs</p>
                  <p className="text-muted-foreground text-xs">
                    7:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Friday</p>
                  <p className="text-muted-foreground text-xs">7 available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">10 jobs</p>
                  <p className="text-muted-foreground text-xs">
                    8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
