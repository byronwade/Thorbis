"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatStore, chatSelectors, type ChatStore } from "@/lib/stores/chat-store";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Artifact, ArtifactContent, ArtifactHeader, ArtifactTitle } from "@/components/ai-elements/artifact";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_ACTIONS = [
	"What are the advantages of using Next.js?",
	"Write code to demonstrate Dijkstra's algorithm",
	"Help me write an essay about Silicon Valley",
	"What is the weather in San Francisco?",
];

const models = [
	{
		id: "grok-vision",
		name: "Grok Vision",
		chef: "xAI",
		chefSlug: "xai",
		providers: ["xai"],
	},
	{
		id: "grok-reasoning",
		name: "Grok Reasoning",
		chef: "xAI",
		chefSlug: "xai",
		providers: ["xai"],
	},
];

// Cache selectors at module level to ensure stable references for SSR
// This prevents Zustand's getServerSnapshot from being recreated on each render
const activeChatIdSelector = chatSelectors.activeChatId;
const messagesSelector = chatSelectors.messages;

export function AiChatInterface() {
	// Use cached selectors to ensure stable references for SSR compatibility
	// This prevents "getServerSnapshot should be cached" errors
	const activeChatId = useChatStore(activeChatIdSelector);
	const activeChatMessages = useChatStore(messagesSelector);
	
	const { createChat, addMessage } = useChatStore();
	const [showSuggestedActions, setShowSuggestedActions] = useState(true);

	// Initialize chat if none exists
	useEffect(() => {
		if (!activeChatId) {
			createChat("New Chat");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChatId]);

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
		},
	});

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

	const handleSuggestedAction = (action: string) => {
		if (!activeChatId) return;
		onSubmit({ text: action, files: [] }, {} as React.FormEvent<HTMLFormElement>);
	};

	// Inner component to access PromptInputController
	function ChatInputInner() {
		const { textInput } = usePromptInputController();
		const attachments = usePromptInputAttachments();
		const [model, setModel] = useState<string>(models[0].id);
		const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
		const [contextUsage] = useState(0);
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		const selectedModelData = models.find((m) => m.id === model);

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
				className="w-full overflow-hidden rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border focus-within:ring-0 focus-within:outline-none hover:border-muted-foreground/50 [&_[data-slot=input-group]]:!border-0 [&_[data-slot=input-group]]:!bg-transparent [&_[data-slot=input-group]]:!shadow-none [&_[data-slot=input-group]]:!rounded-none [&_[data-slot=input-group]]:!p-0 [&_[data-slot=input-group]]:!h-auto [&_[data-slot=input-group]]:!min-h-0 [&_[data-slot=input-group]]:has-[[data-slot=input-group-control]:focus-visible]:!ring-0 [&_[data-slot=input-group]]:has-[[data-slot=input-group-control]:focus-visible]:!outline-none [&_*:focus]:!ring-0 [&_*:focus]:!outline-none [&_*:focus-visible]:!ring-0 [&_*:focus-visible]:!outline-none [&_*:focus-visible]:!ring-offset-0 [&_textarea:focus]:!ring-0 [&_textarea:focus]:!outline-none [&_textarea:focus-visible]:!ring-0 [&_textarea:focus-visible]:!ring-0 [&_button:focus]:!ring-0 [&_button:focus]:!outline-none [&_button:focus-visible]:!ring-0"
			>
				<PromptInputAttachments className="!items-start">
					{(attachment) => <PromptInputAttachment data={attachment} />}
				</PromptInputAttachments>
				<PromptInputBody>
					<PromptInputTextarea
						ref={textareaRef}
						placeholder="Send a message..."
						className="flex min-h-[80px] w-full rounded-none border-none shadow-none outline-hidden field-sizing-fixed dark:bg-transparent grow resize-none bg-transparent p-2 text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden disabled:cursor-not-allowed disabled:opacity-50"
						style={{ height: "44px" }}
						rows={1}
						autoFocus
						data-testid="multimodal-input"
					/>
				</PromptInputBody>
				<PromptInputFooter className="!border-t-0 !p-0 !shadow-none !dark:border-0 !dark:border-transparent flex items-center justify-between">
					<PromptInputTools className="[&_button:first-child]:rounded-bl-xl gap-0 sm:gap-0.5">
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
									{["xAI"].map((chef) => (
										<ModelSelectorGroup heading={chef} key={chef}>
											{models
												.filter((m) => m.chef === chef)
												.map((m) => (
													<ModelSelectorItem
														key={m.id}
														onSelect={() => {
															setModel(m.id);
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
														{model === m.id ? (
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
						className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-1.5 size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
						data-testid="send-button"
					/>
				</PromptInputFooter>
			</PromptInput>
		);
	}

	return (
		<div className="overscroll-behavior-contain flex h-full min-w-0 touch-pan-y flex-col bg-background">
			{/* Messages */}
			<div className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 touch-pan-y overflow-y-scroll" style={{ overflowAnchor: "none" }}>
				<div className="relative flex-1 touch-pan-y overflow-y-auto will-change-scroll mx-auto flex min-w-0 max-w-4xl flex-col gap-4 md:gap-6" role="log">
					<Conversation>
						<ConversationContent>
							{messages.length === 0 && !isLoading && (
								<div className="p-4 flex flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
									<div className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8">
										<div className="font-semibold text-xl md:text-2xl">
											Hello there!
										</div>
										<div className="text-xl text-zinc-500 md:text-2xl">
											How can I help you today?
										</div>
									</div>
									<div className="min-h-[24px] min-w-[24px] shrink-0" />
								</div>
							)}

							{messages.map((message) => (
								<Message key={message.id} from={message.role}>
									<MessageContent>
										{message.content && (
											<MessageResponse>{message.content}</MessageResponse>
										)}

										{/* Render artifacts if present */}
										{message.experimental_attachments?.map((attachment, idx) => (
											<Artifact key={idx}>
												<ArtifactHeader>
													<ArtifactTitle>
														{attachment.name || "Artifact"}
													</ArtifactTitle>
												</ArtifactHeader>
												<ArtifactContent>
													{attachment.content && (
														<pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
															<code>{attachment.content}</code>
														</pre>
													)}
													{attachment.url && (
														<div className="mt-2">
															<a
																href={attachment.url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-primary hover:underline text-sm"
															>
																View artifact →
															</a>
														</div>
													)}
												</ArtifactContent>
											</Artifact>
										))}
									</MessageContent>
								</Message>
							))}

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
			<div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
				<div className="relative flex w-full flex-col gap-4">
					{/* Suggested Actions */}
					{showSuggestedActions && messages.length === 0 && (
						<div className="grid w-full gap-2 sm:grid-cols-2" data-testid="suggested-actions">
							{SUGGESTED_ACTIONS.map((action, idx) => (
								<div key={idx} style={{ opacity: 1, transform: "none" }}>
									<button
										className="inline-flex items-center justify-center gap-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-full h-auto w-full whitespace-normal p-3 text-left"
										onClick={() => handleSuggestedAction(action)}
										type="button"
									>
										{action}
									</button>
								</div>
							))}
						</div>
					)}

					{/* Input */}
					<PromptInputProvider initialInput={input || ""}>
						<ChatInputInner />
					</PromptInputProvider>
				</div>
			</div>
		</div>
	);
}

