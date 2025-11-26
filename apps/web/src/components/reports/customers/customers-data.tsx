/**
 * Customer Analytics Report - Async Server Component
 *
 * Displays comprehensive customer analytics including retention,
 * segmentation, lifetime value, and acquisition trends.
 */

import {
	AlertTriangle,
	DollarSign,
	Shield,
	TrendingUp,
	UserMinus,
	UserPlus,
	Users,
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
import { getCustomerAnalytics } from "@/lib/queries/analytics";

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

function formatDate(dateStr: string | null): string {
	if (!dateStr) return "Never";
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export async function CustomersData() {
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

	const data = await getCustomerAnalytics(companyId, 365);

	return (
		<div className="space-y-6">
			{/* Header with Export */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Customer Analytics
					</h2>
					<p className="text-muted-foreground">
						Retention, segmentation, and lifetime value analysis
					</p>
				</div>
				<ExportButton reportType="customers" days={365} />
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<SummaryCard
					title="Total Customers"
					value={data.summary.totalCustomers.toString()}
					subtitle={`${data.summary.repeatCustomers} repeat`}
					icon={<Users className="size-4 text-blue-500" />}
				/>
				<SummaryCard
					title="New Customers"
					value={data.summary.newCustomers.toString()}
					subtitle="Last 30 days"
					icon={<UserPlus className="size-4 text-green-500" />}
					trend="positive"
				/>
				<SummaryCard
					title="Retention Rate"
					value={formatPercent(data.summary.retentionRate)}
					subtitle={`${data.summary.churnedCustomers} churned`}
					icon={<Shield className="size-4 text-emerald-500" />}
					trend={
						data.summary.retentionRate >= 90
							? "positive"
							: data.summary.retentionRate >= 80
								? "neutral"
								: "negative"
					}
				/>
				<SummaryCard
					title="Avg Lifetime Value"
					value={formatCurrency(data.summary.avgLifetimeValue)}
					icon={<DollarSign className="size-4 text-purple-500" />}
				/>
			</div>

			{/* Churn Risk Distribution */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="size-5" />
						Churn Risk Distribution
					</CardTitle>
					<CardDescription>Customer health by risk level</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-3">
						<RiskCard
							label="Low Risk"
							count={data.riskDistribution.low}
							total={data.summary.totalCustomers}
							color="bg-green-500"
							description="Healthy customers with regular engagement"
						/>
						<RiskCard
							label="Medium Risk"
							count={data.riskDistribution.medium}
							total={data.summary.totalCustomers}
							color="bg-yellow-500"
							description="Customers showing some disengagement"
						/>
						<RiskCard
							label="High Risk"
							count={data.riskDistribution.high}
							total={data.summary.totalCustomers}
							color="bg-red-500"
							description="Customers at risk of churning"
						/>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* By Segment */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue by Segment</CardTitle>
						<CardDescription>Customer type breakdown</CardDescription>
					</CardHeader>
					<CardContent>
						{data.bySegment.length === 0 ? (
							<p className="text-muted-foreground py-8 text-center">
								No segment data available
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Segment</TableHead>
										<TableHead className="text-right">Customers</TableHead>
										<TableHead className="text-right">Revenue</TableHead>
										<TableHead className="text-right">Avg Ticket</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.bySegment.map((segment) => (
										<TableRow key={segment.segment}>
											<TableCell className="font-medium capitalize">
												{segment.segment}
											</TableCell>
											<TableCell className="text-right">
												{segment.count}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(segment.revenue)}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(segment.avgTicket)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Acquisition Trends */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="size-5" />
							Acquisition Trends
						</CardTitle>
						<CardDescription>New customers by month</CardDescription>
					</CardHeader>
					<CardContent>
						{data.acquisitionTrend.length === 0 ? (
							<p className="text-muted-foreground py-8 text-center">
								No trend data available
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Month</TableHead>
										<TableHead className="text-right">New</TableHead>
										<TableHead className="text-right">Churned</TableHead>
										<TableHead className="text-right">Net</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.acquisitionTrend.slice(-12).map((month) => (
										<TableRow key={month.month}>
											<TableCell className="font-medium">
												{formatMonth(month.month)}
											</TableCell>
											<TableCell className="text-right text-green-600">
												+{month.newCustomers}
											</TableCell>
											<TableCell className="text-right text-red-600">
												-{month.churned}
											</TableCell>
											<TableCell className="text-right">
												<span
													className={
														month.net >= 0
															? "text-green-600 font-medium"
															: "text-red-600 font-medium"
													}
												>
													{month.net >= 0 ? "+" : ""}
													{month.net}
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

			{/* Top Customers */}
			<Card>
				<CardHeader>
					<CardTitle>Top Customers by Revenue</CardTitle>
					<CardDescription>
						Your most valuable customers this year
					</CardDescription>
				</CardHeader>
				<CardContent>
					{data.topCustomers.length === 0 ? (
						<p className="text-muted-foreground py-8 text-center">
							No customer data available
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead className="text-right">Revenue</TableHead>
									<TableHead className="text-right">Jobs</TableHead>
									<TableHead className="text-right">Lifetime Value</TableHead>
									<TableHead className="text-right">Last Service</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.topCustomers.map((customer, index) => (
									<TableRow key={customer.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												{index < 3 && (
													<Badge
														variant={index === 0 ? "default" : "secondary"}
														className="text-xs"
													>
														#{index + 1}
													</Badge>
												)}
												<span className="font-medium">{customer.name}</span>
											</div>
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(customer.totalRevenue)}
										</TableCell>
										<TableCell className="text-right">
											{customer.jobCount}
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(customer.lifetimeValue)}
										</TableCell>
										<TableCell className="text-right text-muted-foreground">
											{formatDate(customer.lastServiceDate)}
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
	trend?: "positive" | "negative" | "neutral";
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

function RiskCard({
	label,
	count,
	total,
	color,
	description,
}: {
	label: string;
	count: number;
	total: number;
	color: string;
	description: string;
}) {
	const percentage = total > 0 ? (count / total) * 100 : 0;

	return (
		<div className="space-y-3 p-4 rounded-lg border bg-card/50">
			<div className="flex items-center justify-between">
				<span className="font-medium">{label}</span>
				<Badge variant="outline">{count}</Badge>
			</div>
			<Progress value={percentage} className={`h-2 [&>div]:${color}`} />
			<p className="text-muted-foreground text-xs">{description}</p>
			<p className="text-sm font-semibold">
				{formatPercent(percentage)} of customers
			</p>
		</div>
	);
}
