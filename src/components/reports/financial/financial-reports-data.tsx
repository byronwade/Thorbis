"use cache";

/**
 * Financial Reports Data - Async Server Component
 *
 * Displays financial reports content (Coming Soon variant).
 */

import { DollarSign, FileText, PieChart, TrendingUp } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";


export async function FinancialReportsData() {
	return (
		<ComingSoonShell
			description="Comprehensive financial reporting including P&L, balance sheets, cash flow, and profitability analysis"
			icon={DollarSign}
			title="Financial Reports"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<FileText className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">P&L Statements</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Generate detailed profit and loss statements by period, service line, or technician
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Cash Flow Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track cash inflows and outflows to maintain healthy working capital
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<PieChart className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Revenue Breakdown</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze revenue by service type, customer segment, and geographic area
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Profitability Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track gross margin, net profit, and ROI across all business operations
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Financial Clarity</h3>
					<p className="mb-6 text-muted-foreground">Understand your business finances at a glance</p>
					<div className="flex justify-center gap-4">
						<button
							className="rounded-lg border border-primary/20 bg-background px-6 py-2 font-medium transition-colors hover:bg-primary/5"
							type="button"
						>
							Learn More
						</button>
						<button
							className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							type="button"
						>
							Request Access
						</button>
					</div>
				</div>
			</div>
		</ComingSoonShell>
	);
}
