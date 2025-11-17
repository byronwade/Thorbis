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
import { formatCurrency } from "@/lib/utils/format";

type Invoice = {
	subtotal: number;
	tax_amount: number;
	discount_amount: number;
	total_amount: number;
	paid_amount: number;
	balance_amount: number;
	status: string;
};

type InvoiceTotalsProps = {
	invoice: Invoice;
};

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
	return (
		<Card className="mb-8 ml-auto max-w-md p-6">
			<div className="space-y-3">
				{/* Subtotal */}
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Subtotal</span>
					<span className="font-medium">
						{formatCurrency(invoice.subtotal || 0, { decimals: 2 })}
					</span>
				</div>

				{/* Tax */}
				{invoice.tax_amount > 0 && (
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Tax</span>
						<span className="font-medium">
							{formatCurrency(invoice.tax_amount || 0, { decimals: 2 })}
						</span>
					</div>
				)}

				{/* Discount */}
				{invoice.discount_amount > 0 && (
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Discount</span>
						<span className="text-success font-medium">
							-{formatCurrency(invoice.discount_amount || 0, { decimals: 2 })}
						</span>
					</div>
				)}

				<Separator />

				{/* Total */}
				<div className="flex justify-between">
					<span className="font-semibold">Total</span>
					<span className="text-lg font-bold">
						{formatCurrency(invoice.total_amount || 0, { decimals: 2 })}
					</span>
				</div>

				{/* Paid Amount */}
				{invoice.paid_amount > 0 && (
					<>
						<Separator />
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Paid</span>
							<span className="text-success font-medium">
								{formatCurrency(invoice.paid_amount || 0, { decimals: 2 })}
							</span>
						</div>
					</>
				)}

				{/* Balance Due */}
				{invoice.balance_amount > 0 && (
					<div className="flex justify-between">
						<span className="font-semibold">Balance Due</span>
						<span
							className={`text-lg font-bold ${invoice.status === "overdue" ? "text-destructive" : "text-primary"}`}
						>
							{formatCurrency(invoice.balance_amount || 0, { decimals: 2 })}
						</span>
					</div>
				)}

				{/* Paid in Full */}
				{invoice.balance_amount === 0 && invoice.paid_amount > 0 && (
					<div className="bg-success text-success dark:bg-success dark:text-success rounded-md p-3 text-center text-sm font-medium">
						Paid in Full
					</div>
				)}
			</div>
		</Card>
	);
}
