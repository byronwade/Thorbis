"use client";

/**
 * InvoicesTable Component
 * Full-width Gmail-style table for displaying invoices
 */

import {
  Archive,
  Download,
  FileText,
  MoreHorizontal,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

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

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const config = {
    paid: {
      className: "bg-green-500 hover:bg-green-600 text-white",
      label: "Paid",
    },
    pending: {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Pending",
    },
    draft: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Draft",
    },
    overdue: {
      className: "bg-red-500 hover:bg-red-600 text-white",
      label: "Overdue",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.draft;

  return (
    <Badge
      className={`font-medium text-xs ${statusConfig.className}`}
      variant="outline"
    >
      {statusConfig.label}
    </Badge>
  );
}

export function InvoicesTable({
  invoices,
  itemsPerPage = 50,
  showRefresh = true,
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
          {formatCurrency(invoice.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (invoice) => getStatusBadge(invoice.status),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (invoice) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/invoices/${invoice.id}`}>
                  <FileText className="mr-2 size-4" />
                  View Invoice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 size-4" />
                Send to Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 size-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
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
                }}
              >
                <Archive className="mr-2 size-4" />
                Archive Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
      emptyIcon={
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      }
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
