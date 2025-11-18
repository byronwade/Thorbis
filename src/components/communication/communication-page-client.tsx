"use client";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Inbox, Mail, MessageSquare, Phone, Ticket } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AllMessagesView } from "@/components/communication/all-messages-view";
import { CallsView } from "@/components/communication/calls-view";
import { CommunicationComposerHost } from "@/components/communication/communication-composer-host";
import { EmailView } from "@/components/communication/email-view";
import { SMSView } from "@/components/communication/sms-view";
import { TicketsView } from "@/components/communication/tickets-view";
import { useCommunicationStore } from "@/lib/stores/communication-store";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type MessageType = "email" | "sms" | "phone" | "ticket";
type MessageStatus = "unread" | "read" | "replied" | "archived";
type MessagePriority = "low" | "normal" | "high" | "urgent";
export type CompanyPhone = {
	id: string;
	number: string;
	label?: string | null;
	status?: string | null;
};

export type CommunicationRecord = {
	id: string;
	type: string;
	direction: "inbound" | "outbound";
	status: string;
	priority: string | null;
	subject: string | null;
	body: string | null;
	created_at: string;
	read_at: string | null;
	from_address: string | null;
	to_address: string | null;
	customer_id: string | null;
	phone_number_id: string | null;
	job_id?: string | null;
	property_id?: string | null;
	invoice_id?: string | null;
	estimate_id?: string | null;
	call_duration: number | null;
	customer: {
		id: string;
		first_name: string | null;
		last_name: string | null;
	} | null;
	telnyx_call_control_id?: string | null;
	telnyx_call_session_id?: string | null;
	telnyx_message_id?: string | null;
	call_recording_url?: string | null;
	provider_metadata?: Record<string, unknown> | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
};

type UnifiedMessage = {
	id: string;
	type: MessageType;
	from: string;
	fromPhone?: string;
	toPhone?: string;
	fromEmail?: string;
	toEmail?: string;
	subject?: string;
	preview: string;
	timestamp: Date;
	status: MessageStatus;
	priority: MessagePriority;
	direction: "inbound" | "outbound";
	callDuration?: number;
	callType?: "incoming" | "outgoing" | "missed" | "voicemail";
	telnyxCallControlId?: string;
	telnyxMessageId?: string;
	callRecordingUrl?: string;
	customerId?: string;
	threadId?: string | null;
	threadAddress?: string | null;
	sentAt?: string | null;
	deliveredAt?: string | null;
	failedAt?: string | null;
};

type CommunicationPageClientProps = {
	communications: CommunicationRecord[];
	companyId: string;
	companyPhones: CompanyPhone[];
};

export function CommunicationPageClient({
	communications,
	companyId,
	companyPhones,
}: CommunicationPageClientProps) {
	const [records, setRecords] = useState<CommunicationRecord[]>(communications);

	const activeFilter = useCommunicationStore((state) => state.activeFilter);
	const setActiveFilter = useCommunicationStore(
		(state) => state.setActiveFilter,
	);

	// Initialize records from communications prop only on mount
	// Subsequent updates come from realtime subscriptions
	// DO NOT sync prop changes - it causes infinite re-render loop!

	useEffect(() => {
		const supabase = createBrowserSupabaseClient();
		if (!supabase) {
			return;
		}

		const channel = supabase
			.channel(`communications:company:${companyId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "communications",
					filter: `company_id=eq.${companyId}`,
				},
				(payload) => {
					setRecords((prev) => applyRealtimePayload(prev, payload));
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	const handleCommunicationCreated = useCallback(
		(record: CommunicationRecord) => {
			setRecords((prev) =>
				upsertCommunicationRecord(prev, normalizeCommunicationRecord(record)),
			);
		},
		[],
	);

	const unifiedMessages = useMemo(
		() => records.map(convertCommunicationToMessage),
		[records],
	);

	const messageCounts = useMemo(
		() => ({
			all: unifiedMessages.length,
			email: unifiedMessages.filter((m) => m.type === "email").length,
			sms: unifiedMessages.filter((m) => m.type === "sms").length,
			phone: unifiedMessages.filter((m) => m.type === "phone").length,
			ticket: unifiedMessages.filter((m) => m.type === "ticket").length,
		}),
		[unifiedMessages],
	);

	const filteredMessages = useMemo(
		() =>
			unifiedMessages.filter(
				(msg) => activeFilter === "all" || msg.type === activeFilter,
			),
		[unifiedMessages, activeFilter],
	);

	const handleResumeCall = useCallback((callControlId: string) => {
		if (!callControlId) {
			return;
		}
		// Open call window in new tab
		window.open(
			`/call-window?callId=${encodeURIComponent(callControlId)}`,
			"_blank",
			"noopener,noreferrer",
		);
	}, []);

	const handleViewRecording = useCallback((recordingUrl: string) => {
		if (!recordingUrl) {
			return;
		}
		window.open(recordingUrl, "_blank", "noopener");
	}, []);

	const renderView = () => {
		switch (activeFilter) {
			case "all":
				return (
					<AllMessagesView
						messages={filteredMessages}
						onResumeCall={handleResumeCall}
						onViewRecording={handleViewRecording}
					/>
				);
			case "email":
				return <EmailView messages={filteredMessages} />;
			case "sms":
				return <SMSView messages={filteredMessages} />;
			case "phone":
				return (
					<CallsView
						messages={filteredMessages}
						onResumeCall={handleResumeCall}
						onViewRecording={handleViewRecording}
					/>
				);
			case "ticket":
				return <TicketsView messages={filteredMessages} />;
			default:
				return (
					<AllMessagesView
						messages={filteredMessages}
						onResumeCall={handleResumeCall}
						onViewRecording={handleViewRecording}
					/>
				);
		}
	};

	return (
		<>
			<div className="flex h-full flex-col">
				{/* Filter Tabs */}
				<div className="bg-background border-b">
					<div className="grid grid-cols-5 divide-x">
						{[
							{ key: "all", label: "All Messages", icon: Inbox },
							{ key: "email", label: "Email", icon: Mail },
							{ key: "sms", label: "Texts", icon: MessageSquare },
							{ key: "phone", label: "Calls", icon: Phone },
							{ key: "ticket", label: "Support", icon: Ticket },
						].map(({ key, label, icon: Icon }) => (
							<button
								className={cn(
									"hover:bg-muted/50 relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
									activeFilter === key
										? "bg-muted/30 text-foreground"
										: "text-muted-foreground",
								)}
								key={key}
								onClick={() => setActiveFilter(key as MessageType | "all")}
								type="button"
							>
								<Icon className="size-4" />
								{label}
								<span className="bg-background ml-1 rounded-full px-2 py-0.5 text-xs tabular-nums">
									{messageCounts[key as keyof typeof messageCounts] ?? 0}
								</span>
								{activeFilter === key && (
									<div className="bg-primary absolute inset-x-0 bottom-0 h-0.5" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Type-specific View */}
				<div className="flex-1 overflow-auto">{renderView()}</div>
			</div>

			<CommunicationComposerHost
				companyId={companyId}
				companyPhones={companyPhones}
				onCommunicationCreated={handleCommunicationCreated}
			/>
		</>
	);
}

function convertCommunicationToMessage(
	record: CommunicationRecord,
): UnifiedMessage {
	const type = mapMessageType(record.type);
	const customerName = getCustomerName(record);
	const { primaryAddress, secondaryAddress } = getDirectionalAddresses(record);
	const status = mapMessageStatus(record);
	const callType =
		type === "phone"
			? mapCallType(record.direction, status, record.call_duration)
			: undefined;
	const { fromEmail, toEmail } = getEmailAddresses(record);

	// Parse timestamp: Database stores in UTC without timezone suffix
	// Ensure we parse it as UTC by appending 'Z' if no timezone is present
	const timestampStr = record.created_at;
	const timestamp =
		timestampStr.includes("Z") ||
		timestampStr.includes("+") ||
		timestampStr.includes("-")
			? new Date(timestampStr)
			: new Date(`${timestampStr}Z`); // Force UTC parsing

	return {
		id: record.id,
		type,
		from: customerName ?? formatDisplayPhoneNumber(primaryAddress ?? ""),
		fromPhone: primaryAddress ?? undefined,
		toPhone: secondaryAddress ?? undefined,
		fromEmail,
		toEmail,
		subject: record.subject ?? undefined,
		preview: record.body || "",
		timestamp,
		status,
		priority: mapPriority(record.priority),
		direction: record.direction,
		callDuration: record.call_duration ?? undefined,
		callType,
		telnyxCallControlId: record.telnyx_call_control_id ?? undefined,
		telnyxMessageId: record.telnyx_message_id ?? undefined,
		callRecordingUrl: record.call_recording_url ?? undefined,
		customerId: record.customer?.id ?? record.customer_id ?? undefined,
		threadId: record.thread_id ?? null,
		threadAddress: primaryAddress ?? secondaryAddress ?? null,
		sentAt: record.sent_at ?? null,
		deliveredAt: record.delivered_at ?? null,
		failedAt: record.failed_at ?? null,
	};
}

function normalizeCommunicationRecord(
	record: CommunicationRecord,
): CommunicationRecord {
	const normalizedCustomer = buildNormalizedCustomer(record);
	return {
		...record,
		priority: record.priority ?? null,
		subject: record.subject ?? null,
		body: record.body ?? null,
		read_at: record.read_at ?? null,
		from_address: record.from_address ?? null,
		to_address: record.to_address ?? null,
		call_duration: record.call_duration ?? null,
		customer_id: record.customer_id ?? record.customer?.id ?? null,
		customer: normalizedCustomer,
		telnyx_call_control_id: record.telnyx_call_control_id ?? null,
		telnyx_call_session_id: record.telnyx_call_session_id ?? null,
		call_recording_url: record.call_recording_url ?? null,
		provider_metadata: record.provider_metadata ?? null,
	};
}

function upsertCommunicationRecord(
	list: CommunicationRecord[],
	incoming: CommunicationRecord,
): CommunicationRecord[] {
	const existingIndex = list.findIndex((record) => record.id === incoming.id);
	if (existingIndex === -1) {
		return sortRecords([incoming, ...list]);
	}
	const next = [...list];
	next[existingIndex] = {
		...next[existingIndex],
		...incoming,
	};
	return sortRecords(next);
}

function applyRealtimePayload(
	state: CommunicationRecord[],
	payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
): CommunicationRecord[] {
	switch (payload.eventType) {
		case "INSERT":
		case "UPDATE": {
			const rawRecord = payload.new as CommunicationRecord;
			return upsertCommunicationRecord(
				state,
				normalizeCommunicationRecord(rawRecord),
			);
		}
		case "DELETE": {
			const recordId = (payload.old as { id?: string } | null)?.id;
			if (!recordId) {
				return state;
			}
			return state.filter((record) => record.id !== recordId);
		}
		default:
			return state;
	}
}

function sortRecords(records: CommunicationRecord[]): CommunicationRecord[] {
	return [...records].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);
}

function mapMessageType(type: string): MessageType {
	if (type === "sms" || type === "phone" || type === "ticket") {
		return type;
	}
	return "email";
}

function mapMessageStatus(record: CommunicationRecord): MessageStatus {
	if (record.status === "failed") {
		return "archived";
	}
	if (record.direction === "outbound") {
		return "replied";
	}
	if (record.read_at) {
		return "read";
	}
	return "unread";
}

function mapPriority(priority?: string | null): MessagePriority {
	if (priority === "urgent" || priority === "high" || priority === "low") {
		return priority;
	}
	return "normal";
}

function mapCallType(
	direction: "inbound" | "outbound",
	status: MessageStatus,
	duration?: number | null,
): "incoming" | "outgoing" | "missed" | "voicemail" {
	if (direction === "outbound") {
		return "outgoing";
	}
	if (status === "unread" && (!duration || duration === 0)) {
		return "missed";
	}
	return "incoming";
}

function getCustomerName(record: CommunicationRecord): string | null {
	const first = record.customer?.first_name ?? "";
	const last = record.customer?.last_name ?? "";
	const name = `${first} ${last}`.trim();
	return name || null;
}

function formatDisplayPhoneNumber(phoneNumber?: string | null): string {
	if (!phoneNumber) {
		return "Unknown";
	}
	const digits = phoneNumber.replace(/\D/g, "");
	if (
		digits.length === NANP_WITH_COUNTRY_LENGTH &&
		digits.startsWith(NORTH_AMERICAN_COUNTRY_CODE)
	) {
		const areaCode = digits.slice(
			COUNTRY_CODE_PREFIX_LENGTH,
			NANP_COUNTRY_AREA_END_INDEX,
		);
		const exchangeCode = digits.slice(
			NANP_COUNTRY_AREA_END_INDEX,
			NANP_COUNTRY_EXCHANGE_END_INDEX,
		);
		const subscriberNumber = digits.slice(NANP_COUNTRY_EXCHANGE_END_INDEX);
		return `+${NORTH_AMERICAN_COUNTRY_CODE} (${areaCode}) ${exchangeCode}-${subscriberNumber}`;
	}
	if (digits.length === NANP_LOCAL_LENGTH) {
		const areaCode = digits.slice(0, NANP_LOCAL_AREA_END_INDEX);
		const exchangeCode = digits.slice(
			NANP_LOCAL_AREA_END_INDEX,
			NANP_LOCAL_EXCHANGE_END_INDEX,
		);
		const subscriberNumber = digits.slice(NANP_LOCAL_EXCHANGE_END_INDEX);
		return `(${areaCode}) ${exchangeCode}-${subscriberNumber}`;
	}
	return phoneNumber || "Unknown";
}

function getDirectionalAddresses(record: CommunicationRecord) {
	const isInbound = record.direction === "inbound";
	return {
		primaryAddress: isInbound ? record.from_address : record.to_address,
		secondaryAddress: isInbound ? record.to_address : record.from_address,
	};
}

function getEmailAddresses(record: CommunicationRecord) {
	const isInbound = record.direction === "inbound";
	return {
		fromEmail:
			(isInbound ? record.from_address : record.to_address) ?? undefined,
		toEmail: (isInbound ? record.to_address : record.from_address) ?? undefined,
	};
}

function buildNormalizedCustomer(
	record: CommunicationRecord,
): CommunicationRecord["customer"] {
	if (record.customer) {
		return {
			id: record.customer.id,
			first_name: record.customer.first_name ?? null,
			last_name: record.customer.last_name ?? null,
		};
	}
	if (record.customer_id) {
		return {
			id: record.customer_id,
			first_name: null,
			last_name: null,
		};
	}
	return null;
}

const NORTH_AMERICAN_COUNTRY_CODE = "1";
const NANP_WITH_COUNTRY_LENGTH = 11;
const NANP_LOCAL_LENGTH = 10;
const COUNTRY_CODE_PREFIX_LENGTH = 1;
const NANP_AREA_CODE_LENGTH = 3;
const NANP_EXCHANGE_CODE_LENGTH = 3;
const NANP_COUNTRY_AREA_END_INDEX =
	COUNTRY_CODE_PREFIX_LENGTH + NANP_AREA_CODE_LENGTH;
const NANP_COUNTRY_EXCHANGE_END_INDEX =
	NANP_COUNTRY_AREA_END_INDEX + NANP_EXCHANGE_CODE_LENGTH;
const NANP_LOCAL_AREA_END_INDEX = NANP_AREA_CODE_LENGTH;
const NANP_LOCAL_EXCHANGE_END_INDEX =
	NANP_LOCAL_AREA_END_INDEX + NANP_EXCHANGE_CODE_LENGTH;
