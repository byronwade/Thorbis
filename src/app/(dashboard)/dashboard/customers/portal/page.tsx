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

export default function CustomerPortalPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Customer Portal</h1>
        <p className="text-muted-foreground">
          Customer self-service portal access and management
        </p>
      </div>

      {/* Portal Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Portal Users</CardTitle>
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
            <div className="font-bold text-2xl">892</div>
            <p className="text-muted-foreground text-xs">+34 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Sessions
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
              <title>Activity</title>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">47</div>
            <p className="text-muted-foreground text-xs">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Portal Logins</CardTitle>
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
              <title>LogIn</title>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1,247</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Self-Service Rate
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
            <div className="font-bold text-2xl">78%</div>
            <p className="text-muted-foreground text-xs">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Portal Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portal Activity</CardTitle>
            <CardDescription>
              Recent customer portal usage and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  customer: "ABC Corporation",
                  user: "John Smith",
                  activity: "Scheduled Service",
                  timestamp: "2024-01-25 2:30 PM",
                  details: "Scheduled HVAC maintenance for next week",
                  status: "Completed",
                },
                {
                  customer: "XYZ Industries",
                  user: "Sarah Johnson",
                  activity: "Downloaded Invoice",
                  timestamp: "2024-01-25 1:45 PM",
                  details: "Downloaded invoice #INV-2024-001",
                  status: "Completed",
                },
                {
                  customer: "TechStart Inc",
                  user: "Mike Davis",
                  activity: "Requested Quote",
                  timestamp: "2024-01-25 11:20 AM",
                  details: "Requested quote for plumbing services",
                  status: "Pending",
                },
                {
                  customer: "Global Systems",
                  user: "Lisa Wilson",
                  activity: "Updated Profile",
                  timestamp: "2024-01-24 4:15 PM",
                  details: "Updated contact information",
                  status: "Completed",
                },
                {
                  customer: "123 Manufacturing",
                  user: "Tom Brown",
                  activity: "Viewed Service History",
                  timestamp: "2024-01-24 10:30 AM",
                  details: "Viewed past service records",
                  status: "Completed",
                },
              ].map((activity, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {activity.activity
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {activity.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          activity.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {activity.user} • {activity.activity}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {activity.details}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Portal Features</CardTitle>
            <CardDescription>
              Available customer self-service options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Service Scheduling</p>
                  <p className="text-muted-foreground text-xs">
                    Book appointments online
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Active</p>
                  <p className="text-muted-foreground text-xs">89% usage</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Invoice Management</p>
                  <p className="text-muted-foreground text-xs">
                    View and download invoices
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Active</p>
                  <p className="text-muted-foreground text-xs">76% usage</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Service History</p>
                  <p className="text-muted-foreground text-xs">
                    View past services
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Active</p>
                  <p className="text-muted-foreground text-xs">82% usage</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Quote Requests</p>
                  <p className="text-muted-foreground text-xs">
                    Request service quotes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Active</p>
                  <p className="text-muted-foreground text-xs">65% usage</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Profile Management</p>
                  <p className="text-muted-foreground text-xs">
                    Update contact info
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Active</p>
                  <p className="text-muted-foreground text-xs">58% usage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
