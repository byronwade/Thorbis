/**
 * SMS Service
 * 
 * Handles fetching and managing SMS messages from the communications table
 * Similar structure to email-service.ts but for SMS type communications
 */

import { createClient } from "@/lib/supabase/server";
import type { TypedSupabaseClient } from "@/types/supabase";

export type CompanySms = {
	id: string;
	from_address: string | null;
	from_name: string | null;
	to_address: string | null;
	body: string;
	body_html: string | null;
	created_at: string;
	read_at: string | null;
	direction: "inbound" | "outbound";
	customer_id: string | null;
	customer?: {
		id: string;
		first_name: string | null;
		last_name: string | null;
		display_name: string | null;
		email: string | null;
		phone: string | null;
		company_name: string | null;
	} | null;
	sent_at: string | null;
	delivered_at: string | null;
	status: string;
	channel: string | null;
	provider_metadata: Record<string, unknown> | null;
	is_archived: boolean;
	snoozed_until: string | null;
	category: string | null;
	tags: string[] | null;
	telnyx_message_id: string | null;
};

export type GetCompanySmsInput = {
	limit?: number;
	offset?: number;
	type?: "sent" | "received" | "all";
	folder?: "inbox" | "sent" | "archive" | "trash" | "bin";
	label?: string;
	search?: string | null;
	sortBy?: "created_at" | "sent_at";
	sortOrder?: "asc" | "desc";
};

export type GetCompanySmsResult = {
	sms: CompanySms[];
	total: number;
	hasMore: boolean;
};

export async function getCompanySms(
	companyId: string,
	input: GetCompanySmsInput = {},
): Promise<GetCompanySmsResult> {
	const supabase = await createClient();

	if (!supabase) {
		return { sms: [], total: 0, hasMore: false };
	}

	const {
		limit = 50,
		offset = 0,
		type = "all",
		folder,
		label,
		search,
		sortBy = "created_at",
		sortOrder = "desc",
	} = input;

	// Build the query - get all SMS messages
	let query = supabase
		.from("communications")
		.select(
			`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`,
			{ count: "exact" },
		)
		.eq("company_id", companyId)
		.eq("type", "sms");

	// Apply folder filtering
	if (folder) {
		switch (folder) {
			case "inbox":
				// Inbox: inbound, not archived, not deleted, not snoozed (or snooze expired)
				query = query
					.eq("direction", "inbound")
					.eq("is_archived", false)
					.is("deleted_at", null)
					.or("snoozed_until.is.null,snoozed_until.lt.now()");
				break;
			case "sent":
				// Sent: outbound, not archived, not deleted
				query = query
					.eq("direction", "outbound")
					.eq("is_archived", false)
					.is("deleted_at", null);
				break;
			case "archive":
				// Archive: is_archived = true, not deleted
				query = query.eq("is_archived", true).is("deleted_at", null);
				break;
			case "trash":
			case "bin":
				// Trash: deleted_at is not null
				query = query.not("deleted_at", "is", null);
				break;
			default:
				// Custom folder or label filtering
				if (label || folder) {
					const folderName = label || folder;
					query = query
						.contains("tags", [folderName])
						.is("deleted_at", null);
				}
				break;
		}
	} else {
		// Default: exclude deleted SMS
		query = query.is("deleted_at", null);
	}

	// Apply direction filter
	if (type === "sent") {
		query = query.eq("direction", "outbound");
	} else if (type === "received") {
		query = query.eq("direction", "inbound");
	}

	// Apply search filter
	if (search) {
		const searchLower = search.toLowerCase();
		query = query.or(
			`from_address.ilike.%${searchLower}%,to_address.ilike.%${searchLower}%,body.ilike.%${searchLower}%`,
		);
	}

	// Apply sorting
	const ascending = sortOrder === "asc";
	if (sortBy === "sent_at") {
		query = query.order("sent_at", { ascending, nullsFirst: false });
	} else {
		query = query.order("created_at", { ascending });
	}

	// Apply pagination
	query = query.range(offset, offset + limit - 1);

	const { data, error, count } = await query;

	if (error) {
		console.error("Error fetching SMS messages:", error);
		return { sms: [], total: 0, hasMore: false };
	}

	const sms = (data || []).map((msg) => ({
		...msg,
		tags: (msg.tags as string[]) || null,
		provider_metadata: (msg.provider_metadata as Record<string, unknown>) || null,
	})) as CompanySms[];

	const total = count || 0;
	const hasMore = offset + sms.length < total;

	return {
		sms,
		total,
		hasMore,
	};
}

export async function getSmsById(
	companyId: string,
	smsId: string,
): Promise<CompanySms | null> {
	const supabase = await createClient();

	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from("communications")
		.select(
			`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`,
		)
		.eq("id", smsId)
		.eq("company_id", companyId)
		.eq("type", "sms")
		.single();

	if (error || !data) {
		return null;
	}

	return {
		...data,
		tags: (data.tags as string[]) || null,
		provider_metadata: (data.provider_metadata as Record<string, unknown>) || null,
	} as CompanySms;
}

export async function markSmsAsRead(
	companyId: string,
	smsId: string,
): Promise<boolean> {
	const supabase = await createClient();

	if (!supabase) {
		console.error("❌ markSmsAsRead: Missing supabase");
		return false;
	}

	const readAt = new Date().toISOString();
	const { data, error } = await supabase
		.from("communications")
		.update({ read_at: readAt })
		.eq("id", smsId)
		.eq("company_id", companyId)
		.eq("type", "sms")
		.select("id, read_at")
		.single();

	if (error) {
		console.error("❌ markSmsAsRead error:", error);
		return false;
	}

	if (!data) {
		console.error("❌ markSmsAsRead: No data returned");
		return false;
	}

	console.log("✅ markSmsAsRead success:", { smsId, read_at: data.read_at });
	return true;
}

/**
 * Get all SMS messages for a conversation thread (by phone number)
 */
export async function getSmsConversation(
	companyId: string,
	phoneNumber: string,
): Promise<CompanySms[]> {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}

	// Normalize phone number for matching
	const normalizePhone = (phone: string) => {
		const digits = phone.replace(/[^0-9]/g, "");
		if (digits.length === 11 && digits.startsWith("1")) {
			return `+${digits}`;
		}
		if (digits.length === 10) {
			return `+1${digits}`;
		}
		return phone.startsWith("+") ? phone : `+${phone}`;
	};

	const normalizedPhone = normalizePhone(phoneNumber);

	// Fetch all messages where this phone number is either from or to
	const { data, error } = await supabase
		.from("communications")
		.select(
			`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`,
		)
		.eq("company_id", companyId)
		.eq("type", "sms")
		.is("deleted_at", null)
		.or(`from_address.eq.${normalizedPhone},to_address.eq.${normalizedPhone}`)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Error fetching SMS conversation:", error);
		return [];
	}

	return (data || []).map((msg) => ({
		...msg,
		tags: (msg.tags as string[]) || null,
		provider_metadata: (msg.provider_metadata as Record<string, unknown>) || null,
	})) as CompanySms[];
}

/**
 * Mark all unread messages in an SMS conversation as read
 */
export async function markSmsConversationAsRead(
	companyId: string,
	phoneNumber: string,
): Promise<boolean> {
	const supabase = await createClient();

	if (!supabase) {
		return false;
	}

	// Normalize phone number for matching
	const normalizePhone = (phone: string) => {
		const digits = phone.replace(/[^0-9]/g, "");
		if (digits.length === 11 && digits.startsWith("1")) {
			return `+${digits}`;
		}
		if (digits.length === 10) {
			return `+1${digits}`;
		}
		return phone.startsWith("+") ? phone : `+${phone}`;
	};

	const normalizedPhone = normalizePhone(phoneNumber);

	// Mark all unread inbound messages in this conversation as read
	const readAt = new Date().toISOString();
	const { data, error } = await supabase
		.from("communications")
		.update({ read_at: readAt })
		.eq("company_id", companyId)
		.eq("type", "sms")
		.eq("direction", "inbound")
		.is("read_at", null)
		.is("deleted_at", null)
		.or(`from_address.eq.${normalizedPhone},to_address.eq.${normalizedPhone}`)
		.select("id, read_at");

	if (error) {
		console.error("❌ markSmsConversationAsRead error:", error);
		return false;
	}

	console.log(`✅ markSmsConversationAsRead success: Marked ${data?.length || 0} messages as read`);
	return true;
}

