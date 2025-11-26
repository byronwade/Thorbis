import { CreditCard, DollarSign, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

/**
 * Finance Dashboard
 */
export default function FinancePage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Finance</h1>
				<p className="text-muted-foreground">
					Revenue, billing, and financial management
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4 mb-8">
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Total MRR</p>
					<p className="text-2xl font-bold">$--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">ARR</p>
					<p className="text-2xl font-bold">$--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Revenue Growth</p>
					<p className="text-2xl font-bold">+--% MoM</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Avg Revenue/Company</p>
					<p className="text-2xl font-bold">$--</p>
				</div>
			</div>

			{/* Sections */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Link
					href="/dashboard/finance/revenue"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
						<TrendingUp className="size-5 text-green-500" />
					</div>
					<div>
						<h3 className="font-medium">Revenue</h3>
						<p className="text-sm text-muted-foreground">
							Revenue analytics and trends
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/finance/invoices"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
						<FileText className="size-5 text-blue-500" />
					</div>
					<div>
						<h3 className="font-medium">Invoices</h3>
						<p className="text-sm text-muted-foreground">
							View and manage invoices
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/finance/subscriptions"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
						<CreditCard className="size-5 text-purple-500" />
					</div>
					<div>
						<h3 className="font-medium">Subscriptions</h3>
						<p className="text-sm text-muted-foreground">
							Subscription management
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/finance/payments"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
						<DollarSign className="size-5 text-orange-500" />
					</div>
					<div>
						<h3 className="font-medium">Payments</h3>
						<p className="text-sm text-muted-foreground">
							Payment history and processing
						</p>
					</div>
				</Link>
			</div>

			{/* Charts Placeholder */}
			<div className="grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">Revenue Over Time</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Chart coming soon</p>
					</div>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">Revenue by Plan</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Chart coming soon</p>
					</div>
				</div>
			</div>
		</div>
	);
}
