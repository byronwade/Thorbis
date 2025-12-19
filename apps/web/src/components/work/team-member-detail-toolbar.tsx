"use client";

/**
 * Team Member Detail Toolbar - Actions for team member detail page
 *
 * Shows actions like Send Email, Edit, etc.
 */

import {
	Archive,
	KeyRound,
	MoreHorizontal,
	UserCheck,
	UserX,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	activateTeamMember,
	archiveTeamMember,
	canManageTeamMember,
	sendPasswordResetEmail,
	suspendTeamMember,
} from "@/actions/team";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TeamMemberDetailToolbar() {
	const params = useParams();
	const router = useRouter();
	const memberId = params?.id as string;
	const [isLoading, setIsLoading] = useState(false);
	const [canManage, setCanManage] = useState(false);
	const [showSuspendDialog, setShowSuspendDialog] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);

	useEffect(() => {
		async function checkManagePermission() {
			const result = await canManageTeamMember(memberId);
			if (result.success && result.data) {
				setCanManage(result.data);
			}
		}

		if (memberId) {
			checkManagePermission();
		}
	}, [memberId]);

	const executeSuspend = async () => {
		setShowSuspendDialog(false);
		setIsLoading(true);
		const result = await suspendTeamMember(memberId);
		setIsLoading(false);

		if (result.success) {
			toast.success("Team member suspended successfully");
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to suspend team member");
		}
	};

	const handleSuspendMember = () => {
		setShowSuspendDialog(true);
	};

	const handleActivateMember = async () => {
		setIsLoading(true);
		const result = await activateTeamMember(memberId);
		setIsLoading(false);

		if (result.success) {
			toast.success("Team member activated successfully");
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to activate team member");
		}
	};

	const executeArchive = async () => {
		setShowArchiveDialog(false);
		setIsLoading(true);
		const result = await archiveTeamMember(memberId);
		setIsLoading(false);

		if (result.success) {
			toast.success("Team member archived successfully");
			router.push("/dashboard/work/team");
		} else {
			toast.error(result.error || "Failed to archive team member");
		}
	};

	const handleArchiveMember = () => {
		setShowArchiveDialog(true);
	};

	const executePasswordReset = async () => {
		setShowPasswordResetDialog(false);
		setIsLoading(true);
		const result = await sendPasswordResetEmail(memberId);
		setIsLoading(false);

		if (result.success) {
			toast.success("Password reset email sent successfully");
		} else {
			toast.error(result.error || "Failed to send password reset email");
		}
	};

	const handlePasswordReset = () => {
		setShowPasswordResetDialog(true);
	};

	return (
		<div className="flex items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button disabled={isLoading} size="sm" variant="outline">
						<MoreHorizontal className="size-4" />
						<span className="ml-2">Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					{/* Owner/Manager Only Actions */}
					{canManage && (
						<>
							<DropdownMenuItem onClick={handlePasswordReset}>
								<KeyRound className="mr-2 size-4" />
								Send Password Reset
							</DropdownMenuItem>
							<DropdownMenuSeparator />
						</>
					)}

					<DropdownMenuItem onClick={handleActivateMember}>
						<UserCheck className="mr-2 size-4" />
						Activate Member
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-destructive"
						onClick={handleSuspendMember}
					>
						<UserX className="mr-2 size-4" />
						Suspend Member
					</DropdownMenuItem>

					{/* Owner/Manager Only Actions */}
					{canManage && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={handleArchiveMember}
							>
								<Archive className="mr-2 size-4" />
								Archive Member
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Suspend Confirmation Dialog */}
			<AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Suspend Team Member?</AlertDialogTitle>
						<AlertDialogDescription>
							This will temporarily disable the team member's access. They can be reactivated later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={executeSuspend}
						>
							Suspend Member
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Archive Confirmation Dialog */}
			<AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Team Member?</AlertDialogTitle>
						<AlertDialogDescription>
							This will archive the team member and remove their access. This action can be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={executeArchive}
						>
							Archive Member
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Password Reset Confirmation Dialog */}
			<AlertDialog open={showPasswordResetDialog} onOpenChange={setShowPasswordResetDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Send Password Reset?</AlertDialogTitle>
						<AlertDialogDescription>
							This will send a password reset email to this team member.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={executePasswordReset}>
							Send Reset Email
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
