/**
 * Invoice Payments Component
 *
 * Displays payment history and allows recording new payments
 * Shows all payments applied to this invoice via invoice_payments junction table
 */

"use client";

import { DollarSign, ExternalLink, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { removePaymentFromInvoice } from "@/actions/invoice-payments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Invoice = {
  id: string;
  paid_amount: number;
  balance_amount: number;
  status: string;
  paid_at: string | null;
};

type PaymentData = {
  id: string;
  amount_applied: number;
  applied_at: string;
  notes: string | null;
  payment: {
    id: string;
    payment_number: string;
    amount: number;
    payment_method: string;
    payment_type: string;
    status: string;
    card_brand?: string;
    card_last4?: string;
    check_number?: string;
    reference_number?: string;
    receipt_url?: string;
    refunded_amount?: number;
    processed_at?: string;
    completed_at?: string;
  };
};

type InvoicePaymentsProps = {
  invoice: Invoice;
  payments?: PaymentData[];
};

export function InvoicePayments({
  invoice,
  payments = [],
}: InvoicePaymentsProps) {
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [removePaymentId, setRemovePaymentId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Format currency
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date with time
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get payment method display
  const getPaymentMethodDisplay = (payment: PaymentData["payment"]) => {
    if (payment.card_brand && payment.card_last4) {
      return `${payment.card_brand} •••• ${payment.card_last4}`;
    }
    if (payment.check_number) {
      return `Check #${payment.check_number}`;
    }
    return payment.payment_method.replace("_", " ");
  };

  // Handle removing payment from invoice
  const handleRemovePayment = async () => {
    if (!removePaymentId) {
      return;
    }

    setIsRemoving(true);
    try {
      const result = await removePaymentFromInvoice(removePaymentId);

      if (result.success) {
        toast.success("Payment removed from invoice");
        setRemovePaymentId(null);
        // Refresh to show updated list
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to remove payment");
      }
    } catch (_error) {
      toast.error("Failed to remove payment");
    } finally {
      setIsRemoving(false);
    }
  };

  // Calculate running balance
  let runningBalance = invoice.paid_amount;
  const paymentsWithBalance = [...payments]
    .reverse()
    .map((payment) => {
      const balanceAfter = runningBalance;
      runningBalance -= payment.amount_applied;
      return { ...payment, balanceAfter };
    })
    .reverse();

  // Show payment history if there are any payments
  const hasPayments = invoice.paid_amount > 0 || payments.length > 0;

  return (
    <Card className="mb-8 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <Label className="font-semibold text-base">Payment History</Label>
          {payments.length > 0 && (
            <Badge variant="secondary">
              {payments.length} payment{payments.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        {invoice.balance_amount > 0 && invoice.status !== "cancelled" && (
          <Button
            onClick={() => setShowRecordPayment(!showRecordPayment)}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        )}
      </div>

      {hasPayments ? (
        <div>
          {/* Payment Summary */}
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <div className="text-muted-foreground text-sm">Total Paid</div>
              <div className="mt-1 font-bold text-success text-xl">
                {formatCurrency(invoice.paid_amount)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-muted-foreground text-sm">
                Remaining Balance
              </div>
              <div
                className={`mt-1 font-bold text-xl ${
                  invoice.balance_amount > 0
                    ? invoice.status === "overdue"
                      ? "text-destructive"
                      : "text-primary"
                    : "text-success"
                }`}
              >
                {formatCurrency(invoice.balance_amount)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-muted-foreground text-sm">
                Payment Status
              </div>
              <div className="mt-1">
                {invoice.balance_amount === 0 ? (
                  <Badge className="bg-success" variant="default">
                    PAID
                  </Badge>
                ) : invoice.paid_amount > 0 ? (
                  <Badge variant="secondary">PARTIAL</Badge>
                ) : (
                  <Badge variant="outline">UNPAID</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Payment List */}
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Payment #</TableHead>
                    <TableHead>Amount Applied</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsWithBalance.map((paymentData) => {
                    const payment = paymentData.payment;
                    return (
                      <TableRow key={paymentData.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDateTime(paymentData.applied_at)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.payment_number}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(paymentData.amount_applied)}
                          {payment.amount !== paymentData.amount_applied && (
                            <div className="text-muted-foreground text-xs">
                              of {formatCurrency(payment.amount)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="capitalize">
                          {getPaymentMethodDisplay(payment)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : payment.status === "pending"
                                  ? "secondary"
                                  : payment.status === "failed"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {payment.status}
                          </Badge>
                          {payment.refunded_amount &&
                            payment.refunded_amount > 0 && (
                              <Badge className="ml-1" variant="outline">
                                Refunded:{" "}
                                {formatCurrency(payment.refunded_amount)}
                              </Badge>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(paymentData.balanceAfter)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                              href={`/dashboard/work/payments/${payment.id}`}
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">
                                View payment details
                              </span>
                            </Link>
                            <Button
                              className="h-8 w-8 p-0"
                              onClick={() => setRemovePaymentId(paymentData.id)}
                              size="sm"
                              variant="ghost"
                            >
                              <X className="h-4 w-4 text-destructive" />
                              <span className="sr-only">
                                Remove payment from invoice
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              {invoice.paid_at
                ? `Payment received on ${formatDate(invoice.paid_at)}`
                : "No detailed payment records available"}
            </div>
          )}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DollarSign />
            </EmptyMedia>
            <EmptyTitle>No Payments Yet</EmptyTitle>
            <EmptyDescription>
              Record a payment when the customer pays this invoice.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Remove Payment Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setRemovePaymentId(null)}
        open={removePaymentId !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment from Invoice?</DialogTitle>
            <DialogDescription>
              This will remove the payment application from this invoice. The
              payment will remain in the system but won't be applied to this
              invoice. The invoice balance will be recalculated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isRemoving}
              onClick={() => setRemovePaymentId(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isRemoving}
              onClick={handleRemovePayment}
              variant="destructive"
            >
              {isRemoving ? "Removing..." : "Remove Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
