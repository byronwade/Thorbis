import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { formatDateTime } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type CommunicationRow = Database["public"]["Tables"]["communications"]["Row"];

type CommunicationWithRelations = CommunicationRow & {
	customer: Pick<
		Database["public"]["Tables"]["customers"]["Row"],
		"id" | "first_name" | "last_name" | "email" | "phone" | "company_name"
	> | null;
	job: Pick<
		Database["public"]["Tables"]["jobs"]["Row"],
		"id" | "job_number" | "title" | "status"
	> | null;
	phone_number: Pick<
		Database["public"]["Tables"]["phone_numbers"]["Row"],
		"id" | "formatted_number" | "phone_number"
	> | null;
};

type ConversationMessage = {
	id: string;
	body: string | null;
	direction: "inbound" | "outbound";
	status: string | null;
	timestamp: string;
	attachments: Record<string, any>[] | null;
};

/**
 * Communication detail data loader for the dynamic `[id]` route.
 * Fetches the communication record with related entities plus a lightweight
 * conversation timeline for SMS threads.
 */
export async function CommunicationIdData({ id }: { id: string }) {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const { data: communication, error } = await supabase
		.from("communications")
		.select(
			`
				*,
				customer:customers(id, first_name, last_name, email, phone, company_name),
				job:jobs(id, job_number, title, status),
				phone_number:phone_numbers(id, formatted_number, phone_number)
			`,
		)
		.eq("company_id", activeCompanyId)
		.eq("id", id)
		.single<CommunicationWithRelations>();

	if (error || !communication) {
		return notFound();
	}

	const conversationTimeline = await loadConversationTimeline(
		supabase,
		communication,
		activeCompanyId,
	);

	return (
		<div className="flex h-full flex-col gap-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-muted-foreground text-xs uppercase">
						Communication
					</p>
					<h1 className="text-2xl font-semibold">
						{communication.subject || formatTitle(communication)}
					</h1>
					<p className="text-muted-foreground text-sm">
						{formatDateTime(
							new Date(
								communication.created_at ??
									communication.updated_at ??
									new Date().toISOString(),
							),
						)}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge variant="secondary">{communication.type.toUpperCase()}</Badge>
					<Badge
						variant={
							communication.direction === "outbound" ? "default" : "outline"
						}
					>
						{communication.direction === "outbound" ? "Outgoing" : "Incoming"}
					</Badge>
					<Badge variant="outline">{communication.status}</Badge>
				</div>
			</header>
			<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<section className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Message</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="text-muted-foreground text-sm">
								<p>
									<strong>From:</strong>{" "}
									{renderAddress(
										communication.from_name,
										communication.from_address,
									)}
								</p>
								<p>
									<strong>To:</strong>{" "}
									{renderAddress(
										communication.to_name,
										communication.to_address,
									)}
								</p>
								{communication.cc_addresses?.length ? (
									<p>
										<strong>CC:</strong>{" "}
										{formatAddressList(communication.cc_addresses)}
									</p>
								) : null}
							</div>
							<Separator />
							<article className="prose dark:prose-invert max-w-none text-sm">
								{communication.body_html ? (
									<div
										dangerouslySetInnerHTML={{
											__html: communication.body_html,
										}}
									/>
								) : (
									<p className="whitespace-pre-wrap">{communication.body}</p>
								)}
							</article>
							{renderAttachments(communication.attachments)}
						</CardContent>
					</Card>
					{conversationTimeline.length > 1 && (
						<Card>
							<CardHeader>
								<CardTitle>Conversation</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{conversationTimeline.map((message) => (
									<div key={message.id} className="rounded-lg border px-4 py-3">
										<div className="text-muted-foreground flex items-center justify-between text-xs">
											<span>
												{message.direction === "outbound" ? "You" : "Customer"}
											</span>
											<span>{formatDateTime(new Date(message.timestamp))}</span>
										</div>
										<p className="mt-2 text-sm whitespace-pre-wrap">
											{message.body || "(no content)"}
										</p>
										{renderAttachments(message.attachments, true)}
									</div>
								))}
							</CardContent>
						</Card>
					)}
					{communication.call_recording_url && (
						<Card>
							<CardHeader>
								<CardTitle>Call recording</CardTitle>
							</CardHeader>
							<CardContent>
								<a
									className="text-primary underline"
									href={communication.call_recording_url}
									rel="noreferrer"
									target="_blank"
								>
									Download recording
								</a>
								{communication.call_duration ? (
									<p className="text-muted-foreground text-xs">
										Duration: {formatDuration(communication.call_duration)}
									</p>
								) : null}
							</CardContent>
						</Card>
					)}
				</section>
				<aside className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Customer</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							{communication.customer ? (
								<>
									<p className="font-medium">
										{formatCustomerName(communication.customer)}
									</p>
									{communication.customer.company_name && (
										<p className="text-muted-foreground">
											{communication.customer.company_name}
										</p>
									)}
									<p>{communication.customer.email}</p>
									<p>
										{formatDisplayPhoneNumber(
											communication.customer.phone || "",
										)}
									</p>
									<Link
										className="text-primary underline"
										href={`/dashboard/customers/${communication.customer.id}`}
									>
										Open customer
									</Link>
								</>
							) : (
								<p className="text-muted-foreground">No customer linked</p>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Related job</CardTitle>
						</CardHeader>
						<CardContent className="text-sm">
							{communication.job ? (
								<div className="space-y-2">
									<p className="font-medium">{communication.job.title}</p>
									<p className="text-muted-foreground">
										Job #{communication.job.job_number}
									</p>
									<p>Status: {communication.job.status}</p>
									<Link
										className="text-primary underline"
										href={`/dashboard/work/${communication.job.id}`}
									>
										Open job
									</Link>
								</div>
							) : (
								<p className="text-muted-foreground">No job associated.</p>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Provider metadata</CardTitle>
						</CardHeader>
						<CardContent>
							{renderMetadata(communication.provider_metadata)}
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}

async function loadConversationTimeline(
	supabase: ReturnType<typeof createClient>,
	communication: CommunicationWithRelations,
	companyId: string,
): Promise<ConversationMessage[]> {
	if (!supabase) {
		return [];
	}

	const isSmsLike =
		communication.type === "sms" ||
		communication.type === "mms" ||
		communication.channel === "telnyx";
	if (!isSmsLike) {
		return [
			{
				id: communication.id,
				body: communication.body,
				direction: communication.direction,
				status: communication.status,
				timestamp: communication.created_at || new Date().toISOString(),
				attachments: communication.attachments as any,
			},
		];
	}

	if (
		!(
			communication.thread_id ||
			communication.from_address ||
			communication.to_address
		)
	) {
		return [];
	}

	const baseQuery = supabase
		.from("communications")
		.select(
			"id, body, direction, status, created_at, attachments, thread_id, from_address, to_address",
		)
		.eq("company_id", companyId)
		.order("created_at", { ascending: true })
		.limit(200);

	if (communication.thread_id) {
		baseQuery.eq("thread_id", communication.thread_id);
	} else if (communication.from_address || communication.to_address) {
		const candidates = [communication.from_address, communication.to_address]
			.filter((value): value is string => Boolean(value))
			.map((value) => value);

		if (candidates.length > 0) {
			const orFilters = candidates
				.flatMap((value) => [
					`from_address.eq.${value}`,
					`to_address.eq.${value}`,
				])
				.join(",");
			baseQuery.or(orFilters);
		}
	}

	const { data } = await baseQuery;
	if (!data || data.length === 0) {
		return [
			{
				id: communication.id,
				body: communication.body,
				direction: communication.direction,
				status: communication.status,
				timestamp: communication.created_at || new Date().toISOString(),
				attachments: communication.attachments as any,
			},
		];
	}

	return data.map((message) => ({
		id: message.id,
		body: message.body,
		direction: message.direction as "inbound" | "outbound",
		status: message.status,
		timestamp: message.created_at || new Date().toISOString(),
		attachments: (message.attachments as any) || [],
	}));
}

function renderAddress(name?: string | null, value?: string | null) {
	if (!value) {
		return "Unknown";
	}
	return name ? `${name} <${value}>` : value;
}

function formatAddressList(addresses: any) {
	if (!Array.isArray(addresses) || addresses.length === 0) {
		return "—";
	}
	const normalized = addresses
		.map((entry) => {
			if (typeof entry === "string") {
				return entry;
			}
			if (entry && typeof entry === "object") {
				return entry.email || entry.address || "";
			}
			return "";
		})
		.filter(Boolean);
	return normalized.length > 0 ? normalized.join(", ") : "—";
}

function formatTitle(communication: CommunicationWithRelations) {
	if (communication.type === "sms" || communication.type === "mms") {
		return `Message with ${communication.to_address || communication.from_address}`;
	}
	if (communication.type === "phone") {
		return "Phone Call";
	}
	return "Communication";
}

function renderAttachments(attachments: any, compact = false) {
	if (!Array.isArray(attachments) || attachments.length === 0) {
		return null;
	}
	return (
		<div className="space-y-2">
			<p className="text-sm font-semibold">Attachments</p>
			<ul className="space-y-1 text-sm">
				{attachments.map((attachment, index) => (
					<li
						key={`${attachment.url ?? index}`}
						className="flex items-center justify-between rounded border px-3 py-2"
					>
						<div>
							<p className="font-medium">
								{attachment.name || attachment.url || `Attachment ${index + 1}`}
							</p>
							{attachment.type && (
								<p className="text-muted-foreground text-xs">
									{attachment.type}
								</p>
							)}
						</div>
						<a
							className="text-primary underline"
							href={attachment.url}
							rel="noreferrer"
							target="_blank"
						>
							{compact ? "Open" : "Download"}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

function renderMetadata(metadata: CommunicationRow["provider_metadata"]) {
	if (!metadata || typeof metadata !== "object") {
		return (
			<p className="text-muted-foreground text-sm">
				No provider metadata available.
			</p>
		);
	}
	return (
		<div className="space-y-2 text-sm">
			{Object.entries(metadata).map(([key, value]) => (
				<div
					key={key}
					className="flex items-center justify-between rounded border px-3 py-1"
				>
					<span className="font-medium capitalize">
						{key.replace(/_/g, " ")}
					</span>
					<span className="text-muted-foreground">
						{formatMetadataValue(value)}
					</span>
				</div>
			))}
		</div>
	);
}

function formatMetadataValue(value: any): string {
	if (value === null || value === undefined) {
		return "—";
	}
	if (typeof value === "string") {
		return value;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return JSON.stringify(value);
}

function formatCustomerName(
	customer: NonNullable<CommunicationWithRelations["customer"]>,
) {
	const fullName =
		`${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim();
	return fullName || customer.email || "Customer";
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDisplayPhoneNumber(phoneNumber?: string | null): string {
	if (!phoneNumber) {
		return "—";
	}
	const digits = phoneNumber.replace(/[^0-9]/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phoneNumber;
}

// Alias for backward compatibility
export { CommunicationIdData as CommunicationDetailData };
