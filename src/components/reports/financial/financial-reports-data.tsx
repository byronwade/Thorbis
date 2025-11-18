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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<FileText className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">P&L Statements</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Generate detailed profit and loss statements by period, service
							line, or technician
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<TrendingUp className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Cash Flow Analysis</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track cash inflows and outflows to maintain healthy working
							capital
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<PieChart className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Revenue Breakdown</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Analyze revenue by service type, customer segment, and geographic
							area
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<DollarSign className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Profitability Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track gross margin, net profit, and ROI across all business
							operations
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Financial Clarity</h3>
					<p className="text-muted-foreground mb-6">
						Understand your business finances at a glance
					</p>
					<div className="flex justify-center gap-4">
						<button
							className="border-primary/20 bg-background hover:bg-primary/5 rounded-lg border px-6 py-2 font-medium transition-colors"
							type="button"
						>
							Learn More
						</button>
						<button
							className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors"
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
