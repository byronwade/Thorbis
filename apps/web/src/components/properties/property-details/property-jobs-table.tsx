"use client";

import { Calendar, CheckCircle, Eye, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";

type PropertyJob = {
	id: string;
	job_number: string;
	title: string;
	status: string;
	priority?: string;
	scheduled_start?: string;
	scheduled_end?: string;
	total_amount?: number;
	paid_amount?: number;
	created_at: string;
	customer?: {
		id: string;
		first_name: string;
		last_name: string;
	};
	assigned_user?: {
		id: string;
		name: string;
		avatar?: string;
	};
};

type PropertyJobsTableProps = {
	jobs: PropertyJob[];
};

export function PropertyJobsTable({ jobs }: PropertyJobsTableProps) {
	const getStatusColor = (status: string) => {
		const statusColors: Record<string, string> = {
			pending: "bg-warning/10 text-warning hover:bg-warning/20",
			scheduled: "bg-primary/10 text-primary hover:bg-primary/20",
			in_progress: "bg-accent/10 text-accent-foreground hover:bg-accent/20",
			completed: "bg-success/10 text-success hover:bg-success/20",
			cancelled: "bg-destructive/10 text-destructive hover:bg-destructive/20",
		};
		return (
			statusColors[status.toLowerCase()] ||
			"bg-secondary0/10 text-muted-foreground"
		);
	};

	const getPriorityColor = (priority?: string) => {
		if (!priority) {
			return "bg-secondary0/10 text-muted-foreground";
		}
		const priorityColors: Record<string, string> = {
			low: "bg-primary/10 text-primary",
			medium: "bg-warning/10 text-warning",
			high: "bg-warning/10 text-warning",
			urgent: "bg-destructive/10 text-destructive",
		};
		return (
			priorityColors[priority.toLowerCase()] ||
			"bg-secondary0/10 text-muted-foreground"
		);
	};

	const formatCurrency = (cents?: number) => {
		if (!cents) {
			return "-";
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);
	};

	const columns: ColumnDef<PropertyJob>[] = useMemo(
		() => [
			{
				key: "job_number",
				header: "Job #",
				width: "w-32",
				shrink: true,
				render: (job) => (
					<Link
						className="font-mono text-xs font-medium hover:underline"
						href={`/dashboard/work/${job.id}`}
					>
						{job.job_number}
					</Link>
				),
			},
			{
				key: "title",
				header: "Title",
				render: (job) => (
					<Link
						className="block min-w-0"
						href={`/dashboard/work/${job.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						<span className="text-xs leading-tight font-medium hover:underline">
							{job.title}
						</span>
					</Link>
				),
			},
			{
				key: "customer",
				header: "Customer",
				width: "w-48",
				hideOnMobile: true,
				render: (job) => {
					const customer = job.customer;
					return customer ? (
						<Link
							className="flex items-center gap-2 hover:underline"
							href={`/dashboard/sales/customers/${customer.id}`}
						>
							<User className="text-muted-foreground size-4" />
							<span>
								{customer.first_name} {customer.last_name}
							</span>
						</Link>
					) : (
						<span className="text-muted-foreground">No customer</span>
					);
				},
			},
			{
				key: "status",
				header: "Status",
				width: "w-32",
				shrink: true,
				render: (job) => (
					<Badge className={getStatusColor(job.status)}>{job.status}</Badge>
				),
			},
			{
				key: "priority",
				header: "Priority",
				width: "w-24",
				shrink: true,
				hideOnMobile: true,
				render: (job) => {
					const priority = job.priority;
					return priority ? (
						<Badge className={getPriorityColor(priority)}>{priority}</Badge>
					) : (
						<span className="text-muted-foreground text-xs">-</span>
					);
				},
			},
			{
				key: "value",
				header: "Value",
				width: "w-32",
				shrink: true,
				align: "right",
				render: (job) => (
					<div className="flex flex-col items-end gap-1">
						<span className="text-xs font-medium">
							{formatCurrency(job.financial?.total_amount ?? 0)}
						</span>
						{job.financial?.paid_amount && job.financial?.total_amount && (
							<span className="text-muted-foreground text-xs">
								{formatCurrency(job.financial.paid_amount)} paid
							</span>
						)}
					</div>
				),
			},
			{
				key: "scheduled",
				header: "Scheduled",
				width: "w-36",
				shrink: true,
				render: (job) => {
					const scheduledStart = job.scheduled_start;
					return scheduledStart ? (
						<div className="flex items-center gap-2 text-xs">
							<Calendar className="text-muted-foreground size-4" />
							<span>
								{new Date(scheduledStart).toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
						</div>
					) : (
						<span className="text-muted-foreground text-xs">Not scheduled</span>
					);
				},
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (job) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/work/${job.id}`}>
									<Eye className="mr-2 size-4" />
									View Job
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<CheckCircle className="mr-2 size-4" />
								Mark Complete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[formatCurrency, getPriorityColor, getStatusColor],
	);

	return (
		<FullWidthDataTable
			{...TablePresets.compact()}
			columns={columns}
			data={jobs}
			emptyMessage="No jobs found for this property"
			getItemId={(item) => item.id}
			searchFilter={(item, query) =>
				item.title.toLowerCase().includes(query.toLowerCase()) ||
				item.job_number.toLowerCase().includes(query.toLowerCase())
			}
			searchPlaceholder="Search jobs..."
		/>
	);
}
