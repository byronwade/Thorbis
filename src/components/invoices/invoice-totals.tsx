/**
 * Invoice Totals Component
 *
 * Displays invoice financial summary:
 * - Subtotal
 * - Tax
 * - Discount
 * - Total
 * - Paid amount
 * - Balance due
 */

"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Invoice = {
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: string;
};

interface InvoiceTotalsProps {
  invoice: Invoice;
}

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <Card className="mb-8 ml-auto max-w-md p-6">
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">
            {formatCurrency(invoice.subtotal)}
          </span>
        </div>

        {/* Tax */}
        {invoice.tax_amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">
              {formatCurrency(invoice.tax_amount)}
            </span>
          </div>
        )}

        {/* Discount */}
        {invoice.discount_amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(invoice.discount_amount)}
            </span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">
            {formatCurrency(invoice.total_amount)}
          </span>
        </div>

        {/* Paid Amount */}
        {invoice.paid_amount > 0 && (
          <>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-medium text-green-600">
                {formatCurrency(invoice.paid_amount)}
              </span>
            </div>
          </>
        )}

        {/* Balance Due */}
        {invoice.balance_amount > 0 && (
          <div className="flex justify-between">
            <span className="font-semibold">Balance Due</span>
            <span
              className={`text-lg font-bold ${
                invoice.status === "overdue"
                  ? "text-destructive"
                  : "text-primary"
              }`}
            >
              {formatCurrency(invoice.balance_amount)}
            </span>
          </div>
        )}

        {/* Paid in Full */}
        {invoice.balance_amount === 0 && invoice.paid_amount > 0 && (
          <div className="rounded-md bg-green-50 p-3 text-center text-green-800 text-sm font-medium dark:bg-green-950 dark:text-green-200">
            Paid in Full
          </div>
        )}
      </div>
    </Card>
  );
}
