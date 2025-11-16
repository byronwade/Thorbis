import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { BankAccountsOverview } from "@/components/finance/bank-accounts-overview";
import { VirtualBucketsOverview } from "@/components/finance/virtual-buckets-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Finance Data - Async Server Component
 *
 * Contains the main finance dashboard content.
 * Currently uses static values but is ready for Supabase queries.
 */
export async function FinanceData() {
	return (
		<>
			{/* Financial Overview Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Total Cash on Hand
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$243,250</div>
						<p className="flex items-center gap-1 text-muted-foreground text-xs">
							<TrendingUp className="h-3 w-3 text-success dark:text-success" />
							<span className="text-success dark:text-success">
								+5.8% from last month
							</span>
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Allocated in Buckets
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$166,000</div>
						<p className="text-muted-foreground text-xs">
							68% of total balance
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Unallocated Funds
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$76,750</div>
						<p className="text-muted-foreground text-xs">
							Available to allocate
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Monthly Burn</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$45,200</div>
						<p className="text-muted-foreground text-xs">
							Average monthly expenses
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Bank Accounts Split View */}
			<BankAccountsOverview />

			{/* Virtual Buckets Compact View */}
			<VirtualBucketsOverview />
		</>
	);
}
