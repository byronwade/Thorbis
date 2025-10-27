"use client";

import { ArrowLeft, FileText, Package, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { usePageLayout } from "@/hooks/use-page-layout";

type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
};

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
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    paid: { variant: "default" },
    pending: { variant: "secondary" },
    draft: { variant: "outline" },
    overdue: { variant: "destructive" },
  };

  const config = variants[status] || { variant: "outline" };

  return (
    <Badge
      className={status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
      variant={config.variant}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function InvoicesPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
    sidebar: {
      groups: [
        {
          label: undefined,
          items: [
            {
              mode: "link" as const,
              title: "Back to Work",
              url: "/dashboard/work",
              icon: ArrowLeft,
            },
          ],
        },
        {
          label: "Financial Documents",
          items: [
            {
              mode: "link" as const,
              title: "Invoices",
              url: "/dashboard/work/invoices",
              icon: FileText,
            },
            {
              mode: "link" as const,
              title: "Estimates",
              url: "/dashboard/work/estimates",
              icon: FileText,
            },
            {
              mode: "link" as const,
              title: "Purchase Orders",
              url: "/dashboard/work/purchase-orders",
              icon: Receipt,
            },
          ],
        },
      ],
    },
  });

  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice #",
      sortable: true,
      filterable: true,
      render: (invoice) => (
        <span className="font-medium">{invoice.invoiceNumber}</span>
      ),
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
      render: (invoice) => (
        <span className="font-medium">{formatCurrency(invoice.amount)}</span>
      ),
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
      actionHref="/dashboard/work/invoices/new"
      actionLabel="Create Invoice"
      description="Manage and track all customer invoices and billing"
      secondaryActions={[
        {
          label: "Create PO",
          href: "/dashboard/work/purchase-orders/new",
          icon: Package,
        },
      ]}
      title="Invoices"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Total Invoiced"
          subtext="+20.1% from last month"
          trend="up"
          value="$45,231.89"
        />
        <StatCard
          label="Paid"
          subtext="85% collection rate"
          value="$38,445.67"
        />
        <StatCard label="Pending" subtext="12 invoices" value="$5,786.22" />
        <StatCard
          label="Overdue"
          subtext="3 invoices"
          trend="down"
          value="$1,000.00"
        />
      </div>

      <DataTable
        columns={
          columns as unknown as DataTableColumn<Record<string, unknown>>[]
        }
        data={mockInvoices as unknown as Record<string, unknown>[]}
        emptyMessage="No invoices found."
        itemsPerPage={10}
        keyField="id"
        searchPlaceholder="Search invoices by number, customer, or status..."
      />
    </WorkPageLayout>
  );
}
