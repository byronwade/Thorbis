/**
 * Company Credit Badge
 * Shows customer's available credit with hover details
 */

"use client";

import { CreditCard } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type CompanyCreditBadgeProps = {
	customer: {
		credit_limit?: number | null;
		outstanding_balance?: number | null;
	};
};

export function CompanyCreditBadge({ customer }: CompanyCreditBadgeProps) {
	const creditLimit = customer.credit_limit || 0;
	const outstandingBalance = customer.outstanding_balance || 0;
	const availableCredit = creditLimit - outstandingBalance;

	if (creditLimit <= 0) {
		return null;
	}

	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);

	const hasAvailableCredit = availableCredit > 0;

	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<button
					className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
						hasAvailableCredit
							? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400"
							: "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
					}`}
				>
					<CreditCard className="size-4" />
					{hasAvailableCredit
						? `${formatCurrency(availableCredit)} Credit`
						: "Credit Limit Reached"}
				</button>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-80" side="bottom">
				<div className="space-y-3">
					<div>
						<h4 className="text-sm font-semibold">Customer Credit</h4>
						<p className="text-muted-foreground text-xs">
							Available credit for this customer
						</p>
					</div>

					<Separator />

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm">Credit Limit</span>
							<span className="text-sm font-semibold">
								{formatCurrency(creditLimit)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Outstanding Balance</span>
							<span className="text-sm font-medium text-amber-600 dark:text-amber-400">
								{formatCurrency(outstandingBalance)}
							</span>
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold">Available Credit</span>
							<span
								className={`text-base font-bold ${
									hasAvailableCredit
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{formatCurrency(availableCredit)}
							</span>
						</div>
					</div>

					{!hasAvailableCredit && (
						<>
							<Separator />
							<p className="text-muted-foreground text-xs">
								Customer has reached their credit limit. Payment required before
								additional work.
							</p>
						</>
					)}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
