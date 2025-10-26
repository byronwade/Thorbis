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

export default function CreateInvoicePage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Create Invoice</h1>
        <p className="text-muted-foreground">
          Create new invoices, manage billing details, and process payments
        </p>
      </div>

      {/* Create Invoice Form */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Enter customer and service information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="font-medium text-sm">Customer</label>
                  <select className="w-full rounded-md border p-2">
                    <option>Select Customer</option>
                    <option>ABC Corporation</option>
                    <option>XYZ Industries</option>
                    <option>TechStart Inc</option>
                    <option>Global Systems</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-sm">Invoice Date</label>
                  <input
                    className="w-full rounded-md border p-2"
                    defaultValue="2024-01-25"
                    type="date"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-sm">
                  Service Description
                </label>
                <textarea
                  className="h-20 w-full rounded-md border p-2"
                  placeholder="Describe the services provided..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="font-medium text-sm">Service Type</label>
                  <select className="w-full rounded-md border p-2">
                    <option>HVAC Maintenance</option>
                    <option>Plumbing Repair</option>
                    <option>Electrical Service</option>
                    <option>AC Installation</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-sm">Hours</label>
                  <input
                    className="w-full rounded-md border p-2"
                    placeholder="2.5"
                    type="number"
                  />
                </div>
                <div>
                  <label className="font-medium text-sm">Rate ($/hr)</label>
                  <input
                    className="w-full rounded-md border p-2"
                    placeholder="75"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="font-medium text-sm">Materials Cost</label>
                  <input
                    className="w-full rounded-md border p-2"
                    placeholder="50.00"
                    type="number"
                  />
                </div>
                <div>
                  <label className="font-medium text-sm">Total Amount</label>
                  <input
                    className="w-full rounded-md border p-2"
                    placeholder="237.50"
                    readOnly
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-sm">Payment Terms</label>
                <select className="w-full rounded-md border p-2">
                  <option>Net 30</option>
                  <option>Net 15</option>
                  <option>Due on Receipt</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Create Invoice
                </button>
                <button className="rounded-md border px-4 py-2">
                  Save as Draft
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common invoice tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-accent p-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">New Invoice</p>
                  <p className="text-muted-foreground text-xs">
                    Create from scratch
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-accent p-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">From Template</p>
                  <p className="text-muted-foreground text-xs">
                    Use existing template
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-accent p-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">From Job</p>
                  <p className="text-muted-foreground text-xs">
                    Create from completed job
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-accent p-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Recurring Invoice</p>
                  <p className="text-muted-foreground text-xs">
                    Set up recurring billing
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
