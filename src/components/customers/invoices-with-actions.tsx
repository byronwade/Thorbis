"use client";

/**
 * Invoices Table with Quick Actions
 *
 * Wraps the invoices table to add action buttons:
 * - Quick Pay (one-click with confirmation)
 * - Send Invoice (email to customer)
 * - Send Estimate (email to customer)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreditCard, Send, FileText, MoreHorizontal, Mail } from "lucide-react";
import { QuickPayDialog } from "@/components/invoices/quick-pay-dialog";
import { sendInvoiceEmail, sendEstimateEmail } from "@/actions/invoice-communications";
import { toast } from "sonner";

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
        open={showQuickPay}
        onOpenChange={setShowQuickPay}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoice_number}
        amount={invoice.balance_amount}
        onSuccess={onUpdate}
      />

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
                onClick={() => setShowQuickPay(true)}
                className="cursor-pointer"
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
                onClick={handleSendInvoice}
                disabled={isSending}
                className="cursor-pointer"
              >
                <Mail className="mr-2 size-4" />
                Send Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSendEstimate}
                disabled={isSending}
                className="cursor-pointer"
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
