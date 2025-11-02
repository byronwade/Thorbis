/**
 * Invoices Page - Server Component
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering (no loading flash)
 * - Uses established DataTablePageHeader pattern
 * - Only InvoicesTable component is client-side for sorting/filtering/pagination
 * - Better SEO and initial page load performance
 * - Follows consistent design system with other work pages
 */

import { Download, FileText, Plus, Send, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";

// Mock data - replace with real data from database
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    customer: "Acme Corp",
    date: "Jan 15, 2025",
    dueDate: "Feb 14, 2025",
    amount: 250_000,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    customer: "Tech Solutions",
    date: "Jan 18, 2025",
    dueDate: "Feb 17, 2025",
    amount: 375_000,
    status: "pending",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    customer: "Global Industries",
    date: "Jan 20, 2025",
    dueDate: "Feb 19, 2025",
    amount: 120_000,
    status: "draft",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    customer: "Summit LLC",
    date: "Jan 22, 2025",
    dueDate: "Feb 21, 2025",
    amount: 580_000,
    status: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-005",
    customer: "Mountain View Co",
    date: "Jan 10, 2025",
    dueDate: "Feb 9, 2025",
    amount: 100_000,
    status: "overdue",
  },
  {
    id: "6",
    invoiceNumber: "INV-2025-006",
    customer: "Pacific Corp",
    date: "Jan 25, 2025",
    dueDate: "Feb 24, 2025",
    amount: 425_000,
    status: "paid",
  },
  {
    id: "7",
    invoiceNumber: "INV-2025-007",
    customer: "Downtown Services",
    date: "Jan 28, 2025",
    dueDate: "Feb 27, 2025",
    amount: 195_000,
    status: "pending",
  },
];

export default function InvoicesPage() {
  // Calculate stats from data
  const totalInvoices = mockInvoices.length;
  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = mockInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = mockInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = mockInvoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const draftCount = mockInvoices.filter(
    (inv) => inv.status === "draft"
  ).length;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
            <Button
              className="md:hidden"
              size="sm"
              title="Import"
              variant="outline"
            >
              <Upload className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Upload className="mr-2 size-4" />
              Import
            </Button>

            <Button
              className="md:hidden"
              size="sm"
              title="Export"
              variant="outline"
            >
              <Download className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Download className="mr-2 size-4" />
              Export
            </Button>

            <Button
              className="md:hidden"
              size="sm"
              title="Send Batch"
              variant="outline"
            >
              <Send className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Send className="mr-2 size-4" />
              Send Batch
            </Button>

            <Button asChild size="sm">
              <Link href="/dashboard/work/invoices/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </>
        }
        description="Create, track, and manage customer invoices and payments"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    Total Invoiced
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  ${(totalAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {totalInvoices} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-green-600">
                  ${(paidAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {mockInvoices.filter((inv) => inv.status === "paid").length}{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-yellow-600">
                  ${(pendingAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {
                    mockInvoices.filter((inv) => inv.status === "pending")
                      .length
                  }{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-red-600">
                  ${(overdueAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {
                    mockInvoices.filter((inv) => inv.status === "overdue")
                      .length
                  }{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-muted-foreground">
                  {draftCount}
                </div>
                <p className="text-muted-foreground text-xs">Unsent invoices</p>
              </CardContent>
            </Card>
          </div>
        }
        title="Invoices"
      />

      <div className="flex-1 overflow-auto">
        <InvoicesTable invoices={mockInvoices} itemsPerPage={50} />
      </div>
    </div>
  );
}
