/**
 * Customers > History Page - Server Component
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

export default function ServiceHistoryPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Service History</h1>
        <p className="text-muted-foreground">
          Complete service history and maintenance records for all customers
        </p>
      </div>

      {/* History Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Services
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
            <div className="font-bold text-2xl">8,247</div>
            <p className="text-muted-foreground text-xs">+234 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Completed This Week
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
            <div className="font-bold text-2xl">156</div>
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
            <CardTitle className="font-medium text-sm">
              Repeat Customers
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
              <title>RotateCcw</title>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">78%</div>
            <p className="text-muted-foreground text-xs">Customer retention</p>
          </CardContent>
        </Card>
      </div>

      {/* Service History */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Service History</CardTitle>
            <CardDescription>
              Latest completed services and maintenance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  customer: "ABC Corporation",
                  service: "HVAC Maintenance",
                  technician: "John Smith",
                  date: "2024-01-25",
                  duration: "2.5 hours",
                  status: "Completed",
                  rating: "5.0",
                  notes:
                    "Routine maintenance, all systems functioning properly",
                },
                {
                  customer: "XYZ Industries",
                  service: "Plumbing Repair",
                  technician: "Sarah Johnson",
                  date: "2024-01-24",
                  duration: "1.5 hours",
                  status: "Completed",
                  rating: "4.8",
                  notes: "Fixed leaky faucet in main restroom",
                },
                {
                  customer: "TechStart Inc",
                  service: "Electrical Service",
                  technician: "Mike Davis",
                  date: "2024-01-23",
                  duration: "3.0 hours",
                  status: "Completed",
                  rating: "5.0",
                  notes: "Installed new electrical outlets in conference room",
                },
                {
                  customer: "Global Systems",
                  service: "AC Maintenance",
                  technician: "Lisa Wilson",
                  date: "2024-01-22",
                  duration: "2.0 hours",
                  status: "Completed",
                  rating: "4.9",
                  notes: "Cleaned filters and checked refrigerant levels",
                },
                {
                  customer: "123 Manufacturing",
                  service: "Heater Repair",
                  technician: "Tom Brown",
                  date: "2024-01-21",
                  duration: "4.0 hours",
                  status: "Completed",
                  rating: "4.7",
                  notes: "Replaced faulty thermostat and heating element",
                },
              ].map((service, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {service.service
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {service.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          service.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : service.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.status}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 font-medium text-xs text-yellow-800">
                        ⭐ {service.rating}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {service.service} • {service.technician}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {service.notes}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{service.date}</p>
                    <p className="text-muted-foreground text-xs">
                      {service.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Service Analytics</CardTitle>
            <CardDescription>Service performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Most Requested Service</p>
                  <p className="text-muted-foreground text-xs">
                    HVAC Maintenance
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">45%</p>
                  <p className="text-muted-foreground text-xs">
                    of all services
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Service Time</p>
                  <p className="text-muted-foreground text-xs">
                    Per service call
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">2.3h</p>
                  <p className="text-muted-foreground text-xs">
                    -0.2h from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Customer Satisfaction</p>
                  <p className="text-muted-foreground text-xs">
                    Average rating
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">4.8</p>
                  <p className="text-muted-foreground text-xs">out of 5.0</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Service Completion</p>
                  <p className="text-muted-foreground text-xs">On-time rate</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">94%</p>
                  <p className="text-muted-foreground text-xs">
                    +2% from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Repeat Service Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Follow-up services
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12%</p>
                  <p className="text-muted-foreground text-xs">
                    -1% from last month
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
