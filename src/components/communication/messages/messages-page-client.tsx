"use client";

import {
	ArrowLeft,
	ImageIcon,
	Loader2,
	MessageCircle,
	Paperclip,
	Plus,
	Search,
	X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from "react";
import { getSmsConversationAction } from "@/actions/messages";
import { sendMMSMessage, sendTextMessage } from "@/actions/telnyx";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import type { CompanyPhone } from "@/components/communication/communication-page-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { SmsMessage, SmsThread } from "@/lib/communications/sms";
import { uploadCompanyFile } from "@/lib/storage/upload";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type DirectoryCustomer = {
	id: string;
	name: string;
	phone: string;
	email: string;
	company: string;
};

export type DirectoryJob = {
	id: string;
	jobNumber: string;
	title: string;
	status: string;
};

type AttachmentPreview = {
	id: string;
	file: File;
	previewUrl: string;
};

type MessagesPageClientProps = {
	companyId: string;
	companyPhones: CompanyPhone[];
	threads: SmsThread[];
	initialThreadId: string | null;
	initialConversation: SmsMessage[];
	customers: DirectoryCustomer[];
	jobs: DirectoryJob[];
};

export function MessagesPageClient({
	companyId,
	companyPhones,
	threads: initialThreads,
	initialThreadId,
	initialConversation,
	customers,
	jobs,
}: MessagesPageClientProps) {
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const composeParam = searchParams?.get("compose");
	const threadParam = searchParams?.get("thread");
	const [threads, setThreads] = useState<SmsThread[]>(initialThreads);
	const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
		initialThreadId,
	);
	const [conversation, setConversation] =
		useState<SmsMessage[]>(initialConversation);
	const [view, setView] = useState<"list" | "thread" | "composer">(
		initialThreadId ? "thread" : "composer",
	);
	const [threadSearch, setThreadSearch] = useState("");
	const [isConversationLoading, setConversationLoading] = useState(false);
	const [messageInput, setMessageInput] = useState("");
	const [isPendingSend, startSend] = useTransition();
	const [composerJobId, setComposerJobId] = useState<string | null>(null);
	const [composerCustomerId, setComposerCustomerId] = useState<string | null>(
		null,
	);
	const [composerName, setComposerName] = useState("");
	const [composerPhone, setComposerPhone] = useState("");
	const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
	const [selectedCompanyLine, setSelectedCompanyLine] = useState(
		companyPhones[0]?.number || "",
	);

	const activeThread = useMemo(
		() => threads.find((thread) => thread.id === selectedThreadId) ?? null,
		[threads, selectedThreadId],
	);

	const filteredThreads = useMemo(() => {
		if (!threadSearch.trim()) {
			return threads;
		}
		const query = threadSearch.toLowerCase();
		return threads.filter((thread) => {
			return (
				thread.contactName.toLowerCase().includes(query) ||
				thread.phoneNumber.toLowerCase().includes(query) ||
				thread.lastMessage.toLowerCase().includes(query)
			);
		});
	}, [threads, threadSearch]);

	useEffect(() => {
		const supabase = createBrowserSupabaseClient();
		if (!supabase) {
			return;
		}

		const channel = supabase.channel(`messages:${companyId}`).on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: "communications",
				filter: `company_id=eq.${companyId}`,
			},
			(payload) => {
				const record = payload.new as any;
				if (!record || record.type !== "sms") {
					return;
				}

				const threadKey =
					(record.thread_id as string) ||
					(record.direction === "outbound"
						? (record.to_address as string)
						: (record.from_address as string));
				if (!threadKey) {
					return;
				}

				const remoteNumber =
					record.direction === "outbound"
						? (record.to_address as string)
						: (record.from_address as string);
				const threadDisplayName =
					(record.from_name as string) ||
					(record.to_name as string) ||
					formatPhoneDisplay(remoteNumber);

				const newMessage: SmsMessage = {
					id: record.id,
					threadId: threadKey,
					body: record.body || "",
					direction: record.direction === "outbound" ? "outbound" : "inbound",
					status: record.status,
					timestamp: record.created_at,
					attachments: Array.isArray(record.attachments)
						? record.attachments
						: [],
				};

				setThreads((prev) => {
					const existing = prev.find((thread) => thread.id === threadKey);
					if (existing) {
						const updated: SmsThread = {
							...existing,
							lastMessage: newMessage.body,
							lastTimestamp: newMessage.timestamp,
							unreadCount:
								selectedThreadId === threadKey ||
								newMessage.direction === "outbound"
									? existing.unreadCount
									: existing.unreadCount + 1,
						};
						return [
							updated,
							...prev.filter((thread) => thread.id !== threadKey),
						];
					}

					const freshThread: SmsThread = {
						id: threadKey,
						contactName: threadDisplayName,
						phoneNumber: remoteNumber || "",
						lastMessage: newMessage.body,
						lastTimestamp: newMessage.timestamp,
						unreadCount: newMessage.direction === "inbound" ? 1 : 0,
						customerId: (record.customer_id as string) ?? null,
					};

					return [freshThread, ...prev];
				});

				if (selectedThreadId === threadKey) {
					setConversation((prev) => {
						if (prev.find((message) => message.id === newMessage.id)) {
							return prev;
						}
						return [...prev, newMessage];
					});
				}
			},
		);

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId, selectedThreadId]);

	const handleSelectThread = useCallback(
		async (threadId: string) => {
			setSelectedThreadId(threadId);
			setView("thread");
			if (typeof window !== "undefined" && window.innerWidth < 1024) {
				window.scrollTo({ top: 0 });
			}
			setConversationLoading(true);

			const result = await getSmsConversationAction(threadId);
			if (result.success && result.messages) {
				setConversation(result.messages);
			} else if (result.error) {
				toast.error(result.error);
			}

			setConversationLoading(false);
		},
		[toast],
	);

	const handleNewConversation = useCallback(() => {
		setSelectedThreadId(null);
		setConversation([]);
		setComposerCustomerId(null);
		setComposerName("");
		setComposerPhone("");
		setComposerJobId(null);
		setMessageInput("");
		setAttachments((prev) => {
			prev.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
			return [];
		});
		setView("composer");
	}, []);

	useEffect(() => {
		if (composeParam === "1" && view !== "composer") {
			handleNewConversation();
			return;
		}

		if (threadParam && selectedThreadId !== threadParam) {
			handleSelectThread(threadParam);
		}
	}, [
		composeParam,
		threadParam,
		handleNewConversation,
		handleSelectThread,
		view,
		selectedThreadId,
	]);

	const handleAttachmentsSelected = (files: FileList | null) => {
		if (!files) {
			return;
		}

		const newAttachments: AttachmentPreview[] = Array.from(files).map(
			(file) => ({
				id: crypto.randomUUID(),
				file,
				previewUrl: URL.createObjectURL(file),
			}),
		);

		setAttachments((prev) => [...prev, ...newAttachments]);
	};

	const removeAttachment = (id: string) => {
		setAttachments((prev) => {
			const toRemove = prev.find((attachment) => attachment.id === id);
			if (toRemove) {
				URL.revokeObjectURL(toRemove.previewUrl);
			}
			return prev.filter((attachment) => attachment.id !== id);
		});
	};

	const handleSendMessage = () => {
		const targetThread = selectedThreadId
			? threads.find((thread) => thread.id === selectedThreadId)
			: null;
		const destination = targetThread?.phoneNumber || composerPhone;

		if (!destination) {
			toast.error("Enter a recipient phone number");
			return;
		}

		const outgoingLine = selectedCompanyLine || companyPhones[0]?.number;
		if (!outgoingLine) {
			toast.error("Select a company phone line to send from");
			return;
		}

		if (!messageInput.trim() && attachments.length === 0) {
			toast.error("Type a message or add an attachment");
			return;
		}

		startSend(async () => {
			const normalizedPhone = normalizePhone(destination);
			const optimisticId = crypto.randomUUID();
			const timestamp = new Date().toISOString();

			const optimisticMessage: SmsMessage = {
				id: optimisticId,
				threadId: targetThread?.id || normalizedPhone,
				body: messageInput,
				direction: "outbound",
				status: "queued",
				timestamp,
				attachments: attachments.map((attachment) => ({
					url: attachment.previewUrl,
					type: attachment.file.type,
					name: attachment.file.name,
				})),
			};

			setConversation((prev) => [...prev, optimisticMessage]);
			setMessageInput("");

			const uploadResults = await Promise.all(
				attachments.map((attachment) =>
					uploadCompanyFile(
						attachment.file,
						companyId,
						`messages/${normalizedPhone}`,
					),
				),
			);

			const failedUpload = uploadResults.find(
				(result) => !result.success || !result.url,
			);
			if (failedUpload) {
				toast.error(failedUpload.error || "Failed to upload attachment");
				setConversation((prev) =>
					prev.filter((message) => message.id !== optimisticId),
				);
				return;
			}

			const mediaUrls = uploadResults
				.filter((result): result is { success: true; url: string } =>
					Boolean(result.url),
				)
				.map((result) => result.url!);
			const jobId = composerJobId || targetThread?.customerId || null;

			const sendResult =
				mediaUrls.length > 0
					? await sendMMSMessage({
							to: normalizedPhone,
							from: outgoingLine,
							text: messageInput,
							mediaUrls,
							companyId,
							customerId:
								composerCustomerId || targetThread?.customerId || undefined,
							jobId: composerJobId || undefined,
						})
					: await sendTextMessage({
							to: normalizedPhone,
							from: outgoingLine,
							text: messageInput,
							companyId,
							customerId:
								composerCustomerId || targetThread?.customerId || undefined,
							jobId: composerJobId || undefined,
						});

			if (!sendResult.success) {
				toast.error(sendResult.error || "Failed to send message");
				setConversation((prev) =>
					prev.filter((message) => message.id !== optimisticId),
				);
				return;
			}

			const threadId = targetThread?.id || normalizedPhone;
			const refresh = await getSmsConversationAction(threadId);
			if (refresh.success && refresh.messages) {
				setConversation(refresh.messages);
			}

			if (!targetThread) {
				const newThread: SmsThread = {
					id: threadId,
					contactName: composerName || normalizedPhone,
					phoneNumber: normalizedPhone,
					lastMessage: messageInput,
					lastTimestamp: timestamp,
					unreadCount: 0,
					customerId: composerCustomerId,
				};
				setThreads((prev) => [
					newThread,
					...prev.filter((thread) => thread.id !== threadId),
				]);
				setSelectedThreadId(threadId);
				setView("thread");
			}

			attachments.forEach((attachment) =>
				URL.revokeObjectURL(attachment.previewUrl),
			);
			setAttachments([]);
		});
	};

	const renderThreadList = (isMobile = false) => (
		<div
			className={cn(
				"flex h-full flex-col border-r border-border/80",
				isMobile ? "w-full" : "w-80 min-w-[280px]",
			)}
			data-mobile={isMobile}
		>
			<div className="flex items-center gap-2 border-b border-border/80 p-4">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
					<Input
						className="pl-9"
						onChange={(event) => setThreadSearch(event.target.value)}
						placeholder="Search conversations"
						value={threadSearch}
					/>
				</div>
				<Button
					onClick={handleNewConversation}
					size="icon"
					type="button"
					variant="secondary"
				>
					<Plus className="size-4" />
				</Button>
			</div>
			<ScrollArea className="flex-1">
				<div className="flex flex-col">
					{filteredThreads.length === 0 ? (
						<div className="text-muted-foreground flex flex-col items-center gap-2 px-4 py-12 text-sm">
							<MessageCircle className="size-6" />
							<span>No conversations yet</span>
						</div>
					) : (
						filteredThreads.map((thread) => (
							<button
								className={cn(
									"border-border/50 hover:bg-muted flex flex-col border-b p-4 text-left",
									thread.id === selectedThreadId && view === "thread"
										? "bg-muted"
										: "",
								)}
								key={thread.id}
								onClick={() => handleSelectThread(thread.id)}
								type="button"
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-semibold">
											{thread.contactName}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatPhoneDisplay(thread.phoneNumber)}
										</p>
									</div>
									<div className="text-muted-foreground text-xs">
										{formatRelativeTime(thread.lastTimestamp)}
									</div>
								</div>
								<p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
									{thread.lastMessage || "Media attachment"}
								</p>
								{thread.unreadCount > 0 && (
									<Badge className="mt-2 w-fit" variant="secondary">
										{thread.unreadCount} unread
									</Badge>
								)}
							</button>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);

	const renderConversation = (isMobile = false) => (
		<div
			className={cn("flex h-full flex-1 flex-col", isMobile ? "w-full" : "")}
			data-mobile={isMobile}
		>
			{activeThread ? (
				<>
					<div className="border-border/80 flex items-center justify-between border-b px-4 py-3">
						<div>
							<p className="text-base font-semibold">
								{activeThread.contactName}
							</p>
							<p className="text-muted-foreground text-xs">
								{formatPhoneDisplay(activeThread.phoneNumber)}
							</p>
						</div>
						<div className="flex items-center gap-2">
							{isMobile && (
								<Button
									className="lg:hidden"
									onClick={() => setView("list")}
									size="sm"
									type="button"
									variant="ghost"
								>
									<ArrowLeft className="mr-2 size-4" />
									Back
								</Button>
							)}
							{activeThread.customerId && (
								<Button asChild size="sm" variant="secondary">
									<Link
										href={`/dashboard/customers/${activeThread.customerId}`}
										prefetch={false}
									>
										View customer
									</Link>
								</Button>
							)}
						</div>
					</div>
					<ScrollArea className="flex-1">
						<div className="flex flex-col gap-3 px-4 py-6">
							{isConversationLoading ? (
								<div className="flex justify-center py-12">
									<Loader2 className="size-6 animate-spin" />
								</div>
							) : conversation.length === 0 ? (
								<div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-sm">
									<MessageCircle className="size-6" />
									<span>No messages yet</span>
								</div>
							) : (
								conversation.map((message) => (
									<MessageBubble key={message.id} message={message} />
								))
							)}
						</div>
					</ScrollArea>
					<MessageComposer
						allowAttachments
						attachments={attachments}
						companyLine={selectedCompanyLine}
						companyLines={companyPhones}
						isPending={isPendingSend}
						message={messageInput}
						onAttachmentRemove={removeAttachment}
						onAttachmentsSelected={handleAttachmentsSelected}
						onCompanyLineChange={setSelectedCompanyLine}
						onMessageChange={setMessageInput}
						onSend={handleSendMessage}
					>
						<JobPicker
							jobs={jobs}
							onChange={setComposerJobId}
							value={composerJobId}
						/>
					</MessageComposer>
				</>
			) : (
				<div className="flex h-full flex-col items-center justify-center gap-4 text-center">
					<MessageCircle className="text-muted-foreground size-10" />
					<div>
						<h3 className="text-lg font-semibold">Start messaging</h3>
						<p className="text-muted-foreground text-sm">
							Select a conversation or start a new one to send texts, files, and
							job updates.
						</p>
					</div>
					<Button onClick={handleNewConversation} type="button">
						<Plus className="mr-2 size-4" />
						New text
					</Button>
				</div>
			)}
		</div>
	);

	const renderComposer = () => (
		<div className="flex h-full flex-1 flex-col">
			<div className="border-border/80 flex items-center justify-between border-b px-4 py-3">
				<div>
					<p className="text-base font-semibold">New text message</p>
					<p className="text-muted-foreground text-xs">
						Search customers or enter any phone number.
					</p>
				</div>
				<Button
					onClick={() => setView("list")}
					size="sm"
					type="button"
					variant="ghost"
				>
					<ArrowLeft className="mr-2 size-4" />
					Back
				</Button>
			</div>
			<div className="flex flex-col gap-4 p-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">Customer</label>
					<ContactPicker
						customers={customers}
						onSelect={(customer) => {
							if (customer) {
								setComposerCustomerId(customer.id);
								setComposerName(customer.name);
								setComposerPhone(customer.phone);
							} else {
								setComposerCustomerId(null);
								setComposerName("");
								setComposerPhone("");
							}
						}}
						value={composerCustomerId}
					/>
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Recipient phone</label>
					<Input
						onChange={(event) => setComposerPhone(event.target.value)}
						placeholder="(555) 123-4567"
						value={composerPhone}
					/>
				</div>
				<JobPicker
					jobs={jobs}
					onChange={setComposerJobId}
					value={composerJobId}
				/>
			</div>
			<div className="flex flex-1 flex-col">
				<MessageComposer
					allowAttachments
					attachments={attachments}
					companyLine={selectedCompanyLine}
					companyLines={companyPhones}
					isPending={isPendingSend}
					message={messageInput}
					onAttachmentRemove={removeAttachment}
					onAttachmentsSelected={handleAttachmentsSelected}
					onCompanyLineChange={setSelectedCompanyLine}
					onMessageChange={setMessageInput}
					onSend={handleSendMessage}
				/>
			</div>
		</div>
	);

	return (
		<div
			className="flex h-[calc(100vh-64px)] flex-col bg-background"
			data-communication-messages-page
		>
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden lg:flex">{renderThreadList(false)}</div>
				<div className="hidden lg:flex flex-1">{renderConversation(false)}</div>

				<div className="flex w-full flex-1 lg:hidden">
					{view === "list" && renderThreadList(true)}
					{view === "thread" && renderConversation(true)}
					{view === "composer" && renderComposer()}
				</div>
			</div>
		</div>
	);
}

type MessageComposerProps = {
	allowAttachments?: boolean;
	attachments: AttachmentPreview[];
	companyLine: string;
	companyLines: CompanyPhone[];
	isPending: boolean;
	message: string;
	onAttachmentRemove: (id: string) => void;
	onAttachmentsSelected: (files: FileList | null) => void;
	onCompanyLineChange: (value: string) => void;
	onMessageChange: (value: string) => void;
	onSend: () => void;
	children?: React.ReactNode;
};

function MessageComposer({
	allowAttachments = false,
	attachments,
	companyLine,
	companyLines,
	isPending,
	message,
	onAttachmentRemove,
	onAttachmentsSelected,
	onCompanyLineChange,
	onMessageChange,
	onSend,
	children,
}: MessageComposerProps) {
	return (
		<div className="border-t border-border/80">
			{children}
			{attachments.length > 0 && (
				<div className="flex flex-wrap gap-2 border-b border-border/80 px-4 py-3">
					{attachments.map((attachment) => (
						<div
							className="border-border bg-muted/70 text-foreground flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
							key={attachment.id}
						>
							{attachment.file.type.startsWith("image/") ? (
								<ImageIcon className="size-3" />
							) : (
								<Paperclip className="size-3" />
							)}
							<span className="max-w-[120px] truncate">
								{attachment.file.name}
							</span>
							<button
								onClick={() => onAttachmentRemove(attachment.id)}
								type="button"
							>
								<X className="size-3" />
							</button>
						</div>
					))}
				</div>
			)}
			<div className="flex items-center gap-2 border-b border-border/80 px-4 py-3">
				<label className="text-sm text-muted-foreground">From line</label>
				<select
					className="border-border w-full rounded-md border bg-transparent p-2 text-sm"
					onChange={(event) => onCompanyLineChange(event.target.value)}
					value={companyLine}
				>
					{companyLines.map((line) => (
						<option key={line.id} value={line.number}>
							{line.label}
						</option>
					))}
				</select>
			</div>
			<MultimodalInput
				allowAttachments={allowAttachments}
				isLoading={isPending}
				onAttachmentsSelected={onAttachmentsSelected}
				onChange={onMessageChange}
				onSubmit={() => onSend()}
				placeholder="Send a text message"
				value={message}
			/>
		</div>
	);
}

type MessageBubbleProps = {
	message: SmsMessage;
};

function MessageBubble({ message }: MessageBubbleProps) {
	const isOutbound = message.direction === "outbound";

	return (
		<div
			className={cn(
				"flex w-full",
				isOutbound ? "justify-end" : "justify-start",
			)}
			data-direction={message.direction}
		>
			<div
				className={cn(
					"max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
					isOutbound
						? "bg-primary text-primary-foreground"
						: "bg-muted text-foreground",
				)}
			>
				{message.body && (
					<p className="whitespace-pre-wrap break-words">{message.body}</p>
				)}
				{message.attachments.length > 0 && (
					<div className="mt-2 flex flex-col gap-2">
						{message.attachments.map((attachment, index) => (
							<Link
								className={cn(
									"rounded-lg",
									attachment.type?.startsWith("image/")
										? "block overflow-hidden"
										: "bg-background/20 flex items-center gap-2 px-3 py-2 text-xs",
								)}
								href={attachment.url}
								key={`${attachment.url}-${index}`}
								rel="noreferrer"
								target="_blank"
							>
								{attachment.type?.startsWith("image/") ? (
									<img
										alt={attachment.name || "Attachment"}
										className="max-h-64 rounded-lg"
										src={attachment.url}
									/>
								) : (
									<>
										<Paperclip className="size-4" />
										<span className="truncate text-xs">
											{attachment.name || attachment.url}
										</span>
									</>
								)}
							</Link>
						))}
					</div>
				)}
				{message.job && (
					<Link
						className={cn(
							"mt-2 inline-flex items-center gap-2 text-[11px]",
							isOutbound ? "text-primary-foreground" : "text-muted-foreground",
						)}
						href={`/dashboard/work/${message.job.id}`}
						prefetch={false}
						rel="noreferrer"
						target="_blank"
					>
						<Badge variant={isOutbound ? "secondary" : "outline"}>
							Job #{message.job.jobNumber}
						</Badge>
					</Link>
				)}
				<div
					className={cn(
						"mt-2 text-[11px]",
						isOutbound ? "text-primary-foreground/80" : "text-muted-foreground",
					)}
				>
					{formatRelativeTime(message.timestamp)}
				</div>
			</div>
		</div>
	);
}

type ContactPickerProps = {
	customers: DirectoryCustomer[];
	onSelect: (customer: DirectoryCustomer | null) => void;
	value: string | null;
};

function ContactPicker({ customers, onSelect, value }: ContactPickerProps) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.toLowerCase();
		return customers
			.filter((customer) => {
				if (!q) {
					return true;
				}
				return (
					customer.name.toLowerCase().includes(q) ||
					customer.phone.toLowerCase().includes(q) ||
					customer.email.toLowerCase().includes(q)
				);
			})
			.slice(0, 8);
	}, [customers, query]);

	const selected = customers.find((customer) => customer.id === value) || null;

	return (
		<div className="space-y-2">
			<Input
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search customers"
				value={query}
			/>
			<div className="space-y-1 rounded-lg border">
				<button
					className="text-muted-foreground w-full px-3 py-2 text-left text-xs"
					onClick={() => {
						onSelect(null);
						setQuery("");
					}}
					type="button"
				>
					Clear selection
				</button>
				{filtered.map((customer) => (
					<button
						className={cn(
							"hover:bg-muted flex w-full items-center justify-between px-3 py-2 text-left text-sm",
							selected?.id === customer.id ? "bg-muted" : "",
						)}
						key={customer.id}
						onClick={() => {
							onSelect(customer);
							setQuery("");
						}}
						type="button"
					>
						<div>
							<p className="font-medium">{customer.name}</p>
							<p className="text-muted-foreground text-xs">{customer.phone}</p>
						</div>
						{selected?.id === customer.id && (
							<Badge variant="secondary">Selected</Badge>
						)}
					</button>
				))}
			</div>
		</div>
	);
}

type JobPickerProps = {
	jobs: DirectoryJob[];
	onChange: (jobId: string | null) => void;
	value: string | null;
};

function JobPicker({ jobs, onChange, value }: JobPickerProps) {
	return (
		<div className="border-border/80 flex items-center justify-between gap-2 border-b px-4 py-3">
			<div>
				<p className="text-sm font-medium">Link to job</p>
				<p className="text-muted-foreground text-xs">
					Optional: associate this message with a job
				</p>
			</div>
			<select
				className="border-border rounded-md border bg-transparent p-2 text-sm"
				onChange={(event) => onChange(event.target.value || null)}
				value={value || ""}
			>
				<option value="">No job</option>
				{jobs.map((job) => (
					<option key={job.id} value={job.id}>
						{job.jobNumber} • {job.title}
					</option>
				))}
			</select>
		</div>
	);
}

function normalizePhone(raw: string): string {
	const digits = raw.replace(/[^0-9]/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}
	if (digits.length === 10) {
		return `+1${digits}`;
	}
	return raw.startsWith("+") ? raw : `+${raw}`;
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

function formatRelativeTime(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / (1000 * 60));
	if (minutes < 1) {
		return "Just now";
	}
	if (minutes < 60) {
		return `${minutes}m ago`;
	}
	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}h ago`;
	}
	return date.toLocaleDateString();
}
