/**
 * Team Member Selector - Inline Multi-Select with Avatars
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
import { useCallback, useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

type TeamMemberSelectorProps = {
	jobId: string;
	isEditMode: boolean;
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
}: TeamMemberSelectorProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
	const [assignments, setAssignments] = useState<TeamMemberAssignment[]>([]);
	const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
	const [showAll, setShowAll] = useState(false);
	const [showAllEdit, setShowAllEdit] = useState(false);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [membersResult, assignmentsResult] = await Promise.all([
				getAvailableTeamMembers(),
				getJobTeamAssignments(jobId),
			]);

			if (membersResult.success && membersResult.data) {
				setAvailableMembers(membersResult.data);
			}

			if (assignmentsResult.success && assignmentsResult.data) {
				setAssignments(assignmentsResult.data);
			}
		} catch {
			toast.error("Failed to load team members");
		} finally {
			setLoading(false);
		}
	}, [jobId]);

	// Load data on mount and jobId change
	useEffect(() => {
		loadData();
	}, [loadData]);

	// Reset collapsible states when assignments change
	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		setShowAll(false);
		setShowAllEdit(false);
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	// Helper functions
	const getInitials = (firstName: string | null, lastName: string | null) => {
		const first = firstName || "";
		const last = lastName || "";
		return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
	};

	const getFullName = (firstName: string | null, lastName: string | null) =>
		`${firstName || ""} ${lastName || ""}`.trim() || "Unknown";

	const isAssigned = (teamMemberId: string) =>
		assignments.some((a) => a.teamMemberId === teamMemberId);

	// Handle assignment
	const handleAssign = async (teamMemberId: string) => {
		setProcessingIds((prev) => new Set(prev).add(teamMemberId));

		try {
			const result = await assignTeamMemberToJob({
				jobId,
				teamMemberId,
				role: assignments.length === 0 ? "primary" : "crew",
			});

			if (result.success) {
				// Reload assignments and close collapsibles
				await loadData();
				setShowAll(false);
				setShowAllEdit(false);
				toast.success("Team member assigned");
			} else {
				toast.error("Failed to assign team member");
			}
		} catch {
			toast.error("Failed to assign team member");
		} finally {
			setProcessingIds((prev) => {
				const next = new Set(prev);
				next.delete(teamMemberId);
				return next;
			});
		}
	};

	// Handle removal
	const handleRemove = async (teamMemberId: string) => {
		setProcessingIds((prev) => new Set(prev).add(teamMemberId));

		try {
			const result = await removeTeamMemberFromJob({
				jobId,
				teamMemberId,
			});

			if (result.success) {
				// Reload assignments and close collapsibles
				await loadData();
				setShowAll(false);
				setShowAllEdit(false);
				toast.success("Team member removed");
			} else {
				toast.error("Failed to remove team member");
			}
		} catch {
			toast.error("Failed to remove team member");
		} finally {
			setProcessingIds((prev) => {
				const next = new Set(prev);
				next.delete(teamMemberId);
				return next;
			});
		}
	};

	// Toggle assignment
	const handleToggle = async (teamMemberId: string) => {
		if (isAssigned(teamMemberId)) {
			await handleRemove(teamMemberId);
		} else {
			await handleAssign(teamMemberId);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span>Loading team members...</span>
			</div>
		);
	}

	// Display mode: Show assigned members (compact avatar stack for many members)
	if (!isEditMode) {
		if (assignments.length === 0) {
			return (
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Users className="h-4 w-4" />
					<span>No team assigned</span>
				</div>
			);
		}

		const MAX_VISIBLE_AVATARS = 5;
		const visibleAssignments = assignments.slice(0, MAX_VISIBLE_AVATARS);
		const remainingCount = Math.max(
			0,
			assignments.length - MAX_VISIBLE_AVATARS,
		);

		return (
			<div className="space-y-2">
				{/* Avatar Stack */}
				<div className="flex items-center gap-2">
					<div className="-space-x-2 flex">
						{visibleAssignments.map((assignment) => (
							<Avatar
								className="h-8 w-8 border-2 border-background ring-1 ring-muted transition-transform hover:z-10 hover:scale-110"
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
								className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-muted-foreground text-xs ring-1 ring-muted"
								title={`${remainingCount} more team member${remainingCount === 1 ? "" : "s"}`}
							>
								+{remainingCount}
							</div>
						)}
					</div>

					{/* Team count and toggle */}
					{assignments.length > 1 && (
						<Button
							className="h-auto p-1 text-muted-foreground text-xs hover:text-foreground"
							onClick={() => setShowAll(!showAll)}
							size="sm"
							variant="ghost"
						>
							{showAll ? "Show less" : `View all ${assignments.length}`}
						</Button>
					)}
				</div>

				{/* Expanded List */}
				{showAll && (
					<div className="flex flex-wrap gap-2">
						{assignments.map((assignment) => (
							<div
								className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1"
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
		? assignments
		: assignments.slice(0, MAX_VISIBLE_IN_EDIT);
	const remainingInEdit = Math.max(0, assignments.length - MAX_VISIBLE_IN_EDIT);

	return (
		<div className="space-y-3">
			{/* Assigned Members */}
			{assignments.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-xs">
							{assignments.length} team member
							{assignments.length === 1 ? "" : "s"} assigned
						</span>
						{assignments.length > MAX_VISIBLE_IN_EDIT && (
							<Button
								className="h-auto p-1 text-muted-foreground text-xs hover:text-foreground"
								onClick={() => setShowAllEdit(!showAllEdit)}
								size="sm"
								variant="ghost"
							>
								{showAllEdit ? "Show less" : `Show all ${assignments.length}`}
							</Button>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{visibleInEdit.map((assignment) => (
							<div
								className="group flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1 transition-colors hover:bg-muted/50"
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
								<button
									className="ml-1 opacity-0 transition-opacity disabled:opacity-50 group-hover:opacity-100"
									disabled={processingIds.has(assignment.teamMemberId)}
									onClick={() => handleRemove(assignment.teamMemberId)}
									type="button"
								>
									{processingIds.has(assignment.teamMemberId) ? (
										<Loader2 className="h-3 w-3 animate-spin" />
									) : (
										<X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
									)}
								</button>
							</div>
						))}
						{!showAllEdit && remainingInEdit > 0 && (
							<div className="flex items-center gap-1 rounded-md border border-dashed px-2 py-1 text-muted-foreground text-xs">
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
											disabled={processing}
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
