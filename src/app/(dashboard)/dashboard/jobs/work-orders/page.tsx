/**
 * Jobs > Work Orders Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const revalidate = 300; // Revalidate every 5 minutes

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground">
          Manage work orders, service requests, and job documentation
        </p>
      </div>

      {/* Work Order Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Orders</CardTitle>
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
            <CardTitle className="font-medium text-sm">
              Pending Approval
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
              <title>AlertCircle</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">5</div>
            <p className="text-muted-foreground text-xs">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Average Value</CardTitle>
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
            <div className="font-bold text-2xl">$180</div>
            <p className="text-muted-foreground text-xs">Per work order</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Order Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Work Orders</CardTitle>
            <CardDescription>
              Current work orders and service requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  orderId: "WO-001",
                  customer: "ABC Corporation",
                  service: "HVAC Maintenance",
                  technician: "John Smith",
                  status: "In Progress",
                  priority: "High",
                  created: "2024-01-25 8:00 AM",
                  estimated: "$150",
                },
                {
                  orderId: "WO-002",
                  customer: "XYZ Industries",
                  service: "Plumbing Repair",
                  technician: "Sarah Johnson",
                  status: "Approved",
                  priority: "Medium",
                  created: "2024-01-25 9:30 AM",
                  estimated: "$120",
                },
                {
                  orderId: "WO-003",
                  customer: "TechStart Inc",
                  service: "Electrical Service",
                  technician: "Mike Davis",
                  status: "Pending",
                  priority: "Low",
                  created: "2024-01-25 10:15 AM",
                  estimated: "$200",
                },
                {
                  orderId: "WO-004",
                  customer: "Global Systems",
                  service: "AC Maintenance",
                  technician: "Lisa Wilson",
                  status: "In Progress",
                  priority: "Medium",
                  created: "2024-01-25 11:00 AM",
                  estimated: "$150",
                },
                {
                  orderId: "WO-005",
                  customer: "123 Manufacturing",
                  service: "Heater Repair",
                  technician: "Tom Brown",
                  status: "Approved",
                  priority: "High",
                  created: "2024-01-24 2:30 PM",
                  estimated: "$180",
                },
              ].map((order, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">{order.orderId}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {order.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          order.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          order.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : order.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.priority}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {order.service} • {order.technician}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Created: {order.created}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.estimated}</p>
                    <p className="text-muted-foreground text-xs">Estimated</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Order Analytics</CardTitle>
            <CardDescription>Work order performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Approval Rate</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">92%</p>
                  <p className="text-muted-foreground text-xs">
                    +3% from last week
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Processing</p>
                  <p className="text-muted-foreground text-xs">
                    Time to approval
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2.3h</p>
                  <p className="text-muted-foreground text-xs">
                    -0.5h from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Completion Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Approved orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">96%</p>
                  <p className="text-muted-foreground text-xs">
                    +2% from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Revenue Impact</p>
                  <p className="text-muted-foreground text-xs">
                    From work orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$4,320</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Customer Satisfaction</p>
                  <p className="text-muted-foreground text-xs">
                    Work order quality
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">4.7</p>
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
