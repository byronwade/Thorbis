"use client";

/**
 * PaymentsTable Component
 * Full-width Gmail-style table for displaying payments
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view payment details
 */

import {
  Archive,
  CreditCard,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
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
import { cn } from "@/lib/utils";

type Payment = {
  id: string;
  payment_number: string;
  amount: number;
  payment_method: string;
  status: string;
  processed_at?: string | Date | null;
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
  } | null;
  invoice_id?: string | null;
  job_id?: string | null;
};

type PaymentsTableProps = {
  payments: Payment[];
  itemsPerPage?: number;
  onPaymentClick?: (payment: Payment) => void;
  showRefresh?: boolean;
};

function formatCurrency(cents: number | null): string {
  if (cents === null) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      className: string;
      label: string;
    }
  > = {
    pending: {
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-400",
      label: "Pending",
    },
    processing: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Processing",
    },
    completed: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Completed",
    },
    failed: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Failed",
    },
    refunded: {
      className:
        "border-orange-500/50 bg-orange-500 text-white hover:bg-orange-600",
      label: "Refunded",
    },
    partially_refunded: {
      className:
        "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-400",
      label: "Partially Refunded",
    },
    cancelled: {
      className: "border-gray-500/50 bg-gray-500 text-white hover:bg-gray-600",
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

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: "Cash",
    check: "Check",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    ach: "ACH",
    wire: "Wire Transfer",
    venmo: "Venmo",
    paypal: "PayPal",
    other: "Other",
  };
  return labels[method] || method;
}

function getCustomerName(payment: Payment): string {
  if (payment.customer?.display_name) {
    return payment.customer.display_name;
  }
  if (payment.customer?.first_name || payment.customer?.last_name) {
    return `${payment.customer.first_name || ""} ${payment.customer.last_name || ""}`.trim();
  }
  return "Unknown Customer";
}

export function PaymentsTable({
  payments,
  itemsPerPage = 50,
  onPaymentClick,
  showRefresh = false,
}: PaymentsTableProps) {
  const columns: ColumnDef<Payment>[] = [
    {
      key: "payment_number",
      header: "Payment #",
      width: "w-36",
      shrink: true,
      render: (payment) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/payments/${payment.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {payment.payment_number}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "w-48",
      shrink: true,
      render: (payment) => (
        <span className="text-muted-foreground text-sm">
          {getCustomerName(payment)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (payment) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(payment.amount)}
        </span>
      ),
    },
    {
      key: "payment_method",
      header: "Method",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (payment) => (
        <span className="text-muted-foreground text-sm">
          {getPaymentMethodLabel(payment.payment_method)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (payment) => getStatusBadge(payment.status),
    },
    {
      key: "processed_at",
      header: "Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (payment) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(payment.processed_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (payment) => (
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
                <Link href={`/dashboard/work/payments/${payment.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/payments/${payment.id}/edit`}>
                  <Edit className="mr-2 size-4" />
                  Edit Payment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  if (
                    !confirm(
                      "Delete this payment record? This action cannot be undone."
                    )
                  ) {
                    return;
                  }
                  // TODO: Implement delete payment action
                  window.location.reload();
                }}
              >
                <Archive className="mr-2 size-4" />
                Delete Payment
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
      label: "Export Selected",
      icon: <Archive className="h-4 w-4" />,
      onClick: async (selectedIds) => {
        // TODO: Implement bulk export
        console.log("Export payments:", Array.from(selectedIds));
      },
    },
  ];

  // Search filter function
  const searchFilter = (payment: Payment, query: string) => {
    const searchStr = query.toLowerCase();

    return (
      payment.payment_number.toLowerCase().includes(searchStr) ||
      payment.status.toLowerCase().includes(searchStr) ||
      payment.payment_method.toLowerCase().includes(searchStr) ||
      getCustomerName(payment).toLowerCase().includes(searchStr)
    );
  };

  const handleRowClick = (payment: Payment) => {
    if (onPaymentClick) {
      onPaymentClick(payment);
    } else {
      window.location.href = `/dashboard/work/payments/${payment.id}`;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAddPayment = () => {
    window.location.href = "/dashboard/work/payments/new";
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={payments}
      emptyAction={
        <Button onClick={handleAddPayment} size="sm">
          <Plus className="mr-2 size-4" />
          Record Payment
        </Button>
      }
      emptyIcon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No payments found"
      enableSelection={true}
      getItemId={(payment) => payment.id}
      itemsPerPage={itemsPerPage}
      onRefresh={handleRefresh}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search payments by number, customer, or method..."
      showRefresh={showRefresh}
    />
  );
}





