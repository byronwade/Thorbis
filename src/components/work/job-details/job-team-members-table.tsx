"use client";

import {
	AlertCircle,
	Eye,
	MoreHorizontal,
	UserMinus,
	UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";

import { formatDate } from "@/lib/formatters";

type TeamMember = {
	id: string;
	user_id: string;
	team_member: {
		job_title?: string;
		user: {
			name?: string;
			email?: string;
			avatar_url?: string;
			first_name?: string;
			last_name?: string;
		};
	};
	assigned_at: string;
	role?: string;
};

type JobTeamMembersTableProps = {
	teamMembers: TeamMember[];
	onRemoveMember?: (
		memberId: string,
	) => Promise<{ success: boolean; error?: string }>;
};

export function JobTeamMembersTable({
	teamMembers,
	onRemoveMember,
}: JobTeamMembersTableProps) {
	const router = useRouter();
	const [removeMemberId, setRemoveMemberId] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemoveMember = useCallback(async () => {
		if (!removeMemberId || !onRemoveMember) {
			return;
		}

		setIsRemoving(true);
		try {
			const result = await onRemoveMember(removeMemberId);

			if (result.success) {
				toast.success("Team member removed from job");
				setRemoveMemberId(null);
				// Refresh to show updated list
				router.refresh();
			} else {
				toast.error(result.error || "Failed to remove team member");
			}
		} catch (_error) {
			toast.error("Failed to remove team member");
		} finally {
			setIsRemoving(false);
		}
	}, [removeMemberId, onRemoveMember, router]);

	const getFullName = useCallback((member: TeamMember) => {
		const user = member.team_member.user;
		if (user.name) return user.name;
		if (user.first_name || user.last_name) {
			return [user.first_name, user.last_name].filter(Boolean).join(" ");
		}
		return user.email || "Unknown User";
	}, []);

	const getInitials = useCallback((member: TeamMember) => {
		const user = member.team_member.user;
		if (user.first_name && user.last_name) {
			return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
		}
		const name = user.name || user.email || "?";
		const parts = name.split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	}, []);

	const columns: ColumnDef<TeamMember>[] = useMemo(
		() => [
			{
				key: "name",
				header: "Name",
				render: (member) => {
					const fullName = getFullName(member);
					const initials = getInitials(member);
					const avatarUrl = member.team_member.user.avatar_url;

					return (
						<Link
							className="flex items-center gap-2.5 text-xs leading-tight hover:underline"
							href={`/dashboard/team/${member.user_id}`}
							onClick={(e) => e.stopPropagation()}
						>
							<Avatar className="size-8">
								{avatarUrl && <AvatarImage alt={fullName} src={avatarUrl} />}
								<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="text-foreground font-medium">{fullName}</span>
								{member.team_member.user.email && (
									<span className="text-muted-foreground text-xs">
										{member.team_member.user.email}
									</span>
								)}
							</div>
						</Link>
					);
				},
			},
			{
				key: "job_title",
				header: "Job Title",
				width: "w-40",
				shrink: true,
				hideOnMobile: true,
				render: (member) => (
					<span className="text-xs">{member.team_member.job_title || "—"}</span>
				),
			},
			{
				key: "role",
				header: "Role",
				width: "w-32",
				shrink: true,
				render: (member) => (
					<span className="text-xs">{member.role || "Team Member"}</span>
				),
			},
			{
				key: "assigned_at",
				header: "Assigned Date",
				width: "w-32",
				shrink: true,
				hideOnMobile: true,
				render: (member) => (
					<span className="text-xs">
						{formatDate(member.assigned_at, "short")}
					</span>
				),
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (member) => {
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="size-8 p-0" size="sm" variant="ghost">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem className="cursor-pointer" asChild>
									<Link href={`/dashboard/team/${member.user_id}`}>
										<Eye className="mr-2 size-4" />
										View Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive cursor-pointer"
									onClick={() => setRemoveMemberId(member.id)}
									disabled={!onRemoveMember}
								>
									<UserMinus className="mr-2 size-4" />
									Remove from Job
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[getFullName, getInitials, onRemoveMember],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				columns={columns}
				data={teamMembers}
				emptyIcon={<UserX className="text-muted-foreground/50 size-12" />}
				emptyMessage="No team members assigned to this job"
				getItemId={(member) => member.id}
				noPadding={true}
				searchFilter={(member, query) => {
					const searchLower = query.toLowerCase();
					const fullName = getFullName(member);
					return (
						fullName.toLowerCase().includes(searchLower) ||
						member.team_member.user.email
							?.toLowerCase()
							.includes(searchLower) ||
						member.team_member.job_title?.toLowerCase().includes(searchLower) ||
						member.role?.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search team members..."
			/>

			{/* Remove Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setRemoveMemberId(null)}
				open={removeMemberId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Team Member from Job?</DialogTitle>
						<DialogDescription>
							This will remove this team member's assignment to this job. The
							team member will remain in the system but will no longer be
							associated with this job.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isRemoving}
							onClick={() => setRemoveMemberId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isRemoving}
							onClick={handleRemoveMember}
							variant="destructive"
						>
							{isRemoving ? "Removing..." : "Remove Member"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
