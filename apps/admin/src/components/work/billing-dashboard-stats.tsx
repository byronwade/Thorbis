import { DollarSign, CreditCard, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { formatNumber } from "@/lib/formatters";

type BillingDashboardStatsProps = {
	stats: {
		total_mrr: number;
		active_count: number;
		trial_count: number;
		past_due_count: number;
		churned_this_month: number;
	};
};

/**
 * Billing Dashboard Stats
 * 
 * Displays key billing metrics.
 */
export function BillingDashboardStats({ stats }: BillingDashboardStatsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total MRR</CardTitle>
					<DollarSign className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatCurrency(stats.total_mrr, { decimals: 0 })}
					</div>
					<p className="text-muted-foreground text-xs">Monthly Recurring Revenue</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
					<CreditCard className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatNumber(stats.active_count)}
					</div>
					<p className="text-muted-foreground text-xs">Currently active</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Trial Subscriptions</CardTitle>
					<Clock className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatNumber(stats.trial_count)}
					</div>
					<p className="text-muted-foreground text-xs">In trial period</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Past Due</CardTitle>
					<AlertTriangle className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatNumber(stats.past_due_count)}
					</div>
					<p className="text-muted-foreground text-xs">Payment failed</p>
				</CardContent>
			</Card>
		</div>
	);
}



