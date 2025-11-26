/**
 * Teams Communication Page
 *
 * Slack-style Teams interface with channels sidebar and chat
 * Route: /dashboard/communication/teams?channel=general
 *
 * Shows channels in sidebar, chat interface on the right
 */

"use client";

import {
	Hash,
	Loader2,
	MessageSquare,
	MoreHorizontal,
	PanelLeft,
	Paperclip,
	RefreshCw,
	Search,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CompanySms } from "@/actions/sms-actions";
import {
	getTeamChannelMessagesAction,
	markTeamChannelAsReadAction,
	sendTeamChannelMessageAction,
} from "@/actions/teams-actions";
import { SmsMessageInput } from "@/components/communication/sms-message-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import type { TeamChannel } from "@/lib/queries/teams";
import { cn } from "@/lib/utils";

type ChannelMessage = CompanySms & {
	sent_by_user?: {
		id: string;
		name: string | null;
		avatar: string | null;
	} | null;
};

const DEFAULT_CHANNELS = [
	{ id: "general", name: "General", type: "public" as const },
	{ id: "sales", name: "Sales", type: "public" as const },
	{ id: "support", name: "Support", type: "public" as const },
	{ id: "technicians", name: "Technicians", type: "public" as const },
	{ id: "management", name: "Management", type: "private" as const },
];

type TeamsPageClientProps = {
	initialChannels: TeamChannel[];
	initialChannelId: string | null;
};

export function TeamsPageClient({
	initialChannels,
	initialChannelId,
}: TeamsPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const channelId =
		searchParams.get("channel") || initialChannelId || "general";
	const { toggleSidebar } = useSidebar();

	// Use database channels if available, otherwise fallback to DEFAULT_CHANNELS
	const channels =
		initialChannels.length > 0 ? initialChannels : DEFAULT_CHANNELS;
	const currentChannel =
		channels.find((c) => c.id === channelId) || channels[0];

	const [messages, setMessages] = useState<ChannelMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [attachments, setAttachments] = useState<File[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const conversationScrollRef = useRef<HTMLDivElement>(null);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch channel messages
	const fetchMessages = useCallback(
		async (showRefreshing = false) => {
			if (showRefreshing) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			setError(null);

			try {
				const result = await getTeamChannelMessagesAction({
					channel: channelId,
					limit: 100,
					offset: 0,
				});

				if (result.success && result.messages) {
					setMessages(result.messages);

					// Mark all unread messages in channel as read
					const unreadMessages = result.messages.filter(
						(msg) => !msg.read_at && msg.direction === "inbound",
					);
					if (unreadMessages.length > 0) {
						// Optimistically update UI
						setMessages((prev) =>
							prev.map((msg) =>
								!msg.read_at && msg.direction === "inbound"
									? { ...msg, read_at: new Date().toISOString() }
									: msg,
							),
						);

						// Update database
						markTeamChannelAsReadAction(channelId)
							.then((result) => {
								if (result.success) {
									// Refresh messages to get updated read_at from database
									setTimeout(() => {
										fetchMessages(false);
									}, 500);
								}
							})
							.catch(() => {
								// Error marking as read - fail silently
							});
					}
				} else {
					setError(result.error || "Failed to load messages");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[channelId],
	);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (conversationScrollRef.current) {
			conversationScrollRef.current.scrollTop =
				conversationScrollRef.current.scrollHeight;
		}
	}, [messages]);

	// Fetch messages on channel change (but not on initial mount)
	const isInitialMount = useRef(true);
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		fetchMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channelId]);

	// Search debounce
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			setSearchQuery(searchInput);
			if (searchInput) {
				fetchMessages();
			}
		}, 300);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchInput]);

	const handleRefresh = useCallback(() => {
		fetchMessages(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channelId]);

	const handleSendMessage = useCallback(async () => {
		if ((!messageInput.trim() && attachments.length === 0) || sendingMessage)
			return;

		setSendingMessage(true);
		try {
			// Upload attachments first
			let attachmentData: Array<{
				type: "image" | "file";
				filename: string;
				url?: string;
			}> = [];
			if (attachments.length > 0) {
				const { uploadSmsAttachments } = await import("@/actions/sms-actions");
				const uploadResult = await uploadSmsAttachments(attachments);

				if (!uploadResult.success || !uploadResult.urls) {
					toast.error(uploadResult.error || "Failed to upload attachments");
					setSendingMessage(false);
					return;
				}

				attachmentData = attachments.map((f, idx) => ({
					type: (f.type.startsWith("image/") ? "image" : "file") as
						| "image"
						| "file",
					filename: f.name,
					url: uploadResult.urls?.[idx],
				}));
			}

			const result = await sendTeamChannelMessageAction({
				channel: channelId,
				text: messageInput.trim(),
				attachments: attachmentData,
			});

			if (result.success) {
				setMessageInput("");
				setAttachments([]);
				toast.success("Message sent");
				// Refresh messages
				fetchMessages(true);
			} else {
				toast.error(result.error || "Failed to send message");
			}
		} catch (err) {
			toast.error("Failed to send message", {
				description: err instanceof Error ? err.message : "Unknown error",
			});
		} finally {
			setSendingMessage(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageInput, attachments, channelId, sendingMessage]);

	const handleAttachFiles = useCallback((files: File[]) => {
		setAttachments((prev) => [...prev, ...files]);
	}, []);

	const formatMessageTime = (dateString: string) => {
		const messageDate = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - messageDate.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return messageDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			{/* Chat Area - Full Width */}
			<div className="bg-card mb-1 rounded-tl-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1 overflow-hidden">
				{/* Channel Header */}
				<div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-3 border-b border-border bg-card">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 shrink-0"
							onClick={toggleSidebar}
							title="Toggle sidebar"
						>
							<PanelLeft className="h-4 w-4" />
						</Button>
						<div className="relative flex-1 max-w-md">
							<Input
								type="search"
								placeholder="Search messages..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="h-8 pl-9 pr-8"
							/>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							{searchInput && (
								<button
									onClick={() => setSearchInput("")}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="h-3 w-3" />
								</button>
							)}
						</div>
						<div className="flex items-center gap-2 shrink-0 ml-2">
							<Hash className="h-5 w-5 text-muted-foreground" />
							<h1 className="font-semibold text-base">{currentChannel.name}</h1>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRefresh}
							disabled={refreshing}
							className="h-8 w-8 p-0"
							title="Refresh"
						>
							<RefreshCw
								className={`h-4 w-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`}
							/>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							title="More options"
						>
							<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
						</Button>
					</div>
				</div>

				{/* Messages Area */}
				<div
					ref={conversationScrollRef}
					className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20 px-4 py-4"
				>
					{loading ? (
						<div className="flex items-center justify-center h-full">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : error ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<p className="text-sm text-destructive mb-2 font-medium">
									{error}
								</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => fetchMessages()}
								>
									Try Again
								</Button>
							</div>
						</div>
					) : messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<MessageSquare className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-2" />
								<p className="text-sm text-muted-foreground">No messages yet</p>
								<p className="text-xs text-muted-foreground mt-1">
									Start the conversation!
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							{messages.map((msg, index) => {
								const isOutbound = msg.direction === "outbound";
								const showTime =
									index === 0 ||
									new Date(msg.created_at).getTime() -
										new Date(messages[index - 1].created_at).getTime() >
										5 * 60 * 1000; // 5 minutes

								return (
									<div key={msg.id} className="flex flex-col">
										{showTime && (
											<div className="flex justify-center my-2">
												<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
													{formatMessageTime(msg.created_at)}
												</span>
											</div>
										)}
										<div
											className={cn(
												"flex gap-3",
												isOutbound ? "justify-end" : "justify-start",
											)}
										>
											{/* Avatar for inbound messages */}
											{!isOutbound && msg.sent_by_user && (
												<Avatar className="h-8 w-8 shrink-0">
													<AvatarFallback>
														{msg.sent_by_user.name?.[0]?.toUpperCase() || "U"}
													</AvatarFallback>
												</Avatar>
											)}

											<div
												className={cn(
													"max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
													isOutbound
														? "bg-primary text-primary-foreground rounded-tr-sm"
														: "bg-muted text-foreground rounded-tl-sm",
												)}
											>
												{/* Show sender name for inbound */}
												{!isOutbound && msg.sent_by_user && (
													<div className="text-xs font-medium mb-1 opacity-80">
														{msg.sent_by_user.name || "Unknown"}
													</div>
												)}

												{/* Show attachments if present */}
												{msg.provider_metadata &&
													typeof msg.provider_metadata === "object" &&
													"attachments" in msg.provider_metadata &&
													Array.isArray(msg.provider_metadata.attachments) &&
													msg.provider_metadata.attachments.length > 0 && (
														<div
															className={cn(
																"mb-2 space-y-2",
																msg.body ? "" : "",
															)}
														>
															{msg.provider_metadata.attachments.map(
																(att: any, attIdx: number) => {
																	const isImage =
																		att.type === "image" ||
																		(att.url &&
																			/\.(jpg|jpeg|png|gif|webp)$/i.test(
																				att.url,
																			));
																	return (
																		<div
																			key={attIdx}
																			className="rounded-lg overflow-hidden"
																		>
																			{isImage ? (
																				<img
																					src={att.url}
																					alt={att.filename || "Image"}
																					className="max-w-full max-h-64 object-contain rounded-lg"
																					loading="lazy"
																				/>
																			) : (
																				<a
																					href={att.url}
																					target="_blank"
																					rel="noopener noreferrer"
																					className={cn(
																						"flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity",
																						isOutbound
																							? "bg-primary-foreground/20"
																							: "bg-background/20",
																					)}
																				>
																					<Paperclip className="h-4 w-4" />
																					<span className="text-xs truncate">
																						{att.filename || "Attachment"}
																					</span>
																				</a>
																			)}
																		</div>
																	);
																},
															)}
														</div>
													)}

												{msg.body && (
													<p className="text-sm whitespace-pre-wrap break-words">
														{msg.body}
													</p>
												)}

												{!msg.body &&
													(!msg.provider_metadata ||
														typeof msg.provider_metadata !== "object" ||
														!("attachments" in msg.provider_metadata) ||
														!Array.isArray(msg.provider_metadata.attachments) ||
														msg.provider_metadata.attachments.length === 0) && (
														<p className="text-sm opacity-70 italic">
															No message content
														</p>
													)}

												<span
													className={cn(
														"text-xs opacity-70 mt-1 block",
														isOutbound ? "text-right" : "text-left",
													)}
												>
													{new Date(msg.created_at).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Message Input */}
				<SmsMessageInput
					value={messageInput}
					onChange={setMessageInput}
					onSend={handleSendMessage}
					onAttach={handleAttachFiles}
					sending={sendingMessage}
					disabled={false}
					placeholder={`Message #${currentChannel.name.toLowerCase()}`}
				/>
			</div>
		</div>
	);
}
