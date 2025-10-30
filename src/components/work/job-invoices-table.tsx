"use client";

/**
 * JobInvoicesTable Component - Client Component
 *
 * Client-side features:
 * - Renders invoices with custom render functions in columns
 * - Handles DataTable component which requires client-side interactivity
 * - Extracted from Server Component to isolate client-side rendering
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: Date | null;
};

type JobInvoicesTableProps = {
  invoices: Invoice[];
  itemsPerPage?: number;
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date | null): string {
  if (!date) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      className: string;
      label: string;
    }
  > = {
    draft: {
      className:
        "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
      label: "Draft",
    },
    sent: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Sent",
    },
    paid: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Paid",
    },
    overdue: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Overdue",
    },
    cancelled: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Cancelled",
    },
  };

  const config = variants[status] || {
    className: "border-border/50 bg-background text-muted-foreground",
    label: status,
  };

  return (
    <Badge
      className={cn("font-medium text-xs", config.className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
}

export function JobInvoicesTable({
  invoices,
  itemsPerPage = 5,
}: JobInvoicesTableProps) {
  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      sortable: true,
      filterable: true,
      render: (invoice) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/invoices/${invoice.id}`}
        >
          {invoice.invoiceNumber}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      filterable: true,
      render: (invoice) => (
        <span className="text-sm leading-tight">{invoice.title}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (invoice) => getStatusBadge(invoice.status),
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      sortable: true,
      render: (invoice) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(invoice.totalAmount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      sortable: true,
      render: (invoice) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(invoice.paidAmount)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (invoice) => (
        <span className="text-muted-foreground text-sm tabular-nums leading-tight">
          {formatDate(invoice.dueDate)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={invoices}
      emptyMessage="No invoices found for this job."
      itemsPerPage={itemsPerPage}
      keyField="id"
      searchPlaceholder="Search invoices..."
    />
  );
}
