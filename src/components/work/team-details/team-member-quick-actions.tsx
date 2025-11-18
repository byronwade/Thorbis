"use client";

/**
 * Team Member Quick Actions
 * Primary action buttons for team member management
 */

import { Archive, Briefcase, Edit2, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TeamMemberQuickActionsProps = {
	member: {
		id: string;
		user_id: string;
		status: string;
		archived_at?: string | null;
	};
	user: {
		email?: string;
		phone?: string;
	};
	onEmail: () => void;
	onSMS: () => void;
	onEdit: () => void;
	onAssignJob: () => void;
	onArchive: () => void;
};

export function TeamMemberQuickActions({
	member,
	user,
	onEmail,
	onSMS,
	onEdit,
	onAssignJob,
	onArchive,
}: TeamMemberQuickActionsProps) {
	const [isOpen, setIsOpen] = useState(false);

	const isArchived = Boolean(member.archived_at);
	const canSendEmail = Boolean(user.email);
	const canSendSMS = Boolean(user.phone);

	return (
		<div className="flex items-center gap-2">
			{/* Quick Email Button */}
			{canSendEmail && !isArchived && (
				<Button
					onClick={onEmail}
					size="sm"
					title="Send Email"
					variant="outline"
				>
					<Mail className="size-4" />
				</Button>
			)}

			{/* Quick SMS Button */}
			{canSendSMS && !isArchived && (
				<Button onClick={onSMS} size="sm" title="Send SMS" variant="outline">
					<MessageSquare className="size-4" />
				</Button>
			)}

			{/* More Actions Dropdown */}
			<DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
				<DropdownMenuTrigger asChild>
					<Button size="sm" variant="outline">
						Actions
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					{!isArchived && (
						<>
							<DropdownMenuItem onClick={onEdit}>
								<Edit2 className="mr-2 size-4" />
								Edit Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onAssignJob}>
								<Briefcase className="mr-2 size-4" />
								Assign to Job
							</DropdownMenuItem>
							{canSendEmail && (
								<DropdownMenuItem onClick={onEmail}>
									<Mail className="mr-2 size-4" />
									Send Email
								</DropdownMenuItem>
							)}
							{canSendSMS && (
								<DropdownMenuItem onClick={onSMS}>
									<MessageSquare className="mr-2 size-4" />
									Send SMS
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuItem
						className={isArchived ? "text-success" : "text-destructive"}
						onClick={onArchive}
					>
						<Archive className="mr-2 size-4" />
						{isArchived ? "Unarchive" : "Archive"} Team Member
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
