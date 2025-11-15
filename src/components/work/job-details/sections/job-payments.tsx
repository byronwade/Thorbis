/**
 * Job Payments Section
 * Displays payment history for this job
 */

"use client";

import { CreditCard, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type JobPaymentsProps = {
  payments: any[];
};

export function JobPayments({ payments }: JobPaymentsProps) {
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return "$0.00";
    }
    // Handle both cents and dollar amounts
    const value = amount > 1000 ? amount / 100 : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "Cash",
      check: "Check",
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      ach: "ACH Transfer",
      wire: "Wire Transfer",
      other: "Other",
    };
    return methods[method] || method;
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <DollarSign className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Payments</h3>
        <p className="text-muted-foreground text-sm">
          No payments have been recorded for this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {formatDate(payment.payment_date || payment.created_at)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" />
                    {getPaymentMethodLabel(
                      payment.payment_method || payment.method
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.reference_number || payment.transaction_id || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {payment.status || "completed"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="rounded-md bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Total Payments</p>
            <p className="text-muted-foreground text-xs">
              {payments.length} payment{payments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl">
              {formatCurrency(
                payments.reduce(
                  (sum, payment) => sum + (payment.amount || 0),
                  0
                )
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
