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
	const toAddress = Array.isArray(payload.to)
		? payload.to.join(", ")
		: payload.to;
	const ccAddress = payload.cc
		? Array.isArray(payload.cc)
			? payload.cc.join(", ")
			: payload.cc
		: null;
	const bccAddress = payload.bcc
		? Array.isArray(payload.bcc)
			? payload.bcc.join(", ")
			: payload.bcc
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
			channel: "sendgrid",
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
			provider_metadata:
				isScheduled && payload.attachments
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
async function bulkArchiveCommunicationsAction(
	communicationIds: string[],
	type?: "email" | "sms" | "call",
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
			return {
				success: false,
				archived: 0,
				error: "Database connection failed",
			};
		}

		// Get user's company for security
		const {
			data: { user },
		} = await supabase.auth.getUser();
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

/**
 * Save internal notes for a communication
 * Internal notes are private team notes not visible to customers
 */
const saveInternalNotesSchema = z.object({
	communicationId: z.string().uuid(),
	notes: z.string(),
});

export type SaveInternalNotesInput = z.infer<typeof saveInternalNotesSchema>;

export async function saveInternalNotesAction(
	input: SaveInternalNotesInput,
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const payload = saveInternalNotesSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		// Get authenticated user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Update internal notes
		const { error } = await supabase
			.from("communications")
			.update({
				internal_notes: payload.notes,
				internal_notes_updated_at: new Date().toISOString(),
				internal_notes_updated_by: user.id,
			})
			.eq("id", payload.communicationId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(COMMUNICATIONS_PATH);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get communications with filters (for client-side refresh)
 */
const getCommunicationsSchema = z.object({
	companyId: z.string().uuid(),
	teamMemberId: z.string().uuid(),
	type: z.enum(["email", "sms", "call", "voicemail"]).optional(),
	customerId: z.string().uuid().optional(),
	jobId: z.string().uuid().optional(),
	limit: z.number().min(1).max(200).default(100),
	offset: z.number().min(0).default(0),
});

export type GetCommunicationsInput = z.infer<typeof getCommunicationsSchema>;

export async function getCommunicationsAction(input: GetCommunicationsInput) {
	try {
		const payload = getCommunicationsSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database", data: [] };
		}

		// Build query with customer join
		let query = supabase
			.from("communications")
			.select(
				`
				*,
				customer:customers(id, first_name, last_name, email, phone)
			`,
			)
			.eq("company_id", payload.companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(payload.limit);

		// Apply filters
		if (payload.type) {
			query = query.eq("type", payload.type);
		}
		if (payload.customerId) {
			query = query.eq("customer_id", payload.customerId);
		}
		if (payload.jobId) {
			query = query.eq("job_id", payload.jobId);
		}
		if (payload.offset > 0) {
			query = query.range(payload.offset, payload.offset + payload.limit - 1);
		}

		const { data, error } = await query;

		if (error) {
			return { success: false, error: error.message, data: [] };
		}

		// Transform data to Communication type format
		const communications = (data || []).map((comm: any) => ({
			id: comm.id,
			companyId: comm.company_id,
			type: comm.type as "email" | "sms" | "call" | "voicemail",
			direction: comm.direction as "inbound" | "outbound",
			status: comm.status,
			fromAddress: comm.from_address || undefined,
			fromName: comm.from_name || undefined,
			toAddress: comm.to_address || undefined,
			toName: comm.to_name || undefined,
			subject: comm.subject || undefined,
			body: comm.body || undefined,
			bodyHtml: comm.body_html || undefined,
			customerId: comm.customer_id || undefined,
			jobId: comm.job_id || undefined,
			propertyId: comm.property_id || undefined,
			mailboxOwnerId: comm.mailbox_owner_id,
			assignedTo: comm.assigned_to,
			visibilityScope: comm.visibility_scope,
			emailCategory: comm.category,
			createdAt: comm.created_at,
			customer: comm.customer
				? {
						id: comm.customer.id,
						firstName: comm.customer.first_name || undefined,
						lastName: comm.customer.last_name || undefined,
						email: comm.customer.email || undefined,
						phone: comm.customer.phone || undefined,
					}
				: undefined,
		}));

		return { success: true, data: communications };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			data: [],
		};
	}
}

/**
 * Auto-link a communication to a customer/job/property
 * Uses confidence scoring and link method tracking
 */
const autoLinkCommunicationSchema = z.object({
	communicationId: z.string().uuid(),
	customerId: z.string().uuid().optional(),
	jobId: z.string().uuid().optional(),
	propertyId: z.string().uuid().optional(),
	linkConfidence: z.number().min(0).max(1),
	linkMethod: z.enum(["manual", "ai", "regex", "phone_match", "email_match"]),
});

export type AutoLinkCommunicationInput = z.infer<
	typeof autoLinkCommunicationSchema
>;

export async function autoLinkCommunicationAction(
	input: AutoLinkCommunicationInput,
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const payload = autoLinkCommunicationSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		// Validate at least one link target is provided
		if (!payload.customerId && !payload.jobId && !payload.propertyId) {
			return { success: false, error: "At least one link target required" };
		}

		// Update communication with auto-link data
		const { error } = await supabase
			.from("communications")
			.update({
				customer_id: payload.customerId || null,
				job_id: payload.jobId || null,
				property_id: payload.propertyId || null,
				auto_linked: true,
				link_confidence: payload.linkConfidence,
				link_method: payload.linkMethod,
			})
			.eq("id", payload.communicationId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath(COMMUNICATIONS_PATH);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get auto-link suggestions for a communication
 * Finds potential customer/job/property matches based on email/phone
 */
export interface MatchSuggestion {
	id: string;
	type: "customer" | "job" | "property";
	name: string;
	subtitle?: string;
	confidence: number;
	matchMethod: "email_match" | "phone_match" | "regex" | "ai";
	matchDetails?: string;
}

const getAutoLinkSuggestionsSchema = z.object({
	communicationId: z.string().uuid(),
	companyId: z.string().uuid(),
});

export type GetAutoLinkSuggestionsInput = z.infer<
	typeof getAutoLinkSuggestionsSchema
>;

export async function getAutoLinkSuggestionsAction(
	input: GetAutoLinkSuggestionsInput,
): Promise<{
	success: boolean;
	error?: string;
	suggestions?: MatchSuggestion[];
}> {
	try {
		const payload = getAutoLinkSuggestionsSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		// Get the communication to extract email/phone
		const { data: communication, error: commError } = await supabase
			.from("communications")
			.select("*")
			.eq("id", payload.communicationId)
			.eq("company_id", payload.companyId)
			.single();

		if (commError || !communication) {
			return { success: false, error: "Communication not found" };
		}

		// Extract email and phone from communication
		const emailToMatch =
			communication.direction === "inbound"
				? communication.from_address
				: communication.to_address;

		// Extract phone number (if it's a call or SMS)
		const phoneToMatch =
			communication.type === "call" || communication.type === "sms"
				? communication.direction === "inbound"
					? communication.from_address
					: communication.to_address
				: null;

		const suggestions: MatchSuggestion[] = [];

		// Search for customer matches by email (exact match)
		if (emailToMatch && emailToMatch.includes("@")) {
			const { data: customersByEmail } = await supabase
				.from("customers")
				.select("id, first_name, last_name, email, phone")
				.eq("company_id", payload.companyId)
				.ilike("email", emailToMatch)
				.limit(3);

			if (customersByEmail && customersByEmail.length > 0) {
				customersByEmail.forEach((customer) => {
					suggestions.push({
						id: customer.id,
						type: "customer",
						name:
							`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
							"Unnamed Customer",
						subtitle: customer.email || customer.phone || undefined,
						confidence: 0.95,
						matchMethod: "email_match",
						matchDetails: "Email address match",
					});
				});
			}
		}

		// Search for customer matches by phone
		if (phoneToMatch) {
			// Clean phone number (remove formatting)
			const cleanPhone = phoneToMatch.replace(/[^\d]/g, "");

			if (cleanPhone.length >= 10) {
				const { data: customersByPhone } = await supabase
					.from("customers")
					.select("id, first_name, last_name, email, phone")
					.eq("company_id", payload.companyId)
					.or(
						`phone.ilike.%${cleanPhone.slice(-10)}%,mobile_phone.ilike.%${cleanPhone.slice(-10)}%`,
					)
					.limit(3);

				if (customersByPhone && customersByPhone.length > 0) {
					customersByPhone.forEach((customer) => {
						// Don't add duplicate if already matched by email
						if (!suggestions.find((s) => s.id === customer.id)) {
							suggestions.push({
								id: customer.id,
								type: "customer",
								name:
									`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
									"Unnamed Customer",
								subtitle: customer.phone || customer.email || undefined,
								confidence: 0.9,
								matchMethod: "phone_match",
								matchDetails: "Phone number match",
							});
						}
					});
				}
			}
		}

		// For matched customers, find active jobs
		const customerIds = suggestions
			.filter((s) => s.type === "customer")
			.map((s) => s.id);

		if (customerIds.length > 0) {
			const { data: jobs } = await supabase
				.from("jobs")
				.select(
					"id, title, customer_id, property_id, status, customers(first_name, last_name), properties(address)",
				)
				.eq("company_id", payload.companyId)
				.in("customer_id", customerIds)
				.in("status", ["scheduled", "in_progress", "pending"])
				.order("scheduled_date", { ascending: false })
				.limit(5);

			if (jobs && jobs.length > 0) {
				jobs.forEach((job: any) => {
					suggestions.push({
						id: job.id,
						type: "job",
						name: job.title || "Untitled Job",
						subtitle:
							job.properties?.address ||
							`Job for ${job.customers?.first_name || ""} ${job.customers?.last_name || ""}`.trim(),
						confidence: 0.85,
						matchMethod: "email_match",
						matchDetails: "Via matched customer",
					});
				});
			}
		}

		return { success: true, suggestions };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Transfer a communication to another team member
 * Updates assigned_to and creates a transfer record
 */
const transferCommunicationSchema = z.object({
	communicationId: z.string().uuid(),
	toTeamMemberId: z.string().uuid(),
	notes: z.string().optional(),
	priority: z.enum(["normal", "high", "urgent"]).default("normal"),
});

export type TransferCommunicationInput = z.infer<
	typeof transferCommunicationSchema
>;

export async function transferCommunicationAction(
	input: TransferCommunicationInput,
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const payload = transferCommunicationSchema.parse(input);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Unable to access database" };
		}

		// Get authenticated user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get current team member ID for the user
		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, error: "No company found" };
		}

		// Get current team member
		const { data: currentTeamMember } = await supabase
			.from("team_members")
			.select("id")
			.eq("user_id", user.id)
			.eq("company_id", profile.company_id)
			.single();

		// Get the communication to verify it exists and get current transfer count
		const { data: communication, error: commError } = await supabase
			.from("communications")
			.select("id, transfer_count, assigned_to")
			.eq("id", payload.communicationId)
			.eq("company_id", profile.company_id)
			.single();

		if (commError || !communication) {
			return { success: false, error: "Communication not found" };
		}

		// Update the communication with transfer info
		const { error: updateError } = await supabase
			.from("communications")
			.update({
				assigned_to: payload.toTeamMemberId,
				transferred_from_team_member_id: currentTeamMember?.id || null,
				transfer_count: (communication.transfer_count || 0) + 1,
				priority: payload.priority,
				internal_notes: payload.notes
					? `[Transfer Note] ${payload.notes}${communication.assigned_to ? `\n\n---\n${communication.assigned_to}` : ""}`
					: undefined,
				updated_at: new Date().toISOString(),
			})
			.eq("id", payload.communicationId);

		if (updateError) {
			return { success: false, error: updateError.message };
		}

		revalidatePath(COMMUNICATIONS_PATH);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Toggle star status for any communication type (email, SMS, call, voicemail)
 */
export async function toggleStarCommunicationAction(communicationId: string): Promise<{
	success: boolean;
	isStarred?: boolean;
	error?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Get user's company for security
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("company_id")
			.eq("id", user.id)
			.single();

		if (!profile?.company_id) {
			return { success: false, error: "No company found" };
		}

		// Get current tags (don't filter by type - works for all communication types)
		const { data: communication, error: fetchError } = await supabase
			.from("communications")
			.select("tags")
			.eq("id", communicationId)
			.eq("company_id", profile.company_id)
			.single();

		if (fetchError) {
			return { success: false, error: fetchError.message };
		}

		const currentTags = (communication?.tags as string[]) || [];
		const isCurrentlyStarred = currentTags.includes("starred");

		// Toggle the starred tag
		const newTags = isCurrentlyStarred
			? currentTags.filter((tag) => tag !== "starred")
			: [...currentTags, "starred"];

		// Update the communication
		const { error: updateError } = await supabase
			.from("communications")
			.update({ tags: newTags.length > 0 ? newTags : null })
			.eq("id", communicationId)
			.eq("company_id", profile.company_id);

		if (updateError) {
			return { success: false, error: updateError.message };
		}

		revalidatePath(COMMUNICATIONS_PATH);
		return { success: true, isStarred: !isCurrentlyStarred };
	} catch (error) {
		console.error("Error toggling star on communication:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Diagnostic tool to check email configuration status
 * Returns detailed information about SendGrid setup and potential issues
 */
export async function checkEmailConfigurationAction(companyId: string): Promise<{
	success: boolean;
	error?: string;
		data?: {
		hasSendGridApiKey: boolean;
		hasActiveDomain: boolean;
		sendGridConfigured: boolean;
		issues: string[];
		warnings: string[];
		recommendations: string[];
	};
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return {
				success: false,
				error: "Unable to access database",
			};
		}

		const issues: string[] = [];
		const warnings: string[] = [];
		const recommendations: string[] = [];

		// Check SendGrid API key in database
		const { data: twilioSettings, error: twilioError } = await supabase
			.from("company_twilio_settings")
			.select("sendgrid_api_key, sendgrid_from_email, is_active")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.single();

		const hasSendGridApiKey = !!(twilioSettings?.sendgrid_api_key);
		if (!hasSendGridApiKey) {
			issues.push(
				"SendGrid API key not configured. Add it in Settings > Communications > Email Provider.",
			);
		}

		// Check for active email domain
		const { data: emailDomain } = await supabase
			.from("company_email_domains")
			.select("id, domain_name, status, sending_enabled, is_suspended")
			.eq("company_id", companyId)
			.eq("status", "verified")
			.eq("sending_enabled", true)
			.eq("is_suspended", false)
			.limit(1)
			.maybeSingle();

		const hasActiveDomain = !!emailDomain;
		if (!hasActiveDomain) {
			issues.push(
				"No active email domain configured. Set up an email domain in Settings > Communications > Email Provider.",
			);
		}

		// Recommendations
		if (!hasSendGridApiKey) {
			recommendations.push(
				"Configure SendGrid: Go to Settings > Communications > Email Provider and add your SendGrid API key.",
			);
		}

		if (!hasActiveDomain) {
			recommendations.push(
				"Set up an email domain: Go to Settings > Communications > Email Provider and verify a domain.",
			);
		}

		const sendGridConfigured = hasSendGridApiKey && hasActiveDomain;

		return {
			success: true,
			data: {
				hasSendGridApiKey,
				hasActiveDomain,
				sendGridConfigured,
				issues,
				warnings,
				recommendations,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
