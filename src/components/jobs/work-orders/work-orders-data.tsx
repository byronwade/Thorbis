/**
 * Work Orders Data - Async Server Component
 *
 * Displays work orders management content.
 * This component is wrapped in Suspense for PPR pattern.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function WorkOrdersData() {
  // Future: Fetch real work orders
  // const orders = await fetchWorkOrders();

  const sampleOrders = [
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
  ];

  return (
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
            {sampleOrders.map((order, index) => (
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
                <p className="text-muted-foreground text-xs">Approved orders</p>
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
  );
}
