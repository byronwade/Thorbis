"use client";

import { format } from "date-fns";
import {
	Briefcase,
	Calendar,
	Car,
	Check,
	ClipboardCheck,
	Clock,
	ExternalLink,
	HardHat,
	MapPin,
	Phone,
	Play,
	Search,
	Send,
	Settings,
	Star,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useTransition } from "react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import { cn } from "@/lib/utils";
import type { AppointmentCategory, Job, JobType } from "./schedule-types";
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

// Job type visual configuration - consistent with timeline view
type JobTypeConfig = {
	borderColor: string;
	bgColor: string;
	icon: React.ComponentType<{ className?: string }>;
	label: string;
};

const JOB_TYPE_CONFIG: Record<JobType | "default", JobTypeConfig> = {
	emergency: {
		borderColor: "border-l-red-500",
		bgColor: "bg-red-500/10",
		icon: Zap,
		label: "Emergency",
	},
	repair: {
		borderColor: "border-l-orange-500",
		bgColor: "bg-orange-500/10",
		icon: Wrench,
		label: "Repair",
	},
	installation: {
		borderColor: "border-l-green-500",
		bgColor: "bg-green-500/10",
		icon: HardHat,
		label: "Installation",
	},
	maintenance: {
		borderColor: "border-l-blue-500",
		bgColor: "bg-blue-500/10",
		icon: Settings,
		label: "Maintenance",
	},
	premium_maintenance: {
		borderColor: "border-l-violet-500",
		bgColor: "bg-violet-500/10",
		icon: Star,
		label: "Premium",
	},
	inspection: {
		borderColor: "border-l-cyan-500",
		bgColor: "bg-cyan-500/10",
		icon: Search,
		label: "Inspection",
	},
	service: {
		borderColor: "border-l-sky-500",
		bgColor: "bg-sky-500/10",
		icon: ClipboardCheck,
		label: "Service",
	},
	service_call: {
		borderColor: "border-l-teal-500",
		bgColor: "bg-teal-500/10",
		icon: Phone,
		label: "Service Call",
	},
	estimate: {
		borderColor: "border-l-amber-500",
		bgColor: "bg-amber-500/10",
		icon: ClipboardCheck,
		label: "Estimate",
	},
	callback: {
		borderColor: "border-l-pink-500",
		bgColor: "bg-pink-500/10",
		icon: Phone,
		label: "Callback",
	},
	other: {
		borderColor: "border-l-slate-400",
		bgColor: "bg-slate-400/10",
		icon: ClipboardCheck,
		label: "Other",
	},
	default: {
		borderColor: "border-l-slate-400",
		bgColor: "bg-slate-400/10",
		icon: ClipboardCheck,
		label: "Job",
	},
};

const getJobTypeConfig = (job: Job): JobTypeConfig => {
	const config = job.jobType ? JOB_TYPE_CONFIG[job.jobType] : JOB_TYPE_CONFIG.default;
	return config || JOB_TYPE_CONFIG.default;
};

const getJobTypeColor = (job: Job) => {
	const config = getJobTypeConfig(job);
	return `border-l-4 ${config.borderColor}`;
};

// Appointment category visual configuration - differentiates jobs, meetings, and events
type AppointmentCategoryConfig = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	bgColor: string;
	textColor: string;
	borderStyle: string;
};

const APPOINTMENT_CATEGORY_CONFIG: Record<AppointmentCategory, AppointmentCategoryConfig> = {
	job: {
		icon: Briefcase,
		label: "Job",
		bgColor: "bg-blue-500/10",
		textColor: "text-blue-600 dark:text-blue-400",
		borderStyle: "border-solid",
	},
	meeting: {
		icon: Users,
		label: "Meeting",
		bgColor: "bg-purple-500/10",
		textColor: "text-purple-600 dark:text-purple-400",
		borderStyle: "border-dashed",
	},
	event: {
		icon: Calendar,
		label: "Event",
		bgColor: "bg-emerald-500/10",
		textColor: "text-emerald-600 dark:text-emerald-400",
		borderStyle: "border-dotted",
	},
};

const getAppointmentCategoryConfig = (job: Job): AppointmentCategoryConfig => {
	const category = job.appointmentCategory || "job";
	return APPOINTMENT_CATEGORY_CONFIG[category];
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
	const [isPending, startTransition] = useTransition();
	const startTime =
		job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const endTime =
		job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

	// Quick action handlers
	const handleDispatch = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (!job.jobId) return;
			startTransition(async () => {
				const result = await dispatchAppointment(job.jobId!);
				if (result.success) {
					toast.success("Job dispatched");
				} else {
					toast.error(result.error || "Failed to dispatch");
				}
			});
		},
		[job.jobId],
	);

	const handleArrive = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (!job.jobId) return;
			startTransition(async () => {
				const result = await arriveAppointment(job.jobId!);
				if (result.success) {
					toast.success("Marked as arrived");
				} else {
					toast.error(result.error || "Failed to update");
				}
			});
		},
		[job.jobId],
	);

	const handleComplete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (!job.jobId) return;
			startTransition(async () => {
				const result = await completeAppointment(job.jobId!);
				if (result.success) {
					toast.success("Job completed");
				} else {
					toast.error(result.error || "Failed to complete");
				}
			});
		},
		[job.jobId],
	);

	// Determine which quick action to show based on status
	const getQuickAction = () => {
		if (!job.jobId) return null;

		switch (job.status) {
			case "scheduled":
				return {
					icon: Send,
					label: "Dispatch",
					onClick: handleDispatch,
					className: "bg-blue-500 hover:bg-blue-600 text-white",
				};
			case "dispatched":
				return {
					icon: Car,
					label: "Arrive",
					onClick: handleArrive,
					className: "bg-sky-500 hover:bg-sky-600 text-white",
				};
			case "arrived":
				return {
					icon: Play,
					label: "Start",
					onClick: handleComplete,
					className: "bg-emerald-500 hover:bg-emerald-600 text-white",
				};
			case "in-progress":
				return {
					icon: Check,
					label: "Done",
					onClick: handleComplete,
					className: "bg-amber-500 hover:bg-amber-600 text-white",
				};
			default:
				return null;
		}
	};

	const quickAction = getQuickAction();

	const categoryConfig = getAppointmentCategoryConfig(job);

	return (
		<TooltipProvider>
			<ScheduleJobContextMenu job={job}>
				<div
					className={cn(
						"group relative -m-4 flex flex-col gap-2 rounded-xl border-l-4 p-4",
						getJobTypeColor(job),
						categoryConfig.borderStyle,
					)}
				>
					{/* Status Dot + Quick Actions */}
					<div className="absolute top-3 right-3 flex items-center gap-1.5">
						{/* Quick Action Button - appears on hover */}
						{quickAction && (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={quickAction.onClick}
										disabled={isPending}
										className={cn(
											"flex size-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100",
											"focus:outline-none focus:ring-2 focus:ring-offset-1",
											quickAction.className,
											isPending && "cursor-wait opacity-50",
										)}
									>
										{isPending ? (
											<div className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
										) : (
											<quickAction.icon className="size-3" />
										)}
									</button>
								</TooltipTrigger>
								<TooltipContent side="top" className="text-xs">
									{quickAction.label}
								</TooltipContent>
							</Tooltip>
						)}

						{/* View Details Link - appears on hover */}
						{job.jobId && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={`/dashboard/work/${job.jobId}`}
										onClick={(e) => e.stopPropagation()}
										className="flex size-6 items-center justify-center rounded-md bg-slate-100 opacity-0 transition-all hover:bg-slate-200 group-hover:opacity-100 dark:bg-slate-800 dark:hover:bg-slate-700"
									>
										<ExternalLink className="size-3 text-slate-600 dark:text-slate-400" />
									</Link>
								</TooltipTrigger>
								<TooltipContent side="top" className="text-xs">
									View Details
								</TooltipContent>
							</Tooltip>
						)}

						{/* Status Dot */}
						<div
							className={cn("size-2 rounded-full", getStatusColor(job.status))}
						/>
					</div>

					{/* Appointment Category + Job Type Badge + Customer Name */}
					<div className="flex items-start gap-2 pr-16">
						{/* Appointment Category Icon */}
						{(() => {
							const CategoryIcon = categoryConfig.icon;
							return (
								<Tooltip>
									<TooltipTrigger asChild>
										<div className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm", categoryConfig.bgColor)}>
											<CategoryIcon className={cn("size-2.5", categoryConfig.textColor)} />
										</div>
									</TooltipTrigger>
									<TooltipContent side="top" className="text-xs">
										{categoryConfig.label}
									</TooltipContent>
								</Tooltip>
							);
						})()}
						{/* Job Type Icon */}
						{(() => {
							const typeConfig = getJobTypeConfig(job);
							const TypeIcon = typeConfig.icon;
							return (
								<Tooltip>
									<TooltipTrigger asChild>
										<div className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded", typeConfig.bgColor)}>
											<TypeIcon className={cn("size-3", typeConfig.borderColor.replace("border-l-", "text-"))} />
										</div>
									</TooltipTrigger>
									<TooltipContent side="top" className="text-xs">
										{typeConfig.label}
									</TooltipContent>
								</Tooltip>
							);
						})()}
						<div className="min-w-0 flex-1">
							<h3 className="text-foreground truncate text-sm leading-tight font-semibold">
								{job.customer?.name || "Unknown Customer"}
							</h3>
							<p className="text-muted-foreground truncate text-xs">{job.title}</p>
						</div>
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
							<Calendar className="size-3 shrink-0" />
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
		</TooltipProvider>
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
