"use client";

import {
	ArrowUpRight,
	BriefcaseBusiness,
	CalendarDays,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type {
	KanbanItemBase,
	KanbanMoveEvent,
} from "@/components/ui/shadcn-io/kanban";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/lib/db/schema";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type JobStatus =
	| "quoted"
	| "scheduled"
	| "in_progress"
	| "on_hold"
	| "completed"
	| "cancelled";

type RelatedCustomer = {
	first_name?: string | null;
	last_name?: string | null;
	display_name?: string | null;
	company_name?: string | null;
};

type RelatedProperty = {
	address?: string | null;
	city?: string | null;
	state?: string | null;
	zip_code?: string | null;
};

type ExtendedJob = Job & {
	customers?: RelatedCustomer | null;
	properties?: RelatedProperty | null;
};

type JobsKanbanItem = KanbanItemBase & { entity: ExtendedJob };

type JobsKanbanProps = {
	jobs: ExtendedJob[];
};

const JOB_STATUS_COLUMNS: Array<{
	id: JobStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "quoted", name: "Quoted", accentColor: "#6B7280" },
	{ id: "scheduled", name: "Scheduled", accentColor: "#2563EB" },
	{ id: "in_progress", name: "In Progress", accentColor: "#F97316" },
	{ id: "on_hold", name: "On Hold", accentColor: "#F59E0B" },
	{ id: "completed", name: "Completed", accentColor: "#22C55E" },
	{ id: "cancelled", name: "Cancelled", accentColor: "#EF4444" },
];

const COLUMN_LABEL = new Map(
	JOB_STATUS_COLUMNS.map((column) => [column.id, column.name]),
);
const DEFAULT_STATUS: JobStatus = "quoted";

function resolveStatus(status: Job["status"] | null | undefined): JobStatus {
	if (!status) {
		return DEFAULT_STATUS;
	}

	const normalized = status as JobStatus;
	return COLUMN_LABEL.has(normalized) ? normalized : DEFAULT_STATUS;
}

function formatScheduledRange(job: ExtendedJob) {
	if (!job.scheduledStart) {
		return null;
	}

	return formatDateRange(job.scheduledStart, job.scheduledEnd ?? undefined);
}

function getCustomerName(job: ExtendedJob) {
	const customer = job.customers;
	if (!customer) {
		return "Unassigned customer";
	}

	if (customer.display_name) {
		return customer.display_name;
	}

	const nameParts = [customer.first_name, customer.last_name].filter(Boolean);
	if (nameParts.length > 0) {
		return nameParts.join(" ");
	}

	return customer.company_name || "Unassigned customer";
}

function getPropertySummary(job: ExtendedJob) {
	const property = job.properties;
	if (!property) {
		return null;
	}

	const parts = [property.address];
	const cityState = [property.city, property.state].filter(Boolean).join(", ");
	if (cityState) {
		parts.push(cityState);
	}

	return parts.filter(Boolean).join(" • ");
}

function PriorityBadge({ priority }: { priority: Job["priority"] }) {
	const config: Record<
		NonNullable<Job["priority"]>,
		{ label: string; className: string }
	> = {
		low: {
			label: "Low",
			className:
				"border-primary/60 bg-primary/60 text-primary dark:border-primary/40 dark:bg-primary/40 dark:text-primary",
		},
		medium: {
			label: "Medium",
			className:
				"border-warning/60 bg-warning/60 text-warning dark:border-warning/40 dark:bg-warning/40 dark:text-warning",
		},
		high: {
			label: "High",
			className:
				"border-warning/60 bg-warning/60 text-warning dark:border-warning/40 dark:bg-warning/40 dark:text-warning",
		},
		urgent: {
			label: "Urgent",
			className:
				"border-destructive/60 bg-destructive/60 text-destructive dark:border-destructive/40 dark:bg-destructive/40 dark:text-destructive",
		},
	};

	const key = (priority ?? "medium") as keyof typeof config;
	const { label, className } = config[key];

	return (
		<Badge className={cn("text-xs font-medium", className)} variant="outline">
			{label}
		</Badge>
	);
}

function JobCardContent({ item }: { item: JobsKanbanItem }) {
	const job = item.entity;
	const columnId = item.columnId as JobStatus | undefined;
	const scheduledRange = formatScheduledRange(job);
	const propertySummary = getPropertySummary(job);

	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<Link
						className="text-muted-foreground hover:text-primary block text-xs font-semibold tracking-wide uppercase"
						href={`/dashboard/work/${job.id}`}
					>
						{String(job.jobNumber ?? "—")}
					</Link>
					<h3 className="text-foreground text-sm leading-snug font-semibold">
						{job.title ?? "Untitled Job"}
					</h3>
					<div className="flex flex-wrap items-center gap-2">
						{job.jobType && (
							<Badge className="bg-primary/10 text-primary" variant="secondary">
								{job.jobType}
							</Badge>
						)}
						<PriorityBadge priority={(job.priority ?? "medium") as string} />
						{typeof job.aiPriorityScore === "number" && (
							<Badge
								className="border-primary/40 bg-primary/5 text-primary border-dashed"
								variant="outline"
							>
								AI Score {job.aiPriorityScore}
							</Badge>
						)}
					</div>
				</div>
				<span className="text-foreground text-sm font-semibold">
					{formatCurrency(job.totalAmount)}
				</span>
			</div>

			{job.description && (
				<p className="text-muted-foreground line-clamp-3 text-xs">
					{job.description}
				</p>
			)}

			<div className="text-muted-foreground space-y-2 text-xs">
				<div className="flex items-center gap-2">
					<BriefcaseBusiness className="text-primary size-4" />
					<span className="text-foreground font-medium">
						{getCustomerName(job)}
					</span>
				</div>

				{propertySummary && (
					<div className="flex items-center gap-2">
						<MapPin className="text-primary size-4" />
						<span>{propertySummary}</span>
					</div>
				)}

				{scheduledRange && (
					<div className="flex items-center gap-2">
						<CalendarDays className="text-primary size-4" />
						<span>{scheduledRange}</span>
					</div>
				)}
			</div>

			<div className="text-muted-foreground flex items-center justify-between pt-2 text-[11px] tracking-wide">
				<span>Updated {formatDate(job.updatedAt, { preset: "short" })}</span>
				<span className="uppercase">
					{columnId ? (COLUMN_LABEL.get(columnId) ?? columnId) : "—"}
				</span>
			</div>

			<div className="flex items-center justify-end pt-1">
				<Button
					asChild
					className="text-primary gap-1 text-xs"
					size="sm"
					variant="ghost"
				>
					<Link href={`/dashboard/work/${job.id}`}>
						View
						<ArrowUpRight className="size-3.5" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

export function JobsKanban({ jobs }: JobsKanbanProps) {
	const { toast } = useToast();
	const [_isPending, startTransition] = useTransition();

	const handleItemMove = async ({
		item,
		fromColumnId,
		toColumnId,
	}: KanbanMoveEvent<KanbanItemBase & { entity: ExtendedJob }>) => {
		if (fromColumnId === toColumnId) {
			return;
		}

		startTransition(() => {
			void (async () => {
				const { updateJobStatus } = await import("@/actions/jobs");
				const result = await updateJobStatus(item.entity.id, toColumnId);

				if (!result.success) {
					toast.error("Unable to move job", {
						description: result.error,
					});
					return;
				}

				toast.success(
					`Job ${item.entity.jobNumber} moved to ${COLUMN_LABEL.get(toColumnId as JobStatus)}`,
				);
			})();
		});
	};

	return (
		<EntityKanban<ExtendedJob, JobStatus>
			calculateColumnMeta={(columnId, items) => {
				const columnItems = items.filter((item) => item.columnId === columnId);
				const total = columnItems.reduce(
					(sum, item) => sum + (item.entity.totalAmount ?? 0),
					0,
				);
				return { count: columnItems.length, total };
			}}
			columns={JOB_STATUS_COLUMNS}
			data={jobs}
			entityName="jobs"
			formatTotal={(total) => formatCurrency(total)}
			mapToKanbanItem={(job) => ({
				id: job.id,
				columnId: resolveStatus(job.status),
				entity: job,
			})}
			onItemMove={handleItemMove}
			renderCard={(item) => <JobCardContent item={item as JobsKanbanItem} />}
			renderDragOverlay={(item) => (
				<div className="border-border/70 bg-background/95 w-[280px] rounded-md border p-3 shadow-lg">
					<JobCardContent item={item as JobsKanbanItem} />
				</div>
			)}
			showTotals={true}
			updateEntityStatus={(job, newStatus) => ({
				...job,
				status: newStatus,
			})}
		/>
	);
}
