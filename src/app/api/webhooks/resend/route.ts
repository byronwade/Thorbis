import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyResendWebhookSignature, getReceivedEmail, listReceivedEmailAttachments, getReceivedEmailAttachment } from "@/lib/email/resend-domains";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

export async function POST(request: Request) {
	const rawBody = await request.text();
	const headersList = await headers();

	const isValid = verifyResendWebhookSignature({
		payload: rawBody,
		headers: {
			svixId: headersList.get("svix-id") || undefined,
			svixTimestamp: headersList.get("svix-timestamp") || undefined,
			svixSignature: headersList.get("svix-signature") || undefined,
		},
	});

	if (!isValid) {
		console.error("Invalid webhook signature");
		return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
	}

	const payload = JSON.parse(rawBody) as ResendWebhookPayload;
	const supabase = await createServiceSupabaseClient();

	switch (payload.type) {
		case "email.delivered":
		case "email.bounced":
		case "email.complained":
		case "email.opened":
		case "email.clicked":
			await handleEmailEvent(supabase, payload);
			break;
		case "email.received":
			await handleEmailReceived(supabase, payload);
			break;
		default:
			break;
	}

	return NextResponse.json({ success: true });
}

async function handleEmailEvent(
	supabase: TypedSupabaseClient,
	payload: ResendWebhookPayload,
) {
	const communicationId = payload.data.tags?.find(
		(tag) => tag.name === "communication_id",
	)?.value;

	if (!communicationId) {
		return;
	}

	await supabase.from("communication_email_events").insert({
		communication_id: communicationId,
		event_type: payload.type,
		provider_event_id: payload.data.id,
		payload,
		occurred_at: payload.created_at,
	});

	const updates: Record<string, unknown> = {
		provider_status: payload.type,
		provider_metadata: payload,
	};

	if (payload.type === "email.delivered") {
		updates.status = "delivered";
		updates.delivered_at = new Date().toISOString();
	}

	if (payload.type === "email.opened") {
		updates.opened_at = new Date().toISOString();
	}

	await supabase
		.from("communications")
		.update(updates)
		.eq("id", communicationId);
}

async function handleEmailReceived(
	supabase: TypedSupabaseClient,
	payload: ResendWebhookPayload,
) {
	const destination = payload.data.to?.[0]?.email;
	if (!destination) {
		console.error("No destination email found in webhook payload");
		return;
	}

	const { data: route } = await supabase
		.from("communication_email_inbound_routes")
		.select("company_id")
		.eq("route_address", destination)
		.maybeSingle();

	if (!route?.company_id) {
		console.log(`No inbound route found for destination: ${destination}`);
		return;
	}

	const emailId = payload.data.email_id || payload.data.id;
	if (!emailId) {
		console.error("No email ID found in webhook payload");
		return;
	}

	console.log(`Processing received email: ${emailId} for company: ${route.company_id}`);

	// Fetch the full email content from Resend API
	const emailResponse = await getReceivedEmail(emailId);
	if (!emailResponse.success) {
		console.error(`Failed to fetch email content: ${emailResponse.error}`);
		return;
	}

	const emailData = emailResponse.data;
	console.log(`Fetched email data:`, { subject: emailData.subject, hasHtml: !!emailData.html, hasText: !!emailData.text });

	// Fetch attachments metadata
	const attachmentsResponse = await listReceivedEmailAttachments(emailId);
	const attachments = attachmentsResponse.success ? attachmentsResponse.data : [];
	console.log(`Found ${attachments.length} attachments`);

	// Download and store attachments
	const storedAttachments = [];
	for (const attachment of attachments) {
		try {
			console.log(`Downloading attachment: ${attachment.filename}`);
			const attachmentResponse = await getReceivedEmailAttachment(emailId, attachment.id);

			if (!attachmentResponse.success) {
				console.error(`Failed to download attachment ${attachment.filename}: ${attachmentResponse.error}`);
				continue;
			}

			// The attachment response should contain the file content
			// According to Resend docs, this returns the attachment data
			const attachmentData = attachmentResponse.data;

			let buffer: Buffer;
			if (attachmentData.content && typeof attachmentData.content === 'string') {
				// If content is base64 encoded
				buffer = Buffer.from(attachmentData.content, 'base64');
			} else if (attachmentData.content && Buffer.isBuffer(attachmentData.content)) {
				// If content is already a buffer
				buffer = attachmentData.content;
			} else {
				console.error(`Invalid attachment content format for ${attachment.filename}`);
				continue;
			}

			const filePath = `${route.company_id}/${Date.now()}-${attachment.filename}`;
			await supabase.storage
				.from("email-attachments")
				.upload(filePath, buffer, {
					contentType: attachment.content_type || "application/octet-stream",
					upsert: true,
				});

			storedAttachments.push({
				name: attachment.filename,
				path: filePath,
				type: attachment.content_type,
			});

			console.log(`Stored attachment: ${attachment.filename} at ${filePath}`);
		} catch (error) {
			console.error(`Error processing attachment ${attachment.filename}:`, error);
		}
	}

	// Store the email in the database
	const communicationData = {
		company_id: route.company_id,
		type: "email",
		channel: "resend",
		direction: "inbound",
		from_address: payload.data.from?.[0]?.email || emailData.from,
		from_name: payload.data.from?.[0]?.name || null,
		to_address: destination,
		subject: payload.data.subject || emailData.subject || "(No subject)",
		body: emailData.text || payload.data.text || "",
		body_html: emailData.html || payload.data.html || null,
		status: "delivered",
		provider_message_id: emailId,
		provider_metadata: { ...payload, full_email: emailData },
		attachments: storedAttachments,
		attachment_count: storedAttachments.length,
		is_thread_starter: true,
		delivered_at: new Date().toISOString(),
	};

	const { error: insertError } = await supabase
		.from("communications")
		.insert(communicationData);

	if (insertError) {
		console.error("Failed to insert email communication:", insertError);
		return;
	}

	console.log(`Successfully stored email: ${communicationData.subject} with ${storedAttachments.length} attachments`);
}

type ResendWebhookPayload = {
	type: string;
	created_at: string;
	data: {
		id?: string;
		email_id?: string; // The actual email ID for API calls
		subject?: string;
		text?: string;
		html?: string;
		to?: { email: string }[];
		from?: { email: string; name?: string }[];
		tags?: { name: string; value: string }[];
		attachments?: Array<{
			id?: string;
			filename?: string;
			content?: string;
			content_type?: string;
			content_disposition?: string;
			content_id?: string;
		}>;
	};
};
