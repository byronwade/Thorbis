"use client";

/**
 * Job Action Components
 *
 * Dialog components for job management actions.
 */

import { ActionDialog, type FormField } from "../action-dialog";
import {
	updateJobStatus,
	reassignJob,
	updateJobSchedule,
	updateJobPriority,
	addJobNote,
} from "@/actions/admin-jobs";

interface JobActionDialogProps {
	jobId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Update Job Status Dialog
 */
export function UpdateJobStatusDialog({
	jobId,
	open,
	onOpenChange,
}: JobActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "status",
			label: "New Status",
			type: "select",
			required: true,
			options: [
				{ value: "pending", label: "Pending" },
				{ value: "in_progress", label: "In Progress" },
				{ value: "on_hold", label: "On Hold" },
				{ value: "completed", label: "Completed" },
				{ value: "cancelled", label: "Cancelled" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Job Status"
			description="Change the status of this job."
			fields={fields}
			requireReason={true}
			actionLabel="Update Status"
			onSubmit={async (data) => {
				return await updateJobStatus(jobId, data.status, data.reason);
			}}
		/>
	);
}

/**
 * Reassign Job Dialog
 */
interface ReassignJobDialogProps extends JobActionDialogProps {
	teamMembers?: { id: string; name: string }[];
}

export function ReassignJobDialog({
	jobId,
	open,
	onOpenChange,
	teamMembers = [],
}: ReassignJobDialogProps) {
	const fields: FormField[] = [
		{
			name: "teamMemberId",
			label: "Assign To",
			type: "select",
			required: true,
			placeholder: "Select team member...",
			options: teamMembers.map((tm) => ({
				value: tm.id,
				label: tm.name,
			})),
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Reassign Job"
			description="Assign this job to a different team member."
			fields={fields}
			requireReason={true}
			actionLabel="Reassign"
			onSubmit={async (data) => {
				return await reassignJob(jobId, data.teamMemberId, data.reason);
			}}
		/>
	);
}

/**
 * Update Job Schedule Dialog
 */
export function UpdateJobScheduleDialog({
	jobId,
	open,
	onOpenChange,
}: JobActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "scheduledStart",
			label: "Scheduled Start",
			type: "datetime-local",
			required: true,
		},
		{
			name: "scheduledEnd",
			label: "Scheduled End",
			type: "datetime-local",
			required: true,
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Job Schedule"
			description="Change the scheduled start and end times for this job."
			fields={fields}
			requireReason={true}
			actionLabel="Update Schedule"
			onSubmit={async (data) => {
				return await updateJobSchedule(
					jobId,
					data.scheduledStart,
					data.scheduledEnd,
					data.reason,
				);
			}}
		/>
	);
}

/**
 * Update Job Priority Dialog
 */
export function UpdateJobPriorityDialog({
	jobId,
	open,
	onOpenChange,
}: JobActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "priority",
			label: "Priority Level",
			type: "select",
			required: true,
			options: [
				{ value: "low", label: "Low" },
				{ value: "normal", label: "Normal" },
				{ value: "high", label: "High" },
				{ value: "urgent", label: "Urgent" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Job Priority"
			description="Change the priority level for this job."
			fields={fields}
			requireReason={true}
			actionLabel="Update Priority"
			onSubmit={async (data) => {
				return await updateJobPriority(jobId, data.priority, data.reason);
			}}
		/>
	);
}

/**
 * Add Job Note Dialog
 */
export function AddJobNoteDialog({
	jobId,
	open,
	onOpenChange,
}: JobActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "note",
			label: "Support Note",
			type: "textarea",
			required: true,
			placeholder: "Add an internal support note...",
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Add Support Note"
			description="Add an internal note to this job (visible to support team only)."
			fields={fields}
			requireReason={false}
			actionLabel="Add Note"
			onSubmit={async (data) => {
				return await addJobNote(jobId, data.note);
			}}
		/>
	);
}
