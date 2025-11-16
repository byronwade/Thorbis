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
			<div className="-z-10 pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
			</div>

			{/* Main content */}
			<div className="mx-auto w-full max-w-5xl space-y-10 text-center">
				{/* Status badge */}
				<div className="flex justify-center">
					<div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm backdrop-blur-sm">
						<Clock className="mr-2 size-4" />
						<span className="font-medium">Coming Soon</span>
					</div>
				</div>

				{/* Icon with gradient background */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
						<div className="relative flex size-24 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
							<DollarSign className="size-12 text-primary" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Main heading with gradient */}
				<div className="space-y-3">
					<h1 className="font-bold text-4xl tracking-tight md:text-5xl">
						Complete{" "}
						<span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-extrabold text-transparent dark:from-emerald-400 dark:to-green-400">
							Financial Management
						</span>
					</h1>
					<p className="mx-auto max-w-3xl text-foreground/60 text-lg leading-relaxed">
						Manage your entire financial operation from a single, powerful platform. From banking and payments to
						accounting and payroll - everything integrated seamlessly into your workflow.
					</p>
				</div>

				{/* Core Finance Features */}
				<div className="mx-auto max-w-5xl space-y-8 pt-4">
					<div>
						<h2 className="mb-5 font-semibold text-xl">Complete Financial Control</h2>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-success/20 hover:shadow-green-500/10 hover:shadow-lg">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-success/10">
										<Building2 className="size-6 text-success dark:text-success" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Banking & Payments</h3>
								<p className="text-muted-foreground text-sm">
									Connect multiple bank accounts, process payments, manage cash flow with intelligent virtual buckets
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-primary/20 hover:shadow-blue-500/10 hover:shadow-lg">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
										<Calculator className="size-6 text-primary dark:text-primary" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Bookkeeping & Accounting</h3>
								<p className="text-muted-foreground text-sm">
									Full chart of accounts, general ledger, AR/AP, automated reconciliation, QuickBooks sync
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-border/20 hover:shadow-lg hover:shadow-purple-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
										<CreditCard className="size-6 text-accent-foreground dark:text-accent-foreground" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Business Financing</h3>
								<p className="text-muted-foreground text-sm">
									Access loans, lines of credit, equipment financing with integrated approval workflows
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-orange-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-orange-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
										<Users className="size-6 text-warning dark:text-warning" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Payroll Management</h3>
								<p className="text-muted-foreground text-sm">
									Complete payroll processing with automatic tax calculations, direct deposit, compliance reporting
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-indigo-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-border/20 hover:shadow-indigo-500/10 hover:shadow-lg">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
										<Receipt className="size-6 text-accent-foreground dark:text-accent-foreground" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Invoicing & Estimates</h3>
								<p className="text-muted-foreground text-sm">
									Create professional invoices, track payment status, automate reminders, accept online payments
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-teal-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-teal-500/20 hover:shadow-lg hover:shadow-teal-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-teal-500/10">
										<Banknote className="size-6 text-teal-600 dark:text-teal-400" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Expense Tracking</h3>
								<p className="text-muted-foreground text-sm">
									Track all expenses, categorize automatically, capture receipts with mobile app, generate reports
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-red-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-destructive/20 hover:shadow-lg hover:shadow-red-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
										<Shield className="size-6 text-destructive dark:text-destructive" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Tax Compliance</h3>
								<p className="text-muted-foreground text-sm">
									Automated tax calculations, quarterly estimates, 1099 generation, sales tax management
								</p>
							</div>

							<div className="group hover:-translate-y-1 rounded-xl border border-primary/10 bg-gradient-to-br from-yellow-500/5 to-transparent p-5 text-left transition-all duration-300 hover:border-warning/20 hover:shadow-lg hover:shadow-yellow-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
										<Zap className="size-6 text-warning dark:text-warning" />
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-base">Automated Workflows</h3>
								<p className="text-muted-foreground text-sm">
									Set up automated payment schedules, recurring invoices, expense approvals, smart financial alerts
								</p>
							</div>
						</div>
					</div>

					{/* Smart Financial Intelligence */}
					<div>
						<h2 className="mb-5 font-semibold text-xl">Intelligent Financial Monitoring</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<div className="rounded-xl border border-success/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-12 items-center justify-center rounded-lg bg-success/10">
										<Wallet className="size-6 text-success dark:text-success" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Cash Flow Alerts</h3>
										<p className="text-muted-foreground text-sm">Proactive cash management</p>
									</div>
								</div>
								<p className="mb-3 text-muted-foreground text-sm">
									&quot;Your checking account will drop below $5,000 next Tuesday based on scheduled payments. Consider
									moving $10,000 from savings or delaying vendor payment #234.&quot;
								</p>
								<div className="flex items-center gap-1 text-success text-xs dark:text-success">
									<Bell className="size-3" />
									<span>Never run out of cash</span>
								</div>
							</div>

							<div className="rounded-xl border border-warning/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-12 items-center justify-center rounded-lg bg-warning/10">
										<AlertCircle className="size-6 text-warning dark:text-warning" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Unusual Expenses</h3>
										<p className="text-muted-foreground text-sm">Catches spending anomalies</p>
									</div>
								</div>
								<p className="mb-3 text-muted-foreground text-sm">
									&quot;Fuel expense for Truck #3 is 2.5x normal this week ($485 vs usual $195). Would you like to
									review transactions?&quot;
								</p>
								<div className="flex items-center gap-1 text-warning text-xs dark:text-warning">
									<Zap className="size-3" />
									<span>Fraud prevention</span>
								</div>
							</div>

							<div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
										<ArrowRightLeft className="size-6 text-primary dark:text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Smart Transfers</h3>
										<p className="text-muted-foreground text-sm">Optimizes account balances</p>
									</div>
								</div>
								<p className="mb-3 text-muted-foreground text-sm">
									&quot;Your savings is getting low. Transferring $13,450 from checking account. We noticed you had this
									to spare after reviewing bills and existing totals.&quot;
								</p>
								<div className="flex items-center gap-1 text-primary text-xs dark:text-primary">
									<CheckCircle2 className="size-3" />
									<span>Intelligent automation</span>
								</div>
							</div>

							<div className="rounded-xl border border-border/20 bg-gradient-to-br from-purple-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-12 items-center justify-center rounded-lg bg-accent/10">
										<Calendar className="size-6 text-accent-foreground dark:text-accent-foreground" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Bill Reminders</h3>
										<p className="text-muted-foreground text-sm">Never miss a payment</p>
									</div>
								</div>
								<p className="mb-3 text-muted-foreground text-sm">
									&quot;Insurance payment due in 3 days ($2,450). Rent due next week ($3,200). QuickBooks subscription
									renews tomorrow ($79). Total upcoming: $5,729.&quot;
								</p>
								<div className="flex items-center gap-1 text-accent-foreground text-xs dark:text-accent-foreground">
									<TrendingUp className="size-3" />
									<span>Stay on top of bills</span>
								</div>
							</div>
						</div>
					</div>

					{/* Powerful Integrations */}
					<div>
						<h2 className="mb-5 font-semibold text-xl">Seamless Integrations</h2>
						<div className="grid gap-5 sm:grid-cols-3">
							<div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
								<div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<FileText className="size-5 text-primary" />
								</div>
								<h3 className="mb-2 font-semibold">QuickBooks Sync</h3>
								<p className="text-muted-foreground text-sm">
									Two-way sync with QuickBooks Online and Desktop for seamless accounting
								</p>
							</div>

							<div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
								<div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<CreditCard className="size-5 text-primary" />
								</div>
								<h3 className="mb-2 font-semibold">Payment Processing</h3>
								<p className="text-muted-foreground text-sm">
									Accept credit cards, ACH, and digital payments with competitive rates
								</p>
							</div>

							<div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 text-left">
								<div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
									<BarChart3 className="size-5 text-primary" />
								</div>
								<h3 className="mb-2 font-semibold">Financial Reports</h3>
								<p className="text-muted-foreground text-sm">
									Comprehensive P&L, balance sheet, cash flow, and custom financial analytics
								</p>
							</div>
						</div>
					</div>

					{/* Why This Matters */}
					<div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-8">
						<div className="mb-6 flex justify-center">
							<div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
								<DollarSign className="size-8 text-primary" />
							</div>
						</div>
						<h2 className="mb-4 font-semibold text-2xl">Complete Financial Visibility</h2>
						<div className="mx-auto max-w-3xl space-y-3 text-left text-muted-foreground">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
								<p className="text-sm">
									<span className="font-medium text-foreground">All-In-One Platform:</span> Manage banking, accounting,
									payroll, and reporting from a single integrated system
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
								<p className="text-sm">
									<span className="font-medium text-foreground">Real-Time Insights:</span> See your financial position
									instantly with live dashboards and automated reporting
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
								<p className="text-sm">
									<span className="font-medium text-foreground">Intelligent Automation:</span> Automate invoicing,
									payments, reconciliation, and financial workflows to save time
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
								<p className="text-sm">
									<span className="font-medium text-foreground">Proactive Monitoring:</span> Get alerted to cash flow
									issues, unusual expenses, and opportunities before they impact your business
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
								<p className="text-sm">
									<span className="font-medium text-foreground">Seamless Integrations:</span> Connect with QuickBooks,
									banks, payment processors, and other financial tools you already use
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Call to action */}
				<div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground text-sm">
					<TrendingUp className="size-4" />
					<p>In the meantime, explore the platform and reach out if you need help</p>
				</div>
			</div>
		</div>
	);
}
