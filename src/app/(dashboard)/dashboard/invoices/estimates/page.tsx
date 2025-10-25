import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EstimatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Estimates</h1>
        <p className="text-muted-foreground">
          Manage service estimates, quotes, and proposal tracking
        </p>
      </div>

      {/* Estimate Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Estimates
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
            <div className="font-bold text-2xl">89</div>
            <p className="text-muted-foreground text-xs">+12 this month</p>
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
              <title>Clock</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">23</div>
            <p className="text-muted-foreground text-xs">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Conversion Rate
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
            <div className="font-bold text-2xl">68%</div>
            <p className="text-muted-foreground text-xs">+5% from last month</p>
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
            <div className="font-bold text-2xl">$420</div>
            <p className="text-muted-foreground text-xs">Per estimate</p>
          </CardContent>
        </Card>
      </div>

      {/* Estimates Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Estimates</CardTitle>
            <CardDescription>
              Latest estimates and proposal status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  estimateId: "EST-001",
                  customer: "ABC Corporation",
                  amount: "$450",
                  status: "Pending",
                  created: "2024-01-25",
                  expires: "2024-02-01",
                  services: "HVAC Maintenance",
                },
                {
                  estimateId: "EST-002",
                  customer: "XYZ Industries",
                  amount: "$320",
                  status: "Approved",
                  created: "2024-01-24",
                  expires: "2024-01-31",
                  services: "Plumbing Repair",
                },
                {
                  estimateId: "EST-003",
                  customer: "TechStart Inc",
                  amount: "$200",
                  status: "Rejected",
                  created: "2024-01-23",
                  expires: "2024-01-30",
                  services: "Electrical Service",
                },
                {
                  estimateId: "EST-004",
                  customer: "Global Systems",
                  amount: "$680",
                  status: "Pending",
                  created: "2024-01-22",
                  expires: "2024-01-29",
                  services: "AC Installation",
                },
                {
                  estimateId: "EST-005",
                  customer: "123 Manufacturing",
                  amount: "$180",
                  status: "Expired",
                  created: "2024-01-15",
                  expires: "2024-01-22",
                  services: "Heater Repair",
                },
              ].map((estimate, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {estimate.estimateId}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {estimate.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          estimate.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : estimate.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : estimate.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {estimate.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {estimate.services}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Created: {estimate.created} • Expires: {estimate.expires}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{estimate.amount}</p>
                    <button className="text-primary text-xs hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estimate Analytics</CardTitle>
            <CardDescription>Proposal performance and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Approval Rate</p>
                  <p className="text-muted-foreground text-xs">This month</p>
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
                  <p className="font-medium text-sm">Average Response</p>
                  <p className="text-muted-foreground text-xs">
                    Time to decision
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">3.2 days</p>
                  <p className="text-muted-foreground text-xs">
                    -0.5 days from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Expired Estimates</p>
                  <p className="text-muted-foreground text-xs">This month</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12</p>
                  <p className="text-muted-foreground text-xs">
                    -3 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Revenue Potential</p>
                  <p className="text-muted-foreground text-xs">
                    From pending estimates
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$9,660</p>
                  <p className="text-muted-foreground text-xs">23 estimates</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Follow-up Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Customer engagement
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">84%</p>
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
