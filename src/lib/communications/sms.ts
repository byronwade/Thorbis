import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const SMS_TYPES = ["sms", "mms"];

type Supabase = SupabaseClient<Database>;

type CommunicationRow = Database["public"]["Tables"]["communications"]["Row"];

type Customer = Pick<
	Database["public"]["Tables"]["customers"]["Row"],
	"id" | "first_name" | "last_name" | "phone" | "email"
>;

type Job = Pick<
	Database["public"]["Tables"]["jobs"]["Row"],
	"id" | "job_number" | "title" | "status"
>;

export type SmsAttachment = {
	url: string;
	type?: string;
	name?: string;
};

export type SmsMessage = {
	id: string;
	threadId: string;
	body: string;
	direction: "inbound" | "outbound";
	status: string | null;
	timestamp: string;
	customer?: {
		id: string;
		name: string;
	};
	job?: {
		id: string;
		jobNumber: string;
		title: string;
	};
	attachments: SmsAttachment[];
};

export type SmsThread = {
	id: string;
	contactName: string;
	phoneNumber: string;
	lastMessage: string;
	lastTimestamp: string;
	unreadCount: number;
	customerId?: string | null;
};

function formatContactName(
	customer?: Customer | null,
	fallback?: string | null,
): string {
	if (customer) {
		const fullName =
			`${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim();
		if (fullName.length > 0) {
			return fullName;
		}
	}
	return fallback || "Unknown";
}

function formatPhoneDisplay(phone?: string | null): string {
	if (!phone) {
		return "Unknown";
	}

	const digits = phone.replace(/[^0-9]/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phone;
}

function getThreadKey(
	message: Pick<
		CommunicationRow,
		"direction" | "from_address" | "to_address" | "thread_id"
	>,
): string {
	if (message.thread_id) {
		return message.thread_id;
	}
	const remoteAddress =
		message.direction === "outbound"
			? message.to_address
			: message.from_address;
	return remoteAddress || "unknown";
}

function mapAttachments(raw: any): SmsAttachment[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.map((item) => {
			if (!item || typeof item !== "object") {
				return null;
			}
			const url = typeof item.url === "string" ? item.url : null;
			if (!url) {
				return null;
			}
			return {
				url,
				type: typeof item.type === "string" ? item.type : undefined,
				name: typeof item.name === "string" ? item.name : undefined,
			};
		})
		.filter((attachment): attachment is SmsAttachment => Boolean(attachment));
}

export async function fetchSmsThreads(
	supabase: Supabase,
	companyId: string,
	options?: { limit?: number },
): Promise<SmsThread[]> {
	const LIMIT = options?.limit ?? 400;

	const { data, error } = await supabase
		.from("communications")
		.select(
			`
        id,
        body,
        created_at,
        direction,
        status,
        from_address,
        to_address,
        thread_id,
        read_at,
        customer:customers(id, first_name, last_name, phone, email)
      `,
		)
		.eq("company_id", companyId)
		.in("type", SMS_TYPES)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(LIMIT);

	if (error || !data) {
		return [];
	}

	const threadMap = new Map<
		string,
		SmsThread & {
			lastTimestamp: string;
			lastMessage: string;
			unreadCount: number;
		}
	>();

	for (const message of data) {
		const key = getThreadKey(message);
		if (!key || key === "unknown") {
			continue;
		}

		const remoteAddress =
			message.direction === "outbound"
				? message.to_address
				: message.from_address;
		const fallbackName = formatPhoneDisplay(remoteAddress);
		const displayName = formatContactName(
			message.customer as Customer | null,
			fallbackName,
		);

		if (!threadMap.has(key)) {
			threadMap.set(key, {
				id: key,
				contactName: displayName,
				phoneNumber: remoteAddress || "",
				lastMessage: message.body || "",
				lastTimestamp: message.created_at || new Date().toISOString(),
				unreadCount: message.read_at
					? 0
					: message.direction === "inbound"
						? 1
						: 0,
				customerId: (message.customer as Customer | null)?.id ?? null,
			});
		} else {
			const existing = threadMap.get(key)!;
			if (!existing.phoneNumber && remoteAddress) {
				existing.phoneNumber = remoteAddress;
			}
			if (message.direction === "inbound" && !message.read_at) {
				existing.unreadCount += 1;
			}
		}
	}

	return Array.from(threadMap.values()).sort(
		(a, b) =>
			new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime(),
	);
}

export async function fetchSmsConversation(
	supabase: Supabase,
	companyId: string,
	threadId: string,
	options?: { limit?: number },
): Promise<any[]> {
	const LIMIT = options?.limit ?? 200;

	const { data, error } = await supabase
		.from("communications")
		.select(
			`
        id,
        body,
        created_at,
        direction,
        status,
        attachments,
        attachment_count,
        customer:customers(id, first_name, last_name),
        job:jobs(id, job_number, title),
        from_address,
        to_address,
        thread_id
      `,
		)
		.eq("company_id", companyId)
		.in("type", SMS_TYPES)
		.is("deleted_at", null)
		.or(`from_address.eq.${threadId},to_address.eq.${threadId}`)
		.order("created_at", { ascending: true })
		.limit(LIMIT);

	if (error || !data) {
		return [];
	}

	// Return messages as database Row types for compatibility with stores
	return data as any[];
}
