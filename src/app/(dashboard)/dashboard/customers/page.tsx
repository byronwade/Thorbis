import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Customer Database</h1>
        <p className="text-muted-foreground">
          Manage customer information, communication history, and service
          records
        </p>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Customers
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
            <div className="font-bold text-2xl">1,247</div>
            <p className="text-muted-foreground text-xs">+23 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Customers
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
            <div className="font-bold text-2xl">892</div>
            <p className="text-muted-foreground text-xs">71% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">New This Week</CardTitle>
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
            <div className="font-bold text-2xl">47</div>
            <p className="text-muted-foreground text-xs">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Customer Satisfaction
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
            <p className="text-muted-foreground text-xs">out of 5.0 rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Latest customer additions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "ABC Corporation",
                  contact: "John Smith",
                  email: "john@abccorp.com",
                  phone: "(555) 123-4567",
                  status: "Active",
                  lastService: "HVAC Maintenance",
                  nextService: "2024-02-15",
                  value: "$2,450",
                },
                {
                  name: "XYZ Industries",
                  contact: "Sarah Johnson",
                  email: "sarah@xyzind.com",
                  phone: "(555) 234-5678",
                  status: "Active",
                  lastService: "Plumbing Repair",
                  nextService: "2024-02-20",
                  value: "$1,890",
                },
                {
                  name: "TechStart Inc",
                  contact: "Mike Davis",
                  email: "mike@techstart.com",
                  phone: "(555) 345-6789",
                  status: "Prospect",
                  lastService: "None",
                  nextService: "2024-02-10",
                  value: "$0",
                },
                {
                  name: "Global Systems",
                  contact: "Lisa Wilson",
                  email: "lisa@globalsys.com",
                  phone: "(555) 456-7890",
                  status: "Active",
                  lastService: "Electrical Service",
                  nextService: "2024-02-25",
                  value: "$3,200",
                },
                {
                  name: "123 Manufacturing",
                  contact: "Tom Brown",
                  email: "tom@123mfg.com",
                  phone: "(555) 567-8901",
                  status: "Inactive",
                  lastService: "Heater Repair",
                  nextService: "None",
                  value: "$850",
                },
              ].map((customer, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {customer.name}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : customer.status === "Prospect"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {customer.contact} • {customer.email}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Last: {customer.lastService} • Next:{" "}
                      {customer.nextService}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{customer.value}</p>
                    <p className="text-muted-foreground text-xs">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Key metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Top Customer</p>
                  <p className="text-muted-foreground text-xs">
                    ABC Corporation
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$2,450</p>
                  <p className="text-muted-foreground text-xs">This month</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">New Prospects</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12</p>
                  <p className="text-muted-foreground text-xs">
                    +3 from last week
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Conversion Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Prospects to customers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">68%</p>
                  <p className="text-muted-foreground text-xs">
                    +5% from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Average Value</p>
                  <p className="text-muted-foreground text-xs">Per customer</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$1,850</p>
                  <p className="text-muted-foreground text-xs">
                    +$120 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Retention Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Customer loyalty
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">94%</p>
                  <p className="text-muted-foreground text-xs">
                    +2% from last quarter
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
