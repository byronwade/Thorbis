/**
 * Finance Coming Soon Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - All static marketing content rendered on server
 * - Better SEO and initial page load
 */

import {
	AlertCircle,
	ArrowRightLeft,
	Banknote,
	BarChart3,
	Bell,
	Building2,
	Calculator,
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	Receipt,
	Shield,
	TrendingUp,
	Users,
	Wallet,
	Zap,
} from "lucide-react";

export function FinanceComingSoon() {
	return (
		<div className="relative space-y-10 py-8 md:py-12">
			{/* Background gradient blobs */}
			<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
				<div className="bg-primary/10 absolute top-1/4 left-1/4 size-96 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 size-96 rounded-full blur-3xl" />
			</div>

			{/* Main content */}
			<div className="mx-auto w-full max-w-5xl space-y-10 text-center">
				{/* Status badge */}
				<div className="flex justify-center">
					<div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-5 py-2 text-sm backdrop-blur-sm">
						<Clock className="mr-2 size-4" />
						<span className="font-medium">Coming Soon</span>
					</div>
				</div>

				{/* Icon with gradient background */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="from-primary/20 to-primary/10 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r blur-2xl" />
						<div className="border-primary/20 from-primary/10 to-primary/5 relative flex size-24 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-sm">
							<DollarSign className="text-primary size-12" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Main heading with gradient */}
				<div className="space-y-3">
					<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
						Complete{" "}
						<span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-extrabold text-transparent dark:from-emerald-400 dark:to-green-400">
							Financial Management
						</span>
					</h1>
					<p className="text-foreground/60 mx-auto max-w-3xl text-lg leading-relaxed">
						Manage your entire financial operation from a single, powerful platform. From banking
						and payments to accounting and payroll - everything integrated seamlessly into your
						workflow.
					</p>
				</div>

				{/* Core Finance Features */}
				<div className="mx-auto max-w-5xl space-y-8 pt-4">
					<div>
						<h2 className="mb-5 text-xl font-semibold">Complete Financial Control</h2>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							<div className="group border-primary/10 hover:border-success/20 rounded-xl border bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
										<Building2 className="text-success dark:text-success size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Banking & Payments</h3>
								<p className="text-muted-foreground text-sm">
									Connect multiple bank accounts, process payments, manage cash flow with
									intelligent virtual buckets
								</p>
							</div>

							<div className="group border-primary/10 hover:border-primary/20 rounded-xl border bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
										<Calculator className="text-primary dark:text-primary size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Bookkeeping & Accounting</h3>
								<p className="text-muted-foreground text-sm">
									Full chart of accounts, general ledger, AR/AP, automated reconciliation,
									QuickBooks sync
								</p>
							</div>

							<div className="group border-primary/10 hover:border-border/20 rounded-xl border bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<CreditCard className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Business Financing</h3>
								<p className="text-muted-foreground text-sm">
									Access loans, lines of credit, equipment financing with integrated approval
									workflows
								</p>
							</div>

							<div className="group border-primary/10 hover:border-warning/20 rounded-xl border bg-gradient-to-br from-orange-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
										<Users className="text-warning dark:text-warning size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Payroll Management</h3>
								<p className="text-muted-foreground text-sm">
									Complete payroll processing with automatic tax calculations, direct deposit,
									compliance reporting
								</p>
							</div>

							<div className="group border-primary/10 hover:border-border/20 rounded-xl border bg-gradient-to-br from-indigo-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<Receipt className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Invoicing & Estimates</h3>
								<p className="text-muted-foreground text-sm">
									Create professional invoices, track payment status, automate reminders, accept
									online payments
								</p>
							</div>

							<div className="group border-primary/10 rounded-xl border bg-gradient-to-br from-teal-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/20 hover:shadow-lg hover:shadow-teal-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-teal-500/10">
										<Banknote className="size-6 text-teal-600 dark:text-teal-400" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Expense Tracking</h3>
								<p className="text-muted-foreground text-sm">
									Track all expenses, categorize automatically, capture receipts with mobile app,
									generate reports
								</p>
							</div>

							<div className="group border-primary/10 hover:border-destructive/20 rounded-xl border bg-gradient-to-br from-red-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
										<Shield className="text-destructive dark:text-destructive size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Tax Compliance</h3>
								<p className="text-muted-foreground text-sm">
									Automated tax calculations, quarterly estimates, 1099 generation, sales tax
									management
								</p>
							</div>

							<div className="group border-primary/10 hover:border-warning/20 rounded-xl border bg-gradient-to-br from-yellow-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
										<Zap className="text-warning dark:text-warning size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Automated Workflows</h3>
								<p className="text-muted-foreground text-sm">
									Set up automated payment schedules, recurring invoices, expense approvals, smart
									financial alerts
								</p>
							</div>
						</div>
					</div>

					{/* Smart Financial Intelligence */}
					<div>
						<h2 className="mb-5 text-xl font-semibold">Intelligent Financial Monitoring</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<div className="border-success/20 rounded-xl border bg-gradient-to-br from-green-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-success/10 flex size-12 items-center justify-center rounded-lg">
										<Wallet className="text-success dark:text-success size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Cash Flow Alerts</h3>
										<p className="text-muted-foreground text-sm">Proactive cash management</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Your checking account will drop below $5,000 next Tuesday based on scheduled
									payments. Consider moving $10,000 from savings or delaying vendor payment
									#234.&quot;
								</p>
								<div className="text-success dark:text-success flex items-center gap-1 text-xs">
									<Bell className="size-3" />
									<span>Never run out of cash</span>
								</div>
							</div>

							<div className="border-warning/20 rounded-xl border bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-lg">
										<AlertCircle className="text-warning dark:text-warning size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Unusual Expenses</h3>
										<p className="text-muted-foreground text-sm">Catches spending anomalies</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Fuel expense for Truck #3 is 2.5x normal this week ($485 vs usual $195).
									Would you like to review transactions?&quot;
								</p>
								<div className="text-warning dark:text-warning flex items-center gap-1 text-xs">
									<Zap className="size-3" />
									<span>Fraud prevention</span>
								</div>
							</div>

							<div className="border-primary/20 rounded-xl border bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
										<ArrowRightLeft className="text-primary dark:text-primary size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Smart Transfers</h3>
										<p className="text-muted-foreground text-sm">Optimizes account balances</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Your savings is getting low. Transferring $13,450 from checking account. We
									noticed you had this to spare after reviewing bills and existing totals.&quot;
								</p>
								<div className="text-primary dark:text-primary flex items-center gap-1 text-xs">
									<CheckCircle2 className="size-3" />
									<span>Intelligent automation</span>
								</div>
							</div>

							<div className="border-border/20 rounded-xl border bg-gradient-to-br from-purple-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-lg">
										<Calendar className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Bill Reminders</h3>
										<p className="text-muted-foreground text-sm">Never miss a payment</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Insurance payment due in 3 days ($2,450). Rent due next week ($3,200).
									QuickBooks subscription renews tomorrow ($79). Total upcoming: $5,729.&quot;
								</p>
								<div className="text-accent-foreground dark:text-accent-foreground flex items-center gap-1 text-xs">
									<TrendingUp className="size-3" />
									<span>Stay on top of bills</span>
								</div>
							</div>
						</div>
					</div>

					{/* Powerful Integrations */}
					<div>
						<h2 className="mb-5 text-xl font-semibold">Seamless Integrations</h2>
						<div className="grid gap-5 sm:grid-cols-3">
							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<FileText className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">QuickBooks Sync</h3>
								<p className="text-muted-foreground text-sm">
									Two-way sync with QuickBooks Online and Desktop for seamless accounting
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<CreditCard className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Payment Processing</h3>
								<p className="text-muted-foreground text-sm">
									Accept credit cards, ACH, and digital payments with competitive rates
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<BarChart3 className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Financial Reports</h3>
								<p className="text-muted-foreground text-sm">
									Comprehensive P&L, balance sheet, cash flow, and custom financial analytics
								</p>
							</div>
						</div>
					</div>

					{/* Why This Matters */}
					<div className="border-primary/10 from-primary/5 rounded-2xl border bg-gradient-to-br to-transparent p-8">
						<div className="mb-6 flex justify-center">
							<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
								<DollarSign className="text-primary size-8" />
							</div>
						</div>
						<h2 className="mb-4 text-2xl font-semibold">Complete Financial Visibility</h2>
						<div className="text-muted-foreground mx-auto max-w-3xl space-y-3 text-left">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">All-In-One Platform:</span> Manage
									banking, accounting, payroll, and reporting from a single integrated system
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Real-Time Insights:</span> See your
									financial position instantly with live dashboards and automated reporting
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Intelligent Automation:</span>{" "}
									Automate invoicing, payments, reconciliation, and financial workflows to save time
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Proactive Monitoring:</span> Get
									alerted to cash flow issues, unusual expenses, and opportunities before they
									impact your business
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Seamless Integrations:</span>{" "}
									Connect with QuickBooks, banks, payment processors, and other financial tools you
									already use
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Call to action */}
				<div className="text-muted-foreground flex items-center justify-center gap-2 pt-4 text-sm">
					<TrendingUp className="size-4" />
					<p>In the meantime, explore the platform and reach out if you need help</p>
				</div>
			</div>
		</div>
	);
}
