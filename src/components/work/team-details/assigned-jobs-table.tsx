"use client";

import {
	Building2,
	CheckCircle,
	Clock,
	Eye,
	MapPin,
	MoreHorizontal,
} from "lucide-react";
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

type AssignedJob = {
	id: string;
	job_id: string;
	job: {
		id: string;
		job_number: string;
		title: string;
		status: string;
		priority?: string;
		scheduled_start?: string;
		scheduled_end?: string;
		customer?: {
			id: string;
			first_name: string;
			last_name: string;
		};
		property?: {
			id: string;
			name?: string;
			address: string;
			city?: string;
			state?: string;
		};
	};
	role?: string;
	assigned_at: string;
};

type AssignedJobsTableProps = {
	assignments: AssignedJob[];
};

export function AssignedJobsTable({ assignments }: AssignedJobsTableProps) {
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

	const columns: ColumnDef<AssignedJob>[] = useMemo(
		() => [
			{
				key: "job_number",
				header: "Job #",
				width: "w-32",
				shrink: true,
				render: (assignment) => (
					<Link
						className="font-medium font-mono text-sm hover:underline"
						href={`/dashboard/work/${assignment.job.id}`}
					>
						{assignment.job.job_number}
					</Link>
				),
			},
			{
				key: "title",
				header: "Title",
				render: (assignment) => (
					<Link
						className="block min-w-0"
						href={`/dashboard/work/${assignment.job.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-col gap-1">
							<span className="font-medium text-sm leading-tight hover:underline">
								{assignment.job.title}
							</span>
							{assignment.role && (
								<span className="text-muted-foreground text-xs">
									Role: {assignment.role}
								</span>
							)}
						</div>
					</Link>
				),
			},
			{
				key: "customer",
				header: "Customer",
				width: "w-48",
				render: (assignment) => {
					const customer = assignment.job.customer;
					return customer ? (
						<Link
							className="flex items-center gap-2 hover:underline"
							href={`/dashboard/sales/customers/${customer.id}`}
						>
							<Building2 className="size-4 text-muted-foreground" />
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
				key: "property",
				header: "Property",
				width: "w-64",
				hideOnMobile: true,
				render: (assignment) => {
					const property = assignment.job.property;
					return property ? (
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="size-4 text-muted-foreground" />
							<div className="flex flex-col">
								<span>{property.name || property.address}</span>
								{property.city && property.state && (
									<span className="text-muted-foreground text-xs">
										{property.city}, {property.state}
									</span>
								)}
							</div>
						</div>
					) : (
						<span className="text-muted-foreground">No property</span>
					);
				},
			},
			{
				key: "status",
				header: "Status",
				width: "w-32",
				shrink: true,
				render: (assignment) => (
					<Badge className={getStatusColor(assignment.job.status)}>
						{assignment.job.status}
					</Badge>
				),
			},
			{
				key: "priority",
				header: "Priority",
				width: "w-24",
				shrink: true,
				hideOnMobile: true,
				render: (assignment) => {
					const priority = assignment.job.priority;
					return priority ? (
						<Badge className={getPriorityColor(priority)}>{priority}</Badge>
					) : (
						<span className="text-muted-foreground text-sm">-</span>
					);
				},
			},
			{
				key: "scheduled",
				header: "Scheduled",
				width: "w-36",
				shrink: true,
				render: (assignment) => {
					const scheduledStart = assignment.job.scheduled_start;
					return scheduledStart ? (
						<div className="flex items-center gap-2 text-sm">
							<Clock className="size-4 text-muted-foreground" />
							<span>
								{new Date(scheduledStart).toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
						</div>
					) : (
						<span className="text-muted-foreground text-sm">Not scheduled</span>
					);
				},
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (assignment) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/work/${assignment.job.id}`}>
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
		[getPriorityColor, getStatusColor],
	);

	return (
		<FullWidthDataTable
			columns={columns}
			data={assignments}
			emptyMessage="No assigned jobs found"
			getItemId={(item) => item.id}
			searchFilter={(item, query) =>
				item.job.title.toLowerCase().includes(query.toLowerCase()) ||
				item.job.job_number.toLowerCase().includes(query.toLowerCase())
			}
			searchPlaceholder="Search jobs..."
		/>
	);
}
