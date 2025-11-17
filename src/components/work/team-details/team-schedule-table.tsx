"use client";

import { Calendar, CheckCircle, Clock, Eye, MapPin, MoreHorizontal, User } from "lucide-react";
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
import { type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";

type Schedule = {
	id: string;
	title?: string;
	description?: string;
	start_time: string;
	end_time: string;
	duration?: number;
	status?: string;
	type?: string;
	job?: {
		id: string;
		job_number: string;
		title: string;
	};
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

type TeamScheduleTableProps = {
	schedules: Schedule[];
};

export function TeamScheduleTable({ schedules }: TeamScheduleTableProps) {
	const getStatusColor = (status?: string) => {
		if (!status) {
			return "bg-secondary0/10 text-muted-foreground";
		}
		const statusColors: Record<string, string> = {
			scheduled: "bg-primary/10 text-primary hover:bg-primary/20",
			confirmed: "bg-success/10 text-success hover:bg-success/20",
			in_progress: "bg-accent/10 text-accent-foreground hover:bg-accent/20",
			completed: "bg-success/10 text-success hover:bg-success/20",
			cancelled: "bg-destructive/10 text-destructive hover:bg-destructive/20",
		};
		return statusColors[status.toLowerCase()] || "bg-secondary0/10 text-muted-foreground";
	};

	const formatDuration = (minutes?: number) => {
		if (!minutes) {
			return "-";
		}
		if (minutes < 60) {
			return `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	const columns: ColumnDef<Schedule>[] = useMemo(
		() => [
			{
				key: "datetime",
				header: "Date & Time",
				width: "w-48",
				shrink: true,
				render: (schedule) => {
					const startTime = new Date(schedule.start_time);
					const endTime = new Date(schedule.end_time);
					return (
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<Calendar className="text-muted-foreground size-4" />
								<span className="font-medium">
									{startTime.toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>
							<div className="text-muted-foreground flex items-center gap-2 text-sm">
								<Clock className="size-3" />
								<span>
									{startTime.toLocaleTimeString(undefined, {
										hour: "numeric",
										minute: "2-digit",
									})}{" "}
									-{" "}
									{endTime.toLocaleTimeString(undefined, {
										hour: "numeric",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					);
				},
			},
			{
				key: "job",
				header: "Job",
				render: (schedule) => {
					const job = schedule.job;
					return job ? (
						<Link
							className="flex flex-col gap-1 hover:underline"
							href={`/dashboard/work/${job.id}`}
						>
							<span className="font-mono text-sm font-medium">#{job.job_number}</span>
							<span className="text-sm">{job.title}</span>
						</Link>
					) : schedule.title ? (
						<span className="text-sm">{schedule.title}</span>
					) : (
						<span className="text-muted-foreground text-sm">No job linked</span>
					);
				},
			},
			{
				key: "customer",
				header: "Customer",
				width: "w-48",
				hideOnMobile: true,
				render: (schedule) => {
					const customer = schedule.customer;
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
						<span className="text-muted-foreground text-sm">-</span>
					);
				},
			},
			{
				key: "location",
				header: "Location",
				width: "w-64",
				hideOnMobile: true,
				render: (schedule) => {
					const property = schedule.property;
					return property ? (
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="text-muted-foreground size-4" />
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
						<span className="text-muted-foreground text-sm">-</span>
					);
				},
			},
			{
				key: "duration",
				header: "Duration",
				width: "w-24",
				shrink: true,
				render: (schedule) => <span className="text-sm">{formatDuration(schedule.duration)}</span>,
			},
			{
				key: "status",
				header: "Status",
				width: "w-32",
				shrink: true,
				render: (schedule) => {
					const status = schedule.status || "scheduled";
					return <Badge className={getStatusColor(status)}>{status}</Badge>;
				},
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (schedule) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{schedule.job && (
								<DropdownMenuItem asChild>
									<Link href={`/dashboard/work/${schedule.job.id}`}>
										<Eye className="mr-2 size-4" />
										View Job
									</Link>
								</DropdownMenuItem>
							)}
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
		[formatDuration, getStatusColor]
	);

	return (
		<FullWidthDataTable
			columns={columns}
			data={schedules}
			emptyMessage="No upcoming appointments"
			getItemId={(item) => item.id}
			searchFilter={(item, query) =>
				(item.title?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
				(item.job?.title.toLowerCase().includes(query.toLowerCase()) ?? false)
			}
			searchPlaceholder="Search appointments..."
		/>
	);
}
