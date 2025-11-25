"use client";

import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	Clock,
	MapPin,
} from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
	arriveAppointment,
	cancelAppointment,
	closeAppointment,
	completeAppointment,
	dispatchAppointment,
} from "@/actions/schedule-assignments";
import { ScheduleJobContextMenu } from "./schedule-job-context-menu";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type {
	KanbanItemBase,
	KanbanMoveEvent,
} from "@/components/ui/shadcn-io/kanban";
import { useSchedule } from "@/hooks/use-schedule";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";
import { TeamAvatarGroup } from "./team-avatar-manager";

type ScheduleStatus =
	| "scheduled"
	| "dispatched"
	| "arrived"
	| "in-progress"
	| "closed"
	| "completed"
	| "cancelled";

type ScheduleKanbanItem = KanbanItemBase & {
	entity: Job;
};

const SCHEDULE_STATUS_COLUMNS: Array<{
	id: ScheduleStatus | "unassigned";
	name: string;
	accentColor: string;
}> = [
	{ id: "unassigned", name: "Unscheduled", accentColor: "#EF4444" }, // Red
	{ id: "scheduled", name: "Scheduled", accentColor: "#3B82F6" }, // Blue
	{ id: "dispatched", name: "Dispatched", accentColor: "#0EA5E9" }, // Sky
	{ id: "arrived", name: "Arrived", accentColor: "#34D399" }, // Emerald
	{ id: "in-progress", name: "In Progress", accentColor: "#F59E0B" }, // Amber
	{ id: "closed", name: "Closed", accentColor: "#10B981" }, // Green
	{ id: "completed", name: "Completed", accentColor: "#059669" }, // Emerald-600
	{ id: "cancelled", name: "Cancelled", accentColor: "#94A3B8" }, // Slate
];

const COLUMN_LABEL = new Map(
	SCHEDULE_STATUS_COLUMNS.map((column) => [column.id, column.name]),
);

const DEFAULT_STATUS: ScheduleStatus = "scheduled";

function resolveStatus(
	status: string | null | undefined,
	technicianId: string | null | undefined,
): ScheduleStatus | "unassigned" {
	// If no technician assigned, it's unscheduled
	if (!technicianId) {
		return "unassigned";
	}

	if (!status) {
		return DEFAULT_STATUS;
	}

	const normalized = status as ScheduleStatus;
	return COLUMN_LABEL.has(normalized) ? normalized : DEFAULT_STATUS;
}

// Job type color mapping (same as timeline view) - returns left border classes
const getJobTypeColor = (job: Job) => {
	const title = job.title.toLowerCase();

	if (title.includes("emergency") || title.includes("urgent")) {
		return "border-l-red-400 dark:border-l-red-700";
	}

	if (
		title.includes("callback") ||
		title.includes("follow-up") ||
		title.includes("followup")
	) {
		return "border-l-orange-400 dark:border-l-orange-700";
	}

	if (
		title.includes("meeting") ||
		title.includes("event") ||
		title.includes("training")
	) {
		return "border-l-purple-400 dark:border-l-purple-700";
	}

	if (
		title.includes("install") ||
		title.includes("setup") ||
		title.includes("new")
	) {
		return "border-l-green-400 dark:border-l-green-700";
	}

	if (title.includes("service") || title.includes("maintenance")) {
		return "border-l-blue-400 dark:border-l-blue-700";
	}

	return "border-l-slate-300 dark:border-l-slate-700";
};

// Job status color mapping (same as timeline view)
const getStatusColor = (status: Job["status"]) => {
	switch (status) {
		case "scheduled":
			return "bg-blue-500";
		case "dispatched":
			return "bg-sky-500";
		case "arrived":
			return "bg-emerald-400";
		case "in-progress":
			return "bg-amber-500 animate-pulse";
		case "closed":
			return "bg-emerald-600";
		case "completed":
			return "bg-emerald-600";
		case "cancelled":
			return "bg-slate-400";
		default:
			return "bg-slate-500";
	}
};

function JobCard({ item }: { item: ScheduleKanbanItem }) {
	const { entity: job } = item;
	const startTime =
		job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const endTime =
		job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

	return (
		<ScheduleJobContextMenu job={job}>
			<div
				className={cn(
					"relative -m-4 flex flex-col gap-2 rounded-xl border-l-4 p-4",
					getJobTypeColor(job),
				)}
			>
				{/* Status Dot */}
				<div className="absolute top-4 right-4">
					<div
						className={cn("size-2 rounded-full", getStatusColor(job.status))}
					/>
				</div>

				{/* Customer Name */}
				<div className="pr-4">
					<h3 className="text-foreground truncate text-sm leading-tight font-semibold">
						{job.customer?.name || "Unknown Customer"}
					</h3>
					<p className="text-muted-foreground truncate text-xs">{job.title}</p>
				</div>

				{/* Time & Date */}
				<div className="flex flex-col gap-1">
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<Clock className="size-3 shrink-0" />
						<span className="truncate">
							{format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
						</span>
					</div>
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<CalendarIcon className="size-3 shrink-0" />
						<span className="truncate">{format(startTime, "MMM d, yyyy")}</span>
					</div>
				</div>

				{/* Location */}
				{job.location?.address?.street && (
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<MapPin className="size-3 shrink-0" />
						<span className="truncate">{job.location.address.street}</span>
					</div>
				)}

				{/* Team Avatars */}
				{job.assignments.length > 0 && (
					<div className="border-t pt-2">
						<TeamAvatarGroup
							assignments={job.assignments}
							jobId={job.id}
							maxVisible={3}
							size="sm"
						/>
					</div>
				)}
			</div>
		</ScheduleJobContextMenu>
	);
}

export function KanbanView() {
	const { getAllJobs, isLoading } = useSchedule();
	const [_isPending, startTransition] = useTransition();

	const jobs = getAllJobs();

	const handleItemMove = async ({
		item,
		fromColumnId,
		toColumnId,
	}: KanbanMoveEvent<ScheduleKanbanItem>) => {
		if (fromColumnId === toColumnId) {
			return;
		}

		const jobItem = item;

		startTransition(() => {
			void (async () => {
				let result: { success: boolean; error?: string } = {
					success: false,
					error: "Unknown status",
				};

				// Handle moving to/from unassigned
				if (toColumnId === "unassigned") {
					// Moving to unassigned - unassign the job
					const { unassignAppointment } = await import(
						"@/actions/schedule-assignments"
					);
					result = await unassignAppointment(jobItem.entity.id);
					if (result.success) {
						toast.success("Appointment unscheduled");
					}
					return;
				}

				const newStatus = toColumnId as ScheduleStatus;

				// Call appropriate action based on new status
				switch (newStatus) {
					case "dispatched":
						result = await dispatchAppointment(jobItem.entity.id);
						break;
					case "arrived":
						result = await arriveAppointment(jobItem.entity.id);
						break;
					case "closed":
						result = await closeAppointment(jobItem.entity.id);
						break;
					case "completed":
						result = await completeAppointment(jobItem.entity.id);
						break;
					case "cancelled":
						result = await cancelAppointment(jobItem.entity.id);
						break;
					default:
						// For "scheduled" and "in-progress", we'd need new actions
						result = { success: false, error: "Status change not supported" };
				}

				if (!result.success) {
					toast.error("Unable to move appointment", {
						description: result.error,
					});
					return;
				}

				toast.success(`Appointment moved to ${COLUMN_LABEL.get(newStatus)}`);
			})();
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-muted-foreground">Loading schedule...</div>
			</div>
		);
	}

	return (
		<div className="h-full overflow-auto">
			<EntityKanban<Job, ScheduleStatus | "unassigned">
				calculateColumnMeta={(columnId, items) => {
					const columnItems = items.filter(
						(item) => item.columnId === columnId,
					);
					return { count: columnItems.length };
				}}
				columns={SCHEDULE_STATUS_COLUMNS}
				data={jobs}
				entityName="appointments"
				mapToKanbanItem={(job) => ({
					id: job.id,
					columnId: resolveStatus(job.status, job.technicianId),
					entity: job,
				})}
				onItemMove={handleItemMove}
				renderCard={(item) => <JobCard item={item} />}
				updateEntityStatus={(job, newStatus) =>
					newStatus === "unassigned"
						? {
								...job,
								isUnassigned: true,
							}
						: {
								...job,
								status: newStatus,
								isUnassigned: false,
							}
				}
			/>
		</div>
	);
}
