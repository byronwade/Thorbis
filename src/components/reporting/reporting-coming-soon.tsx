/**
 * Reporting Coming Soon Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - All static marketing content rendered on server
 * - Better SEO and initial page load
 */

import {
	Activity,
	AlertCircle,
	BarChart3,
	Bell,
	Brain,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	Download,
	FileText,
	Filter,
	LineChart,
	PieChart,
	Settings,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";

export function ReportingComingSoon() {
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
							<BarChart3 className="text-primary size-12" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Main heading with gradient */}
				<div className="space-y-3">
					<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
						Business Intelligence with{" "}
						<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text font-extrabold text-transparent dark:from-purple-400 dark:to-blue-400">
							Advanced Analytics
						</span>
					</h1>
					<p className="text-foreground/60 mx-auto max-w-3xl text-lg leading-relaxed">
						Transform raw data into actionable insights with our powerful reporting suite. Real-time
						dashboards, custom reports, and AI-powered analytics to drive data-informed decisions
						across your entire operation.
					</p>
				</div>

				{/* Core Reporting Features */}
				<div className="mx-auto max-w-5xl space-y-8 pt-4">
					<div>
						<h2 className="mb-5 text-xl font-semibold">Comprehensive Analytics Platform</h2>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							<div className="group border-primary/10 hover:border-primary/20 rounded-xl border bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
										<TrendingUp className="text-primary dark:text-primary size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Real-Time Dashboards</h3>
								<p className="text-muted-foreground text-sm">
									Live KPIs, performance metrics, and business intelligence updated in real-time
									with customizable widgets
								</p>
							</div>

							<div className="group border-primary/10 hover:border-success/20 rounded-xl border bg-gradient-to-br from-green-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
										<FileText className="text-success dark:text-success size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Custom Report Builder</h3>
								<p className="text-muted-foreground text-sm">
									Build unlimited custom reports with advanced filters, grouping, pivot tables, and
									scheduled delivery
								</p>
							</div>

							<div className="group border-primary/10 hover:border-border/20 rounded-xl border bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<Brain className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">AI-Powered Insights</h3>
								<p className="text-muted-foreground text-sm">
									Get intelligent recommendations, anomaly detection, predictive analytics, and
									natural language queries
								</p>
							</div>

							<div className="group border-primary/10 hover:border-warning/20 rounded-xl border bg-gradient-to-br from-orange-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
										<LineChart className="text-warning dark:text-warning size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Data Visualization</h3>
								<p className="text-muted-foreground text-sm">
									Interactive charts, graphs, heat maps, and visual dashboards with drill-down
									capabilities
								</p>
							</div>

							<div className="group border-primary/10 hover:border-border/20 rounded-xl border bg-gradient-to-br from-indigo-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<Activity className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Performance Analytics</h3>
								<p className="text-muted-foreground text-sm">
									Track team performance, technician productivity, job completion rates, customer
									satisfaction scores
								</p>
							</div>

							<div className="group border-primary/10 rounded-xl border bg-gradient-to-br from-teal-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/20 hover:shadow-lg hover:shadow-teal-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-teal-500/10">
										<DollarSign className="size-6 text-teal-600 dark:text-teal-400" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Financial Reports</h3>
								<p className="text-muted-foreground text-sm">
									Comprehensive P&L, balance sheets, cash flow analysis, revenue forecasting,
									profitability tracking
								</p>
							</div>

							<div className="group border-primary/10 rounded-xl border bg-gradient-to-br from-cyan-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10">
								<div className="mb-4 flex justify-center">
									<div className="flex size-12 items-center justify-center rounded-full bg-cyan-500/10">
										<Users className="size-6 text-cyan-600 dark:text-cyan-400" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Customer Analytics</h3>
								<p className="text-muted-foreground text-sm">
									Analyze acquisition costs, lifetime value, retention rates, churn analysis, cohort
									performance
								</p>
							</div>

							<div className="group border-primary/10 hover:border-border/20 rounded-xl border bg-gradient-to-br from-pink-500/5 to-transparent p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<Calendar className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-base font-semibold">Operations Reporting</h3>
								<p className="text-muted-foreground text-sm">
									Schedule efficiency, dispatch performance, job duration analysis, capacity
									planning metrics
								</p>
							</div>
						</div>
					</div>

					{/* Smart Analytics Intelligence */}
					<div>
						<h2 className="mb-5 text-xl font-semibold">Intelligent Data Insights</h2>
						<div className="grid gap-5 sm:grid-cols-2">
							<div className="border-border/20 rounded-xl border bg-gradient-to-br from-purple-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-lg">
										<Target className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Goal Tracking</h3>
										<p className="text-muted-foreground text-sm">Set and monitor targets</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;You're 87% toward your monthly revenue goal of $50,000 with 5 days left.
									Based on current pace, you'll finish at $48,200. Consider pushing 2 pending quotes
									to close the gap.&quot;
								</p>
								<div className="text-accent-foreground dark:text-accent-foreground flex items-center gap-1 text-xs">
									<Target className="size-3" />
									<span>Stay on track</span>
								</div>
							</div>

							<div className="border-warning/20 rounded-xl border bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-lg">
										<AlertCircle className="text-warning dark:text-warning size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Anomaly Detection</h3>
										<p className="text-muted-foreground text-sm">Catches unusual patterns</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Tech #5 has completed 12 jobs today vs usual average of 6. Job quality may
									be compromised. Running quality check on recent completions.&quot;
								</p>
								<div className="text-warning dark:text-warning flex items-center gap-1 text-xs">
									<Zap className="size-3" />
									<span>Quality assurance</span>
								</div>
							</div>

							<div className="border-primary/20 rounded-xl border bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
										<TrendingUp className="text-primary dark:text-primary size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Trend Analysis</h3>
										<p className="text-muted-foreground text-sm">Identifies patterns</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;HVAC calls up 40% this week compared to last month. Weather forecast shows
									heat wave continuing. Consider running targeted campaign for AC tune-ups.&quot;
								</p>
								<div className="text-primary dark:text-primary flex items-center gap-1 text-xs">
									<CheckCircle2 className="size-3" />
									<span>Predictive insights</span>
								</div>
							</div>

							<div className="border-success/20 rounded-xl border bg-gradient-to-br from-green-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-success/10 flex size-12 items-center justify-center rounded-lg">
										<Bell className="text-success dark:text-success size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Smart Alerts</h3>
										<p className="text-muted-foreground text-sm">Proactive notifications</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									&quot;Customer satisfaction score dropped from 4.8 to 4.2 stars this month.
									Reviewing recent reviews shows 3 mentions of 'late arrival'. Addressing dispatch
									timing.&quot;
								</p>
								<div className="text-success dark:text-success flex items-center gap-1 text-xs">
									<TrendingUp className="size-3" />
									<span>Stay ahead of issues</span>
								</div>
							</div>
						</div>
					</div>

					{/* Advanced Features */}
					<div>
						<h2 className="mb-5 text-xl font-semibold">Enterprise Reporting Tools</h2>
						<div className="grid gap-5 sm:grid-cols-3">
							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Filter className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Advanced Filtering</h3>
								<p className="text-muted-foreground text-sm">
									Filter by date ranges, technicians, services, locations, and custom criteria
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Download className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Export & Share</h3>
								<p className="text-muted-foreground text-sm">
									Export to PDF, Excel, CSV with scheduled delivery via email or Slack
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Settings className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Custom Dashboards</h3>
								<p className="text-muted-foreground text-sm">
									Build role-specific dashboards with drag-and-drop widgets and saved views
								</p>
							</div>
						</div>
					</div>

					{/* Why This Matters */}
					<div className="border-primary/10 from-primary/5 rounded-2xl border bg-gradient-to-br to-transparent p-8">
						<div className="mb-6 flex justify-center">
							<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
								<BarChart3 className="text-primary size-8" />
							</div>
						</div>
						<h2 className="mb-4 text-2xl font-semibold">Data-Driven Decision Making</h2>
						<div className="text-muted-foreground mx-auto max-w-3xl space-y-3 text-left">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Real-Time Visibility:</span> See
									what's happening in your business right now with live dashboards and instant
									updates
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Custom Reports:</span> Build exactly
									the reports you need with advanced filtering, grouping, and scheduling
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">AI-Powered Insights:</span> Get
									intelligent recommendations and anomaly detection to catch issues before they
									impact your business
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Predictive Analytics:</span>{" "}
									Forecast revenue, identify trends, and make proactive decisions based on
									historical data
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Executive Summaries:</span>{" "}
									High-level dashboards and board-ready reports with one-click export to
									presentations
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Call to action */}
				<div className="text-muted-foreground flex items-center justify-center gap-2 pt-4 text-sm">
					<PieChart className="size-4" />
					<p>In the meantime, explore the platform and reach out if you need help</p>
				</div>
			</div>
		</div>
	);
}
