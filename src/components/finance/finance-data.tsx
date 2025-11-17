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
						<CardTitle className="text-sm font-medium">Total Cash on Hand</CardTitle>
						<Wallet className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$243,250</div>
						<p className="text-muted-foreground flex items-center gap-1 text-xs">
							<TrendingUp className="text-success dark:text-success h-3 w-3" />
							<span className="text-success dark:text-success">+5.8% from last month</span>
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Allocated in Buckets</CardTitle>
						<DollarSign className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$166,000</div>
						<p className="text-muted-foreground text-xs">68% of total balance</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Unallocated Funds</CardTitle>
						<DollarSign className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$76,750</div>
						<p className="text-muted-foreground text-xs">Available to allocate</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Monthly Burn</CardTitle>
						<TrendingDown className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,200</div>
						<p className="text-muted-foreground text-xs">Average monthly expenses</p>
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
