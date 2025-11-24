"use server";

import { PlainTextEmail } from "@/emails/plain-text-email";
import { sendEmail } from "@/lib/email/email-sender";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const COMMUNICATIONS_PATH = "/dashboard/communication";

const attachmentSchema = z.object({
	filename: z.string(),
	content: z.string(), // Base64 encoded
	contentType: z.string().optional(),
});

const sendCustomerEmailSchema = z.object({
	to: z.union([z.string().email(), z.array(z.string().email())]),
	subject: z.string().min(1),
	body: z.string().min(1),
	customerName: z.string().min(1),
	companyId: z.string().min(1),
	customerId: z.string().optional(),
	jobId: z.string().optional(),
	propertyId: z.string().optional(),
	invoiceId: z.string().optional(),
	estimateId: z.string().optional(),
	cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
	bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
	attachments: z.array(attachmentSchema).optional(),
	scheduledFor: z.string().optional(), // ISO date string for scheduled send
});

export type SendCustomerEmailInput = z.infer<typeof sendCustomerEmailSchema>;

type SendCustomerEmailActionResult = {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
};

export async function sendCustomerEmailAction(
	input: SendCustomerEmailInput,
): Promise<SendCustomerEmailActionResult> {
	const payload = sendCustomerEmailSchema.parse(input);
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Unable to access database" };
	}

	// Normalize to/cc/bcc to string format for database storage
	const toAddress = Array.isArray(payload.to) ? payload.to.join(", ") : payload.to;
	const ccAddress = payload.cc
		? Array.isArray(payload.cc) ? payload.cc.join(", ") : payload.cc
		: null;
	const bccAddress = payload.bcc
		? Array.isArray(payload.bcc) ? payload.bcc.join(", ") : payload.bcc
		: null;

	// Check if this is a scheduled send
	const isScheduled = !!payload.scheduledFor;
	const scheduledTime = isScheduled ? new Date(payload.scheduledFor!) : null;

	const insertResult = await supabase
		.from("communications")
		.insert({
			company_id: payload.companyId,
			customer_id: payload.customerId ?? null,
			job_id: payload.jobId ?? null,
			invoice_id: payload.invoiceId ?? null,
			estimate_id: payload.estimateId ?? null,
			type: "email",
			channel: "resend",
			direction: "outbound",
			from_address: null,
			to_address: toAddress,
			cc_address: ccAddress,
			bcc_address: bccAddress,
			subject: payload.subject,
			body: payload.body,
			status: isScheduled ? "scheduled" : "queued",
			priority: "normal",
			is_archived: false,
			is_automated: false,
			is_internal: false,
			is_thread_starter: true,
			scheduled_for: scheduledTime?.toISOString() ?? null,
			// Store attachments for scheduled emails
			provider_metadata: isScheduled && payload.attachments
				? { scheduled_attachments: payload.attachments }
				: null,
		})
		.select()
		.single();

	if (insertResult.error || !insertResult.data) {
		return {
			success: false,
			error: insertResult.error?.message
				? `Failed to log communication: ${insertResult.error.message}`
				: "Failed to log communication before sending email",
		};
	}

	const communication = insertResult.data;

	// If scheduled, don't send now - return success
	if (isScheduled) {
		revalidatePath(COMMUNICATIONS_PATH);
		return {
			success: true,
			data: { ...communication, isScheduled: true },
		};
	}

	// Send immediately
	const sendResult = await sendEmail({
		to: payload.to,
		subject: payload.subject,
		template: PlainTextEmail({ message: payload.body }),
		templateType: "generic" as any,
		companyId: payload.companyId,
		communicationId: communication.id,
		cc: payload.cc,
		bcc: payload.bcc,
		attachments: payload.attachments,
	});

	if (!sendResult.success) {
		await supabase
			.from("communications")
			.update({
				status: "failed",
				failure_reason: sendResult.error || "Email send failed",
			})
			.eq("id", communication.id);

		return {
			success: false,
			error: sendResult.error || "Failed to send email",
		};
	}

	await supabase
		.from("communications")
		.update({
			status: "sent",
			sent_at: new Date().toISOString(),
			provider_message_id: sendResult.data?.id || null,
		})
		.eq("id", communication.id);

	revalidatePath(COMMUNICATIONS_PATH);

	return {
		success: true,
		data: communication,
	};
}

/**
 * Bulk archive multiple communications by their IDs
 * Works for any communication type (email, sms, call)
 */
export async function bulkArchiveCommunicationsAction(
	communicationIds: string[],
	type?: "email" | "sms" | "call"
): Promise<{
	success: boolean;
	archived: number;
	error?: string;
}> {
	if (!communicationIds || communicationIds.length === 0) {
		return { success: false, archived: 0, error: "No IDs provided" };
	}

	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, archived: 0, error: "Database connection failed" };
		}

		// Get user's company for security
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			return { success: false, archived: 0, error: "Not authenticated" };
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, archived: 0, error: "No company found" };
		}

		let query = supabase
			.from("communications")
			.update({ is_archived: true })
			.in("id", communicationIds)
			.eq("company_id", profile.company_id);

		// Optionally filter by type
		if (type) {
			query = query.eq("type", type);
		}

		const { data, error } = await query.select("id");

		if (error) {
			return { success: false, archived: 0, error: error.message };
		}

		revalidatePath(COMMUNICATIONS_PATH);

		return { success: true, archived: data?.length ?? 0 };
	} catch (error) {
		return {
			success: false,
			archived: 0,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
