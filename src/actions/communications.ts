"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { GenericEmail } from "@/emails/generic-email";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { createClient } from "@/lib/supabase/server";

const COMMUNICATIONS_PATH = "/dashboard/communication";

const sendCustomerEmailSchema = z.object({
	to: z.string().email(),
	subject: z.string().min(1),
	body: z.string().min(1),
	customerName: z.string().min(1),
	companyId: z.string().min(1),
	customerId: z.string().optional(),
	jobId: z.string().optional(),
	propertyId: z.string().optional(),
	invoiceId: z.string().optional(),
	estimateId: z.string().optional(),
});

export type SendCustomerEmailInput = z.infer<typeof sendCustomerEmailSchema>;

type SendCustomerEmailActionResult = {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
};

export async function sendCustomerEmailAction(input: SendCustomerEmailInput): Promise<SendCustomerEmailActionResult> {
	const payload = sendCustomerEmailSchema.parse(input);
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Unable to access database" };
	}

	const insertResult = await supabase
		.from("communications")
		.insert({
			company_id: payload.companyId,
			customer_id: payload.customerId ?? null,
			job_id: payload.jobId ?? null,
			property_id: payload.propertyId ?? null,
			invoice_id: payload.invoiceId ?? null,
			estimate_id: payload.estimateId ?? null,
			type: "email",
			channel: "resend",
			direction: "outbound",
			from_address: null,
			to_address: payload.to,
			subject: payload.subject,
			body: payload.body,
			status: "queued",
			priority: "normal",
			is_archived: false,
			is_automated: false,
			is_internal: false,
			is_thread_starter: true,
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

	const sendResult = await sendEmail({
		to: payload.to,
		subject: payload.subject,
		template: GenericEmail({
			recipientName: payload.customerName,
			message: payload.body,
		}),
		templateType: EmailTemplate.GENERIC,
		companyId: payload.companyId,
		communicationId: communication.id,
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
		})
		.eq("id", communication.id);

	revalidatePath(COMMUNICATIONS_PATH);

	return {
		success: true,
		data: communication,
	};
}
