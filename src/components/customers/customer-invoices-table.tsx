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

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreditCard, FileText, MoreHorizontal, Mail } from "lucide-react";
import { QuickPayDialog } from "@/components/invoices/quick-pay-dialog";
import { sendInvoiceEmail, sendEstimateEmail } from "@/actions/invoice-communications";
import { toast } from "sonner";
import { FullWidthDataTable, type ColumnDef } from "@/components/ui/full-width-datatable";

interface CustomerInvoicesTableProps {
  invoices: any[];
  onUpdate?: () => void;
}

export function CustomerInvoicesTable({ invoices, onUpdate }: CustomerInvoicesTableProps) {
  const [quickPayInvoice, setQuickPayInvoice] = useState<any>(null);
  const [isSending, setIsSending] = useState<string | null>(null);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

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
      <Badge variant={variants[status] || "outline"} className="text-xs">
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      key: "invoice_number",
      header: "Invoice #",
      width: "w-32",
      shrink: true,
      render: (invoice) => (
        <Link
          href={`/dashboard/work/invoices/${invoice.id}`}
          className="font-medium text-primary hover:underline"
        >
          {invoice.invoice_number}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (invoice) => <span className="text-sm">{invoice.title || "—"}</span>,
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
        <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
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
          {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}
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
        const canPay = invoice.status !== "paid" && invoice.balance_amount > 0;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canPay && (
                <>
                  <DropdownMenuItem
                    onClick={() => setQuickPayInvoice(invoice)}
                    className="cursor-pointer"
                  >
                    <CreditCard className="mr-2 size-4" />
                    Quick Pay
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => handleSendInvoice(invoice.id)}
                disabled={isSending === invoice.id}
                className="cursor-pointer"
              >
                <Mail className="mr-2 size-4" />
                Send Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSendEstimate(invoice.id)}
                disabled={isSending === invoice.id}
                className="cursor-pointer"
              >
                <FileText className="mr-2 size-4" />
                Send as Estimate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [isSending]);

  return (
    <>
      {quickPayInvoice && (
        <QuickPayDialog
          open={!!quickPayInvoice}
          onOpenChange={(open) => !open && setQuickPayInvoice(null)}
          invoiceId={quickPayInvoice.id}
          invoiceNumber={quickPayInvoice.invoice_number}
          amount={quickPayInvoice.balance_amount}
          onSuccess={() => {
            setQuickPayInvoice(null);
            onUpdate?.();
          }}
        />
      )}

      <FullWidthDataTable
        data={invoices}
        columns={columns}
        getItemId={(invoice) => invoice.id}
        searchPlaceholder="Search invoices..."
        searchFilter={(invoice, query) => {
          const searchLower = query.toLowerCase();
          return (
            invoice.invoice_number?.toLowerCase().includes(searchLower) ||
            invoice.title?.toLowerCase().includes(searchLower) ||
            invoice.status?.toLowerCase().includes(searchLower)
          );
        }}
        emptyMessage="No invoices found"
        emptyIcon={<FileText className="size-12 text-muted-foreground/50" />}
        showPagination={true}
      />
    </>
  );
}
