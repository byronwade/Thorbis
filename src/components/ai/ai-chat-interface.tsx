"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useChat, type Message as AiMessage } from "@ai-sdk/react";
import { useChatStore, chatSelectors } from "@/lib/stores/chat-store";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
	ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
	MessageActions,
	MessageAction,
	MessageToolbar,
	MessageAttachment,
	MessageAttachments,
	MessageBranch,
	MessageBranchContent,
	MessageBranchSelector,
	MessageBranchPrevious,
	MessageBranchNext,
	MessageBranchPage,
} from "@/components/ai-elements/message";
import {
	Artifact,
	ArtifactContent,
	ArtifactHeader,
	ArtifactTitle,
	ArtifactDescription,
	ArtifactActions,
	ArtifactAction,
	ArtifactClose,
} from "@/components/ai-elements/artifact";
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
	ModelSelectorSeparator,
	ModelSelectorShortcut,
} from "@/components/ai-elements/model-selector";
import {
	PromptInput,
	PromptInputProvider,
	usePromptInputController,
	usePromptInputAttachments,
	PromptInputBody,
	PromptInputTextarea,
	PromptInputSubmit,
	PromptInputAttachments,
	PromptInputAttachment,
	PromptInputFooter,
	PromptInputTools,
	PromptInputButton,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputActionAddAttachments,
	PromptInputSpeechButton,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	CheckIcon,
	Wrench,
	Bot,
	Sparkles,
	Users,
	Calendar,
	FileText,
	DollarSign,
	Phone,
	Mail,
	MessageSquare,
	TrendingUp,
	Copy,
	RefreshCw,
	Pencil,
	ThumbsUp,
	ThumbsDown,
	Download,
	X,
	ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
	OwnerActionApprovalDialog,
	ActionApprovalBanner,
} from "@/components/ai/owner-action-approval-dialog";
import {
	approveAIAction,
	rejectAIAction,
	getChatPendingActions,
	checkIsCompanyOwner,
	type PendingAction,
} from "@/actions/ai-approval";

// Business-focused suggested actions for the AI manager
const SUGGESTED_ACTIONS = [
	{ text: "Show today's schedule", icon: Calendar },
	{ text: "Inactive customers (30+ days)", icon: Users },
	{ text: "Overdue invoices", icon: FileText },
	{ text: "Monthly financial summary", icon: TrendingUp },
];

// AI Models available - Claude is primary
const models = [
	{
		id: "claude-3-5-sonnet-20241022",
		name: "Claude 3.5 Sonnet",
		chef: "Anthropic",
		chefSlug: "anthropic",
		providers: ["anthropic"],
		description: "Best for complex reasoning and analysis",
	},
	{
		id: "claude-3-5-haiku-20241022",
		name: "Claude 3.5 Haiku",
		chef: "Anthropic",
		chefSlug: "anthropic",
		providers: ["anthropic"],
		description: "Fast and efficient for quick tasks",
	},
	{
		id: "claude-3-opus-20240229",
		name: "Claude 3 Opus",
		chef: "Anthropic",
		chefSlug: "anthropic",
		providers: ["anthropic"],
		description: "Most capable for complex tasks",
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

// Cache selectors at module level to ensure stable references for SSR
// This prevents Zustand's getServerSnapshot from being recreated on each render
const activeChatIdSelector = chatSelectors.activeChatId;
const messagesSelector = chatSelectors.messages;

interface AiChatInterfaceProps {
	companyId?: string;
}

export function AiChatInterface({ companyId }: AiChatInterfaceProps) {
	// Use cached selectors to ensure stable references for SSR compatibility
	// This prevents "getServerSnapshot should be cached" errors
	const activeChatId = useChatStore(activeChatIdSelector);
	const activeChatMessages = useChatStore(messagesSelector);

	const { createChat, addMessage } = useChatStore();
	const [showSuggestedActions, setShowSuggestedActions] = useState(true);
	const [selectedModel, setSelectedModel] = useState(models[0].id);
	const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);

	// Owner approval state
	const [ownerPendingActions, setOwnerPendingActions] = useState<PendingAction[]>([]);
	const [selectedPendingAction, setSelectedPendingAction] = useState<PendingAction | null>(null);
	const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [chatId] = useState(() => crypto.randomUUID()); // Stable chat ID for this session

	// Initialize chat if none exists
	useEffect(() => {
		if (!activeChatId) {
			createChat("New Chat");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChatId]);

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
		if (!chatId) return;
		const result = await getChatPendingActions({ chatId });
		if (result.success && result.data) {
			setOwnerPendingActions(result.data);
		}
	}, [chatId]);

	// Poll for pending actions periodically (every 10 seconds)
	useEffect(() => {
		fetchPendingActions();
		const interval = setInterval(fetchPendingActions, 10000);
		return () => clearInterval(interval);
	}, [fetchPendingActions]);

	// Handler for approving owner-required actions
	const handleOwnerApprove = useCallback(async (actionId: string) => {
		const result = await approveAIAction({ actionId });
		if (result.success) {
			toast.success(
				result.data?.executed
					? "Action approved and executed!"
					: "Action approved! Executing..."
			);
			// Refresh pending actions
			fetchPendingActions();
			return { success: true };
		}
		return { success: false, error: result.error };
	}, [fetchPendingActions]);

	// Handler for rejecting owner-required actions
	const handleOwnerReject = useCallback(async (actionId: string, reason?: string) => {
		const result = await rejectAIAction({ actionId, reason });
		if (result.success) {
			toast.info("Action rejected");
			fetchPendingActions();
			return { success: true };
		}
		return { success: false, error: result.error };
	}, [fetchPendingActions]);

	// Open approval dialog for a specific action
	const handleViewActionDetails = useCallback((action: PendingAction) => {
		setSelectedPendingAction(action);
		setApprovalDialogOpen(true);
	}, []);

	// Use Vercel AI SDK's useChat hook
	const {
		messages,
		input,
		isLoading,
		error,
		append,
		setMessages,
		status,
	} = useChat({
		api: "/api/ai/chat",
		id: activeChatId || undefined,
		body: {
			companyId,
			chatId, // Include chatId for destructive action tracking
			model: selectedModel,
		},
		onFinish: (message) => {
			// Sync with chat store when message finishes
			if (activeChatId && message.content) {
				addMessage(activeChatId, {
					id: message.id,
					role: message.role as "user" | "assistant",
					content: message.content,
					timestamp: new Date(),
				});
			}

			// Check for approval requests in tool results
			const toolInvocations = (message as AiMessage & { toolInvocations?: ToolInvocation[] }).toolInvocations;
			if (toolInvocations) {
				// Check for basic approval requests
				const approvalRequests = toolInvocations
					.filter((inv) => inv.state === "result" && inv.toolName === "requestApproval")
					.map((inv) => ({
						...(inv.result as { action: string; reason: string; details: string }),
						toolCallId: inv.toolCallId,
					}));

				if (approvalRequests.length > 0) {
					setPendingApprovals((prev) => [...prev, ...approvalRequests]);
				}

				// Check for owner-required approval results (destructive actions)
				const ownerApprovalResults = toolInvocations
					.filter((inv) => {
						if (inv.state !== "result") return false;
						const result = inv.result as { requiresOwnerApproval?: boolean } | undefined;
						return result?.requiresOwnerApproval === true;
					});

				if (ownerApprovalResults.length > 0) {
					// Refresh pending actions to show the new ones
					fetchPendingActions();
				}
			}
		},
	});

	// Handle approval/rejection of AI actions
	const handleApproval = async (approval: ApprovalRequest, approved: boolean) => {
		// Remove from pending
		setPendingApprovals((prev) => prev.filter((a) => a.toolCallId !== approval.toolCallId));

		// Send response to AI
		await append({
			role: "user",
			content: approved
				? `Yes, I approve: ${approval.action}`
				: `No, do not proceed with: ${approval.action}`,
		});
	};

	// Sync messages from store when chat changes - only on mount or when chat ID changes
	const prevActiveChatIdRef = useRef<string | null>(null);
	useEffect(() => {
		// Only sync on initial load or when chat ID actually changes
		if (activeChatId && activeChatId !== prevActiveChatIdRef.current) {
			prevActiveChatIdRef.current = activeChatId;
			if (activeChatMessages.length > 0) {
				const storeMessages = activeChatMessages.map((msg) => ({
					id: msg.id,
					role: msg.role,
					content: msg.content,
				}));
				setMessages(storeMessages);
			} else {
				setMessages([]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChatId]);

	// Hide suggested actions once user starts chatting
	useEffect(() => {
		if (messages.length > 0) {
			setShowSuggestedActions(false);
		}
	}, [messages.length]);

	const onSubmit = async (message: { text: string; files: any[] }, event: React.FormEvent<HTMLFormElement>) => {
		if (!message.text?.trim() || !activeChatId) return;

		// Add user message to store
		const userMessage = {
			id: `msg-${Date.now()}`,
			role: "user" as const,
			content: message.text,
			timestamp: new Date(),
		};
		addMessage(activeChatId, userMessage);

		// Send to AI
		await append({
			role: "user",
			content: message.text,
			experimental_attachments: message.files,
		});
	};

	const handleSuggestedAction = (action: { text: string; icon: React.ElementType }) => {
		if (!activeChatId) return;
		onSubmit({ text: action.text, files: [] }, {} as React.FormEvent<HTMLFormElement>);
	};

	// Message action handlers
	const handleCopyMessage = useCallback(async (content: string) => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success("Copied to clipboard");
		} catch {
			toast.error("Failed to copy");
		}
	}, []);

	const handleRegenerateMessage = useCallback(async (messageId: string) => {
		// Find the user message before this assistant message
		const messageIndex = messages.findIndex((m) => m.id === messageId);
		if (messageIndex <= 0) return;

		const userMessage = messages[messageIndex - 1];
		if (userMessage.role !== "user") return;

		// Remove messages from this point forward and regenerate
		const newMessages = messages.slice(0, messageIndex);
		setMessages(newMessages);

		// Re-send the user message
		await append({
			role: "user",
			content: userMessage.content,
		});

		toast.success("Regenerating response...");
	}, [messages, setMessages, append]);

	const handleFeedback = useCallback((messageId: string, type: "up" | "down") => {
		// TODO: Implement feedback submission to your analytics/feedback system
		toast.success(type === "up" ? "Thanks for the feedback!" : "We'll improve based on your feedback");
	}, []);

	const handleEditMessage = useCallback((messageId: string, content: string) => {
		// Find the message and allow editing
		const messageIndex = messages.findIndex((m) => m.id === messageId);
		if (messageIndex < 0) return;

		// Set the input to the message content for editing
		// This will require the PromptInputProvider to be updated
		// For now, we'll just copy to clipboard
		handleCopyMessage(content);
		toast.info("Message copied - paste and edit in the input");
	}, [messages, handleCopyMessage]);

	// Render tool invocation UI
	const renderToolInvocation = (invocation: ToolInvocation) => {
		const ToolIcon = toolIcons[invocation.toolName] || Wrench;
		const isCompleted = invocation.state === "result";
		const isRunning = invocation.state === "call";

		return (
			<div key={invocation.toolCallId} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
				<ToolIcon className="h-3 w-3" />
				<span>{invocation.toolName.replace(/([A-Z])/g, " $1").trim()}</span>
				<span className={cn(
					"ml-auto",
					isCompleted ? "text-green-600" : "text-muted-foreground"
				)}>
					{isCompleted ? "Done" : isRunning ? "Running..." : "Pending"}
				</span>
			</div>
		);
	};

	// Render approval request UI
	const renderApprovalRequest = (approval: ApprovalRequest) => (
		<div key={approval.toolCallId} className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-3">
			<p className="text-sm font-medium mb-1">Approval Required</p>
			<p className="text-sm text-muted-foreground mb-2">{approval.action}</p>
			<p className="text-xs text-muted-foreground mb-3">{approval.reason}</p>
			<div className="flex gap-2">
				<Button size="sm" onClick={() => handleApproval(approval, true)}>
					Approve
				</Button>
				<Button size="sm" variant="outline" onClick={() => handleApproval(approval, false)}>
					Reject
				</Button>
			</div>
		</div>
	);

	// Inner component to access PromptInputController
	function ChatInputInner() {
		const { textInput } = usePromptInputController();
		const attachments = usePromptInputAttachments();
		const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		const selectedModelData = models.find((m) => m.id === selectedModel);

		// Sync PromptInputProvider with useChat's input
		useEffect(() => {
			if (input !== textInput.value) {
				textInput.setInput(input || "");
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [input]);

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
						className="min-h-[44px] w-full resize-none bg-transparent p-2 text-sm placeholder:text-muted-foreground focus:outline-none"
						rows={1}
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
										<ModelSelectorLogo
											provider={selectedModelData.chefSlug}
										/>
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
									{["Anthropic"].map((chef) => (
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
						disabled={status === "in_progress" || !textInput.value?.trim()}
						className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
						data-testid="send-button"
					/>
				</PromptInputFooter>
			</PromptInput>
		);
	}

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
									icon={<Image src="/ThorbisLogo.webp" alt="Thorbis AI" width={48} height={48} className="h-12 w-12" />}
									title="AI Business Manager"
									description="Ask me anything about your business - customers, jobs, invoices, scheduling, and more."
								/>
							)}

							{messages.map((message) => {
								const toolInvocations = (message as AiMessage & { toolInvocations?: ToolInvocation[] }).toolInvocations;
								const attachments = (message as AiMessage & { experimental_attachments?: Array<{ name?: string; content?: string; url?: string; mediaType?: string }> }).experimental_attachments;

								return (
									<Message key={message.id} from={message.role}>
										{/* User message attachments */}
										{message.role === "user" && attachments && attachments.length > 0 && (
											<MessageAttachments className="mb-2">
												{attachments.map((attachment, idx) => (
													<MessageAttachment
														key={idx}
														data={{
															type: "file",
															url: attachment.url || "",
															mediaType: attachment.mediaType || "application/octet-stream",
															filename: attachment.name || "attachment",
														}}
													/>
												))}
											</MessageAttachments>
										)}

										<MessageContent>
											{/* Render tool invocations for assistant messages */}
											{message.role === "assistant" && toolInvocations && toolInvocations.length > 0 && (
												<div className="mb-2">
													{toolInvocations
														.filter((inv) => inv.toolName !== "requestApproval")
														.map((inv) => renderToolInvocation(inv))}
												</div>
											)}

											{message.content && (
												<MessageResponse>{message.content}</MessageResponse>
											)}

											{/* Render artifacts if present for assistant messages */}
											{message.role === "assistant" && attachments?.map((attachment, idx) => (
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
																	onClick={() => handleCopyMessage(attachment.content || "")}
																/>
															)}
															{attachment.url && (
																<ArtifactAction
																	tooltip="Open in new tab"
																	icon={ExternalLink}
																	onClick={() => window.open(attachment.url, "_blank")}
																/>
															)}
															{attachment.content && (
																<ArtifactAction
																	tooltip="Download"
																	icon={Download}
																	onClick={() => {
																		const blob = new Blob([attachment.content || ""], { type: "text/plain" });
																		const url = URL.createObjectURL(blob);
																		const a = document.createElement("a");
																		a.href = url;
																		a.download = attachment.name || "artifact.txt";
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
															onClick={() => handleEditMessage(message.id, message.content)}
														>
															<Pencil className="h-3.5 w-3.5" />
														</MessageAction>
													)}

													{message.role === "assistant" && (
														<>
															<MessageAction
																tooltip="Regenerate"
																onClick={() => handleRegenerateMessage(message.id)}
															>
																<RefreshCw className="h-3.5 w-3.5" />
															</MessageAction>
															<MessageAction
																tooltip="Good response"
																onClick={() => handleFeedback(message.id, "up")}
															>
																<ThumbsUp className="h-3.5 w-3.5" />
															</MessageAction>
															<MessageAction
																tooltip="Bad response"
																onClick={() => handleFeedback(message.id, "down")}
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
							{pendingApprovals.map((approval) => renderApprovalRequest(approval))}
						</div>
					)}

					{/* Suggested Actions */}
					{showSuggestedActions && messages.length === 0 && (
						<div className="flex flex-wrap gap-2" data-testid="suggested-actions">
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
					<PromptInputProvider initialInput={input || ""}>
						<ChatInputInner />
					</PromptInputProvider>
				</div>
			</div>
		</div>
		</>
	);
}
