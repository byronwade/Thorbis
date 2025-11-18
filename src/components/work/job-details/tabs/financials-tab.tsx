/**
 * Financials Tab - Complete Financial Overview
 *
 * Features:
 * - Invoices list with status
 * - Estimates management
 * - Payment tracking
 * - Profitability analysis
 * - Deposit tracking
 *
 * Performance:
 * - Client Component for interactivity
 * - Optimistic UI updates
 */

"use client";

import {
	CreditCard,
	DollarSign,
	Download,
	Eye,
	FileText,
	PieChart,
	Plus,
	Receipt,
	Send,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type FinancialsTabProps = {
	job: any;
	invoices: any[];
	estimates: any[];
	metrics: any;
	isEditMode: boolean;
};

export function FinancialsTab({
	job,
	invoices,
	estimates,
	metrics,
	isEditMode,
}: FinancialsTabProps) {
	// Calculate totals
	const totalInvoiced = invoices.reduce(
		(sum, inv) => sum + (inv.total_amount || 0),
		0,
	);
	const totalPaid = invoices.reduce(
		(sum, inv) => sum + (inv.paid_amount || 0),
		0,
	);
	const totalOutstanding = totalInvoiced - totalPaid;

	// Get invoice status badge color
	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "paid":
				return "default";
			case "sent":
				return "secondary";
			case "overdue":
				return "destructive";
			case "draft":
				return "outline";
			default:
				return "secondary";
		}
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			{/* Financial Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-xs">Job Value</p>
								<p className="text-2xl font-bold">
									{formatCurrency(job.financial?.total_amount || 0, {
										decimals: 2,
									})}
								</p>
							</div>
							<DollarSign className="text-muted-foreground h-8 w-8" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-xs">Paid</p>
								<p className="text-success text-2xl font-bold">
									{formatCurrency(totalPaid, { decimals: 2 })}
								</p>
							</div>
							<CreditCard className="text-success h-8 w-8" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-xs">Outstanding</p>
								<p className="text-warning text-2xl font-bold">
									{formatCurrency(totalOutstanding, { decimals: 2 })}
								</p>
							</div>
							<Receipt className="text-warning h-8 w-8" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-xs">Profit</p>
								<p className="text-primary text-2xl font-bold">
									{formatCurrency(metrics.totalAmount - metrics.materialsCost, {
										decimals: 2,
									})}
								</p>
								<p className="text-muted-foreground text-xs">
									{metrics.profitMargin.toFixed(2)}% margin
								</p>
							</div>
							<TrendingUp className="text-primary h-8 w-8" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Invoices */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FileText className="text-muted-foreground h-5 w-5" />
							<CardTitle>Invoices</CardTitle>
							<Badge variant="secondary">{invoices.length}</Badge>
						</div>
						{isEditMode && (
							<Button size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Create Invoice
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{invoices && invoices.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Invoice #</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Paid</TableHead>
									<TableHead>Balance</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell className="font-medium">
											{invoice.invoice_number}
										</TableCell>
										<TableCell className="text-sm">
											{formatDate(invoice.created_at, "short")}
										</TableCell>
										<TableCell className="font-medium">
											{formatCurrency(invoice.total_amount || 0, {
												decimals: 2,
											})}
										</TableCell>
										<TableCell className="text-success">
											{formatCurrency(invoice.paid_amount || 0, {
												decimals: 2,
											})}
										</TableCell>
										<TableCell
											className={cn(
												"font-medium",
												(invoice.total_amount || 0) -
													(invoice.paid_amount || 0) >
													0
													? "text-warning"
													: "text-success",
											)}
										>
											{formatCurrency(
												(invoice.total_amount || 0) -
													(invoice.paid_amount || 0),
												{
													decimals: 2,
												},
											)}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusColor(invoice.status)}>
												{invoice.status?.toUpperCase()}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button size="sm" variant="ghost">
													<Eye className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="ghost">
													<Download className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="ghost">
													<Send className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-muted-foreground text-center text-sm">
							No invoices created yet
							{isEditMode && (
								<Button className="mt-2 ml-2" size="sm" variant="outline">
									Create First Invoice
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Estimates */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Receipt className="text-muted-foreground h-5 w-5" />
							<CardTitle>Estimates</CardTitle>
							<Badge variant="secondary">{estimates.length}</Badge>
						</div>
						{isEditMode && (
							<Button size="sm" variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Create Estimate
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{estimates && estimates.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Estimate #</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Valid Until</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{estimates.map((estimate) => (
									<TableRow key={estimate.id}>
										<TableCell className="font-medium">
											{estimate.estimate_number}
										</TableCell>
										<TableCell className="text-sm">
											{formatDate(estimate.created_at, "short")}
										</TableCell>
										<TableCell className="font-medium">
											{formatCurrency(estimate.total_amount || 0, {
												decimals: 2,
											})}
										</TableCell>
										<TableCell className="text-sm">
											{estimate.valid_until
												? formatDate(estimate.valid_until, "short")
												: "N/A"}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusColor(estimate.status)}>
												{estimate.status?.toUpperCase()}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												<Button size="sm" variant="ghost">
													<Eye className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="ghost">
													<Download className="h-4 w-4" />
												</Button>
												{estimate.status === "approved" && (
													<Button size="sm" variant="ghost">
														Convert to Job
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-muted-foreground text-center text-sm">
							No estimates created
							{isEditMode && (
								<Button className="mt-2 ml-2" size="sm" variant="outline">
									Create First Estimate
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Profitability Analysis */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<PieChart className="text-muted-foreground h-5 w-5" />
						<CardTitle>Profitability Analysis</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Revenue</span>
								<span className="font-medium">
									{formatCurrency(metrics.totalAmount)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">
									Materials Cost
								</span>
								<span className="font-medium">
									{formatCurrency(metrics.materialsCost)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">
									Labor Hours
								</span>
								<span className="font-medium">
									{metrics.totalLaborHours.toFixed(2)}h
								</span>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold">Gross Profit</span>
								<span className="text-success text-lg font-bold">
									{formatCurrency(metrics.totalAmount - metrics.materialsCost)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold">Profit Margin</span>
								<span className="text-primary text-lg font-bold">
									{metrics.profitMargin.toFixed(2)}%
								</span>
							</div>
						</div>

						<div className="rounded-lg border p-4">
							<h4 className="mb-3 text-sm font-semibold">Cost Breakdown</h4>
							<div className="space-y-2">
								<div>
									<div className="mb-1 flex justify-between text-xs">
										<span>Materials</span>
										<span>
											{(
												(metrics.materialsCost / metrics.totalAmount) *
												100
											).toFixed(2)}
											%
										</span>
									</div>
									<div className="bg-muted h-2 overflow-hidden rounded-full">
										<div
											className="bg-warning h-full"
											style={{
												width: `${(metrics.materialsCost / metrics.totalAmount) * 100}%`,
											}}
										/>
									</div>
								</div>

								<div>
									<div className="mb-1 flex justify-between text-xs">
										<span>Profit</span>
										<span>{metrics.profitMargin.toFixed(2)}%</span>
									</div>
									<div className="bg-muted h-2 overflow-hidden rounded-full">
										<div
											className="bg-success h-full"
											style={{ width: `${metrics.profitMargin}%` }}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Terms & Deposit Info */}
					<Separator />

					<div className="grid gap-4 md:grid-cols-2">
						{job.financial?.payment_terms && (
							<div>
								<p className="text-sm font-medium">Payment Terms</p>
								<p className="text-muted-foreground text-sm">
									{job.financial.payment_terms}
								</p>
							</div>
						)}

						{(job.financial?.deposit_amount ?? 0) > 0 && (
							<div>
								<p className="text-sm font-medium">Deposit</p>
								<div className="flex items-center gap-2">
									<p className="text-muted-foreground text-sm">
										{formatCurrency(job.financial.deposit_amount ?? 0)}
									</p>
									{job.deposit_paid_at && (
										<Badge className="text-xs" variant="default">
											Paid {formatDate(job.deposit_paid_at)}
										</Badge>
									)}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button size="sm" variant="outline">
							Record Payment
						</Button>
						<Button size="sm" variant="outline">
							Send Invoice Reminder
						</Button>
						<Button size="sm" variant="outline">
							Generate Statement
						</Button>
						<Button size="sm" variant="outline">
							Apply Discount
						</Button>
						<Button size="sm" variant="outline">
							Set Payment Plan
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
