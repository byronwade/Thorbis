"use client";

import { type UIMessage as AiMessage, useChat } from "@ai-sdk/react";
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
	X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	approveAIAction,
	checkIsCompanyOwner,
	getChatPendingActions,
	type PendingAction,
	rejectAIAction,
} from "@/actions/ai-approval";
import {
	Artifact,
	ArtifactAction,
	ArtifactActions,
	ArtifactClose,
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
	MessageBranch,
	MessageBranchContent,
	MessageBranchNext,
	MessageBranchPage,
	MessageBranchPrevious,
	MessageBranchSelector,
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
	ModelSelectorSeparator,
	ModelSelectorShortcut,
	ModelSelectorTrigger,
} from "@/components/ai/model-selector";
import {
	ActionApprovalBanner,
	OwnerActionApprovalDialog,
} from "@/components/ai/owner-action-approval-dialog";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";

// Business-focused suggested actions for the AI manager
const SUGGESTED_ACTIONS = [
	{ text: "Show today's schedule", icon: Calendar },
	{ text: "Inactive customers (30+ days)", icon: Users },
	{ text: "Overdue invoices", icon: FileText },
	{ text: "Monthly financial summary", icon: TrendingUp },
];

// AI Models available - Google Gemini is primary
const models = [
	{
		id: "gemini-2.0-flash-exp",
		name: "Gemini 2.0 Flash",
		chef: "Google",
		chefSlug: "google",
		providers: ["google"],
		description: "Fast and efficient for most tasks",
	},
	{
		id: "gemini-1.5-pro",
		name: "Gemini 1.5 Pro",
		chef: "Google",
		chefSlug: "google",
		providers: ["google"],
		description: "Best for complex reasoning and analysis",
	},
	{
		id: "gemini-1.5-flash",
		name: "Gemini 1.5 Flash",
		chef: "Google",
		chefSlug: "google",
		providers: ["google"],
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

interface ApprovalRequest {
	action: string;
	reason: string;
	details: string;
	toolCallId: string;
}

// Action selectors - get actions without subscribing to state changes
// This prevents infinite re-renders when any store state changes
const createChatSelector = (state: ReturnType<typeof useChatStore.getState>) =>
	state.createChat;
const addMessageSelector = (state: ReturnType<typeof useChatStore.getState>) =>
	state.addMessage;

interface AiChatInterfaceProps {
	companyId?: string;
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
								{["Google"].map((chef) => (
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

export function AiChatInterface({ companyId }: AiChatInterfaceProps) {
	// STABLE chat ID for this component instance - created once, never changes
	// This prevents useChat from reinitializing when Zustand state changes
	const [stableChatId] = useState(() => crypto.randomUUID());

	// Track if we've initialized the store chat (prevents infinite loop)
	const hasInitializedRef = useRef(false);

	// Use action selectors to avoid subscribing to entire store state
	// This prevents infinite re-renders when any store state changes
	const createChat = useChatStore(createChatSelector);
	const addMessage = useChatStore(addMessageSelector);
	const [showSuggestedActions, setShowSuggestedActions] = useState(true);
	const [selectedModel, setSelectedModel] = useState(models[0].id);
	const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>(
		[],
	);

	// Owner approval state
	const [ownerPendingActions, setOwnerPendingActions] = useState<
		PendingAction[]
	>([]);
	const [selectedPendingAction, setSelectedPendingAction] =
		useState<PendingAction | null>(null);
	const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

	// Store chat ID for persistence (separate from useChat's ID)
	const [storeChatId, setStoreChatId] = useState<string | null>(null);

	// Initialize chat in store ONCE when component mounts
	useEffect(() => {
		if (!hasInitializedRef.current) {
			hasInitializedRef.current = true;
			const newChatId = createChat("New Chat");
			setStoreChatId(newChatId);
		}
	}, [createChat]);

	// Check if user is owner on mount
	useEffect(() => {
		const checkOwner = async () => {
			const result = await checkIsCompanyOwner();
			if (result.success && result.data) {
				setIsOwner(result.data);
			}
		};
		checkOwner();
	}, []);

	// Fetch pending actions for this chat
	const fetchPendingActions = useCallback(async () => {
		if (!stableChatId) return;
		const result = await getChatPendingActions({ chatId: stableChatId });
		if (result.success && result.data) {
			setOwnerPendingActions(result.data);
		}
	}, [stableChatId]);

	// Poll for pending actions periodically (every 10 seconds)
	useEffect(() => {
		fetchPendingActions();
		const interval = setInterval(fetchPendingActions, 10000);
		return () => clearInterval(interval);
	}, [fetchPendingActions]);

	// Handler for approving owner-required actions
	const handleOwnerApprove = useCallback(
		async (actionId: string) => {
			const result = await approveAIAction({ actionId });
			if (result.success) {
				toast.success(
					result.data?.executed
						? "Action approved and executed!"
						: "Action approved! Executing...",
				);
				// Refresh pending actions
				fetchPendingActions();
				return { success: true };
			}
			return { success: false, error: result.error };
		},
		[fetchPendingActions],
	);

	// Handler for rejecting owner-required actions
	const handleOwnerReject = useCallback(
		async (actionId: string, reason?: string) => {
			const result = await rejectAIAction({ actionId, reason });
			if (result.success) {
				toast.info("Action rejected");
				fetchPendingActions();
				return { success: true };
			}
			return { success: false, error: result.error };
		},
		[fetchPendingActions],
	);

	// Open approval dialog for a specific action
	const handleViewActionDetails = useCallback((action: PendingAction) => {
		setSelectedPendingAction(action);
		setApprovalDialogOpen(true);
	}, []);

	// Refs for stable callback references - prevents useChat from re-initializing
	const storeChatIdRef = useRef(storeChatId);
	const addMessageRef = useRef(addMessage);
	const fetchPendingActionsRef = useRef(fetchPendingActions);

	// Keep refs updated
	useEffect(() => {
		storeChatIdRef.current = storeChatId;
	}, [storeChatId]);

	useEffect(() => {
		addMessageRef.current = addMessage;
	}, [addMessage]);

	useEffect(() => {
		fetchPendingActionsRef.current = fetchPendingActions;
	}, [fetchPendingActions]);

	// Memoize body to prevent useChat re-initialization
	// Uses stableChatId which never changes for this component instance
	const chatBody = useMemo(
		() => ({
			companyId,
			chatId: stableChatId,
			model: selectedModel,
		}),
		[companyId, stableChatId, selectedModel],
	);

	// Memoize onFinish callback to prevent useChat re-initialization
	const handleChatFinish = useCallback((message: AiMessage) => {
		// Sync with chat store when message finishes
		const currentStoreChatId = storeChatIdRef.current;
		if (currentStoreChatId && message.content) {
			addMessageRef.current(currentStoreChatId, {
				id: message.id,
				role: message.role as "user" | "assistant",
				content: message.content,
				timestamp: new Date(),
			});
		}

		// Check for approval requests in tool results
		const toolInvocations = (
			message as AiMessage & { toolInvocations?: ToolInvocation[] }
		).toolInvocations;
		if (toolInvocations) {
			// Check for basic approval requests
			const approvalRequests = toolInvocations
				.filter(
					(inv) => inv.state === "result" && inv.toolName === "requestApproval",
				)
				.map((inv) => ({
					...(inv.result as {
						action: string;
						reason: string;
						details: string;
					}),
					toolCallId: inv.toolCallId,
				}));

			if (approvalRequests.length > 0) {
				setPendingApprovals((prev) => [...prev, ...approvalRequests]);
			}

			// Check for owner-required approval results (destructive actions)
			const ownerApprovalResults = toolInvocations.filter((inv) => {
				if (inv.state !== "result") return false;
				const result = inv.result as
					| { requiresOwnerApproval?: boolean }
					| undefined;
				return result?.requiresOwnerApproval === true;
			});

			if (ownerApprovalResults.length > 0) {
				// Refresh pending actions to show the new ones
				fetchPendingActionsRef.current();
			}
		}
	}, []); // Empty deps - uses refs for latest values

	// Use Vercel AI SDK's useChat hook (v5 API)
	// Uses stableChatId which NEVER changes for this component instance
	// This prevents the hook from reinitializing on state changes
	const { messages, error, sendMessage, setMessages, status, regenerate } =
		useChat({
			id: stableChatId, // Always stable - never undefined, never changes
			api: "/api/ai/chat",
			body: chatBody,
			onFinish: handleChatFinish,
		});

	// Derive loading state from status (v5 API change)
	const isLoading = status === "submitted" || status === "streaming";

	// Handle approval/rejection of AI actions
	const handleApproval = async (
		approval: ApprovalRequest,
		approved: boolean,
	) => {
		// Remove from pending
		setPendingApprovals((prev) =>
			prev.filter((a) => a.toolCallId !== approval.toolCallId),
		);

		// Send response to AI using v5 API
		sendMessage({
			text: approved
				? `Yes, I approve: ${approval.action}`
				: `No, do not proceed with: ${approval.action}`,
		});
	};

	// NOTE: We no longer sync from Zustand store - useChat manages its own message state
	// Messages are only persisted to Zustand when AI finishes (via handleChatFinish)

	// Hide suggested actions once user starts chatting
	useEffect(() => {
		if (messages.length > 0) {
			setShowSuggestedActions(false);
		}
	}, [messages.length]);

	const onSubmit = useCallback(
		async (
			message: { text: string; files: any[] },
			event: React.FormEvent<HTMLFormElement>,
		) => {
			if (!message.text?.trim()) return;

			// Require companyId for authenticated API calls
			if (!companyId) {
				toast.error("Please wait - loading company data...");
				return;
			}

			// Add user message to store for persistence
			const currentStoreChatId = storeChatIdRef.current;
			if (currentStoreChatId) {
				const userMessage = {
					id: `msg-${Date.now()}`,
					role: "user" as const,
					content: message.text,
					timestamp: new Date(),
				};
				addMessage(currentStoreChatId, userMessage);
			}

			// Send to AI using v5 API - sendMessage instead of append
			// Files are passed directly in the message object (not as options)
			sendMessage({
				text: message.text,
				files: message.files?.length > 0 ? message.files : undefined,
			});
		},
		[companyId, addMessage, sendMessage],
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

	// Render approval request UI
	const renderApprovalRequest = (approval: ApprovalRequest) => (
		<div
			key={approval.toolCallId}
			className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-3"
		>
			<p className="text-sm font-medium mb-1">Approval Required</p>
			<p className="text-sm text-muted-foreground mb-2">{approval.action}</p>
			<p className="text-xs text-muted-foreground mb-3">{approval.reason}</p>
			<div className="flex gap-2">
				<Button size="sm" onClick={() => handleApproval(approval, true)}>
					Approve
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleApproval(approval, false)}
				>
					Reject
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<OwnerActionApprovalDialog
				pendingAction={selectedPendingAction}
				isOpen={approvalDialogOpen}
				onOpenChange={setApprovalDialogOpen}
				onApprove={handleOwnerApprove}
				onReject={handleOwnerReject}
				isOwner={isOwner}
			/>
			<div className="flex h-full flex-col">
				{/* Messages */}
				<div className="flex-1 overflow-y-auto">
					<div className="mx-auto max-w-3xl px-4" role="log">
						<Conversation>
							<ConversationContent>
								{messages.length === 0 && !isLoading && (
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
										description="Ask me anything about your business - customers, jobs, invoices, scheduling, and more."
									/>
								)}

								{messages.map((message) => {
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

												{message.content && (
													<MessageResponse>{message.content}</MessageResponse>
												)}

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
											{message.content && (
												<MessageToolbar className="opacity-0 group-hover:opacity-100 transition-opacity">
													<MessageActions>
														<MessageAction
															tooltip="Copy"
															onClick={() => handleCopyMessage(message.content)}
														>
															<Copy className="h-3.5 w-3.5" />
														</MessageAction>

														{message.role === "user" && (
															<MessageAction
																tooltip="Edit"
																onClick={() =>
																	handleEditMessage(message.id, message.content)
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
											)}
										</Message>
									);
								})}

								{isLoading && (
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

				{/* Suggested Actions & Input */}
				<div className="bg-background px-4 py-4">
					<div className="mx-auto max-w-3xl flex flex-col gap-3">
						{/* Owner-Required Pending Actions (Destructive) */}
						{ownerPendingActions.length > 0 && (
							<div className="space-y-2">
								{ownerPendingActions.map((action) => (
									<ActionApprovalBanner
										key={action.id}
										pendingAction={action}
										onViewDetails={() => handleViewActionDetails(action)}
									/>
								))}
							</div>
						)}

						{/* Basic Approval Requests */}
						{pendingApprovals.length > 0 && (
							<div className="space-y-2">
								{pendingApprovals.map((approval) =>
									renderApprovalRequest(approval),
								)}
							</div>
						)}

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
		</>
	);
}
