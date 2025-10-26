"use client";

import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TechniciansPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">
          Technician Schedules
        </h1>
        <p className="text-muted-foreground">
          Manage technician schedules, availability, and workload
        </p>
      </div>

      {/* Technician Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Technicians
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
            <div className="font-bold text-2xl">12</div>
            <p className="text-muted-foreground text-xs">2 on vacation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">On Duty</CardTitle>
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
            <div className="font-bold text-2xl">8</div>
            <p className="text-muted-foreground text-xs">2 on break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Utilization
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
            <div className="font-bold text-2xl">87%</div>
            <p className="text-muted-foreground text-xs">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Overtime Hours
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
            <div className="font-bold text-2xl">24h</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Technician Schedules */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Technician Roster</CardTitle>
            <CardDescription>
              Current technician schedules and assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  shift: "8:00 AM - 5:00 PM",
                  status: "On Job",
                  currentJob: "HVAC Repair at 123 Main St",
                  nextJob: "AC Maintenance at 456 Oak Ave",
                },
                {
                  name: "Sarah Johnson",
                  shift: "9:00 AM - 6:00 PM",
                  status: "Available",
                  currentJob: "Office",
                  nextJob: "Plumbing Service at 789 Pine St",
                },
                {
                  name: "Mike Davis",
                  shift: "7:00 AM - 4:00 PM",
                  status: "On Break",
                  currentJob: "Office (Break until 2:30 PM)",
                  nextJob: "Electrical Repair at 321 Elm St",
                },
                {
                  name: "Lisa Wilson",
                  shift: "10:00 AM - 7:00 PM",
                  status: "En Route",
                  currentJob: "Traveling to 456 Oak Ave",
                  nextJob: "Heater Service at 654 Maple Dr",
                },
                {
                  name: "Tom Brown",
                  shift: "8:30 AM - 5:30 PM",
                  status: "On Job",
                  currentJob: "Plumbing Service at 789 Pine St",
                  nextJob: "Duct Cleaning at 987 Cedar Ln",
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
                          tech.status === "On Job"
                            ? "bg-green-100 text-green-800"
                            : tech.status === "Available"
                              ? "bg-blue-100 text-blue-800"
                              : tech.status === "On Break"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {tech.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {tech.shift}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {tech.currentJob}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">Next Job</p>
                    <p className="text-muted-foreground text-xs">
                      {tech.nextJob}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
            <CardDescription>Weekly schedule summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Monday</p>
                  <p className="text-muted-foreground text-xs">
                    8 technicians scheduled
                  </p>
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
                  <p className="text-muted-foreground text-xs">
                    10 technicians scheduled
                  </p>
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
                  <p className="text-muted-foreground text-xs">
                    9 technicians scheduled
                  </p>
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
                  <p className="text-muted-foreground text-xs">
                    11 technicians scheduled
                  </p>
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
                  <p className="text-muted-foreground text-xs">
                    7 technicians scheduled
                  </p>
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
