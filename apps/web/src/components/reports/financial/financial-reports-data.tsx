/**
 * Financial Reports Data - Async Server Component
 *
 * Displays comprehensive financial reporting including P&L,
 * AR aging, cash flow, and profitability analysis.
 */

import {
	AlertTriangle,
	CheckCircle,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { ExportButton } from "@/components/reports/export-button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	type FinancialReportData,
	getFinancialReport,
} from "@/lib/queries/analytics";

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

function formatMonth(monthStr: string): string {
	const date = new Date(monthStr + "-01");
	return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export async function FinancialReportsData() {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">
					Please select a company to view reports
				</p>
			</div>
		);
	}

	const data = await getFinancialReport(companyId, 365);

	return (
		<div className="space-y-6">
			{/* Header with Export */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Financial Reports
					</h2>
					<p className="text-muted-foreground">
						P&L, AR aging, and cash flow analysis
					</p>
				</div>
				<ExportButton reportType="financial" days={365} />
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<SummaryCard
					title="Total Revenue"
					value={formatCurrency(data.summary.totalRevenue)}
					icon={<DollarSign className="size-4 text-green-500" />}
					trend="positive"
				/>
				<SummaryCard
					title="Gross Profit"
					value={formatCurrency(data.summary.grossProfit)}
					subtitle={`${formatPercent(data.summary.grossMargin)} margin`}
					icon={<TrendingUp className="size-4 text-blue-500" />}
					trend={data.summary.grossMargin >= 30 ? "positive" : "neutral"}
				/>
				<SummaryCard
					title="Outstanding AR"
					value={formatCurrency(data.summary.outstandingAR)}
					subtitle={`${formatCurrency(data.summary.overdueAR)} overdue`}
					icon={<AlertTriangle className="size-4 text-orange-500" />}
					trend={data.summary.overdueAR > 0 ? "negative" : "positive"}
				/>
				<SummaryCard
					title="Total Cost"
					value={formatCurrency(data.summary.totalCost)}
					icon={<TrendingDown className="size-4 text-red-500" />}
					trend="neutral"
				/>
			</div>

			{/* AR Aging */}
			<Card>
				<CardHeader>
					<CardTitle>Accounts Receivable Aging</CardTitle>
					<CardDescription>
						Outstanding invoices by aging bucket
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-5">
						<AgingBucket
							label="Current"
							count={data.arAging.current.count}
							amount={data.arAging.current.amount}
							total={data.summary.outstandingAR}
							color="bg-green-500"
						/>
						<AgingBucket
							label="1-30 Days"
							count={data.arAging.days1_30.count}
							amount={data.arAging.days1_30.amount}
							total={data.summary.outstandingAR}
							color="bg-yellow-500"
						/>
						<AgingBucket
							label="31-60 Days"
							count={data.arAging.days31_60.count}
							amount={data.arAging.days31_60.amount}
							total={data.summary.outstandingAR}
							color="bg-orange-500"
						/>
						<AgingBucket
							label="61-90 Days"
							count={data.arAging.days61_90.count}
							amount={data.arAging.days61_90.amount}
							total={data.summary.outstandingAR}
							color="bg-red-400"
						/>
						<AgingBucket
							label="Over 90 Days"
							count={data.arAging.over90.count}
							amount={data.arAging.over90.amount}
							total={data.summary.outstandingAR}
							color="bg-red-600"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Monthly P&L */}
			<Card>
				<CardHeader>
					<CardTitle>Monthly Profit & Loss</CardTitle>
					<CardDescription>Revenue, costs, and profit by month</CardDescription>
				</CardHeader>
				<CardContent>
					{data.monthlyPL.length === 0 ? (
						<p className="text-muted-foreground py-8 text-center">
							No data available for this period
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Month</TableHead>
									<TableHead className="text-right">Revenue</TableHead>
									<TableHead className="text-right">Cost</TableHead>
									<TableHead className="text-right">Profit</TableHead>
									<TableHead className="text-right">Margin</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.monthlyPL.slice(-12).map((month) => (
									<TableRow key={month.month}>
										<TableCell className="font-medium">
											{formatMonth(month.month)}
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(month.revenue)}
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(month.cost)}
										</TableCell>
										<TableCell className="text-right">
											<span
												className={
													month.profit >= 0 ? "text-green-600" : "text-red-600"
												}
											>
												{formatCurrency(month.profit)}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<Badge
												variant={
													month.margin >= 30
														? "default"
														: month.margin >= 15
															? "secondary"
															: "destructive"
												}
											>
												{formatPercent(month.margin)}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Cash Flow */}
			<Card>
				<CardHeader>
					<CardTitle>Cash Flow Summary</CardTitle>
					<CardDescription>Monthly cash inflows and outflows</CardDescription>
				</CardHeader>
				<CardContent>
					{data.cashFlow.length === 0 ? (
						<p className="text-muted-foreground py-8 text-center">
							No cash flow data available
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Month</TableHead>
									<TableHead className="text-right">Inflows</TableHead>
									<TableHead className="text-right">Outflows</TableHead>
									<TableHead className="text-right">Net</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.cashFlow.slice(-12).map((month) => (
									<TableRow key={month.month}>
										<TableCell className="font-medium">
											{formatMonth(month.month)}
										</TableCell>
										<TableCell className="text-right text-green-600">
											{formatCurrency(month.inflows)}
										</TableCell>
										<TableCell className="text-right text-red-600">
											{formatCurrency(month.outflows)}
										</TableCell>
										<TableCell className="text-right">
											<span
												className={
													month.net >= 0
														? "text-green-600 font-medium"
														: "text-red-600 font-medium"
												}
											>
												{formatCurrency(month.net)}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function SummaryCard({
	title,
	value,
	subtitle,
	icon,
	trend,
}: {
	title: string;
	value: string;
	subtitle?: string;
	icon: React.ReactNode;
	trend: "positive" | "negative" | "neutral";
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && (
					<p
						className={`text-xs ${
							trend === "positive"
								? "text-green-600"
								: trend === "negative"
									? "text-red-600"
									: "text-muted-foreground"
						}`}
					>
						{subtitle}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

function AgingBucket({
	label,
	count,
	amount,
	total,
	color,
}: {
	label: string;
	count: number;
	amount: number;
	total: number;
	color: string;
}) {
	const percentage = total > 0 ? (amount / total) * 100 : 0;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">{label}</span>
				<Badge variant="outline">{count}</Badge>
			</div>
			<div className="text-lg font-bold">{formatCurrency(amount)}</div>
			<Progress value={percentage} className={`h-2 [&>div]:${color}`} />
			<p className="text-muted-foreground text-xs">
				{formatPercent(percentage)} of total
			</p>
		</div>
	);
}
