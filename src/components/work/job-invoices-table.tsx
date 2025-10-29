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
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    draft: { variant: "outline", label: "Draft" },
    sent: { variant: "secondary", label: "Sent" },
    paid: { variant: "default", label: "Paid" },
    overdue: { variant: "destructive", label: "Overdue" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = variants[status] || {
    variant: "outline" as const,
    label: status,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
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
          className="font-medium hover:underline"
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
        <span className="font-medium">
          {formatCurrency(invoice.totalAmount)}
        </span>
      ),
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      sortable: true,
      render: (invoice) => (
        <span className="font-medium">
          {formatCurrency(invoice.paidAmount)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (invoice) => <span>{formatDate(invoice.dueDate)}</span>,
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
