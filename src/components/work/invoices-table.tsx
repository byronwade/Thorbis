"use client";

/**
 * InvoicesTable Component
 * Full-width Gmail-style table for displaying invoices
 */

import {
  Archive,
  Download,
  FileText,
  Plus,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { InvoiceStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "draft" | "overdue";
};

type InvoicesTableProps = {
  invoices: Invoice[];
  itemsPerPage?: number;
  showRefresh?: boolean;
};


export function InvoicesTable({
  invoices,
  itemsPerPage = 50,
  showRefresh = false,
}: InvoicesTableProps) {
  const columns: ColumnDef<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice #",
      width: "w-36",
      shrink: true,
      render: (invoice) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/invoices/${invoice.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {invoice.invoiceNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "flex-1",
      render: (invoice) => (
        <span className="font-medium text-foreground text-sm">
          {invoice.customer}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (invoice) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {invoice.date}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (invoice) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {invoice.dueDate}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (invoice) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(invoice.amount, { decimals: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (invoice) => (
        <RowActionsDropdown
          actions={[
            {
              label: "View Invoice",
              icon: FileText,
              href: `/dashboard/work/invoices/${invoice.id}`,
            },
            {
              label: "Send to Customer",
              icon: Send,
              onClick: () => {
                // TODO: Implement send functionality
              },
            },
            {
              label: "Download PDF",
              icon: Download,
              onClick: () => {
                // TODO: Implement download functionality
              },
            },
            {
              label: "Archive Invoice",
              icon: Archive,
              variant: "destructive",
              separatorBefore: true,
              onClick: async () => {
                if (
                  !confirm(
                    "Archive this invoice? It can be restored within 90 days."
                  )
                ) {
                  return;
                }
                const { archiveInvoice } = await import("@/actions/invoices");
                const result = await archiveInvoice(invoice.id);
                if (result.success) {
                  window.location.reload();
                }
              },
            },
          ]}
        />
      ),
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Send",
      icon: <Send className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Send invoices:", Array.from(selectedIds));
      },
    },
    {
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Download invoices:", Array.from(selectedIds));
      },
    },
    {
      label: "Archive Selected",
      icon: <Archive className="h-4 w-4" />,
      onClick: async (selectedIds) => {
        if (
          !confirm(
            `Archive ${selectedIds.size} invoice(s)? They can be restored within 90 days.`
          )
        ) {
          return;
        }

        // Import dynamically to avoid circular dependencies
        const { archiveInvoice } = await import("@/actions/invoices");

        let archived = 0;
        for (const id of selectedIds) {
          const result = await archiveInvoice(id);
          if (result.success) archived++;
        }

        if (archived > 0) {
          window.location.reload(); // Reload to show updated list
        }
      },
      variant: "destructive",
    },
  ];

  // Search filter function
  const searchFilter = (invoice: Invoice, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchStr) ||
      invoice.customer.toLowerCase().includes(searchStr) ||
      invoice.status.toLowerCase().includes(searchStr)
    );
  };

  const handleRowClick = (invoice: Invoice) => {
    window.location.href = `/dashboard/work/invoices/${invoice.id}`;
  };

  // Highlight overdue invoices
  const isHighlighted = (invoice: Invoice) => invoice.status === "overdue";

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={invoices}
      emptyAction={
        <Button
          onClick={() => (window.location.href = "/dashboard/work/invoices/new")}
          size="sm"
        >
          <Plus className="mr-2 size-4" />
          Create Invoice
        </Button>
      }
      emptyIcon={<FileText className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No invoices found"
      enableSelection={true}
      getHighlightClass={() => "bg-red-50/30 dark:bg-red-950/10"}
      getItemId={(invoice) => invoice.id}
      isHighlighted={isHighlighted}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search invoices by number, customer, or status..."
      showRefresh={showRefresh}
    />
  );
}
