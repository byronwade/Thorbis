"use client";

import {
  CreditCard,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

type Invoice = {
  id: string;
  invoice_number: string;
  title?: string;
  total_amount: number;
  paid_amount: number;
  balance_amount?: number;
  status: string;
  created_at: string;
  due_date?: string;
};

type JobInvoicesTableProps = {
  invoices: Invoice[];
};

const CENTS_PER_DOLLAR = 100;

export function JobInvoicesTable({ invoices }: JobInvoicesTableProps) {
  const formatCurrency = useCallback(
    (cents: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(cents / CENTS_PER_DOLLAR),
    []
  );

  const getStatusBadge = useCallback((status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      paid: "default",
      pending: "secondary",
      draft: "outline",
      overdue: "destructive",
    };

    return (
      <Badge className="text-xs" variant={variants[status] || "outline"}>
        {status}
      </Badge>
    );
  }, []);

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        key: "invoice_number",
        header: "Invoice #",
        width: "w-32",
        shrink: true,
        render: (invoice) => (
          <Link
            className="font-medium text-primary hover:underline"
            href={`/dashboard/work/invoices/${invoice.id}`}
          >
            {invoice.invoice_number}
          </Link>
        ),
      },
      {
        key: "title",
        header: "Title",
        render: (invoice) => (
          <span className="text-sm">{invoice.title || "—"}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-24",
        shrink: true,
        render: (invoice) => getStatusBadge(invoice.status),
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-32",
        shrink: true,
        align: "right",
        render: (invoice) => (
          <span className="font-medium">
            {formatCurrency(invoice.total_amount)}
          </span>
        ),
      },
      {
        key: "balance_amount",
        header: "Balance",
        width: "w-32",
        shrink: true,
        align: "right",
        render: (invoice) => {
          const balance =
            invoice.balance_amount ??
            invoice.total_amount - invoice.paid_amount;
          return balance > 0 ? (
            <span className="font-medium text-destructive">
              {formatCurrency(balance)}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Paid</span>
          );
        },
      },
      {
        key: "due_date",
        header: "Due Date",
        width: "w-28",
        shrink: true,
        hideOnMobile: true,
        render: (invoice) => (
          <span className="text-sm">
            {invoice.due_date
              ? new Date(invoice.due_date).toLocaleDateString()
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-12",
        shrink: true,
        align: "right",
        render: (invoice) => {
          const balance =
            invoice.balance_amount ??
            invoice.total_amount - invoice.paid_amount;
          const canPay = invoice.status !== "paid" && balance > 0;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="size-8 p-0" size="sm" variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 size-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="mr-2 size-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Send className="mr-2 size-4" />
                  Send to Customer
                </DropdownMenuItem>
                {canPay && (
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 size-4" />
                    Record Payment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [formatCurrency, getStatusBadge]
  );

  return (
    <FullWidthDataTable
      columns={columns}
      data={invoices}
      emptyIcon={<FileText className="size-12 text-muted-foreground/50" />}
      emptyMessage="No invoices found for this job"
      getItemId={(invoice) => invoice.id}
      searchFilter={(invoice, query) => {
        const searchLower = query.toLowerCase();
        return (
          invoice.invoice_number?.toLowerCase().includes(searchLower) ||
          invoice.title?.toLowerCase().includes(searchLower) ||
          invoice.status?.toLowerCase().includes(searchLower)
        );
      }}
      searchPlaceholder="Search invoices..."
      showPagination={true}
    />
  );
}
