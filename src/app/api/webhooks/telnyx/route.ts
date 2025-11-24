/**
 * Telnyx Webhook Handler - API Route
 *
 * Production-ready webhook processing with:
 * - Mandatory signature verification (production)
 * - Timestamp validation (replay protection)
 * - Webhook deduplication
 * - Dead letter queue for failed processing
 * - Structured logging with correlation IDs
 * - Comprehensive error handling
 *
 * Events handled:
 * - Call events (initiated, answered, hangup, recording saved)
 * - Message events (sent, delivered, received, failed)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { formatPhoneNumber } from "@/lib/telnyx/messaging";
import { lookupCallerInfo } from "@/lib/telnyx/number-lookup";
import {
	type CallAnsweredPayload,
	type CallHangupPayload,
	type CallInitiatedPayload,
	createWebhookResponse,
	getEventType,
	isCallEvent,
	isMessageEvent,
	type MessageReceivedPayload,
	validateWebhook,
	type WebhookPayload,
} from "@/lib/telnyx/webhooks";
import { addToDLQ } from "@/lib/telnyx/dead-letter-queue";
import { telnyxLogger } from "@/lib/telnyx/logger";
import { telnyxMetrics } from "@/lib/telnyx/metrics";
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;
type CommunicationInsert =
	Database["public"]["Tables"]["communications"]["Insert"];

// =============================================================================
// MAIN WEBHOOK HANDLER
// =============================================================================

/**
 * POST /api/webhooks/telnyx
 *
 * Handles all incoming Telnyx webhook events with production-grade reliability
 */
export async function POST(request: NextRequest) {
	const startTime = Date.now();
	let correlationId = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
	let eventType: string | undefined;
	let webhookId: string | undefined;

	try {
		// Get request body as text for signature verification
		const body = await request.text();

		// Get headers for signature verification
		const headersList = await headers();
		const signature = headersList.get("telnyx-signature-ed25519") || "";
		const timestamp = headersList.get("telnyx-timestamp") || "";

		// Comprehensive webhook validation (signature, timestamp, payload, deduplication)
		const validationResult = validateWebhook({
			rawPayload: body,
			signature,
			timestamp,
			correlationId,
		});

		// Use the correlation ID from validation
		correlationId = validationResult.correlationId;

		if (!validationResult.valid) {
			telnyxLogger.warn("Webhook validation failed", {
				correlationId,
				error: validationResult.error,
				errorCode: validationResult.errorCode,
			});

			telnyxMetrics.recordWebhook(false);

			return NextResponse.json(
				createWebhookResponse(false, validationResult.error || "Validation failed"),
				{ status: validationResult.errorCode === "WEBHOOK_SIGNATURE_INVALID" ? 401 : 400 },
			);
		}

		// Handle duplicate webhooks (already processed)
		if (validationResult.isDuplicate) {
			telnyxLogger.info("Duplicate webhook skipped", {
				correlationId,
				webhookId: validationResult.payload?.data.id,
			});

			// Return success to prevent Telnyx from retrying
			return NextResponse.json(createWebhookResponse(true, "Already processed"), { status: 200 });
		}

		const payload = validationResult.payload!;
		eventType = getEventType(payload);
		webhookId = payload.data.id;

		telnyxLogger.info("Processing webhook", {
			correlationId,
			eventType,
			webhookId,
		});

		// Route to appropriate handler based on event type
		if (isCallEvent(eventType)) {
			await handleCallEvent(payload, eventType, correlationId);
		} else if (isMessageEvent(eventType)) {
			await handleMessageEvent(payload, eventType, correlationId);
		} else {
			telnyxLogger.debug("Unhandled event type", {
				correlationId,
				eventType,
			});
		}

		const latencyMs = Date.now() - startTime;
		telnyxLogger.info("Webhook processed successfully", {
			correlationId,
			eventType,
			webhookId,
			latencyMs,
		});

		telnyxMetrics.recordWebhook(true);

		// Return success response
		return NextResponse.json(createWebhookResponse(true), { status: 200 });
	} catch (error) {
		const latencyMs = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		telnyxLogger.error("Webhook processing failed", {
			correlationId,
			eventType,
			webhookId,
			error: errorMessage,
			latencyMs,
		});

		// Add to dead letter queue for retry
		if (webhookId && eventType) {
			try {
				const body = await request.clone().text().catch(() => "");
				await addToDLQ({
					webhookId,
					eventType,
					payload: body ? JSON.parse(body) : {},
					errorMessage,
					errorCode: error instanceof Error ? error.name : "UNKNOWN_ERROR",
					correlationId,
				});

				telnyxLogger.info("Webhook added to DLQ for retry", {
					correlationId,
					webhookId,
					eventType,
				});
			} catch (dlqError) {
				telnyxLogger.error("Failed to add webhook to DLQ", {
					correlationId,
					webhookId,
					error: dlqError instanceof Error ? dlqError.message : "Unknown DLQ error",
				});
			}
		}

		telnyxMetrics.recordWebhook(false);

		return NextResponse.json(
			createWebhookResponse(false, "Internal error"),
			{ status: 500 },
		);
	}
}

// =============================================================================
// CALL EVENT HANDLERS
// =============================================================================

/**
 * Handle call-related webhook events
 */
async function handleCallEvent(
	payload: WebhookPayload,
	eventType: string,
	correlationId: string,
) {
	const supabase = await createServiceSupabaseClient();

	switch (eventType) {
		case "call.initiated": {
			await handleCallInitiated(payload as CallInitiatedPayload, supabase, correlationId);
			break;
		}

		case "call.answered": {
			await handleCallAnswered(payload as CallAnsweredPayload, supabase, correlationId);
			break;
		}

		case "call.hangup": {
			await handleCallHangup(payload as CallHangupPayload, supabase, correlationId);
			break;
		}

		case "call.recording.saved": {
			await handleCallRecordingSaved(payload, supabase, correlationId);
			break;
		}

		case "call.machine.detection.ended":
		case "call.machine.premium.detection.ended": {
			await handleMachineDetection(payload, supabase, correlationId);
			break;
		}

		default:
			telnyxLogger.debug("Unhandled call event", { correlationId, eventType });
	}
}

/**
 * Handle call.initiated event
 */
async function handleCallInitiated(
	event: CallInitiatedPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const callData = event.data.payload;

	const phoneContext = await getPhoneNumberContext(supabase, callData.to);

	if (!phoneContext) {
		telnyxLogger.warn("No phone context found for call", {
			correlationId,
			to: callData.to,
		});
		return;
	}

	const fromAddress = normalizePhoneNumber(callData.from);
	const toAddress = normalizePhoneNumber(callData.to);

	// Look up customer by phone (handles multiple matches)
	const customerLookup =
		callData.direction === "incoming"
			? await findCustomerIdByPhone(
					supabase,
					phoneContext.companyId,
					fromAddress,
				)
			: { customerId: null, hasDuplicates: false };

	const customerId = customerLookup.customerId;

	let fromName: string | null = null;
	if (customerId) {
		fromName = await getCustomerDisplayName(supabase, customerId);
	}

	let callerLookup: Record<string, unknown> | undefined;
	if (!fromName) {
		const lookupResult = await lookupCallerInfo(fromAddress);
		if (lookupResult.success && lookupResult.data) {
			fromName = lookupResult.data.caller_name || null;
			callerLookup = lookupResult.data;
		} else if (lookupResult.error) {
			callerLookup = { error: lookupResult.error };
		}
	}

	const communicationPayload: CommunicationInsert = {
		company_id: phoneContext.companyId,
		type: "phone",
		channel: "telnyx",
		direction: callData.direction === "incoming" ? "inbound" : "outbound",
		from_address: fromAddress,
		to_address: toAddress,
		from_name: fromName,
		body: "",
		status: "queued",
		priority: "normal",
		phone_number_id: phoneContext.phoneNumberId,
		is_archived: false,
		is_internal: false,
		is_automated: false,
		is_thread_starter: true,
		telnyx_call_control_id: callData.call_control_id,
		telnyx_call_session_id: callData.call_session_id,
	};

	// Build provider metadata with caller lookup and duplicate detection
	const providerMetadata: Record<string, unknown> = {};
	if (callerLookup) {
		providerMetadata.caller_lookup = callerLookup;
	}
	if (customerLookup.hasDuplicates) {
		providerMetadata.duplicate_customers = {
			detected: true,
			primary_customer_id: customerId,
			other_customer_ids: customerLookup.duplicateCustomerIds,
			merge_suggested: true,
			message: "Multiple customers found with this phone number. Consider merging these contacts.",
		};
	}
	if (Object.keys(providerMetadata).length > 0) {
		communicationPayload.provider_metadata = providerMetadata as CommunicationInsert["provider_metadata"];
	}

	if (customerId) {
		communicationPayload.customer_id = customerId;
	}

	const { error: upsertError } = await supabase
		.from("communications")
		.upsert(communicationPayload, {
			onConflict: "telnyx_call_control_id",
		});

	if (upsertError) {
		telnyxLogger.error("Failed to upsert call communication", {
			correlationId,
			callControlId: callData.call_control_id,
			error: upsertError.message,
		});
		throw upsertError;
	}

	telnyxLogger.info("Call initiated recorded", {
		correlationId,
		callControlId: callData.call_control_id,
		direction: callData.direction,
		customerId,
	});
}

/**
 * Handle call.answered event
 */
async function handleCallAnswered(
	event: CallAnsweredPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const callData = event.data.payload;

	const { error: updateError, count } = await supabase
		.from("communications")
		.update({
			status: "delivered",
			call_answered_at: new Date().toISOString(),
		})
		.eq("telnyx_call_control_id", callData.call_control_id);

	if (updateError) {
		telnyxLogger.error("Failed to update call answered status", {
			correlationId,
			callControlId: callData.call_control_id,
			error: updateError.message,
		});
		throw updateError;
	}

	if (count === 0) {
		telnyxLogger.warn("No communication found for call.answered", {
			correlationId,
			callControlId: callData.call_control_id,
		});
	} else {
		telnyxLogger.info("Call answered recorded", {
			correlationId,
			callControlId: callData.call_control_id,
		});
	}
}

/**
 * Handle call.hangup event
 */
async function handleCallHangup(
	event: CallHangupPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const callData = event.data.payload;

	// Calculate call duration
	const startTime = new Date(callData.start_time).getTime();
	const endTime = new Date(callData.end_time).getTime();
	const duration = Math.round((endTime - startTime) / 1000); // seconds

	const { error: hangupError, count } = await supabase
		.from("communications")
		.update({
			status: "sent",
			call_ended_at: callData.end_time,
			call_duration: duration,
			hangup_cause: callData.hangup_cause,
			hangup_source: callData.hangup_source,
		})
		.eq("telnyx_call_control_id", callData.call_control_id);

	if (hangupError) {
		telnyxLogger.error("Failed to update call hangup status", {
			correlationId,
			callControlId: callData.call_control_id,
			error: hangupError.message,
		});
		throw hangupError;
	}

	if (count === 0) {
		telnyxLogger.warn("No communication found for call.hangup", {
			correlationId,
			callControlId: callData.call_control_id,
		});
	} else {
		telnyxLogger.info("Call hangup recorded", {
			correlationId,
			callControlId: callData.call_control_id,
			duration,
			hangupCause: callData.hangup_cause,
		});
	}

	// Record call completion metric
	telnyxMetrics.recordCallCompleted();
}

/**
 * Handle call.recording.saved event
 */
async function handleCallRecordingSaved(
	payload: WebhookPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const recordingData = payload.data.payload as {
		call_control_id: string;
		recording_urls?: string[];
		public_recording_url?: string;
		channels?: number;
	};

	const recordingUrl =
		recordingData.recording_urls?.[0] || recordingData.public_recording_url;

	if (!recordingUrl) {
		telnyxLogger.warn("Recording saved event without URL", {
			correlationId,
			callControlId: recordingData.call_control_id,
		});
		return;
	}

	// Update communication with recording URL
	const { data: communication, error: updateError } = await supabase
		.from("communications")
		.update({
			call_recording_url: recordingUrl,
			recording_channels: recordingData.channels,
		})
		.eq("telnyx_call_control_id", recordingData.call_control_id)
		.select("id")
		.single();

	if (updateError) {
		telnyxLogger.error("Failed to update recording URL", {
			correlationId,
			callControlId: recordingData.call_control_id,
			error: updateError.message,
		});
		throw updateError;
	}

	telnyxLogger.info("Recording saved", {
		correlationId,
		callControlId: recordingData.call_control_id,
		communicationId: communication?.id,
	});

	// Automatically trigger transcription if recording URL exists
	if (communication?.id) {
		try {
			const { transcribeCallRecording } = await import("@/actions/telnyx");
			const transcriptionResult = await transcribeCallRecording({
				recordingUrl,
				communicationId: communication.id,
			});

			if (transcriptionResult.success) {
				telnyxLogger.info("Transcription started", {
					correlationId,
					communicationId: communication.id,
				});
			} else {
				telnyxLogger.warn("Transcription failed to start", {
					correlationId,
					communicationId: communication.id,
					error: transcriptionResult.error,
				});
			}
		} catch (transcriptionError) {
			// Don't throw - transcription failure shouldn't fail the webhook
			telnyxLogger.error("Transcription error (non-fatal)", {
				correlationId,
				communicationId: communication.id,
				error: transcriptionError instanceof Error ? transcriptionError.message : "Unknown",
			});
		}
	}
}

/**
 * Handle machine detection events
 */
async function handleMachineDetection(
	payload: WebhookPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const machineData = payload.data.payload as {
		call_control_id: string;
		result: string;
	};

	const { error: updateError } = await supabase
		.from("communications")
		.update({
			answering_machine_detected: machineData.result !== "human",
		})
		.eq("telnyx_call_control_id", machineData.call_control_id);

	if (updateError) {
		telnyxLogger.error("Failed to update machine detection", {
			correlationId,
			callControlId: machineData.call_control_id,
			error: updateError.message,
		});
		// Don't throw - machine detection is non-critical
	} else {
		telnyxLogger.debug("Machine detection recorded", {
			correlationId,
			callControlId: machineData.call_control_id,
			result: machineData.result,
		});
	}
}

// =============================================================================
// MESSAGE EVENT HANDLERS
// =============================================================================

/**
 * Handle message-related webhook events
 */
async function handleMessageEvent(
	payload: WebhookPayload,
	eventType: string,
	correlationId: string,
) {
	const supabase = await createServiceSupabaseClient();

	switch (eventType) {
		case "message.received": {
			await handleMessageReceived(payload as MessageReceivedPayload, supabase, correlationId);
			break;
		}

		case "message.sent": {
			await handleMessageSent(payload, supabase, correlationId);
			break;
		}

		case "message.delivered": {
			await handleMessageDelivered(payload, supabase, correlationId);
			break;
		}

		case "message.sending_failed":
		case "message.delivery_failed": {
			await handleMessageFailed(payload, eventType, supabase, correlationId);
			break;
		}

		case "message.read": {
			await handleMessageRead(payload, supabase, correlationId);
			break;
		}

		default:
			telnyxLogger.debug("Unhandled message event", { correlationId, eventType });
	}
}

/**
 * Handle message.received event
 */
async function handleMessageReceived(
	event: MessageReceivedPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const messageData = event.data.payload;

	const destinationNumber = messageData.to[0]?.phone_number;
	const phoneContext = destinationNumber
		? await getPhoneNumberContext(supabase, destinationNumber)
		: null;

	if (!phoneContext) {
		telnyxLogger.warn("No phone context found for message", {
			correlationId,
			to: destinationNumber,
		});
		return;
	}

	const fromAddress = normalizePhoneNumber(messageData.from.phone_number);
	const toAddress = normalizePhoneNumber(destinationNumber);

	// Look up customer by phone (handles multiple matches)
	const customerLookup = await findCustomerIdByPhone(
		supabase,
		phoneContext.companyId,
		fromAddress,
	);
	const customerId = customerLookup.customerId;

	// Build provider metadata with carrier info and duplicate detection
	const providerMetadata: Record<string, unknown> = {
		carrier: messageData.from.carrier,
		line_type: messageData.from.line_type,
		media: messageData.media,
	};

	if (customerLookup.hasDuplicates) {
		providerMetadata.duplicate_customers = {
			detected: true,
			primary_customer_id: customerId,
			other_customer_ids: customerLookup.duplicateCustomerIds,
			merge_suggested: true,
			message: "Multiple customers found with this phone number. Consider merging these contacts.",
		};
	}

	const { error: insertError } = await supabase.from("communications").insert({
		company_id: phoneContext.companyId,
		customer_id: customerId,
		type: "sms",
		channel: "telnyx",
		direction: "inbound",
		from_address: fromAddress,
		to_address: toAddress,
		body: messageData.text || "",
		status: "delivered",
		priority: "normal",
		phone_number_id: phoneContext.phoneNumberId,
		is_archived: false,
		is_internal: false,
		is_automated: false,
		is_thread_starter: true,
		telnyx_message_id: messageData.id,
		received_at: messageData.received_at,
		provider_metadata: providerMetadata,
	});

	if (insertError) {
		telnyxLogger.error("Failed to insert incoming message", {
			correlationId,
			messageId: messageData.id,
			error: insertError.message,
		});
		throw insertError;
	}

	telnyxLogger.info("Inbound message recorded", {
		correlationId,
		messageId: messageData.id,
		from: fromAddress,
		customerId,
		hasDuplicates: customerLookup.hasDuplicates,
	});
}

/**
 * Handle message.sent event
 */
async function handleMessageSent(
	payload: WebhookPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const messageData = payload.data.payload as { id: string };

	const { error: updateError, count } = await supabase
		.from("communications")
		.update({
			status: "sent",
			sent_at: new Date().toISOString(),
		})
		.eq("telnyx_message_id", messageData.id);

	if (updateError) {
		telnyxLogger.error("Failed to update message sent status", {
			correlationId,
			messageId: messageData.id,
			error: updateError.message,
		});
		throw updateError;
	}

	if (count === 0) {
		telnyxLogger.warn("No communication found for message.sent", {
			correlationId,
			messageId: messageData.id,
		});
	} else {
		telnyxLogger.debug("Message sent status updated", {
			correlationId,
			messageId: messageData.id,
		});
	}

	telnyxMetrics.recordSmsSent(true);
}

/**
 * Handle message.delivered event
 */
async function handleMessageDelivered(
	payload: WebhookPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const messageData = payload.data.payload as { id: string };

	const { error: updateError, count } = await supabase
		.from("communications")
		.update({
			status: "delivered",
			delivered_at: new Date().toISOString(),
		})
		.eq("telnyx_message_id", messageData.id);

	if (updateError) {
		telnyxLogger.error("Failed to update message delivered status", {
			correlationId,
			messageId: messageData.id,
			error: updateError.message,
		});
		throw updateError;
	}

	if (count === 0) {
		telnyxLogger.warn("No communication found for message.delivered", {
			correlationId,
			messageId: messageData.id,
		});
	} else {
		telnyxLogger.debug("Message delivered status updated", {
			correlationId,
			messageId: messageData.id,
		});
	}

	telnyxMetrics.recordSmsDelivered();
}

/**
 * Handle message.sending_failed and message.delivery_failed events
 */
async function handleMessageFailed(
	payload: WebhookPayload,
	eventType: string,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const messageData = payload.data.payload as {
		id: string;
		errors?: Array<{ detail?: string; code?: string }>;
	};

	const failureReason = messageData.errors?.[0]?.detail || "Unknown error";

	const { error: updateError, count } = await supabase
		.from("communications")
		.update({
			status: "failed",
			failed_at: new Date().toISOString(),
			failure_reason: failureReason,
		})
		.eq("telnyx_message_id", messageData.id);

	if (updateError) {
		telnyxLogger.error("Failed to update message failed status", {
			correlationId,
			messageId: messageData.id,
			error: updateError.message,
		});
		throw updateError;
	}

	if (count === 0) {
		telnyxLogger.warn("No communication found for message failure", {
			correlationId,
			messageId: messageData.id,
			eventType,
		});
	} else {
		telnyxLogger.warn("Message failed", {
			correlationId,
			messageId: messageData.id,
			eventType,
			failureReason,
		});
	}

	telnyxMetrics.recordSmsSent(false);
}

/**
 * Handle message.read event (RCS only)
 */
async function handleMessageRead(
	payload: WebhookPayload,
	supabase: TypedSupabaseClient,
	correlationId: string,
) {
	const messageData = payload.data.payload as { id: string };

	const { error: updateError, count } = await supabase
		.from("communications")
		.update({
			read_at: new Date().toISOString(),
		})
		.eq("telnyx_message_id", messageData.id);

	if (updateError) {
		telnyxLogger.error("Failed to update message read status", {
			correlationId,
			messageId: messageData.id,
			error: updateError.message,
		});
		// Don't throw - read receipt is non-critical
	}

	if (count && count > 0) {
		telnyxLogger.debug("Message read status updated", {
			correlationId,
			messageId: messageData.id,
		});
	}
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function normalizePhoneNumber(phoneNumber: string): string {
	return formatPhoneNumber(phoneNumber);
}

function extractComparableDigits(phoneNumber: string): string {
	const digits = phoneNumber.replace(/\D/g, "");
	if (digits.length > 10) {
		return digits.slice(-10);
	}
	return digits;
}

async function getPhoneNumberContext(
	supabase: TypedSupabaseClient,
	phoneNumber: string,
): Promise<{ companyId: string; phoneNumberId: string } | null> {
	const normalized = normalizePhoneNumber(phoneNumber);

	const { data } = await supabase
		.from("phone_numbers")
		.select("id, company_id")
		.eq("phone_number", normalized)
		.is("deleted_at", null)
		.maybeSingle();

	if (!data) {
		return null;
	}

	return {
		companyId: data.company_id,
		phoneNumberId: data.id,
	};
}

type CustomerLookupResult = {
	customerId: string | null;
	duplicateCustomerIds?: string[];
	hasDuplicates: boolean;
};

async function findCustomerIdByPhone(
	supabase: TypedSupabaseClient,
	companyId: string,
	phoneNumber: string,
): Promise<CustomerLookupResult> {
	const digits = extractComparableDigits(phoneNumber);
	if (!digits) {
		return { customerId: null, hasDuplicates: false };
	}

	// Find ALL matching customers, ordered by most recently updated
	const { data: customers } = await supabase
		.from("customers")
		.select("id, updated_at")
		.eq("company_id", companyId)
		.or(`phone.ilike.%${digits}%,secondary_phone.ilike.%${digits}%`)
		.order("updated_at", { ascending: false });

	if (!customers || customers.length === 0) {
		return { customerId: null, hasDuplicates: false };
	}

	// If only one match, return it
	if (customers.length === 1) {
		return { customerId: customers[0].id, hasDuplicates: false };
	}

	// Multiple matches - return most recently active and flag duplicates
	telnyxLogger.info("Multiple customers found for phone number", {
		phoneNumber,
		companyId,
		customerCount: customers.length,
		customerIds: customers.map(c => c.id),
	});

	return {
		customerId: customers[0].id, // Most recently updated
		duplicateCustomerIds: customers.slice(1).map(c => c.id),
		hasDuplicates: true,
	};
}

async function getCustomerDisplayName(
	supabase: TypedSupabaseClient,
	customerId: string,
) {
	const { data } = await supabase
		.from("customers")
		.select("first_name, last_name, company_name")
		.eq("id", customerId)
		.maybeSingle();

	if (!data) {
		return null;
	}

	const first = data.first_name?.trim();
	const last = data.last_name?.trim();
	const fullName = [first, last].filter(Boolean).join(" ").trim();

	return fullName || data.company_name || null;
}
