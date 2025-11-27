/**
 * Communication Analytics Tracking
 *
 * Tracks email, SMS, and call engagement metrics:
 * - Email: opens, clicks, bounces, replies
 * - SMS: delivered, failed, replies
 * - Calls: connected, duration, outcomes
 *
 * Usage:
 * ```typescript
 * import {
 *   trackEmailSent,
 *   trackEmailOpen,
 *   trackEmailClick,
 *   trackSmsSent,
 *   trackSmsDelivered,
 *   trackCallConnected,
 * } from "@/lib/analytics/communication-tracker";
 *
 * // Track email sent
 * await trackEmailSent({
 *   companyId: "uuid",
 *   messageId: "email-uuid",
 *   recipientType: "customer",
 *   templateName: "invoice_reminder",
 * });
 *
 * // Track email open (from pixel)
 * await trackEmailOpen(messageId);
 *
 * // Track SMS delivery
 * await trackSmsDelivered({
 *   companyId: "uuid",
 *   messageId: "sms-uuid",
 *   deliveredAt: new Date(),
 * });
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// ============================================
// Types
// ============================================

export type CommunicationType = "email" | "sms" | "call";

export type RecipientType =
	| "customer"
	| "lead"
	| "vendor"
	| "team_member"
	| "other";

export type EmailEvent =
	| "sent"
	| "delivered"
	| "opened"
	| "clicked"
	| "bounced"
	| "complained"
	| "unsubscribed"
	| "replied";

export type SmsEvent =
	| "sent"
	| "delivered"
	| "failed"
	| "replied"
	| "opted_out";

export type CallEvent =
	| "initiated"
	| "ringing"
	| "connected"
	| "completed"
	| "failed"
	| "voicemail"
	| "no_answer"
	| "busy";

export interface BaseCommunicationEvent {
	companyId: string;
	messageId: string;
	recipientType?: RecipientType;
	recipientId?: string;
	templateName?: string;
}

export interface EmailTrackingEvent extends BaseCommunicationEvent {
	event: EmailEvent;
	linkUrl?: string; // For click events
	userAgent?: string;
	ipAddress?: string;
}

export interface SmsTrackingEvent extends BaseCommunicationEvent {
	event: SmsEvent;
	errorCode?: string;
	errorMessage?: string;
	segments?: number;
}

export interface CallTrackingEvent extends BaseCommunicationEvent {
	event: CallEvent;
	callDurationSeconds?: number;
	callOutcome?: string;
	recordingUrl?: string;
}

export interface CommunicationStats {
	communicationType: CommunicationType;
	totalSent: number;
	totalDelivered: number;
	totalOpened: number;
	totalClicked: number;
	totalBounced: number;
	totalReplied: number;
	openRate: number;
	clickRate: number;
	bounceRate: number;
	replyRate: number;
}

// ============================================
// Core Functions
// ============================================

/**
 * Log a communication event to the database
 */
async function logCommunicationEvent(
	companyId: string,
	communicationType: CommunicationType,
	messageId: string,
	event: string,
	options: {
		recipientType?: RecipientType;
		recipientId?: string;
		templateName?: string;
		linkUrl?: string;
		userAgent?: string;
		ipAddress?: string;
		errorCode?: string;
		errorMessage?: string;
		callDurationSeconds?: number;
		callOutcome?: string;
		metadata?: Record<string, unknown>;
	} = {},
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const { error } = await supabase.from("communication_analytics").insert({
			company_id: companyId,
			communication_type: communicationType,
			message_id: messageId,
			event_type: event,
			customer_id: options.recipientId || null,
			link_url: options.linkUrl || null,
			ip_address: options.ipAddress || null,
			call_duration_seconds: options.callDurationSeconds || null,
			call_outcome: options.callOutcome || null,
			event_data: {
				recipient_type: options.recipientType || null,
				template_name: options.templateName || null,
				user_agent: options.userAgent || null,
				error_code: options.errorCode || null,
				error_message: options.errorMessage || null,
				...(options.metadata || {}),
			},
			created_at: new Date().toISOString(),
		});

		if (error) {
			console.error(
				"[Communication Tracker] Failed to log event:",
				error.message,
			);
		}
	} catch (err) {
		console.error("[Communication Tracker] Logging error:", err);
	}
}

// ============================================
// Email Tracking
// ============================================

/**
 * Track when an email is sent
 */
export async function trackEmailSent(
	event: BaseCommunicationEvent,
): Promise<void> {
	await logCommunicationEvent(
		event.companyId,
		"email",
		event.messageId,
		"sent",
		{
			recipientType: event.recipientType,
			recipientId: event.recipientId,
			templateName: event.templateName,
		},
	);
}

/**
 * Track when an email is delivered
 */
export async function trackEmailDelivered(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "delivered");
}

/**
 * Track when an email is opened
 * Call this from your email tracking pixel endpoint
 */
export async function trackEmailOpen(
	companyId: string,
	messageId: string,
	options?: { userAgent?: string; ipAddress?: string },
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "opened", options);
}

/**
 * Track when a link in an email is clicked
 * Call this from your email link redirect endpoint
 */
export async function trackEmailClick(
	companyId: string,
	messageId: string,
	linkUrl: string,
	options?: { userAgent?: string; ipAddress?: string },
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "clicked", {
		...options,
		linkUrl,
	});
}

/**
 * Track when an email bounces
 */
export async function trackEmailBounce(
	companyId: string,
	messageId: string,
	bounceType: "hard" | "soft",
	errorMessage?: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "bounced", {
		errorMessage,
		metadata: { bounce_type: bounceType },
	});
}

/**
 * Track when a recipient complains (marks as spam)
 */
export async function trackEmailComplaint(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "complained");
}

/**
 * Track when a recipient unsubscribes
 */
export async function trackEmailUnsubscribe(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "unsubscribed");
}

/**
 * Track when a recipient replies to an email
 */
export async function trackEmailReply(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "email", messageId, "replied");
}

// ============================================
// SMS Tracking
// ============================================

/**
 * Track when an SMS is sent
 */
export async function trackSmsSent(
	event: BaseCommunicationEvent & { segments?: number },
): Promise<void> {
	await logCommunicationEvent(event.companyId, "sms", event.messageId, "sent", {
		recipientType: event.recipientType,
		recipientId: event.recipientId,
		templateName: event.templateName,
		metadata: { segments: event.segments },
	});
}

/**
 * Track when an SMS is delivered
 */
export async function trackSmsDelivered(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "sms", messageId, "delivered");
}

/**
 * Track when an SMS fails to deliver
 */
export async function trackSmsFailed(
	companyId: string,
	messageId: string,
	errorCode: string,
	errorMessage: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "sms", messageId, "failed", {
		errorCode,
		errorMessage,
	});
}

/**
 * Track when a recipient replies to an SMS
 */
export async function trackSmsReply(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "sms", messageId, "replied");
}

/**
 * Track when a recipient opts out of SMS
 */
export async function trackSmsOptOut(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "sms", messageId, "opted_out");
}

// ============================================
// Call Tracking
// ============================================

/**
 * Track when a call is initiated
 */
export async function trackCallInitiated(
	event: BaseCommunicationEvent,
): Promise<void> {
	await logCommunicationEvent(
		event.companyId,
		"call",
		event.messageId,
		"initiated",
		{
			recipientType: event.recipientType,
			recipientId: event.recipientId,
		},
	);
}

/**
 * Track when a call is connected
 */
export async function trackCallConnected(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "call", messageId, "connected");
}

/**
 * Track when a call is completed
 */
export async function trackCallCompleted(
	companyId: string,
	messageId: string,
	durationSeconds: number,
	outcome?: string,
	recordingUrl?: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "call", messageId, "completed", {
		callDurationSeconds: durationSeconds,
		callOutcome: outcome,
		metadata: recordingUrl ? { recording_url: recordingUrl } : undefined,
	});
}

/**
 * Track when a call fails
 */
export async function trackCallFailed(
	companyId: string,
	messageId: string,
	errorCode: string,
	errorMessage: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "call", messageId, "failed", {
		errorCode,
		errorMessage,
	});
}

/**
 * Track when a call goes to voicemail
 */
export async function trackCallVoicemail(
	companyId: string,
	messageId: string,
	recordingUrl?: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "call", messageId, "voicemail", {
		metadata: recordingUrl ? { recording_url: recordingUrl } : undefined,
	});
}

/**
 * Track when a call is not answered
 */
export async function trackCallNoAnswer(
	companyId: string,
	messageId: string,
): Promise<void> {
	await logCommunicationEvent(companyId, "call", messageId, "no_answer");
}

// ============================================
// Query Functions
// ============================================

/**
 * Get communication statistics for a company
 */
export async function getCommunicationStats(
	companyId: string,
	communicationType?: CommunicationType,
	days: number = 30,
): Promise<CommunicationStats[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		let query = supabase
			.from("communication_analytics")
			.select("communication_type, event_type")
			.eq("company_id", companyId)
			.gte("created_at", cutoff);

		if (communicationType) {
			query = query.eq("communication_type", communicationType);
		}

		const { data, error } = await query;

		if (error) {
			console.error(
				"[Communication Tracker] Failed to get stats:",
				error.message,
			);
			return [];
		}

		// Aggregate by communication type
		const statsMap = new Map<string, CommunicationStats>();

		for (const row of data || []) {
			const type = row.communication_type as CommunicationType;
			const event = row.event_type;

			if (!statsMap.has(type)) {
				statsMap.set(type, {
					communicationType: type,
					totalSent: 0,
					totalDelivered: 0,
					totalOpened: 0,
					totalClicked: 0,
					totalBounced: 0,
					totalReplied: 0,
					openRate: 0,
					clickRate: 0,
					bounceRate: 0,
					replyRate: 0,
				});
			}

			const stats = statsMap.get(type)!;

			switch (event) {
				case "sent":
					stats.totalSent++;
					break;
				case "delivered":
					stats.totalDelivered++;
					break;
				case "opened":
					stats.totalOpened++;
					break;
				case "clicked":
					stats.totalClicked++;
					break;
				case "bounced":
					stats.totalBounced++;
					break;
				case "replied":
					stats.totalReplied++;
					break;
			}
		}

		// Calculate rates
		Array.from(statsMap.values()).forEach((stats) => {
			const base = stats.totalSent || 1;
			stats.openRate = Math.round((stats.totalOpened / base) * 100);
			stats.clickRate = Math.round((stats.totalClicked / base) * 100);
			stats.bounceRate = Math.round((stats.totalBounced / base) * 100);
			stats.replyRate = Math.round((stats.totalReplied / base) * 100);
		});

		return Array.from(statsMap.values());
	} catch (err) {
		console.error("[Communication Tracker] Stats query error:", err);
		return [];
	}
}

/**
 * Get email engagement for a specific message
 */
export async function getEmailEngagement(
	companyId: string,
	messageId: string,
): Promise<{
	sent: boolean;
	delivered: boolean;
	opened: boolean;
	openCount: number;
	clicked: boolean;
	clickCount: number;
	bounced: boolean;
	replied: boolean;
}> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return {
			sent: false,
			delivered: false,
			opened: false,
			openCount: 0,
			clicked: false,
			clickCount: 0,
			bounced: false,
			replied: false,
		};

		const { data, error } = await supabase
			.from("communication_analytics")
			.select("event_type")
			.eq("company_id", companyId)
			.eq("message_id", messageId)
			.eq("communication_type", "email");

		if (error) {
			console.error(
				"[Communication Tracker] Failed to get engagement:",
				error.message,
			);
			return {
				sent: false,
				delivered: false,
				opened: false,
				openCount: 0,
				clicked: false,
				clickCount: 0,
				bounced: false,
				replied: false,
			};
		}

		const events = (data || []).map((row) => row.event_type);

		return {
			sent: events.includes("sent"),
			delivered: events.includes("delivered"),
			opened: events.includes("opened"),
			openCount: events.filter((e) => e === "opened").length,
			clicked: events.includes("clicked"),
			clickCount: events.filter((e) => e === "clicked").length,
			bounced: events.includes("bounced"),
			replied: events.includes("replied"),
		};
	} catch (err) {
		console.error("[Communication Tracker] Engagement query error:", err);
		return {
			sent: false,
			delivered: false,
			opened: false,
			openCount: 0,
			clicked: false,
			clickCount: 0,
			bounced: false,
			replied: false,
		};
	}
}

/**
 * Get top performing email templates
 */
export async function getTopEmailTemplates(
	companyId: string,
	days: number = 30,
	limit: number = 10,
): Promise<
	{
		templateName: string;
		sent: number;
		opened: number;
		clicked: number;
		openRate: number;
		clickRate: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabase
			.from("communication_analytics")
			.select("template_name, event_type")
			.eq("company_id", companyId)
			.eq("communication_type", "email")
			.not("template_name", "is", null)
			.gte("created_at", cutoff);

		if (error) {
			console.error(
				"[Communication Tracker] Failed to get top templates:",
				error.message,
			);
			return [];
		}

		// Aggregate by template
		const templateMap = new Map<
			string,
			{ sent: number; opened: number; clicked: number }
		>();

		for (const row of data || []) {
			const template = row.template_name;
			if (!template) continue;

			if (!templateMap.has(template)) {
				templateMap.set(template, { sent: 0, opened: 0, clicked: 0 });
			}

			const stats = templateMap.get(template)!;

			switch (row.event_type) {
				case "sent":
					stats.sent++;
					break;
				case "opened":
					stats.opened++;
					break;
				case "clicked":
					stats.clicked++;
					break;
			}
		}

		// Calculate rates and sort
		const results = Array.from(templateMap.entries())
			.map(([templateName, stats]) => ({
				templateName,
				sent: stats.sent,
				opened: stats.opened,
				clicked: stats.clicked,
				openRate: Math.round((stats.opened / (stats.sent || 1)) * 100),
				clickRate: Math.round((stats.clicked / (stats.sent || 1)) * 100),
			}))
			.sort((a, b) => b.sent - a.sent)
			.slice(0, limit);

		return results;
	} catch (err) {
		console.error("[Communication Tracker] Top templates query error:", err);
		return [];
	}
}

/**
 * Get call duration statistics
 */
export async function getCallStats(
	companyId: string,
	days: number = 30,
): Promise<{
	totalCalls: number;
	connectedCalls: number;
	failedCalls: number;
	voicemails: number;
	averageDurationSeconds: number;
	totalDurationMinutes: number;
	connectRate: number;
}> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return {
			totalCalls: 0,
			connectedCalls: 0,
			failedCalls: 0,
			voicemails: 0,
			averageDurationSeconds: 0,
			totalDurationMinutes: 0,
			connectRate: 0,
		};

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabase
			.from("communication_analytics")
			.select("event_type, call_duration_seconds")
			.eq("company_id", companyId)
			.eq("communication_type", "call")
			.gte("created_at", cutoff);

		if (error) {
			console.error(
				"[Communication Tracker] Failed to get call stats:",
				error.message,
			);
			return {
				totalCalls: 0,
				connectedCalls: 0,
				failedCalls: 0,
				voicemails: 0,
				averageDurationSeconds: 0,
				totalDurationMinutes: 0,
				connectRate: 0,
			};
		}

		const events = data || [];
		const initiated = events.filter((e) => e.event_type === "initiated").length;
		const connected = events.filter((e) => e.event_type === "connected").length;
		const completed = events.filter((e) => e.event_type === "completed");
		const failed = events.filter((e) => e.event_type === "failed").length;
		const voicemails = events.filter(
			(e) => e.event_type === "voicemail",
		).length;

		const totalDuration = completed.reduce(
			(sum, e) => sum + (e.call_duration_seconds || 0),
			0,
		);

		return {
			totalCalls: initiated,
			connectedCalls: connected,
			failedCalls: failed,
			voicemails,
			averageDurationSeconds:
				completed.length > 0 ? Math.round(totalDuration / completed.length) : 0,
			totalDurationMinutes: Math.round(totalDuration / 60),
			connectRate: initiated > 0 ? Math.round((connected / initiated) * 100) : 0,
		};
	} catch (err) {
		console.error("[Communication Tracker] Call stats query error:", err);
		return {
			totalCalls: 0,
			connectedCalls: 0,
			failedCalls: 0,
			voicemails: 0,
			averageDurationSeconds: 0,
			totalDurationMinutes: 0,
			connectRate: 0,
		};
	}
}

// ============================================
// Exports
// ============================================

export default {
	// Email
	trackEmailSent,
	trackEmailDelivered,
	trackEmailOpen,
	trackEmailClick,
	trackEmailBounce,
	trackEmailComplaint,
	trackEmailUnsubscribe,
	trackEmailReply,
	// SMS
	trackSmsSent,
	trackSmsDelivered,
	trackSmsFailed,
	trackSmsReply,
	trackSmsOptOut,
	// Call
	trackCallInitiated,
	trackCallConnected,
	trackCallCompleted,
	trackCallFailed,
	trackCallVoicemail,
	trackCallNoAnswer,
	// Queries
	getCommunicationStats,
	getEmailEngagement,
	getTopEmailTemplates,
	getCallStats,
};
