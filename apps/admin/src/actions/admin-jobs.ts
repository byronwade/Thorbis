"use server";

/**
 * Admin Job Management Actions
 *
 * Server actions for managing jobs in view-as mode.
 * All actions include:
 * - Session validation
 * - Permission checking
 * - Audit logging
 * - Company ownership validation
 */

import {
	executeAdminAction,
	getBeforeData,
	logDetailedAction,
	validateCompanyOwnership,
	type ActionResult,
} from "@/lib/admin-actions/framework";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";

/**
 * Update Job Status
 *
 * Changes a job's status (e.g., pending → in_progress → completed)
 */
export async function updateJobStatus(
	jobId: string,
	newStatus: string,
	reason?: string,
): Promise<ActionResult<{ statusUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_jobs",
			action: "update_job_status",
			resourceType: "job",
			resourceId: jobId,
			reason: reason || `Changed status to ${newStatus}`,
		},
		async (supabase, sessionId) => {
			// Validate company ownership
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership("jobs", jobId, companyId);
			if (!isOwned) {
				throw new Error("Job does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("jobs", jobId, "id, status");

			// Update status
			const { error } = await supabase
				.from("jobs")
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", jobId);

			if (error) {
				throw new Error(`Failed to update job status: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_job_status",
				"job",
				jobId,
				beforeData,
				{ status: newStatus },
				reason,
			);

			// Revalidate the jobs page
			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/jobs`);

			return { statusUpdated: true };
		},
	);
}

/**
 * Reassign Job
 *
 * Assigns a job to a different team member
 */
export async function reassignJob(
	jobId: string,
	newTeamMemberId: string,
	reason?: string,
): Promise<ActionResult<{ jobReassigned: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_jobs",
			action: "reassign_job",
			resourceType: "job",
			resourceId: jobId,
			reason: reason || `Reassigned to team member ${newTeamMemberId}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership("jobs", jobId, companyId);
			if (!isOwned) {
				throw new Error("Job does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("jobs", jobId, "id, assigned_to");

			// Reassign job
			const { error } = await supabase
				.from("jobs")
				.update({
					assigned_to: newTeamMemberId,
					updated_at: new Date().toISOString(),
				})
				.eq("id", jobId);

			if (error) {
				throw new Error(`Failed to reassign job: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"reassign_job",
				"job",
				jobId,
				beforeData,
				{ assigned_to: newTeamMemberId },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/jobs`);

			return { jobReassigned: true };
		},
	);
}

/**
 * Update Job Schedule
 *
 * Changes scheduled start/end times for a job
 */
export async function updateJobSchedule(
	jobId: string,
	scheduledStart: string,
	scheduledEnd: string,
	reason?: string,
): Promise<ActionResult<{ scheduleUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_jobs",
			action: "update_job_schedule",
			resourceType: "job",
			resourceId: jobId,
			reason: reason || "Updated job schedule",
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership("jobs", jobId, companyId);
			if (!isOwned) {
				throw new Error("Job does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"jobs",
				jobId,
				"id, scheduled_start, scheduled_end",
			);

			// Update schedule
			const { error } = await supabase
				.from("jobs")
				.update({
					scheduled_start: scheduledStart,
					scheduled_end: scheduledEnd,
					updated_at: new Date().toISOString(),
				})
				.eq("id", jobId);

			if (error) {
				throw new Error(`Failed to update job schedule: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_job_schedule",
				"job",
				jobId,
				beforeData,
				{ scheduled_start: scheduledStart, scheduled_end: scheduledEnd },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/jobs`);

			return { scheduleUpdated: true };
		},
	);
}

/**
 * Update Job Priority
 *
 * Changes a job's priority level
 */
export async function updateJobPriority(
	jobId: string,
	newPriority: string,
	reason?: string,
): Promise<ActionResult<{ priorityUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_jobs",
			action: "update_job_priority",
			resourceType: "job",
			resourceId: jobId,
			reason: reason || `Changed priority to ${newPriority}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership("jobs", jobId, companyId);
			if (!isOwned) {
				throw new Error("Job does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("jobs", jobId, "id, priority");

			// Update priority
			const { error } = await supabase
				.from("jobs")
				.update({
					priority: newPriority,
					updated_at: new Date().toISOString(),
				})
				.eq("id", jobId);

			if (error) {
				throw new Error(`Failed to update job priority: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_job_priority",
				"job",
				jobId,
				beforeData,
				{ priority: newPriority },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/jobs`);

			return { priorityUpdated: true };
		},
	);
}

/**
 * Add Job Note
 *
 * Adds an internal note to a job (visible to support team)
 */
export async function addJobNote(
	jobId: string,
	note: string,
	reason?: string,
): Promise<ActionResult<{ noteAdded: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_jobs",
			action: "add_job_note",
			resourceType: "job",
			resourceId: jobId,
			reason: reason || "Added support note",
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership("jobs", jobId, companyId);
			if (!isOwned) {
				throw new Error("Job does not belong to this company");
			}

			// Get current notes
			const beforeData = await getBeforeData("jobs", jobId, "id, notes");
			const currentNotes = beforeData?.notes || "";

			// Append new note with timestamp
			const timestamp = new Date().toISOString();
			const newNotes = currentNotes
				? `${currentNotes}\n\n[SUPPORT ${timestamp}]: ${note}`
				: `[SUPPORT ${timestamp}]: ${note}`;

			// Update notes
			const { error } = await supabase
				.from("jobs")
				.update({
					notes: newNotes,
					updated_at: new Date().toISOString(),
				})
				.eq("id", jobId);

			if (error) {
				throw new Error(`Failed to add job note: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"add_job_note",
				"job",
				jobId,
				beforeData,
				{ notes: newNotes },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/jobs`);

			return { noteAdded: true };
		},
	);
}
