"use client";

import { Briefcase, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";

/**
 * Customer Data Tables - Client Component
 *
 * Uses FullWidthDataTable for consistent Gmail-style table layout
 * Must be a Client Component because render functions can't be serialized.
 */

type Job = {
	id: string;
	jobNumber: string;
	title: string;
	status: string;
	totalAmount: number;
	scheduledStart: string | null;
};

type Invoice = {
	id: string;
	invoiceNumber: string;
	title: string;
	status: string;
	totalAmount: number;
	dueDate: string | null;
};

function getStatusBadge(status: string) {
	const variants: Record<
		string,
		{
			className: string;
			label: string;
		}
	> = {
		draft: {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
			label: "Draft",
		},
		scheduled: {
			className:
				"border-primary bg-primary text-primary hover:bg-primary dark:border-primary dark:bg-primary/50 dark:text-primary",
			label: "Scheduled",
		},
		in_progress: {
			className: "border-primary/50 bg-primary text-white hover:bg-primary",
			label: "In Progress",
		},
		completed: {
			className: "border-success/50 bg-success text-white hover:bg-success",
			label: "Completed",
		},
		cancelled: {
			className: "border-destructive/50 bg-destructive text-white hover:bg-destructive",
			label: "Cancelled",
		},
		paid: {
			className: "border-success/50 bg-success text-white hover:bg-success",
			label: "Paid",
		},
		unpaid: {
			className:
				"border-warning/50 bg-warning/50 text-warning dark:border-warning/50 dark:bg-warning/30 dark:text-warning",
			label: "Unpaid",
		},
		overdue: {
			className: "border-destructive/50 bg-destructive text-white hover:bg-destructive",
			label: "Overdue",
		},
	};

	const config = variants[status] || {
		className: "border-border/50 bg-background text-muted-foreground",
		label: status.replace("_", " "),
	};

	return (
		<Badge className={`text-xs font-medium ${config.className}`} variant="outline">
			{config.label}
		</Badge>
	);
}

type CustomerDataTablesProps = {
	customerId: string;
	jobs: Job[];
	invoices: Invoice[];
};

export function CustomerDataTables({ customerId, jobs, invoices }: CustomerDataTablesProps) {
	// Job columns for FullWidthDataTable
	const jobColumns: ColumnDef<Job>[] = [
		{
			key: "jobNumber",
			header: "Job Number",
			width: "w-36",
			shrink: true,
			render: (job) => (
				<Link
					className="text-foreground text-sm leading-tight font-medium hover:underline"
					href={`/dashboard/work/${job.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{job.jobNumber}
				</Link>
			),
		},
		{
			key: "title",
			header: "Title",
			width: "flex-1",
			render: (job) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/${job.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<span className="truncate text-sm leading-tight font-medium hover:underline">
						{job.title}
					</span>
				</Link>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			render: (job) => getStatusBadge(job.status),
		},
		{
			key: "totalAmount",
			header: "Amount",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (job) => (
				<span className="text-sm font-semibold tabular-nums">
					{formatCurrencyFromDollars(job.totalAmount)}
				</span>
			),
		},
		{
			key: "scheduledStart",
			header: "Scheduled",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (job) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{formatDate(job.scheduledStart, "short")}
				</span>
			),
		},
	];

	// Invoice columns
	const invoiceColumns: ColumnDef<Invoice>[] = [
		{
			key: "invoiceNumber",
			header: "Invoice Number",
			width: "w-36",
			shrink: true,
			render: (invoice) => (
				<Link
					className="text-foreground text-sm leading-tight font-medium hover:underline"
					href={`/dashboard/work/invoices/${invoice.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{invoice.invoiceNumber}
				</Link>
			),
		},
		{
			key: "title",
			header: "Title",
			width: "flex-1",
			render: (invoice) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/invoices/${invoice.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<span className="truncate text-sm leading-tight font-medium hover:underline">
						{invoice.title}
					</span>
				</Link>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			render: (invoice) => getStatusBadge(invoice.status),
		},
		{
			key: "totalAmount",
			header: "Amount",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (invoice) => (
				<span className="text-sm font-semibold tabular-nums">
					{formatCurrencyFromDollars(invoice.totalAmount)}
				</span>
			),
		},
		{
			key: "dueDate",
			header: "Due Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (invoice) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{formatDate(invoice.dueDate, "short")}
				</span>
			),
		},
	];

	// Search filter functions
	const jobSearchFilter = (job: Job, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			job.jobNumber.toLowerCase().includes(searchStr) ||
			job.title.toLowerCase().includes(searchStr) ||
			job.status.toLowerCase().includes(searchStr)
		);
	};

	const invoiceSearchFilter = (invoice: Invoice, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			invoice.invoiceNumber.toLowerCase().includes(searchStr) ||
			invoice.title.toLowerCase().includes(searchStr) ||
			invoice.status.toLowerCase().includes(searchStr)
		);
	};

	const handleJobRowClick = (job: Job) => {
		window.location.href = `/dashboard/work/${job.id}`;
	};

	const handleInvoiceRowClick = (invoice: Invoice) => {
		window.location.href = `/dashboard/work/invoices/${invoice.id}`;
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<>
			{/* Jobs Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Jobs ({jobs.length})</CardTitle>
							<CardDescription>All jobs for this customer</CardDescription>
						</div>
						<Button asChild size="sm" variant="outline">
							<Link href={`/dashboard/work/new?customer=${customerId}`}>
								<Briefcase className="mr-2 size-4" />
								New Job
							</Link>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<FullWidthDataTable
						columns={jobColumns}
						data={jobs}
						emptyAction={
							<Button asChild size="sm">
								<Link href={`/dashboard/work/new?customer=${customerId}`}>
									<Plus className="mr-2 size-4" />
									Add Job
								</Link>
							</Button>
						}
						emptyIcon={<Briefcase className="text-muted-foreground h-8 w-8" />}
						emptyMessage="No jobs found for this customer"
						enableSelection={false}
						getItemId={(job) => job.id}
						itemsPerPage={10}
						onRefresh={handleRefresh}
						onRowClick={handleJobRowClick}
						searchFilter={jobSearchFilter}
						searchPlaceholder="Search jobs by number, title, or status..."
					/>
				</CardContent>
			</Card>

			{/* Invoices Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Invoices ({invoices.length})</CardTitle>
							<CardDescription>All invoices for this customer</CardDescription>
						</div>
						<Button asChild size="sm" variant="outline">
							<Link href={`/dashboard/work/invoices/new?customer=${customerId}`}>
								<FileText className="mr-2 size-4" />
								New Invoice
							</Link>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<FullWidthDataTable
						columns={invoiceColumns}
						data={invoices}
						emptyAction={
							<Button asChild size="sm">
								<Link href={`/dashboard/work/invoices/new?customer=${customerId}`}>
									<Plus className="mr-2 size-4" />
									Add Invoice
								</Link>
							</Button>
						}
						emptyIcon={<FileText className="text-muted-foreground h-8 w-8" />}
						emptyMessage="No invoices found for this customer"
						enableSelection={false}
						getItemId={(invoice) => invoice.id}
						itemsPerPage={10}
						onRefresh={handleRefresh}
						onRowClick={handleInvoiceRowClick}
						searchFilter={invoiceSearchFilter}
						searchPlaceholder="Search invoices by number, title, or status..."
					/>
				</CardContent>
			</Card>
		</>
	);
}
