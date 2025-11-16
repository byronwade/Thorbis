"use client";

/**
 * Finance > Payroll > Pay Runs Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calendar, CheckCircle2, Clock, DollarSign, Download, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

interface PayRun extends Record<string, unknown> {
	id: string;
	period: string;
	payDate: string;
	employees: number;
	grossPay: number;
	netPay: number;
	status: string;
}

// Mock pay run data
const payRuns: PayRun[] = [
	{
		id: "1",
		period: "Oct 16-31, 2024",
		payDate: "2024-11-01",
		employees: 5,
		grossPay: 42_350.0,
		netPay: 32_145.8,
		status: "scheduled",
	},
	{
		id: "2",
		period: "Oct 1-15, 2024",
		payDate: "2024-10-18",
		employees: 5,
		grossPay: 38_920.0,
		netPay: 29_540.5,
		status: "completed",
	},
	{
		id: "3",
		period: "Sep 16-30, 2024",
		payDate: "2024-10-04",
		employees: 5,
		grossPay: 41_275.0,
		netPay: 31_337.2,
		status: "completed",
	},
	{
		id: "4",
		period: "Sep 1-15, 2024",
		payDate: "2024-09-20",
		employees: 4,
		grossPay: 35_680.0,
		netPay: 27_086.4,
		status: "completed",
	},
];

export default function PayRunsPage() {
	const columns: DataTableColumn<PayRun>[] = [
		{
			key: "period",
			header: "Period",
			sortable: true,
			filterable: true,
			render: (payRun) => <span className="font-medium">{payRun.period}</span>,
		},
		{
			key: "payDate",
			header: "Pay Date",
			sortable: true,
			render: (payRun) => new Date(payRun.payDate).toLocaleDateString(),
		},
		{
			key: "employees",
			header: "Employees",
			sortable: true,
		},
		{
			key: "grossPay",
			header: "Gross Pay",
			sortable: true,
			render: (payRun) => `$${payRun.grossPay.toLocaleString()}`,
		},
		{
			key: "netPay",
			header: "Net Pay",
			sortable: true,
			render: (payRun) => `$${payRun.netPay.toLocaleString()}`,
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			filterable: true,
			render: (payRun) => (
				<Badge variant={payRun.status === "completed" ? "default" : "secondary"}>
					{payRun.status === "completed" ? (
						<CheckCircle2 className="mr-1 h-3 w-3" />
					) : (
						<Clock className="mr-1 h-3 w-3" />
					)}
					{payRun.status}
				</Badge>
			),
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right",
			render: (payRun) =>
				payRun.status === "completed" ? (
					<Button size="sm" variant="outline">
						<Download className="size-4" />
						<span className="sr-only">Download</span>
					</Button>
				) : (
					<Button size="sm">Preview</Button>
				),
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl">Pay Runs</h1>
					<p className="text-muted-foreground">Process and manage payroll runs</p>
				</div>
				<Button>
					<Play className="mr-2 size-4" />
					<span className="hidden sm:inline">Run Payroll</span>
					<span className="sm:hidden">Run</span>
				</Button>
			</div>

			{/* Next Pay Run Card */}
			<Card className="border-primary/50 bg-primary/5">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-primary dark:text-primary">Next Pay Run</CardTitle>
							<CardDescription>October 16-31, 2024</CardDescription>
						</div>
						<div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
							<Clock className="h-5 w-5 text-primary" />
							<div className="text-right">
								<p className="font-bold text-2xl text-primary dark:text-primary">3</p>
								<p className="text-muted-foreground text-xs">days until</p>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-3">
						<div>
							<p className="text-muted-foreground text-sm">Pay Date</p>
							<p className="font-semibold text-lg">Friday, Nov 1st</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">Employees</p>
							<p className="font-semibold text-lg">5</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">Estimated Total</p>
							<p className="font-semibold text-lg">$42,350.00</p>
						</div>
					</div>
					<div className="mt-4 flex gap-2">
						<Button size="sm">Preview Pay Run</Button>
						<Button size="sm" variant="outline">
							View Details
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">This Month</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$81,270</div>
						<p className="text-muted-foreground text-xs">2 pay runs</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Avg Per Run</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$40,635</div>
						<p className="text-muted-foreground text-xs">Last 3 months</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Total YTD</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$365,420</div>
						<p className="text-muted-foreground text-xs">2024 to date</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Pay Frequency</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">Semi-Monthly</div>
						<p className="text-muted-foreground text-xs">2x per month</p>
					</CardContent>
				</Card>
			</div>

			{/* Pay Run History */}
			<Card>
				<CardHeader>
					<CardTitle>Pay Run History</CardTitle>
					<CardDescription>View past and upcoming payroll runs</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={payRuns}
						emptyMessage="No pay runs found."
						itemsPerPage={10}
						keyField="id"
						searchPlaceholder="Search by period or status..."
					/>
				</CardContent>
			</Card>
		</div>
	);
}
