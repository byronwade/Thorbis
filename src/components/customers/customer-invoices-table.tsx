"use client";

/**
 * Customer Invoices Table with Quick Actions
 *
 * Displays invoices for a customer with action buttons:
 * - Quick Pay (one-click payment)
 * - Send Invoice (email)
 * - Send Estimate (email)
 *
 * Uses FullWidthDatatable for consistency
 */

import { CreditCard, FileText, Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  sendEstimateEmail,
  sendInvoiceEmail,
} from "@/actions/invoice-communications";
import { QuickPayDialog } from "@/components/invoices/quick-pay-dialog";
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

interface CustomerInvoicesTableProps {
  invoices: any[];
  onUpdate?: () => void;
}

export function CustomerInvoicesTable({
  invoices,
  onUpdate,
}: CustomerInvoicesTableProps) {
  const [quickPayInvoice, setQuickPayInvoice] = useState<any>(null);
  const [isSending, setIsSending] = useState<string | null>(null);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const handleSendInvoice = async (invoiceId: string) => {
    setIsSending(invoiceId);
    const result = await sendInvoiceEmail(invoiceId);
    setIsSending(null);

    if (result.success) {
      toast.success(result.message || "Invoice sent successfully");
      onUpdate?.();
    } else {
      toast.error(result.error || "Failed to send invoice");
    }
  };

  const handleSendEstimate = async (invoiceId: string) => {
    setIsSending(invoiceId);
    const result = await sendEstimateEmail(invoiceId);
    setIsSending(null);

    if (result.success) {
      toast.success(result.message || "Estimate sent successfully");
      onUpdate?.();
    } else {
      toast.error(result.error || "Failed to send estimate");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
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
  };

  const columns: ColumnDef<any>[] = useMemo(
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
        render: (invoice) =>
          invoice.balance_amount > 0 ? (
            <span className="font-medium text-destructive">
              {formatCurrency(invoice.balance_amount)}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Paid</span>
          ),
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
          const canPay =
            invoice.status !== "paid" && invoice.balance_amount > 0;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="size-8 p-0" size="sm" variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {canPay && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setQuickPayInvoice(invoice)}
                    >
                      <CreditCard className="mr-2 size-4" />
                      Quick Pay
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isSending === invoice.id}
                  onClick={() => handleSendInvoice(invoice.id)}
                >
                  <Mail className="mr-2 size-4" />
                  Send Invoice
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isSending === invoice.id}
                  onClick={() => handleSendEstimate(invoice.id)}
                >
                  <FileText className="mr-2 size-4" />
                  Send as Estimate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isSending]
  );

  return (
    <>
      {quickPayInvoice && (
        <QuickPayDialog
          amount={quickPayInvoice.balance_amount}
          invoiceId={quickPayInvoice.id}
          invoiceNumber={quickPayInvoice.invoice_number}
          onOpenChange={(open) => !open && setQuickPayInvoice(null)}
          onSuccess={() => {
            setQuickPayInvoice(null);
            onUpdate?.();
          }}
          open={!!quickPayInvoice}
        />
      )}

      <FullWidthDataTable
        columns={columns}
        data={invoices}
        emptyIcon={<FileText className="size-12 text-muted-foreground/50" />}
        emptyMessage="No invoices found"
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
    </>
  );
}
