"use client";

import {
	Archive,
	CheckCircle,
	Clock,
	Edit,
	MoreHorizontal,
	Trash2,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type JobTask = {
	id: string;
	title: string;
	description?: string;
	category?: string;
	is_completed: boolean;
	is_required?: boolean;
	completed_at?: string;
	due_date?: string;
	assigned_user?:
		| {
				id: string;
				name: string;
				email?: string;
				phone?: string;
				avatar?: string;
		  }
		| Array<{
				id: string;
				name: string;
				email?: string;
				phone?: string;
				avatar?: string;
		  }>;
};

type JobTasksTableProps = {
	tasks: JobTask[];
	onToggleComplete?: (
		taskId: string,
		completed: boolean,
	) => Promise<{ success: boolean; error?: string }>;
	onDeleteTask?: (
		taskId: string,
	) => Promise<{ success: boolean; error?: string }>;
};

export function JobTasksTable({
	tasks,
	onToggleComplete,
	onDeleteTask,
}: JobTasksTableProps) {
	const router = useRouter();
	const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isArchiving, setIsArchiving] = useState(false);

	const handleDeleteTask = useCallback(async () => {
		if (!deleteTaskId || !onDeleteTask) {
			return;
		}

		setIsDeleting(true);
		try {
			const result = await onDeleteTask(deleteTaskId);

			if (result.success) {
				toast.success("Task deleted");
				setDeleteTaskId(null);
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete task");
			}
		} catch (_error) {
			toast.error("Failed to delete task");
		} finally {
			setIsDeleting(false);
		}
	}, [deleteTaskId, onDeleteTask, router]);

	const handleArchive = useCallback(async () => {
		if (selectedIds.size === 0) {
			return;
		}

		setIsArchiving(true);
		try {
			const result = await bulkArchive(Array.from(selectedIds), "job_task");

			if (result.success && result.data) {
				toast.success(
					`Successfully archived ${result.data.archived} task${result.data.archived === 1 ? "" : "s"}`,
				);
				setShowArchiveDialog(false);
				setSelectedIds(new Set());
				router.refresh();
			} else {
				toast.error("Failed to archive tasks");
			}
		} catch (_error) {
			toast.error("Failed to archive tasks");
		} finally {
			setIsArchiving(false);
		}
	}, [selectedIds, router]);

	const handleToggleComplete = useCallback(
		async (taskId: string, currentStatus: boolean) => {
			if (!onToggleComplete) {
				return;
			}

			try {
				const result = await onToggleComplete(taskId, !currentStatus);

				if (result.success) {
					toast.success(
						currentStatus ? "Task marked incomplete" : "Task completed",
					);
					router.refresh();
				} else {
					toast.error(result.error || "Failed to update task");
				}
			} catch (_error) {
				toast.error("Failed to update task");
			}
		},
		[onToggleComplete, router],
	);

	const getCategoryDisplay = useCallback((category?: string) => {
		if (!category) return "Other";
		return category;
	}, []);

	const getCategoryVariant = useCallback(
		(category?: string): "default" | "secondary" | "outline" => {
			switch (category) {
				case "Pre-Job":
					return "default";
				case "On-Site":
					return "secondary";
				case "Post-Job":
					return "outline";
				case "Safety":
					return "default";
				case "Quality":
					return "secondary";
				default:
					return "outline";
			}
		},
		[],
	);

	const completedTasks = tasks.filter((t) => t.is_completed).length;
	const totalTasks = tasks.length;
	const progressPercentage =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const bulkActions: BulkAction[] = useMemo(
		() => [
			{
				label: "Archive Selected",
				icon: <Archive className="h-4 w-4" />,
				variant: "destructive",
				onClick: (selectedIds: Set<string>) => {
					setSelectedIds(selectedIds);
					setShowArchiveDialog(true);
				},
			},
		],
		[],
	);

	const columns: ColumnDef<JobTask>[] = useMemo(
		() => [
			{
				key: "status",
				header: "",
				width: "w-12",
				shrink: true,
				align: "center",
				render: (task) => (
					<button
						className="flex items-center justify-center"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleComplete(task.id, task.is_completed);
						}}
						type="button"
						disabled={!onToggleComplete}
					>
						<input
							checked={task.is_completed}
							className={cn(
								"border-border h-5 w-5 cursor-pointer rounded focus:ring-2",
								task.is_completed
									? "text-success focus:ring-green-500"
									: "focus:ring-primary",
							)}
							onChange={() => {}}
							type="checkbox"
							disabled={!onToggleComplete}
						/>
					</button>
				),
			},
			{
				key: "title",
				header: "Task",
				render: (task) => (
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span
								className={cn(
									"text-xs font-medium",
									task.is_completed && "text-muted-foreground line-through",
								)}
							>
								{task.title}
							</span>
							{task.is_required && (
								<Badge variant="destructive" className="text-xs">
									Required
								</Badge>
							)}
						</div>
						{task.description && (
							<p className="text-muted-foreground line-clamp-2 text-xs">
								{task.description}
							</p>
						)}
					</div>
				),
			},
			{
				key: "category",
				header: "Category",
				width: "w-28",
				shrink: true,
				hideOnMobile: true,
				render: (task) => (
					<Badge
						variant={getCategoryVariant(task.category)}
						className="font-normal"
					>
						{getCategoryDisplay(task.category)}
					</Badge>
				),
			},
			{
				key: "assigned_user",
				header: "Assigned To",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (task) => {
					const assignedUser = Array.isArray(task.assigned_user)
						? task.assigned_user[0]
						: task.assigned_user;

					if (!assignedUser) {
						return <span className="text-muted-foreground text-xs">—</span>;
					}

					return (
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarImage src={assignedUser.avatar} />
								<AvatarFallback className="text-xs">
									{assignedUser.name?.substring(0, 2).toUpperCase() || "TM"}
								</AvatarFallback>
							</Avatar>
							<span className="max-w-24 truncate text-xs">
								{assignedUser.name}
							</span>
						</div>
					);
				},
			},
			{
				key: "due_date",
				header: "Due Date",
				width: "w-32",
				shrink: true,
				hideOnMobile: true,
				render: (task) => {
					if (task.is_completed && task.completed_at) {
						return (
							<div className="text-success flex items-center gap-1 text-xs">
								<CheckCircle className="size-3" />
								{formatDate(task.completed_at, "short")}
							</div>
						);
					}

					if (task.due_date) {
						const isOverdue =
							new Date(task.due_date) < new Date() && !task.is_completed;
						return (
							<div
								className={cn(
									"flex items-center gap-1 text-xs",
									isOverdue ? "text-destructive" : "text-muted-foreground",
								)}
							>
								<Clock className="size-3" />
								{formatDate(task.due_date, "short")}
							</div>
						);
					}

					return <span className="text-muted-foreground text-xs">—</span>;
				},
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (task) => {
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="size-8 p-0" size="sm" variant="ghost">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() =>
										handleToggleComplete(task.id, task.is_completed)
									}
									disabled={!onToggleComplete}
								>
									<CheckCircle className="mr-2 size-4" />
									{task.is_completed ? "Mark Incomplete" : "Mark Complete"}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<Edit className="mr-2 size-4" />
									Edit Task
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive cursor-pointer"
									onClick={() => {
										setSelectedIds(new Set([task.id]));
										setShowArchiveDialog(true);
									}}
								>
									<Archive className="mr-2 size-4" />
									Archive Task
								</DropdownMenuItem>
								{onDeleteTask && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive focus:text-destructive cursor-pointer"
											onClick={() => setDeleteTaskId(task.id)}
										>
											<Trash2 className="mr-2 size-4" />
											Delete Task
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[
			handleToggleComplete,
			getCategoryDisplay,
			getCategoryVariant,
			onToggleComplete,
			onDeleteTask,
		],
	);

	return (
		<>
			{totalTasks > 0 && (
				<div className="bg-muted/30 border-border mb-4 rounded-lg border p-4">
					<div className="mb-2 flex items-center justify-between text-xs">
						<span className="font-medium">Overall Progress</span>
						<span className="text-muted-foreground">
							{completedTasks} of {totalTasks} completed ({progressPercentage}%)
						</span>
					</div>
					<div className="bg-muted h-2 w-full overflow-hidden rounded-full">
						<div
							className="bg-success h-full transition-all"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			)}

			<FullWidthDataTable
				{...TablePresets.compact()}
				bulkActions={bulkActions}
				columns={columns}
				data={tasks}
				emptyIcon={<CheckCircle className="text-muted-foreground/50 size-12" />}
				emptyMessage="No tasks added yet. Create a step-by-step checklist for the field crew."
				getItemId={(task) => task.id}
				noPadding={true}
				searchFilter={(task, query) => {
					const searchLower = query.toLowerCase();
					return (
						task.title.toLowerCase().includes(searchLower) ||
						task.description?.toLowerCase().includes(searchLower) ||
						task.category?.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search tasks..."
				getRowClassName={(task) =>
					cn(
						task.is_completed && "bg-secondary/30 opacity-75",
						task.is_required &&
							!task.is_completed &&
							"border-l-2 border-l-destructive",
					)
				}
			/>

			<ArchiveConfirmDialog
				entityType="task"
				isLoading={isArchiving}
				itemCount={selectedIds.size}
				onConfirm={handleArchive}
				onOpenChange={setShowArchiveDialog}
				open={showArchiveDialog}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setDeleteTaskId(null)}
				open={deleteTaskId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Task?</DialogTitle>
						<DialogDescription>
							This will permanently delete this task. This action cannot be
							undone. Are you sure you want to continue?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isDeleting}
							onClick={() => setDeleteTaskId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isDeleting}
							onClick={handleDeleteTask}
							variant="destructive"
						>
							{isDeleting ? "Deleting..." : "Delete Task"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
