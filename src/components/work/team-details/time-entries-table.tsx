"use client";

import { Briefcase, Clock, Edit2, Eye, MoreHorizontal, Play, Square } from "lucide-react";
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

type TimeEntry = {
	id: string;
	clock_in: string;
	clock_out?: string | null;
	break_duration?: number | null;
	total_duration?: number | null;
	notes?: string | null;
	status?: string | null;
	job?: {
		id: string;
		job_number: string;
		title: string;
	};
	created_at: string;
};

type TimeEntriesTableProps = {
	timeEntries: TimeEntry[];
};

export function TimeEntriesTable({ timeEntries }: TimeEntriesTableProps) {
	const getStatusColor = (entry: TimeEntry) => {
		if (!entry.clock_out) {
			return "bg-success/10 text-success"; // Active/Clocked In
		}
		return "bg-secondary0/10 text-muted-foreground"; // Completed
	};

	const formatDuration = (minutes?: number | null) => {
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

	const calculateDuration = (entry: TimeEntry): number | null => {
		if (entry.total_duration) {
			return entry.total_duration;
		}

		const clockIn = new Date(entry.clock_in);
		const clockOut = entry.clock_out ? new Date(entry.clock_out) : new Date();

		let duration = Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60));

		// Subtract break duration if provided
		if (entry.break_duration) {
			duration -= entry.break_duration;
		}

		return duration > 0 ? duration : null;
	};

	const columns: ColumnDef<TimeEntry>[] = useMemo(
		() => [
			{
				key: "date",
				header: "Date",
				width: "w-36",
				shrink: true,
				render: (entry) => {
					const clockIn = new Date(entry.clock_in);
					return (
						<div className="flex flex-col gap-1">
							<span className="font-medium">
								{clockIn.toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
							<span className="text-muted-foreground text-xs">
								{clockIn.toLocaleDateString(undefined, {
									weekday: "short",
								})}
							</span>
						</div>
					);
				},
			},
			{
				key: "job",
				header: "Job",
				render: (entry) => {
					const job = entry.job;
					return job ? (
						<Link className="flex items-center gap-2 hover:underline" href={`/dashboard/work/${job.id}`}>
							<Briefcase className="size-4 text-muted-foreground" />
							<div className="flex flex-col">
								<span className="font-medium font-mono text-sm">#{job.job_number}</span>
								<span className="text-sm">{job.title}</span>
							</div>
						</Link>
					) : (
						<span className="text-muted-foreground text-sm">No job linked</span>
					);
				},
			},
			{
				key: "clock_in",
				header: "Clock In",
				width: "w-28",
				shrink: true,
				render: (entry) => {
					const clockIn = new Date(entry.clock_in);
					return (
						<div className="flex items-center gap-2 text-sm">
							<Play className="size-4 text-success" />
							<span>
								{clockIn.toLocaleTimeString(undefined, {
									hour: "numeric",
									minute: "2-digit",
								})}
							</span>
						</div>
					);
				},
			},
			{
				key: "clock_out",
				header: "Clock Out",
				width: "w-28",
				shrink: true,
				render: (entry) => {
					const clockOut = entry.clock_out;
					return clockOut ? (
						<div className="flex items-center gap-2 text-sm">
							<Square className="size-4 text-destructive" />
							<span>
								{new Date(clockOut).toLocaleTimeString(undefined, {
									hour: "numeric",
									minute: "2-digit",
								})}
							</span>
						</div>
					) : (
						<Badge className="bg-success/10 text-success">Active</Badge>
					);
				},
			},
			{
				key: "duration",
				header: "Duration",
				width: "w-24",
				shrink: true,
				render: (entry) => {
					const duration = calculateDuration(entry);
					return (
						<div className="flex items-center gap-2">
							<Clock className="size-4 text-muted-foreground" />
							<span className="font-medium text-sm">{formatDuration(duration)}</span>
						</div>
					);
				},
			},
			{
				key: "break",
				header: "Break",
				width: "w-20",
				shrink: true,
				hideOnMobile: true,
				render: (entry) => <span className="text-sm">{formatDuration(entry.break_duration)}</span>,
			},
			{
				key: "status",
				header: "Status",
				width: "w-28",
				shrink: true,
				render: (entry) => {
					const hasClockOut = Boolean(entry.clock_out);
					return <Badge className={getStatusColor(entry)}>{hasClockOut ? "Completed" : "Active"}</Badge>;
				},
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (entry) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{entry.job && (
								<>
									<DropdownMenuItem asChild>
										<Link href={`/dashboard/work/${entry.job.id}`}>
											<Eye className="mr-2 size-4" />
											View Job
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
							<DropdownMenuItem>
								<Edit2 className="mr-2 size-4" />
								Edit Entry
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[calculateDuration, formatDuration, getStatusColor]
	);

	// Calculate total hours
	const totalMinutes = timeEntries.reduce((sum, entry) => {
		const duration = calculateDuration(entry);
		return sum + (duration || 0);
	}, 0);

	return (
		<div className="space-y-4">
			{/* Summary Card */}
			<div className="rounded-lg border bg-card p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-muted-foreground text-sm">Total Hours</p>
						<p className="font-bold text-2xl">{formatDuration(totalMinutes)}</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Entries</p>
						<p className="font-bold text-2xl">{timeEntries.length}</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Active Now</p>
						<p className="font-bold text-2xl">{timeEntries.filter((e) => !e.clock_out).length}</p>
					</div>
				</div>
			</div>

			{/* Table */}
			<FullWidthDataTable
				columns={columns}
				data={timeEntries}
				emptyMessage="No time entries found"
				getItemId={(item) => item.id}
				searchFilter={(item, query) =>
					(item.notes?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
					(item.job?.title.toLowerCase().includes(query.toLowerCase()) ?? false)
				}
				searchPlaceholder="Search time entries..."
			/>
		</div>
	);
}
