"use client";

import { type UIMessage as AiMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import {
	Bot,
	Calendar,
	CheckIcon,
	Copy,
	DollarSign,
	Download,
	ExternalLink,
	FileText,
	Mail,
	MessageSquare,
	Pencil,
	Phone,
	RefreshCw,
	Sparkles,
	ThumbsDown,
	ThumbsUp,
	TrendingUp,
	Users,
	Wrench,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	createChat as createChatAction,
	generateChatTitle,
	getChatMessages,
} from "@/actions/chats";
import {
	Artifact,
	ArtifactAction,
	ArtifactActions,
	ArtifactContent,
	ArtifactDescription,
	ArtifactHeader,
	ArtifactTitle,
} from "@/components/ai/artifact";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai/conversation";
import { Loader } from "@/components/ai/loader";
import {
	Message,
	MessageAction,
	MessageActions,
	MessageAttachment,
	MessageAttachments,
	MessageContent,
	MessageResponse,
	MessageToolbar,
} from "@/components/ai/message";
import {
	ModelSelector,
	ModelSelectorContent,
	ModelSelectorEmpty,
	ModelSelectorGroup,
	ModelSelectorInput,
	ModelSelectorItem,
	ModelSelectorList,
	ModelSelectorLogo,
	ModelSelectorLogoGroup,
	ModelSelectorName,
	ModelSelectorTrigger,
} from "@/components/ai/model-selector";
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	PromptInputButton,
	PromptInputFooter,
	PromptInputSpeechButton,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from "@/components/ai/prompt-input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";

// Business-focused suggested actions for the AI manager
const SUGGESTED_ACTIONS = [
	{ text: "Show today's schedule", icon: Calendar },
	{ text: "Inactive customers (30+ days)", icon: Users },
	{ text: "Overdue invoices", icon: FileText },
	{ text: "Monthly financial summary", icon: TrendingUp },
];

// AI Models available - Groq is primary (free tier)
const models = [
	{
		id: "llama-3.3-70b-versatile",
		name: "LLaMA 3.3 70B",
		chef: "Groq",
		chefSlug: "groq",
		providers: ["groq"],
		description: "Best for tool calling and complex tasks",
	},
	{
		id: "llama-3.1-70b-versatile",
		name: "LLaMA 3.1 70B",
		chef: "Groq",
		chefSlug: "groq",
		providers: ["groq"],
		description: "Versatile model for general tasks",
	},
	{
		id: "llama-3.1-8b-instant",
		name: "LLaMA 3.1 8B",
		chef: "Groq",
		chefSlug: "groq",
		providers: ["groq"],
		description: "Ultra fast for quick tasks",
	},
];

// Tool icons for display
const toolIcons: Record<string, React.ElementType> = {
	searchCustomers: Users,
	getCustomerDetails: Users,
	createCustomer: Users,
	updateCustomer: Users,
	searchJobs: Wrench,
	createAppointment: Calendar,
	getAvailableSlots: Calendar,
	searchInvoices: FileText,
	createInvoice: FileText,
	getFinancialSummary: DollarSign,
	getVirtualBuckets: DollarSign,
	transferToBucket: DollarSign,
	sendEmail: Mail,
	sendSms: MessageSquare,
	initiateCall: Phone,
	getCommunicationHistory: MessageSquare,
	getDashboardMetrics: Sparkles,
	getProactiveInsights: Bot,
};

// Tool category labels
const toolCategoryLabels: Record<string, string> = {
	customer: "Customer",
	scheduling: "Scheduling",
	financial: "Financial",
	communication: "Communication",
	reporting: "Reporting",
};

interface ToolInvocation {
	toolCallId: string;
	toolName: string;
	args: Record<string, unknown>;
	state: "partial-call" | "call" | "result";
	result?: unknown;
}

// AI SDK 6: Messages use parts array (no content property)
// This helper extracts the text content from the parts array
function getMessageTextContent(message: AiMessage): string {
	// AI SDK 6 uses parts array for message content
	if (message.parts && Array.isArray(message.parts)) {
		return message.parts
			.filter(isTextUIPart)
			.map((part) => part.text)
			.join("");
	}

	return "";
}

// Action selectors - get actions without subscribing to state changes
// This prevents infinite re-renders when any store state changes
const createChatSelector = (state: ReturnType<typeof useChatStore.getState>) =>
	state.createChat;

interface AiChatInterfaceProps {
	companyId?: string;
	/** User ID for message persistence */
	userId?: string;
	/** Optional chat ID - if provided, loads existing chat; if undefined, creates new chat */
	chatId?: string;
	/** Initial messages from SSR (optional - can also be loaded client-side) */
	initialMessages?: AiMessage[];
	/** Callback when a new chat is created (for URL routing) */
	onChatCreated?: (chatId: string) => void;
	/** Callback when chat title is updated */
	onTitleUpdated?: (title: string) => void;
}

// ChatInputInner component - defined outside to prevent re-creation on every render
interface ChatInputInnerProps {
	onSubmit: (
		message: { text: string; files: any[] },
		event: React.FormEvent<HTMLFormElement>,
	) => Promise<void>;
	selectedModel: string;
	setSelectedModel: (model: string) => void;
	status: "submitted" | "streaming" | "ready" | "error";
}

function ChatInputInner({
	onSubmit,
	selectedModel,
	setSelectedModel,
	status,
}: ChatInputInnerProps) {
	const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const selectedModelData = models.find((m) => m.id === selectedModel);

	return (
		<PromptInput
			onSubmit={onSubmit}
			accept="image/*"
			multiple
			className="w-full bg-background"
		>
			<PromptInputAttachments className="!items-start">
				{(attachment) => <PromptInputAttachment data={attachment} />}
			</PromptInputAttachments>
			<PromptInputBody>
				<PromptInputTextarea
					ref={textareaRef}
					placeholder="Ask anything about your business..."
					autoFocus
					data-testid="multimodal-input"
				/>
			</PromptInputBody>
			<PromptInputFooter className="flex items-center justify-between">
				<PromptInputTools className="gap-1">
					<PromptInputActionMenu>
						<PromptInputActionMenuTrigger />
						<PromptInputActionMenuContent>
							<PromptInputActionAddAttachments />
						</PromptInputActionMenuContent>
					</PromptInputActionMenu>
					<PromptInputSpeechButton textareaRef={textareaRef} />
					<ModelSelector
						onOpenChange={setModelSelectorOpen}
						open={modelSelectorOpen}
					>
						<ModelSelectorTrigger asChild>
							<PromptInputButton>
								{selectedModelData?.chefSlug && (
									<ModelSelectorLogo provider={selectedModelData.chefSlug} />
								)}
								{selectedModelData?.name && (
									<ModelSelectorName>
										{selectedModelData.name}
									</ModelSelectorName>
								)}
							</PromptInputButton>
						</ModelSelectorTrigger>
						<ModelSelectorContent>
							<ModelSelectorInput placeholder="Search models..." />
							<ModelSelectorList>
								<ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
								{["Groq"].map((chef) => (
									<ModelSelectorGroup heading={chef} key={chef}>
										{models
											.filter((m) => m.chef === chef)
											.map((m) => (
												<ModelSelectorItem
													key={m.id}
													onSelect={() => {
														setSelectedModel(m.id);
														setModelSelectorOpen(false);
													}}
													value={m.id}
												>
													<ModelSelectorLogo provider={m.chefSlug} />
													<ModelSelectorName>{m.name}</ModelSelectorName>
													<ModelSelectorLogoGroup>
														{m.providers.map((provider) => (
															<ModelSelectorLogo
																key={provider}
																provider={provider}
															/>
														))}
													</ModelSelectorLogoGroup>
													{selectedModel === m.id ? (
														<CheckIcon className="ml-auto size-4" />
													) : (
														<div className="ml-auto size-4" />
													)}
												</ModelSelectorItem>
											))}
									</ModelSelectorGroup>
								))}
							</ModelSelectorList>
						</ModelSelectorContent>
					</ModelSelector>
				</PromptInputTools>
				<PromptInputSubmit
					status={status}
					className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					data-testid="send-button"
				/>
			</PromptInputFooter>
		</PromptInput>
	);
}

export function AiChatInterface({
	companyId,
	userId,
	chatId: propChatId,
	initialMessages,
	onChatCreated,
	onTitleUpdated,
}: AiChatInterfaceProps) {
	// Chat ID management:
	// - If propChatId is provided, use it (existing chat)
	// - Otherwise, generate a new ID once when the component mounts
	const generatedChatId = useMemo(() => crypto.randomUUID(), []);
	const activeChatId = propChatId || generatedChatId;

	// Track whether this chat exists in the database
	const [isNewChat, setIsNewChat] = useState(!propChatId);
	const hasCreatedChatRef = useRef(false);
	const hasTitleGeneratedRef = useRef(false);
	const firstUserMessageRef = useRef<string | null>(null);

	// Track if we've loaded messages for this chat ID
	const loadedChatIdRef = useRef<string | null>(null);
	const [dbMessages, setDbMessages] = useState<AiMessage[]>(
		initialMessages || []
	);
	// Skip client-side fetch when SSR provided messages
	useEffect(() => {
		if (propChatId && initialMessages?.length) {
			loadedChatIdRef.current = propChatId;
		}
	}, [propChatId, initialMessages]);

	// Use action selectors to avoid subscribing to entire store state
	// This prevents infinite re-renders when any store state changes
	const createChat = useChatStore(createChatSelector);
	const [showSuggestedActions, setShowSuggestedActions] = useState(true);
	const [selectedModel, setSelectedModel] = useState(models[0].id);
	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/ai/chat",
				streamProtocol: "sse", // Ensure partial tokens stream immediately
			}),
		[],
	);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Load messages from database when chatId changes (only for existing chats)
	useEffect(() => {
		// Skip if no chatId provided (new chat) or already loaded for this ID
		if (!propChatId || loadedChatIdRef.current === propChatId) {
			return;
		}

		const loadMessages = async () => {
			console.log("[AI Chat] Loading messages for chat:", propChatId);
			const result = await getChatMessages(propChatId);

			if (result.success && result.data) {
				setDbMessages(result.data);
				loadedChatIdRef.current = propChatId;
				console.log(
					"[AI Chat] Loaded",
					result.data.length,
					"messages from DB"
				);
			} else {
				console.error("[AI Chat] Failed to load messages:", result.error);
			}
		};

		loadMessages();
	}, [propChatId]);

	// Create chat in database when first message is sent (for new chats only)
	const createChatInDb = useCallback(async () => {
		if (!isNewChat || hasCreatedChatRef.current) {
			return activeChatId; // Already created or existing chat
		}

		hasCreatedChatRef.current = true;
		console.log("[AI Chat] Creating new chat in database:", activeChatId);

		// Pass the client-generated chatId to ensure sync between client and API
		const result = await createChatAction("New Chat", activeChatId);
		if (result.success && result.data) {
			setIsNewChat(false);
			// Notify parent with the chatId (should match activeChatId now)
			onChatCreated?.(result.data.chatId);
			console.log("[AI Chat] Chat created:", result.data.chatId);
			return result.data.chatId;
		} else {
			console.error("[AI Chat] Failed to create chat:", result.error);
			hasCreatedChatRef.current = false; // Allow retry
			return activeChatId;
		}
	}, [isNewChat, activeChatId, onChatCreated]);

	// Generate title after first assistant response
	const maybeGenerateTitle = useCallback(
		async (firstMessage: string) => {
			if (hasTitleGeneratedRef.current || !isNewChat) {
				return; // Already generated or existing chat has a title
			}

			hasTitleGeneratedRef.current = true;
			console.log("[AI Chat] Generating title for chat:", activeChatId);

			const result = await generateChatTitle(activeChatId, firstMessage);
			if (result.success && result.data) {
				onTitleUpdated?.(result.data);
				console.log("[AI Chat] Title generated:", result.data);
			} else {
				console.error("[AI Chat] Failed to generate title:", result.error);
				hasTitleGeneratedRef.current = false; // Allow retry
			}
		},
		[activeChatId, isNewChat, onTitleUpdated]
	);

	// Simple onFinish callback - generates title after first response
	// AI SDK v5 changed signature: receives options object instead of message directly
	const handleChatFinish = useCallback(() => {
		console.log("[AI Chat] Response completed");

		// Generate title if this is the first response and we have the first user message
		if (firstUserMessageRef.current && !hasTitleGeneratedRef.current) {
			maybeGenerateTitle(firstUserMessageRef.current);
		}
	}, [maybeGenerateTitle]);

	// Use Vercel AI SDK's useChat hook (v6 API)
	// Uses activeChatId which is either from props or generated once
	// NOTE: Dynamic values (companyId, model) are passed to sendMessage, NOT here
	const { messages, error, sendMessage, status, regenerate, setMessages } =
		useChat({
			id: activeChatId, // Stable per chat - either from props or generated
			initialMessages: dbMessages, // Load from DB if existing chat
			transport,
			maxRetries: 0, // avoid duplicate POSTs on rate limits in dev
			experimental_throttle: 24, // Keep streaming smooth without over-rendering
			onFinish: handleChatFinish,
			onError: (err) => {
				console.error("[AI Chat] Error from useChat:", err);
				toast.error(err.message || "Failed to get AI response");
			},
		});

	// Abort any in-flight request when unmounting or chatId changes
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// Update messages when dbMessages changes (after loading from DB)
	useEffect(() => {
		if (dbMessages.length > 0 && propChatId) {
			setMessages(dbMessages);
		}
	}, [dbMessages, propChatId, setMessages]);

	// Debug: Log messages state changes
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			console.log("[AI Chat] Messages updated:", {
				count: messages.length,
				messages: messages.map((m) => {
					const textContent = getMessageTextContent(m);
					return {
						id: m.id,
						role: m.role,
						contentLength: textContent.length,
						contentPreview: textContent.substring(0, 100),
						hasParts: !!m.parts?.length,
						partsCount: m.parts?.length || 0,
					};
				}),
				status,
				error: error?.message,
			});
		}
	}, [messages, status, error]);

	// Derive loading state from status (v5 API change)
	const isLoading = status === "submitted" || status === "streaming";

	// NOTE: useChat manages its own message state

	// Hide suggested actions once user starts chatting
	useEffect(() => {
		if (messages.length > 0) {
			setShowSuggestedActions(false);
		}
	}, [messages.length]);

	// Track latest assistant tool activity for UI feedback
	const lastAssistantMessage = useMemo(
		() => [...messages].reverse().find((m) => m.role === "assistant"),
		[messages],
	);
	const activeToolInvocations =
		(lastAssistantMessage as AiMessage & { toolInvocations?: ToolInvocation[] })
			?.toolInvocations || [];
	const hasActiveTools = activeToolInvocations.length > 0;
	const runningToolInvocations = activeToolInvocations.filter(
		(inv) => inv.state !== "result"
	);

	const onSubmit = useCallback(
		async (
			message: { text: string; files: any[] },
			event: React.FormEvent<HTMLFormElement>,
		) => {
			// Prevent double-send while a request is in-flight
			if (status === "submitted" || status === "streaming") {
				console.log("[AI Chat] Ignoring submit while request in-flight");
				return;
			}

			if (!message.text?.trim()) {
				console.log("[AI Chat] Empty message, ignoring");
				return;
			}

			// Require companyId for authenticated API calls
			if (!companyId) {
				console.error("[AI Chat] No companyId available");
				toast.error("Please wait - loading company data...");
				return;
			}

			// Track first user message for title generation
			if (!firstUserMessageRef.current) {
				firstUserMessageRef.current = message.text;
			}

			// Create chat in database if this is a new chat
			if (isNewChat) {
				await createChatInDb();
			}

			// Abort any previous request and start a new controller
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			abortControllerRef.current = new AbortController();

			console.log("[AI Chat] Sending message:", {
				text: message.text.substring(0, 50),
				companyId,
				chatId: activeChatId,
				model: selectedModel,
				hasFiles: message.files?.length > 0,
			});

			// Send to AI using v5 API
			// Dynamic values (companyId, userId, model) are passed here, NOT in useChat config
			// This prevents stale body data issues
			sendMessage(
				{
					text: message.text,
					files: message.files?.length > 0 ? message.files : undefined,
				},
				{
					body: {
						companyId,
						userId,
						chatId: activeChatId,
						model: selectedModel,
					},
					abortSignal: abortControllerRef.current.signal,
				},
			);
		},
		[companyId, userId, activeChatId, selectedModel, sendMessage, isNewChat, createChatInDb],
	);

	const handleSuggestedAction = useCallback(
		(action: { text: string; icon: React.ElementType }) => {
			onSubmit(
				{ text: action.text, files: [] },
				{} as React.FormEvent<HTMLFormElement>,
			);
		},
		[onSubmit],
	);

	// Message action handlers
	const handleCopyMessage = useCallback(async (content: string) => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success("Copied to clipboard");
		} catch {
			toast.error("Failed to copy");
		}
	}, []);

	const handleRegenerateMessage = useCallback(
		async (messageId: string) => {
			// Use v5 regenerate API with optional messageId
			regenerate({ messageId });
			toast.success("Regenerating response...");
		},
		[regenerate],
	);

	const handleFeedback = useCallback(
		(messageId: string, type: "up" | "down") => {
			// Log feedback for analytics - can be extended to store in database
			console.info("[AI Feedback]", {
				messageId,
				feedbackType: type,
				timestamp: new Date().toISOString(),
			});
			toast.success(
				type === "up"
					? "Thanks for the feedback!"
					: "We'll improve based on your feedback",
			);
		},
		[],
	);

	const handleEditMessage = useCallback(
		(messageId: string, content: string) => {
			// Find the message and allow editing
			const messageIndex = messages.findIndex((m) => m.id === messageId);
			if (messageIndex < 0) return;

			// Set the input to the message content for editing
			// This will require the PromptInputProvider to be updated
			// For now, we'll just copy to clipboard
			handleCopyMessage(content);
			toast.info("Message copied - paste and edit in the input");
		},
		[messages, handleCopyMessage],
	);

	// Render tool invocation UI
	const renderToolInvocation = (invocation: ToolInvocation) => {
		const ToolIcon = toolIcons[invocation.toolName] || Wrench;
		const isCompleted = invocation.state === "result";
		const isRunning = invocation.state === "call";

		return (
			<div
				key={invocation.toolCallId}
				className="flex items-center gap-2 text-xs text-muted-foreground py-1"
			>
				<ToolIcon className="h-3 w-3" />
				<span>{invocation.toolName.replace(/([A-Z])/g, " $1").trim()}</span>
				<span
					className={cn(
						"ml-auto",
						isCompleted ? "text-green-600" : "text-muted-foreground",
					)}
				>
					{isCompleted ? "Done" : isRunning ? "Running..." : "Pending"}
				</span>
			</div>
		);
	};

	// Render tool result details (web search, etc.) when available
	const renderToolResult = (invocation: ToolInvocation) => {
		if (invocation.state !== "result" || !invocation.result) return null;
		const result = invocation.result as any;

		const items = Array.isArray(result?.results) ? result.results : null;
		if (items && items.length > 0) {
			return (
				<div className="mt-2 space-y-2 rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
					<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
						<span>Tool result</span>
						{result.searchType && (
							<span className="uppercase tracking-wide">{result.searchType}</span>
						)}
					</div>
					<ul className="space-y-2">
						{items.slice(0, 5).map((item: any, idx: number) => (
							<li key={idx} className="space-y-1">
								<div className="font-medium leading-tight">{item.title}</div>
								{item.snippet && (
									<p className="text-xs text-muted-foreground leading-snug">
										{item.snippet}
									</p>
								)}
								{item.url && (
									<a
										className="text-xs text-primary hover:underline break-all"
										href={item.url}
										target="_blank"
										rel="noreferrer"
									>
										{item.url}
									</a>
								)}
							</li>
						))}
					</ul>
				</div>
			);
		}

		return (
			<pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
				{JSON.stringify(result, null, 2)}
			</pre>
		);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Messages */}
			<div className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-3xl px-4" role="log">
						<Conversation>
							<ConversationContent>
								{messages.length === 0 && !isLoading && !error && (
									<ConversationEmptyState
										icon={
											<Image
												src="/ThorbisLogo.webp"
												alt="Thorbis AI"
												width={48}
												height={48}
												className="h-12 w-12"
											/>
										}
										title="AI Business Manager"
										description={companyId
											? "Ask me anything about your business - customers, jobs, invoices, scheduling, and more."
											: "Loading company data..."}
									/>
								)}

								{/* Error display */}
								{error && (
									<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
										<p className="font-medium">Error</p>
										<p className="mt-1">{error.message || "Failed to get AI response"}</p>
									</div>
								)}

								{messages.map((message, messageIndex) => {
									const toolInvocations = (
										message as AiMessage & {
											toolInvocations?: ToolInvocation[];
										}
									).toolInvocations;
									const attachments = (
										message as AiMessage & {
											experimental_attachments?: Array<{
												name?: string;
												content?: string;
												url?: string;
												mediaType?: string;
											}>;
										}
									).experimental_attachments;

									// Determine if this message is currently streaming
									// It's streaming if: status is 'streaming', it's an assistant message, and it's the last message
									const isLastMessage = messageIndex === messages.length - 1;
									const isStreamingMessage =
										status === "streaming" &&
										message.role === "assistant" &&
										isLastMessage;

									return (
										<Message key={message.id} from={message.role}>
											{/* User message attachments */}
											{message.role === "user" &&
												attachments &&
												attachments.length > 0 && (
													<MessageAttachments className="mb-2">
														{attachments.map((attachment, idx) => (
															<MessageAttachment
																key={idx}
																data={{
																	type: "file",
																	url: attachment.url || "",
																	mediaType:
																		attachment.mediaType ||
																		"application/octet-stream",
																	filename: attachment.name || "attachment",
																}}
															/>
														))}
													</MessageAttachments>
												)}

											<MessageContent>
												{/* Render tool invocations for assistant messages */}
												{message.role === "assistant" &&
													toolInvocations &&
													toolInvocations.length > 0 && (
														<div className="mb-2">
															{toolInvocations
																.filter(
																	(inv) => inv.toolName !== "requestApproval",
																)
																.map((inv) => renderToolInvocation(inv))}
														</div>
													)}

												{(() => {
													const textContent = getMessageTextContent(message);
									return textContent ? (
										<MessageResponse isStreaming={isStreamingMessage}>
											{textContent}
										</MessageResponse>
									) : null;
								})()}

												{/* Tool result details */}
												{message.role === "assistant" &&
													toolInvocations?.map((inv) => (
														<div key={`${inv.toolCallId}-result`}>
															{renderToolResult(inv)}
														</div>
													))}

												{/* Render artifacts if present for assistant messages */}
												{message.role === "assistant" &&
													attachments?.map((attachment, idx) => (
														<Artifact key={idx} className="mt-3">
															<ArtifactHeader>
																<div className="flex-1">
																	<ArtifactTitle>
																		{attachment.name || "Artifact"}
																	</ArtifactTitle>
																	{attachment.mediaType && (
																		<ArtifactDescription>
																			{attachment.mediaType}
																		</ArtifactDescription>
																	)}
																</div>
																<ArtifactActions>
																	{attachment.content && (
																		<ArtifactAction
																			tooltip="Copy code"
																			icon={Copy}
																			onClick={() =>
																				handleCopyMessage(
																					attachment.content || "",
																				)
																			}
																		/>
																	)}
																	{attachment.url && (
																		<ArtifactAction
																			tooltip="Open in new tab"
																			icon={ExternalLink}
																			onClick={() =>
																				window.open(attachment.url, "_blank")
																			}
																		/>
																	)}
																	{attachment.content && (
																		<ArtifactAction
																			tooltip="Download"
																			icon={Download}
																			onClick={() => {
																				const blob = new Blob(
																					[attachment.content || ""],
																					{ type: "text/plain" },
																				);
																				const url = URL.createObjectURL(blob);
																				const a = document.createElement("a");
																				a.href = url;
																				a.download =
																					attachment.name || "artifact.txt";
																				a.click();
																				URL.revokeObjectURL(url);
																			}}
																		/>
																	)}
																</ArtifactActions>
															</ArtifactHeader>
															<ArtifactContent>
																{attachment.content && (
																	<pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
																		<code>{attachment.content}</code>
																	</pre>
																)}
																{attachment.url && !attachment.content && (
																	<div className="flex items-center gap-2">
																		<ExternalLink className="h-4 w-4 text-muted-foreground" />
																		<a
																			href={attachment.url}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-primary hover:underline text-sm"
																		>
																			View artifact
																		</a>
																	</div>
																)}
															</ArtifactContent>
														</Artifact>
													))}
											</MessageContent>

											{/* Message Toolbar with Actions */}
											{(() => {
												const textContent = getMessageTextContent(message);
												if (!textContent) return null;
												return (
													<MessageToolbar className="opacity-0 group-hover:opacity-100 transition-opacity">
														<MessageActions>
															<MessageAction
																tooltip="Copy"
																onClick={() => handleCopyMessage(textContent)}
															>
																<Copy className="h-3.5 w-3.5" />
															</MessageAction>

															{message.role === "user" && (
																<MessageAction
																	tooltip="Edit"
																	onClick={() =>
																		handleEditMessage(message.id, textContent)
																	}
																>
																	<Pencil className="h-3.5 w-3.5" />
																</MessageAction>
															)}

															{message.role === "assistant" && (
																<>
																	<MessageAction
																		tooltip="Regenerate"
																		onClick={() =>
																			handleRegenerateMessage(message.id)
																		}
																	>
																		<RefreshCw className="h-3.5 w-3.5" />
																	</MessageAction>
																	<MessageAction
																		tooltip="Good response"
																		onClick={() =>
																			handleFeedback(message.id, "up")
																		}
																	>
																		<ThumbsUp className="h-3.5 w-3.5" />
																	</MessageAction>
																	<MessageAction
																		tooltip="Bad response"
																		onClick={() =>
																			handleFeedback(message.id, "down")
																		}
																	>
																		<ThumbsDown className="h-3.5 w-3.5" />
																	</MessageAction>
																</>
															)}
														</MessageActions>
													</MessageToolbar>
												);
											})()}
										</Message>
									);
								})}

								{/* Show typing indicator only when waiting for first chunk (submitted)
								    Once streaming starts, the streaming cursor in MessageResponse handles visual feedback */}
								{status === "submitted" && (
									<Message from="assistant">
										<MessageContent>
											<Loader />
										</MessageContent>
									</Message>
								)}
							</ConversationContent>
							<ConversationScrollButton />
						</Conversation>
					</div>
				</div>

			{/* Live tool activity (global) */}
			{hasActiveTools && (
				<div className="mx-auto mt-2 w-full max-w-3xl px-4">
					<div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-2 font-medium text-foreground">
							{runningToolInvocations.length > 0 ? (
								<>
									<Loader className="mr-1 h-3 w-3" />
									<span>Working...</span>
								</>
							) : (
								<span>Tools finished</span>
							)}
						</div>
						<div className="mt-2 space-y-1">
							{activeToolInvocations.map((inv) => (
								<div
									key={`activity-${inv.toolCallId}`}
									className="flex items-center gap-2"
								>
									<span className="text-foreground">
										{inv.toolName.replace(/([A-Z])/g, " $1").trim()}
									</span>
									<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide">
										{inv.state}
									</span>
									{inv.state === "call" && (
										<span className="text-[10px] text-muted-foreground">
											Executing tool…
										</span>
									)}
									{inv.state === "result" && (
										<span className="text-[10px] text-green-600">Done</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Suggested Actions & Input */}
			<div className="bg-background px-4 py-4">
				<div className="mx-auto max-w-3xl flex flex-col gap-3">
					{/* Suggested Actions */}
					{showSuggestedActions && messages.length === 0 && (
						<div
							className="flex flex-wrap gap-2"
							data-testid="suggested-actions"
						>
							{SUGGESTED_ACTIONS.map((action, idx) => {
								const ActionIcon = action.icon;
								return (
									<button
										key={idx}
										className="inline-flex items-center gap-2 text-sm border border-border bg-background hover:bg-muted rounded-lg px-3 py-2 transition-colors"
										onClick={() => handleSuggestedAction(action)}
										type="button"
									>
										<ActionIcon className="h-4 w-4 text-muted-foreground" />
										<span>{action.text}</span>
									</button>
								);
							})}
						</div>
					)}

					{/* Input */}
					<ChatInputInner
						onSubmit={onSubmit}
						selectedModel={selectedModel}
						setSelectedModel={setSelectedModel}
						status={status}
					/>
				</div>
			</div>
		</div>
	);
}
