/**
 * Invoice Payments Component
 *
 * Displays payment history and allows recording new payments
 */

"use client";

import { useState } from "react";
import { DollarSign, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

type Invoice = {
  id: string;
  paid_amount: number;
  balance_amount: number;
  status: string;
  paid_at: string | null;
};

interface InvoicePaymentsProps {
  invoice: Invoice;
}

export function InvoicePayments({ invoice }: InvoicePaymentsProps) {
  const [showRecordPayment, setShowRecordPayment] = useState(false);

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mock payments for now (replace with real data when payment table exists)
  const payments: any[] = [];

  // Show payment history if there are any payments
  const hasPayments = invoice.paid_amount > 0 || payments.length > 0;

  return (
    <Card className="mb-8 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <Label className="text-base font-semibold">Payment History</Label>
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
              <div className="mt-1 text-xl font-bold text-green-600">
                {formatCurrency(invoice.paid_amount)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-muted-foreground text-sm">
                Remaining Balance
              </div>
              <div
                className={`mt-1 text-xl font-bold ${
                  invoice.balance_amount > 0
                    ? invoice.status === "overdue"
                      ? "text-destructive"
                      : "text-primary"
                    : "text-green-600"
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
                  <Badge variant="default" className="bg-green-600">
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
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.method}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.reference || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
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
    </Card>
  );
}
