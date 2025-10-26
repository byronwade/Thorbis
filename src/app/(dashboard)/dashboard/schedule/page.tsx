"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SchedulePage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your calendar, dispatch board, and technician schedules
        </p>
      </div>

      {/* Calendar Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Today's Jobs</CardTitle>
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
              <title>Calendar</title>
              <rect height="13" rx="2" width="20" x="2" y="6" />
              <path d="M12 6V2M6 6V2M18 6V2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">12</div>
            <p className="text-muted-foreground text-xs">+2 from yesterday</p>
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
            <div className="font-bold text-2xl">8</div>
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
            <div className="font-bold text-2xl">3</div>
            <p className="text-muted-foreground text-xs">Average wait: 15min</p>
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
              <title>CheckCircle</title>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">94%</div>
            <p className="text-muted-foreground text-xs">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              Today's schedule and upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Calendar component placeholder - integrate with your scheduling
                system
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common scheduling tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-accent">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">
                    Create New Job
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Schedule a new service appointment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-accent">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">
                    Assign Technician
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Assign jobs to available technicians
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-accent">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">
                    Optimize Routes
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Optimize technician routes for efficiency
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
