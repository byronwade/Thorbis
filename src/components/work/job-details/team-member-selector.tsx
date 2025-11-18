/**
 * Team Member Selector - Server Actions + useOptimistic (React 19)
 *
 * Performance optimizations:
 * - useOptimistic for instant assignment/removal
 * - Server Actions for mutations with auto-revalidation
 * - No external state management needed
 *
 * Client component for selecting and displaying multiple team members
 * with avatar display and role badges.
 *
 * Features:
 * - Multi-select dropdown with search
 * - Avatar display in dropdown and selected items
 * - Inline display similar to title editing
 * - Role badge for primary assignment
 * - Quick add/remove functionality
 * - Optimistic updates
 */

"use client";

import {
	Check,
	ChevronsUpDown,
	Loader2,
	UserPlus,
	Users,
	X,
} from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	assignTeamMemberToJob,
	getAvailableTeamMembers,
	getJobTeamAssignments,
	removeTeamMemberFromJob,
	type TeamMemberAssignment,
} from "@/actions/team-assignments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TeamMemberSelectorProps = {
	jobId: string;
	isEditMode: boolean;
	initialAssignments?: TeamMemberAssignment[];
	initialAvailableMembers?: TeamMember[];
};

type TeamMember = {
	id: string;
	userId: string;
	jobTitle: string | null;
	user: {
		id: string;
		email: string;
		firstName: string | null;
		lastName: string | null;
		avatarUrl: string | null;
	};
};

// eslint-disable-next-line complexity
export function TeamMemberSelector({
	jobId,
	isEditMode,
	initialAssignments = [],
	initialAvailableMembers = [],
}: TeamMemberSelectorProps) {
	// Local UI state
	const [open, setOpen] = useState(false);
	const [showAll, setShowAll] = useState(false);
	const [showAllEdit, setShowAllEdit] = useState(false);
	const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

	// Data state
	const [availableMembers, setAvailableMembers] = useState<TeamMember[]>(
		initialAvailableMembers,
	);
	const [assignments, setAssignments] =
		useState<TeamMemberAssignment[]>(initialAssignments);
	const [isLoading, setIsLoading] = useState(
		initialAssignments.length === 0 && initialAvailableMembers.length === 0,
	);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const [optimisticAssignments, updateOptimisticAssignments] = useOptimistic(
		assignments,
		(
			state,
			update: TeamMemberAssignment | { id: string; action: "delete" },
		) => {
			if ("action" in update && update.action === "delete") {
				return state.filter((assignment) => assignment.id !== update.id);
			}
			return [...state, update as TeamMemberAssignment];
		},
	);

	// Load data on mount
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			setError(null);

			// Fetch available team members
			const membersResult = await getAvailableTeamMembers();
			if (!membersResult.success) {
				setError(membersResult.error || "Failed to fetch team members");
			} else {
				setAvailableMembers(membersResult.data || []);
			}

			// Fetch job assignments
			const assignmentsResult = await getJobTeamAssignments(jobId);
			if (!assignmentsResult.success) {
				setError(assignmentsResult.error || "Failed to fetch assignments");
			} else {
				setAssignments(assignmentsResult.data || []);
			}

			setIsLoading(false);
		};

		if (
			initialAssignments.length === 0 &&
			initialAvailableMembers.length === 0
		) {
			loadData();
		}
	}, [jobId, initialAssignments.length, initialAvailableMembers.length]);

	// Helper functions
	const getInitials = (firstName: string | null, lastName: string | null) => {
		const first = firstName || "";
		const last = lastName || "";
		return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
	};

	const getFullName = (firstName: string | null, lastName: string | null) =>
		`${firstName || ""} ${lastName || ""}`.trim() || "Unknown";

	const isAssigned = (teamMemberId: string) =>
		optimisticAssignments.some((a) => a.teamMemberId === teamMemberId);

	// Handlers
	const handleAssign = async (teamMemberId: string) => {
		const role = assignments.length === 0 ? "primary" : "crew";

		// Create temporary assignment for optimistic update
		const tempAssignment: TeamMemberAssignment = {
			id: `temp-${Date.now()}`,
			jobId,
			teamMemberId,
			role,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teamMember: availableMembers.find((m) => m.id === teamMemberId) || {
				id: teamMemberId,
				userId: "",
				jobTitle: null,
				user: {
					id: "",
					email: "",
					firstName: null,
					lastName: null,
					avatarUrl: null,
				},
			},
		};

		setProcessingIds((prev) => new Set(prev).add(teamMemberId));

		startTransition(async () => {
			updateOptimisticAssignments(tempAssignment);

			const result = await assignTeamMemberToJob({
				jobId,
				teamMemberId,
				role,
			});

			if (result.success) {
				toast.success("Team member assigned");
				setShowAll(false);
				setShowAllEdit(false);
				// Refresh assignments
				const refreshResult = await getJobTeamAssignments(jobId);
				if (refreshResult.success) {
					setAssignments(refreshResult.data || []);
				}
			} else {
				toast.error(result.error || "Failed to assign team member");
				// Revert optimistic update
				setAssignments((prev) =>
					prev.filter((a) => a.id !== tempAssignment.id),
				);
			}

			setProcessingIds((prev) => {
				const next = new Set(prev);
				next.delete(teamMemberId);
				return next;
			});
		});
	};

	const handleRemove = async (teamMemberId: string) => {
		const assignmentToRemove = assignments.find(
			(a) => a.teamMemberId === teamMemberId,
		);
		if (!assignmentToRemove) return;

		setProcessingIds((prev) => new Set(prev).add(teamMemberId));

		startTransition(async () => {
			updateOptimisticAssignments({
				id: assignmentToRemove.id,
				action: "delete",
			});

			const result = await removeTeamMemberFromJob({
				jobId,
				teamMemberId,
			});

			if (result.success) {
				toast.success("Team member removed");
				setShowAll(false);
				setShowAllEdit(false);
			} else {
				toast.error(result.error || "Failed to remove team member");
			}

			// Refresh assignments
			const refreshResult = await getJobTeamAssignments(jobId);
			if (refreshResult.success) {
				setAssignments(refreshResult.data || []);
			}

			setProcessingIds((prev) => {
				const next = new Set(prev);
				next.delete(teamMemberId);
				return next;
			});
		});
	};

	const handleToggle = (teamMemberId: string) => {
		if (isAssigned(teamMemberId)) {
			handleRemove(teamMemberId);
		} else {
			handleAssign(teamMemberId);
		}
	};

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="flex items-center gap-2">
				<Skeleton className="h-8 w-8 rounded-full" />
				<Skeleton className="h-8 w-8 rounded-full" />
				<Skeleton className="h-8 w-24" />
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="text-destructive flex items-center gap-2 text-sm">
				<Users className="h-4 w-4" />
				<span>Failed to load team members: {error}</span>
			</div>
		);
	}

	// Display mode: Show assigned members (compact avatar stack for many members)
	if (!isEditMode) {
		if (optimisticAssignments.length === 0) {
			return (
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Users className="h-4 w-4" />
					<span>No team assigned</span>
				</div>
			);
		}

		const MAX_VISIBLE_AVATARS = 5;
		const visibleAssignments = optimisticAssignments.slice(
			0,
			MAX_VISIBLE_AVATARS,
		);
		const remainingCount = Math.max(
			0,
			optimisticAssignments.length - MAX_VISIBLE_AVATARS,
		);

		return (
			<div className="space-y-2">
				{/* Avatar Stack */}
				<div className="flex items-center gap-2">
					<div className="flex -space-x-2">
						{visibleAssignments.map((assignment) => (
							<Avatar
								className="border-background ring-muted h-8 w-8 border-2 ring-1 transition-transform hover:z-10 hover:scale-110"
								key={assignment.id}
								title={getFullName(
									assignment.teamMember.user.firstName,
									assignment.teamMember.user.lastName,
								)}
							>
								<AvatarImage
									alt={getFullName(
										assignment.teamMember.user.firstName,
										assignment.teamMember.user.lastName,
									)}
									src={assignment.teamMember.user.avatarUrl || undefined}
								/>
								<AvatarFallback className="text-xs">
									{getInitials(
										assignment.teamMember.user.firstName,
										assignment.teamMember.user.lastName,
									)}
								</AvatarFallback>
							</Avatar>
						))}
						{remainingCount > 0 && (
							<div
								className="border-background bg-muted text-muted-foreground ring-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium ring-1"
								title={`${remainingCount} more team member${remainingCount === 1 ? "" : "s"}`}
							>
								+{remainingCount}
							</div>
						)}
					</div>

					{/* Team count and toggle */}
					{optimisticAssignments.length > 1 && (
						<Button
							className="text-muted-foreground hover:text-foreground h-auto p-1 text-xs"
							onClick={() => setShowAll(!showAll)}
							size="sm"
							variant="ghost"
						>
							{showAll
								? "Show less"
								: `View all ${optimisticAssignments.length}`}
						</Button>
					)}
				</div>

				{/* Expanded List */}
				{showAll && (
					<div className="flex flex-wrap gap-2">
						{optimisticAssignments.map((assignment) => (
							<div
								className="bg-muted/30 flex items-center gap-2 rounded-md border px-2 py-1"
								key={assignment.id}
							>
								<Avatar className="h-6 w-6">
									<AvatarImage
										alt={getFullName(
											assignment.teamMember.user.firstName,
											assignment.teamMember.user.lastName,
										)}
										src={assignment.teamMember.user.avatarUrl || undefined}
									/>
									<AvatarFallback className="text-[10px]">
										{getInitials(
											assignment.teamMember.user.firstName,
											assignment.teamMember.user.lastName,
										)}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm">
									{getFullName(
										assignment.teamMember.user.firstName,
										assignment.teamMember.user.lastName,
									)}
								</span>
								{assignment.role === "primary" && (
									<Badge className="text-xs" variant="secondary">
										Lead
									</Badge>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	// Edit mode: Show selector with assigned members (compact for many members)
	const MAX_VISIBLE_IN_EDIT = 10;
	const visibleInEdit = showAllEdit
		? optimisticAssignments
		: optimisticAssignments.slice(0, MAX_VISIBLE_IN_EDIT);
	const remainingInEdit = Math.max(
		0,
		optimisticAssignments.length - MAX_VISIBLE_IN_EDIT,
	);

	return (
		<div className="space-y-3">
			{/* Assigned Members */}
			{optimisticAssignments.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-xs">
							{optimisticAssignments.length} team member
							{optimisticAssignments.length === 1 ? "" : "s"} assigned
						</span>
						{optimisticAssignments.length > MAX_VISIBLE_IN_EDIT && (
							<Button
								className="text-muted-foreground hover:text-foreground h-auto p-1 text-xs"
								onClick={() => setShowAllEdit(!showAllEdit)}
								size="sm"
								variant="ghost"
							>
								{showAllEdit
									? "Show less"
									: `Show all ${optimisticAssignments.length}`}
							</Button>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{visibleInEdit.map((assignment) => {
							const isTemp = assignment.id.startsWith("temp-");
							return (
								<div
									className="group bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-md border px-2 py-1 transition-colors"
									key={assignment.id}
									style={{ opacity: isTemp ? 0.5 : 1 }}
								>
									<Avatar className="h-6 w-6">
										<AvatarImage
											alt={getFullName(
												assignment.teamMember.user.firstName,
												assignment.teamMember.user.lastName,
											)}
											src={assignment.teamMember.user.avatarUrl || undefined}
										/>
										<AvatarFallback className="text-[10px]">
											{getInitials(
												assignment.teamMember.user.firstName,
												assignment.teamMember.user.lastName,
											)}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">
										{getFullName(
											assignment.teamMember.user.firstName,
											assignment.teamMember.user.lastName,
										)}
									</span>
									{assignment.role === "primary" && (
										<Badge className="text-xs" variant="secondary">
											Lead
										</Badge>
									)}
									<button
										className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
										disabled={
											processingIds.has(assignment.teamMemberId) || isTemp
										}
										onClick={() => handleRemove(assignment.teamMemberId)}
										type="button"
									>
										{processingIds.has(assignment.teamMemberId) ? (
											<Loader2 className="h-3 w-3 animate-spin" />
										) : (
											<X className="text-muted-foreground hover:text-destructive h-3 w-3" />
										)}
									</button>
								</div>
							);
						})}
						{!showAllEdit && remainingInEdit > 0 && (
							<div className="text-muted-foreground flex items-center gap-1 rounded-md border border-dashed px-2 py-1 text-xs">
								+{remainingInEdit} more
							</div>
						)}
					</div>
				</div>
			)}

			{/* Add Team Member Popover */}
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						aria-expanded={open}
						className="w-fit gap-2"
						role="combobox"
						size="sm"
						variant="outline"
					>
						<UserPlus className="h-4 w-4" />
						<span>Add Team Member</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-[320px] p-0">
					<Command>
						<CommandInput placeholder="Search team members..." />
						<CommandList className="max-h-[400px]">
							<CommandEmpty>No team members found.</CommandEmpty>
							<CommandGroup
								heading={`Available Team Members (${availableMembers.length})`}
							>
								{availableMembers.map((member) => {
									const assigned = isAssigned(member.id);
									const processing = processingIds.has(member.id);

									return (
										<CommandItem
											className="flex items-center gap-2"
											disabled={processing || isPending}
											key={member.id}
											onSelect={() => handleToggle(member.id)}
											value={`${member.user.firstName} ${member.user.lastName} ${member.user.email}`}
										>
											{/* Checkbox */}
											<div
												className={cn(
													"flex h-4 w-4 items-center justify-center rounded-sm border",
													assigned
														? "border-primary bg-primary text-primary-foreground"
														: "border-muted-foreground",
												)}
											>
												{assigned && <Check className="h-3 w-3" />}
											</div>

											{/* Avatar */}
											<Avatar className="h-6 w-6">
												<AvatarImage
													alt={getFullName(
														member.user.firstName,
														member.user.lastName,
													)}
													src={member.user.avatarUrl || undefined}
												/>
												<AvatarFallback className="text-[10px]">
													{getInitials(
														member.user.firstName,
														member.user.lastName,
													)}
												</AvatarFallback>
											</Avatar>

											{/* Name and Title */}
											<div className="flex flex-1 flex-col">
												<span className="text-sm">
													{getFullName(
														member.user.firstName,
														member.user.lastName,
													)}
												</span>
												{member.jobTitle && (
													<span className="text-muted-foreground text-xs">
														{member.jobTitle}
													</span>
												)}
											</div>

											{/* Loading spinner */}
											{processing && (
												<Loader2 className="h-4 w-4 animate-spin" />
											)}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
