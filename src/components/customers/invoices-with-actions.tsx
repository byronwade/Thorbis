"use client";

/**
 * Invoices Table with Quick Actions
 *
 * Wraps the invoices table to add action buttons:
 * - Quick Pay (one-click with confirmation)
 * - Send Invoice (email to customer)
 * - Send Estimate (email to customer)
 */

import { CreditCard, FileText, Mail, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  sendEstimateEmail,
  sendInvoiceEmail,
} from "@/actions/invoice-communications";
import { QuickPayDialog } from "@/components/invoices/quick-pay-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceActionsProps {
  invoice: {
    id: string;
    invoice_number: string;
    status: string;
    balance_amount: number;
    total_amount: number;
  };
  onUpdate?: () => void;
}

export function InvoiceActions({ invoice, onUpdate }: InvoiceActionsProps) {
  const [showQuickPay, setShowQuickPay] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendInvoice = async () => {
    setIsSending(true);
    const result = await sendInvoiceEmail(invoice.id);
    setIsSending(false);

    if (result.success) {
      toast.success(result.message || "Invoice sent successfully");
      onUpdate?.();
    } else {
      toast.error(result.error || "Failed to send invoice");
    }
  };

  const handleSendEstimate = async () => {
    setIsSending(true);
    const result = await sendEstimateEmail(invoice.id);
    setIsSending(false);

    if (result.success) {
      toast.success(result.message || "Estimate sent successfully");
      onUpdate?.();
    } else {
      toast.error(result.error || "Failed to send estimate");
    }
  };

  const canPay = invoice.status !== "paid" && invoice.balance_amount > 0;
  const canSend = invoice.status !== "cancelled";

  return (
    <>
      <QuickPayDialog
        amount={invoice.balance_amount}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoice_number}
        onOpenChange={setShowQuickPay}
        onSuccess={onUpdate}
        open={showQuickPay}
      />

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
                onClick={() => setShowQuickPay(true)}
              >
                <CreditCard className="mr-2 size-4" />
                Quick Pay
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {canSend && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={isSending}
                onClick={handleSendInvoice}
              >
                <Mail className="mr-2 size-4" />
                Send Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={isSending}
                onClick={handleSendEstimate}
              >
                <FileText className="mr-2 size-4" />
                Send as Estimate
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
