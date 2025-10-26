"use client";

import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JobHistoryPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Job History</h1>
        <p className="text-muted-foreground">
          Complete job history, completed services, and performance analytics
        </p>
      </div>

      {/* History Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Jobs</CardTitle>
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
              <title>Archive</title>
              <rect height="13" rx="2" width="20" x="2" y="6" />
              <path d="M12 6V2M6 6V2M18 6V2" />
              <path d="M8 10h8M8 14h8M8 18h4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">2,847</div>
            <p className="text-muted-foreground text-xs">+156 this month</p>
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
            <div className="font-bold text-2xl">2,678</div>
            <p className="text-muted-foreground text-xs">94% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Rating
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
              <title>Star</title>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">4.8</div>
            <p className="text-muted-foreground text-xs">out of 5.0 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Revenue</CardTitle>
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
              <title>DollarSign</title>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$847K</div>
            <p className="text-muted-foreground text-xs">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Job History */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Job History</CardTitle>
            <CardDescription>
              Latest completed jobs and service records
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
                  completed: "2024-01-25 2:30 PM",
                  duration: "2.5 hours",
                  rating: "5.0",
                  revenue: "$150",
                },
                {
                  jobId: "JOB-002",
                  customer: "XYZ Industries",
                  service: "Plumbing Repair",
                  technician: "Sarah Johnson",
                  completed: "2024-01-25 1:45 PM",
                  duration: "1.5 hours",
                  rating: "4.8",
                  revenue: "$120",
                },
                {
                  jobId: "JOB-003",
                  customer: "TechStart Inc",
                  service: "Electrical Service",
                  technician: "Mike Davis",
                  completed: "2024-01-24 4:15 PM",
                  duration: "3.0 hours",
                  rating: "5.0",
                  revenue: "$200",
                },
                {
                  jobId: "JOB-004",
                  customer: "Global Systems",
                  service: "AC Maintenance",
                  technician: "Lisa Wilson",
                  completed: "2024-01-24 2:45 PM",
                  duration: "2.0 hours",
                  rating: "4.9",
                  revenue: "$150",
                },
                {
                  jobId: "JOB-005",
                  customer: "123 Manufacturing",
                  service: "Heater Repair",
                  technician: "Tom Brown",
                  completed: "2024-01-23 3:30 PM",
                  duration: "2.5 hours",
                  rating: "4.7",
                  revenue: "$180",
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
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                        ⭐ {job.rating}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {job.service} • {job.technician}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Completed: {job.completed} • Duration: {job.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{job.revenue}</p>
                    <p className="text-muted-foreground text-xs">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>History Analytics</CardTitle>
            <CardDescription>Job performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Most Common Service</p>
                  <p className="text-muted-foreground text-xs">
                    HVAC Maintenance
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">45%</p>
                  <p className="text-muted-foreground text-xs">of all jobs</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Job Value</p>
                  <p className="text-muted-foreground text-xs">
                    Per completed job
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$180</p>
                  <p className="text-muted-foreground text-xs">
                    +$15 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Top Technician</p>
                  <p className="text-muted-foreground text-xs">
                    By completion rate
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">John Smith</p>
                  <p className="text-muted-foreground text-xs">
                    98% completion
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Customer Retention</p>
                  <p className="text-muted-foreground text-xs">
                    Repeat customers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">78%</p>
                  <p className="text-muted-foreground text-xs">
                    +3% from last quarter
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Revenue Growth</p>
                  <p className="text-muted-foreground text-xs">This month</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">+12%</p>
                  <p className="text-muted-foreground text-xs">vs last month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
