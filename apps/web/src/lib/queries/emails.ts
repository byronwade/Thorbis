import { cache } from "react";
import {
	getActiveCompanyId,
	getActiveTeamMemberId,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export type EmailFolder =
	| "inbox"
	| "spam"
	| "starred"
	| "sent"
	| "drafts"
	| "archive"
	| "snoozed"
	| "trash"
	| "bin"
	| "all";
export type InboxType = "personal" | "company";
export type EmailCategory = "support" | "sales" | "billing" | "general";

export type EmailQueryParams = {
	inboxType?: InboxType;
	folder?: EmailFolder;
	category?: EmailCategory;
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
 * Cached email fetching function using React.cache() with dual-inbox support
 * This ensures multiple components calling getEmails in the same request
 * only trigger one database query
 *
 * Supports two inbox types:
 * - Personal: mailbox_owner_id = team_member_id (user's workspace email)
 * - Company: mailbox_owner_id IS NULL (shared categories: support, sales, billing, general)
 */
export const getEmails = cache(
	async (params: EmailQueryParams = {}): Promise<EmailsResult> => {
		const {
			inboxType = "personal",
			folder,
			category,
			search,
			limit = 50,
			offset = 0,
		} = params;

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
			.select(
				`
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
			mailbox_owner_id,
			customer:customers!customer_id(
				id,
				first_name,
				last_name,
				display_name,
				email,
				phone
			)
		`,
				{ count: "exact" },
			)
			.eq("company_id", companyId)
			.eq("type", "email")
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		// Apply inbox type filter
		if (inboxType === "personal") {
			// Personal inbox: only emails where mailbox_owner_id = current team member
			const teamMemberId = await getActiveTeamMemberId();
			if (teamMemberId) {
				query = query.eq("mailbox_owner_id", teamMemberId);
			} else {
				// No team member ID means user can't see personal emails
				return { emails: [], total: 0, hasMore: false };
			}
		} else if (inboxType === "company") {
			// Company inbox: only emails where mailbox_owner_id IS NULL (shared emails)
			query = query.is("mailbox_owner_id", null);

			// If category specified, filter by category
			if (category) {
				query = query.eq("category", category);
			}
		}

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
						.or(
							`snoozed_until.is.null,snoozed_until.lt.${new Date().toISOString()}`,
						);
					break;
				case "sent":
					// Sent: outbound, not archived, not drafts
					query = query
						.eq("direction", "outbound")
						.eq("is_archived", false)
						.neq("status", "draft");
					break;
				case "spam":
					// Spam: filtering done in-memory to catch both category=spam AND tags containing spam
					// Don't filter at DB level to ensure we don't lose any spam-tagged emails
					break;
				case "starred":
					// Starred filtering done in-memory after fetch due to JSONB query limitations
					// The .contains() generates PostgreSQL array syntax {value} not JSONB ["value"]
					query = query.is("deleted_at", null);
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
				case "all":
					// All mail: show everything except deleted (safety net - emails should never be lost)
					// No additional filters - just non-deleted emails
					break;
			}
		}

		// Apply search filter
		if (search) {
			query = query.or(
				`subject.ilike.%${search}%,from_address.ilike.%${search}%,from_name.ilike.%${search}%`,
			);
		}

		const { data, error, count } = await query;

		if (error) {
			console.error("Failed to fetch emails:", {
				message: error.message,
				code: error.code,
				details: error.details,
				hint: error.hint,
				fullError: JSON.stringify(error, null, 2),
			});
			return { emails: [], total: 0, hasMore: false };
		}

		let emails = (data ?? []).map((email) => {
			// Parse to_address if it's a JSON string
			let parsedToAddress = email.to_address;
			if (typeof email.to_address === "string") {
				const trimmed = email.to_address.trim();
				if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
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

		// Post-process: filter by tags in-memory (JSONB array containment not supported by PostgREST cs operator)
		let needsInMemoryCount = false;

		if (folder === "starred") {
			emails = emails.filter((email) => {
				const tags = email.tags;
				return Array.isArray(tags) && tags.includes("starred");
			});
			needsInMemoryCount = true;
		}

		// Filter spam emails in-memory (catches both category=spam AND spam tag)
		if (folder === "spam") {
			emails = emails.filter((email) => {
				const tags = email.tags;
				const hasSpamTag = Array.isArray(tags) && tags.includes("spam");
				return email.category === "spam" || hasSpamTag;
			});
			needsInMemoryCount = true;
		}

		const total = needsInMemoryCount ? emails.length : (count ?? emails.length);
		const hasMore = needsInMemoryCount ? false : offset + emails.length < total;

		return { emails, total, hasMore };
	},
);

/**
 * Get a single email by ID
 */
const getEmailById = cache(
	async (emailId: string): Promise<EmailRecord | null> => {
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
	},
);
