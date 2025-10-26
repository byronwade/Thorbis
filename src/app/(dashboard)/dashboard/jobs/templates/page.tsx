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

export default function JobTemplatesPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Job Templates</h1>
        <p className="text-muted-foreground">
          Manage job templates, service packages, and standardized work
          procedures
        </p>
      </div>

      {/* Template Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Templates
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
              <title>FileText</title>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">47</div>
            <p className="text-muted-foreground text-xs">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Most Used</CardTitle>
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
            <div className="font-bold text-2xl">HVAC</div>
            <p className="text-muted-foreground text-xs">Maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Template Usage
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
            <div className="font-bold text-2xl">78%</div>
            <p className="text-muted-foreground text-xs">Jobs use templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Time Saved</CardTitle>
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
            <div className="font-bold text-2xl">2.3h</div>
            <p className="text-muted-foreground text-xs">Per job setup</p>
          </CardContent>
        </Card>
      </div>

      {/* Template Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Job Templates</CardTitle>
            <CardDescription>
              Available job templates and service packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "HVAC Maintenance",
                  category: "HVAC",
                  duration: "2.0 hours",
                  price: "$150",
                  usage: "45 times",
                  status: "Active",
                  description: "Standard HVAC maintenance checklist",
                },
                {
                  name: "Plumbing Repair",
                  category: "Plumbing",
                  duration: "1.5 hours",
                  price: "$120",
                  usage: "32 times",
                  status: "Active",
                  description: "Basic plumbing repair procedures",
                },
                {
                  name: "Electrical Service",
                  category: "Electrical",
                  duration: "3.0 hours",
                  price: "$200",
                  usage: "28 times",
                  status: "Active",
                  description: "Electrical installation and repair",
                },
                {
                  name: "AC Installation",
                  category: "HVAC",
                  duration: "6.0 hours",
                  price: "$500",
                  usage: "12 times",
                  status: "Active",
                  description: "Complete AC unit installation",
                },
                {
                  name: "Heater Repair",
                  category: "HVAC",
                  duration: "2.5 hours",
                  price: "$180",
                  usage: "18 times",
                  status: "Draft",
                  description: "Heater troubleshooting and repair",
                },
              ].map((template, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {template.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {template.name}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          template.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : template.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {template.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {template.category} • {template.description}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Duration: {template.duration} • Price: {template.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{template.usage}</p>
                    <p className="text-muted-foreground text-xs">times used</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Template Analytics</CardTitle>
            <CardDescription>
              Template usage and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Most Popular</p>
                  <p className="text-muted-foreground text-xs">
                    HVAC Maintenance
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">45</p>
                  <p className="text-muted-foreground text-xs">
                    uses this month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Duration</p>
                  <p className="text-muted-foreground text-xs">Per template</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2.8h</p>
                  <p className="text-muted-foreground text-xs">
                    across all templates
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Template Efficiency</p>
                  <p className="text-muted-foreground text-xs">Time saved</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">78%</p>
                  <p className="text-muted-foreground text-xs">faster setup</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">New Templates</p>
                  <p className="text-muted-foreground text-xs">This month</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">3</p>
                  <p className="text-muted-foreground text-xs">
                    +1 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Template Accuracy</p>
                  <p className="text-muted-foreground text-xs">Success rate</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">96%</p>
                  <p className="text-muted-foreground text-xs">
                    +2% from last month
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
