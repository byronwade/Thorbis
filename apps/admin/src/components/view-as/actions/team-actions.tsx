"use client";

/**
 * Team Action Components
 *
 * Dialog components for team management actions.
 */

import { ActionDialog, type FormField } from "../action-dialog";
import {
	resetTeamMemberPassword,
	changeTeamMemberRole,
	updateTeamMemberStatus,
	updateTeamMemberEmail,
} from "@/actions/admin-team";

interface TeamActionDialogProps {
	teamMemberId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Reset Password Dialog
 */
export function ResetPasswordDialog({
	teamMemberId,
	open,
	onOpenChange,
}: TeamActionDialogProps) {
	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Reset Team Member Password"
			description="Send a password reset email to this team member. They will receive a link to create a new password."
			fields={[]}
			requireReason={true}
			actionLabel="Send Password Reset"
			isDestructive={true}
			onSubmit={async (data) => {
				return await resetTeamMemberPassword(teamMemberId, data.reason);
			}}
		/>
	);
}

/**
 * Change Role Dialog
 */
export function ChangeRoleDialog({
	teamMemberId,
	open,
	onOpenChange,
}: TeamActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "role",
			label: "New Role",
			type: "select",
			required: true,
			options: [
				{ value: "owner", label: "Owner" },
				{ value: "admin", label: "Admin" },
				{ value: "manager", label: "Manager" },
				{ value: "technician", label: "Technician" },
				{ value: "dispatcher", label: "Dispatcher" },
				{ value: "viewer", label: "Viewer" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Change Team Member Role"
			description="Change the role and permissions for this team member."
			fields={fields}
			requireReason={true}
			actionLabel="Change Role"
			onSubmit={async (data) => {
				return await changeTeamMemberRole(teamMemberId, data.role, data.reason);
			}}
		/>
	);
}

/**
 * Update Status Dialog
 */
export function UpdateTeamStatusDialog({
	teamMemberId,
	open,
	onOpenChange,
}: TeamActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "status",
			label: "New Status",
			type: "select",
			required: true,
			options: [
				{ value: "active", label: "Active" },
				{ value: "inactive", label: "Inactive" },
				{ value: "suspended", label: "Suspended" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Team Member Status"
			description="Activate, deactivate, or suspend this team member's account."
			fields={fields}
			requireReason={true}
			actionLabel="Update Status"
			isDestructive={true}
			onSubmit={async (data) => {
				return await updateTeamMemberStatus(
					teamMemberId,
					data.status,
					data.reason,
				);
			}}
		/>
	);
}

/**
 * Update Email Dialog
 */
export function UpdateEmailDialog({
	teamMemberId,
	open,
	onOpenChange,
}: TeamActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "email",
			label: "New Email Address",
			type: "text",
			required: true,
			placeholder: "user@example.com",
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Team Member Email"
			description="Change the email address for this team member. This will update both their profile and login credentials."
			fields={fields}
			requireReason={true}
			actionLabel="Update Email"
			onSubmit={async (data) => {
				return await updateTeamMemberEmail(teamMemberId, data.email, data.reason);
			}}
		/>
	);
}
