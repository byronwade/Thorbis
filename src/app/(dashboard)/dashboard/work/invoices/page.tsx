"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FileText, DollarSign, Clock, CheckCircle2 } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    customer: "Acme Corp",
    date: "Jan 15, 2025",
    dueDate: "Feb 14, 2025",
    amount: 250000,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    customer: "Tech Solutions",
    date: "Jan 18, 2025",
    dueDate: "Feb 17, 2025",
    amount: 375000,
    status: "pending",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    customer: "Global Industries",
    date: "Jan 20, 2025",
    dueDate: "Feb 19, 2025",
    amount: 120000,
    status: "draft",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    customer: "Summit LLC",
    date: "Jan 22, 2025",
    dueDate: "Feb 21, 2025",
    amount: 580000,
    status: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-005",
    customer: "Mountain View Co",
    date: "Jan 10, 2025",
    dueDate: "Feb 9, 2025",
    amount: 100000,
    status: "overdue",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
    paid: { variant: "default" },
    pending: { variant: "secondary" },
    draft: { variant: "outline" },
    overdue: { variant: "destructive" },
  };

  const config = variants[status] || { variant: "outline" };

  return (
    <Badge variant={config.variant} className={status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function InvoicesPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice #",
      sortable: true,
      filterable: true,
      render: (invoice) => <span className="font-medium">{invoice.invoiceNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      filterable: true,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (invoice) => <span className="font-medium">{formatCurrency(invoice.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (invoice) => getStatusBadge(invoice.status),
    },
  ];

  return (
    <WorkPageLayout
      title="Invoices"
      description="Manage and track all customer invoices and billing"
      actionLabel="Create Invoice"
      actionHref="/dashboard/work/invoices/new"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Invoiced</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$45,231.89</div>
            <p className="text-muted-foreground text-xs">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Paid</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$38,445.67</div>
            <p className="text-muted-foreground text-xs">85% collection rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Pending</CardTitle>
            <Clock className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$5,786.22</div>
            <p className="text-muted-foreground text-xs">12 invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Overdue</CardTitle>
            <FileText className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$1,000.00</div>
            <p className="text-muted-foreground text-xs">3 invoices</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={mockInvoices as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        keyField="id"
        itemsPerPage={10}
        searchPlaceholder="Search invoices by number, customer, or status..."
        emptyMessage="No invoices found."
      />
    </WorkPageLayout>
  );
}
