import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export type EmailFolder = "inbox" | "spam" | "starred" | "sent" | "drafts" | "archive" | "snoozed" | "trash" | "bin";

export type EmailQueryParams = {
	folder?: EmailFolder;
	search?: string;
	limit?: number;
	offset?: number;
};

export type EmailRecord = {
	id: string;
	company_id: string;
	customer_id: string | null;
	from_address: string | null;
	from_name: string | null;
	to_address: string | null;
	subject: string | null;
	body: string | null;
	body_html: string | null;
	direction: "inbound" | "outbound" | null;
	status: string | null;
	category: string | null;
	tags: string[] | null;
	read_at: string | null;
	sent_at: string | null;
	delivered_at: string | null;
	opened_at: string | null;
	clicked_at: string | null;
	open_count: number | null;
	click_count: number | null;
	created_at: string;
	updated_at: string;
	customer?: {
		id: string;
		first_name: string | null;
		last_name: string | null;
		display_name: string | null;
		email: string | null;
		phone: string | null;
	} | null;
};

export type EmailsResult = {
	emails: EmailRecord[];
	total: number;
	hasMore: boolean;
};

/**
 * Cached email fetching function using React.cache()
 * This ensures multiple components calling getEmails in the same request
 * only trigger one database query
 */
export const getEmails = cache(async (
	params: EmailQueryParams = {}
): Promise<EmailsResult> => {
	const { folder, search, limit = 50, offset = 0 } = params;

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return { emails: [], total: 0, hasMore: false };
	}

	const supabase = await createClient();
	if (!supabase) {
		return { emails: [], total: 0, hasMore: false };
	}

	let query = supabase
		.from("communications")
		.select(`
			id,
			company_id,
			customer_id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			direction,
			status,
			category,
			tags,
			read_at,
			sent_at,
			delivered_at,
			opened_at,
			clicked_at,
			open_count,
			click_count,
			created_at,
			updated_at,
			is_archived,
			snoozed_until,
			customer:customers!customer_id(
				id,
				first_name,
				last_name,
				display_name,
				email,
				phone
			)
		`, { count: "exact" })
		.eq("company_id", companyId)
		.eq("type", "email")
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	// Apply deleted_at filter based on folder (trash needs deleted emails, others don't)
	if (folder !== "trash" && folder !== "bin") {
		query = query.is("deleted_at", null);
	}

	// Apply folder filter (matches email-service.ts logic for consistency)
	if (folder) {
		switch (folder) {
			case "inbox":
				// Inbox: inbound, not archived, not draft, not spam, not snoozed (or snooze expired)
				query = query
					.eq("direction", "inbound")
					.eq("is_archived", false)
					.neq("status", "draft")
					.or("category.is.null,category.neq.spam")
					.or("snoozed_until.is.null,snoozed_until.lt.now()");
				break;
			case "sent":
				// Sent: outbound, not archived, not drafts
				query = query
					.eq("direction", "outbound")
					.eq("is_archived", false)
					.neq("status", "draft");
				break;
			case "spam":
				query = query.eq("category", "spam");
				break;
			case "starred":
				query = query.contains("tags", ["starred"]).is("deleted_at", null);
				break;
			case "archive":
				query = query.eq("is_archived", true);
				break;
			case "drafts":
				query = query.eq("status", "draft");
				break;
			case "snoozed":
				query = query
					.not("snoozed_until", "is", null)
					.gt("snoozed_until", new Date().toISOString());
				break;
			case "trash":
			case "bin":
				query = query.not("deleted_at", "is", null);
				break;
		}
	}

	// Apply search filter
	if (search) {
		query = query.or(`subject.ilike.%${search}%,from_address.ilike.%${search}%,from_name.ilike.%${search}%`);
	}

	const { data, error, count } = await query;

	if (error) {
		console.error("Failed to fetch emails:", error);
		return { emails: [], total: 0, hasMore: false };
	}

	const emails = (data ?? []).map(email => {
		// Parse to_address if it's a JSON string
		let parsedToAddress = email.to_address;
		if (typeof email.to_address === 'string') {
			const trimmed = email.to_address.trim();
			if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
				try {
					const parsed = JSON.parse(email.to_address);
					if (Array.isArray(parsed) && parsed.length > 0) {
						parsedToAddress = parsed[0];
					}
				} catch {
					// Keep original if parsing fails
				}
			}
		}
		return {
			...email,
			to_address: parsedToAddress,
		} as EmailRecord;
	});

	const total = count ?? emails.length;
	const hasMore = offset + emails.length < total;

	return { emails, total, hasMore };
});

/**
 * Get a single email by ID
 */
export const getEmailById = cache(async (emailId: string): Promise<EmailRecord | null> => {
	const companyId = await getActiveCompanyId();
	if (!companyId) return null;

	const supabase = await createClient();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from("communications")
		.select(`
			id,
			company_id,
			customer_id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			direction,
			status,
			category,
			tags,
			read_at,
			sent_at,
			delivered_at,
			opened_at,
			clicked_at,
			open_count,
			click_count,
			created_at,
			updated_at,
			customer:customers!customer_id(
				id,
				first_name,
				last_name,
				display_name,
				email,
				phone
			)
		`)
		.eq("id", emailId)
		.eq("company_id", companyId)
		.eq("type", "email")
		.single();

	if (error || !data) return null;

	return data as EmailRecord;
});
