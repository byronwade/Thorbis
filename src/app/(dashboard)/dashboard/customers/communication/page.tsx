import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Communication History
        </h1>
        <p className="text-muted-foreground">
          Track all customer communications, calls, emails, and messages
        </p>
      </div>

      {/* Communication Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Communications
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
              <title>MessageSquare</title>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">3,247</div>
            <p className="text-muted-foreground text-xs">+156 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Calls Today</CardTitle>
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
              <title>Phone</title>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">47</div>
            <p className="text-muted-foreground text-xs">+8 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Emails Sent</CardTitle>
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
              <title>Mail</title>
              <rect height="13" rx="2" width="20" x="2" y="6" />
              <path d="M22 6 12 13 2 6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">89</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Response Time</CardTitle>
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
            <p className="text-muted-foreground text-xs">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication History */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
            <CardDescription>
              Latest customer interactions and messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  customer: "ABC Corporation",
                  contact: "John Smith",
                  type: "Phone Call",
                  subject: "HVAC Maintenance Schedule",
                  timestamp: "2024-01-25 2:30 PM",
                  duration: "12 minutes",
                  status: "Completed",
                  notes: "Scheduled maintenance for next week",
                },
                {
                  customer: "XYZ Industries",
                  contact: "Sarah Johnson",
                  type: "Email",
                  subject: "Service Quote Request",
                  timestamp: "2024-01-25 1:45 PM",
                  duration: "N/A",
                  status: "Pending",
                  notes: "Requested quote for plumbing services",
                },
                {
                  customer: "TechStart Inc",
                  contact: "Mike Davis",
                  type: "Text Message",
                  subject: "Service Confirmation",
                  timestamp: "2024-01-25 11:20 AM",
                  duration: "N/A",
                  status: "Completed",
                  notes: "Confirmed appointment for tomorrow",
                },
                {
                  customer: "Global Systems",
                  contact: "Lisa Wilson",
                  type: "Phone Call",
                  subject: "Emergency Service",
                  timestamp: "2024-01-24 4:15 PM",
                  duration: "8 minutes",
                  status: "Completed",
                  notes: "Emergency electrical repair scheduled",
                },
                {
                  customer: "123 Manufacturing",
                  contact: "Tom Brown",
                  type: "Email",
                  subject: "Service Follow-up",
                  timestamp: "2024-01-24 10:30 AM",
                  duration: "N/A",
                  status: "Completed",
                  notes: "Follow-up on completed heater repair",
                },
              ].map((comm, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {comm.type === "Phone Call"
                        ? "📞"
                        : comm.type === "Email"
                          ? "📧"
                          : "💬"}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {comm.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          comm.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : comm.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {comm.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {comm.contact} • {comm.type}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {comm.subject}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {comm.notes}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{comm.timestamp}</p>
                    <p className="text-muted-foreground text-xs">
                      {comm.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Communication Insights</CardTitle>
            <CardDescription>Communication patterns and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Most Active Customer</p>
                  <p className="text-muted-foreground text-xs">
                    ABC Corporation
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">23</p>
                  <p className="text-muted-foreground text-xs">This month</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Preferred Channel</p>
                  <p className="text-muted-foreground text-xs">
                    Customer preference
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">Phone</p>
                  <p className="text-muted-foreground text-xs">
                    45% of communications
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Response Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Customer responses
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">87%</p>
                  <p className="text-muted-foreground text-xs">
                    +3% from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Satisfaction Score</p>
                  <p className="text-muted-foreground text-xs">
                    Communication quality
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">4.7</p>
                  <p className="text-muted-foreground text-xs">out of 5.0</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Follow-up Rate</p>
                  <p className="text-muted-foreground text-xs">
                    Required follow-ups
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12%</p>
                  <p className="text-muted-foreground text-xs">
                    -2% from last month
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
