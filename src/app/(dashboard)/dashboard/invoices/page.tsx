"use client";

import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InvoicesPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage billing, payments, and financial transactions
        </p>
      </div>

      {/* Invoice Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Invoices
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
              <title>Receipt</title>
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
              <path d="M14 8H8M16 12H8M14 16H8" />
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
              Pending Payment
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
              <title>DollarSign</title>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$24,500</div>
            <p className="text-muted-foreground text-xs">47 invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Paid This Month
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
            <div className="font-bold text-2xl">$89,200</div>
            <p className="text-muted-foreground text-xs">156 invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Average Payment
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
            <div className="font-bold text-2xl">$572</div>
            <p className="text-muted-foreground text-xs">Per invoice</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>
              Latest invoices and payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  invoiceId: "INV-001",
                  customer: "ABC Corporation",
                  amount: "$450",
                  status: "Paid",
                  dueDate: "2024-01-25",
                  paidDate: "2024-01-24",
                  services: "HVAC Maintenance",
                },
                {
                  invoiceId: "INV-002",
                  customer: "XYZ Industries",
                  amount: "$320",
                  status: "Pending",
                  dueDate: "2024-01-30",
                  paidDate: "N/A",
                  services: "Plumbing Repair",
                },
                {
                  invoiceId: "INV-003",
                  customer: "TechStart Inc",
                  amount: "$200",
                  status: "Overdue",
                  dueDate: "2024-01-20",
                  paidDate: "N/A",
                  services: "Electrical Service",
                },
                {
                  invoiceId: "INV-004",
                  customer: "Global Systems",
                  amount: "$680",
                  status: "Paid",
                  dueDate: "2024-01-28",
                  paidDate: "2024-01-25",
                  services: "AC Installation",
                },
                {
                  invoiceId: "INV-005",
                  customer: "123 Manufacturing",
                  amount: "$180",
                  status: "Pending",
                  dueDate: "2024-02-01",
                  paidDate: "N/A",
                  services: "Heater Repair",
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
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {invoice.services}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Due: {invoice.dueDate} • Paid: {invoice.paidDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{invoice.amount}</p>
                    <p className="text-muted-foreground text-xs">Amount</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Invoice Analytics</CardTitle>
            <CardDescription>
              Payment trends and financial metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Payment Rate</p>
                  <p className="text-muted-foreground text-xs">This month</p>
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
                  <p className="font-medium text-sm">Average Payment Time</p>
                  <p className="text-muted-foreground text-xs">
                    Days to payment
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">12</p>
                  <p className="text-muted-foreground text-xs">
                    -2 days from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Overdue Amount</p>
                  <p className="text-muted-foreground text-xs">Outstanding</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$3,200</p>
                  <p className="text-muted-foreground text-xs">8 invoices</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Monthly Revenue</p>
                  <p className="text-muted-foreground text-xs">
                    Total collected
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">$89,200</p>
                  <p className="text-muted-foreground text-xs">
                    +$5,400 from last month
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent p-3">
                <div>
                  <p className="font-medium text-sm">Collection Efficiency</p>
                  <p className="text-muted-foreground text-xs">
                    Payment success
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
