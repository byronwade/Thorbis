"use client";

export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function PendingInvoicesPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Pending Invoices</h1>
        <p className="text-muted-foreground">
          Manage unpaid invoices and follow up on overdue payments
        </p>
      </div>

      {/* Pending Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Pending</CardTitle>
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
            <div className="font-bold text-2xl">47</div>
            <p className="text-muted-foreground text-xs">$24,500 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Overdue</CardTitle>
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
              <title>AlertTriangle</title>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">8</div>
            <p className="text-muted-foreground text-xs">$3,200 overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Due This Week</CardTitle>
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
            <p className="text-muted-foreground text-xs">$6,800 due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Average Age</CardTitle>
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
            <div className="font-bold text-2xl">18 days</div>
            <p className="text-muted-foreground text-xs">Since issued</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
            <CardDescription>
              Unpaid invoices requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  invoiceId: "INV-002",
                  customer: "XYZ Industries",
                  amount: "$320",
                  dueDate: "2024-01-30",
                  daysOverdue: "0",
                  status: "Pending",
                  services: "Plumbing Repair",
                },
                {
                  invoiceId: "INV-003",
                  customer: "TechStart Inc",
                  amount: "$200",
                  dueDate: "2024-01-20",
                  daysOverdue: "5",
                  status: "Overdue",
                  services: "Electrical Service",
                },
                {
                  invoiceId: "INV-005",
                  customer: "123 Manufacturing",
                  amount: "$180",
                  dueDate: "2024-02-01",
                  daysOverdue: "0",
                  status: "Pending",
                  services: "Heater Repair",
                },
                {
                  invoiceId: "INV-006",
                  customer: "ABC Corp",
                  amount: "$450",
                  dueDate: "2024-01-15",
                  daysOverdue: "10",
                  status: "Overdue",
                  services: "HVAC Maintenance",
                },
                {
                  invoiceId: "INV-007",
                  customer: "Global Systems",
                  amount: "$680",
                  dueDate: "2024-01-28",
                  daysOverdue: "0",
                  status: "Pending",
                  services: "AC Installation",
                },
              ].map((invoice, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4"
                  key={index}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <span className="font-medium text-sm">
                      {invoice.invoiceId}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm leading-none">
                        {invoice.customer}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                          invoice.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                      {Number.parseInt(invoice.daysOverdue, 10) > 0 && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs">
                          {invoice.daysOverdue} days overdue
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {invoice.services}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{invoice.amount}</p>
                    <button className="text-primary text-xs hover:underline">
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Collection Actions</CardTitle>
            <CardDescription>Manage pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Send Reminders</p>
                  <p className="text-muted-foreground text-xs">
                    Email overdue customers
                  </p>
                </div>
                <div className="text-right">
                  <button className="rounded bg-primary px-3 py-1 text-primary-foreground text-sm">
                    Send All
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Payment Plans</p>
                  <p className="text-muted-foreground text-xs">
                    Set up installment plans
                  </p>
                </div>
                <div className="text-right">
                  <button className="rounded border px-3 py-1 text-sm">
                    Manage
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Collection Agency</p>
                  <p className="text-muted-foreground text-xs">
                    Send to collections
                  </p>
                </div>
                <div className="text-right">
                  <button className="rounded border px-3 py-1 text-sm">
                    Review
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Payment Portal</p>
                  <p className="text-muted-foreground text-xs">
                    Customer self-service
                  </p>
                </div>
                <div className="text-right">
                  <button className="rounded border px-3 py-1 text-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
