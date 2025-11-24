/**
 * AI Chat Store Integration
 *
 * Zustand-based state management for AI chat using @ai-sdk-tools/store
 * Provides optimized subscriptions, message indexing, and data parts handling
 */

"use client";

import {
	createChatStore,
	Provider as ChatStoreProvider,
	useChatStore,
	useChatMessages,
	useChatStatus,
	useChatError,
	useChatId,
	useChatActions,
	useChatReset,
	useMessageById,
	useMessageIds,
	useMessageCount,
	useVirtualMessages,
	useSelector,
	useDataPart,
	useDataParts,
	type StoreState,
	type ChatActions,
} from "@ai-sdk-tools/store";
import type { UIMessage } from "ai";
import { createContext, useContext, type ReactNode } from "react";

/**
 * Extended UI Message type with Stratos-specific metadata
 */
export interface StratosMessage extends UIMessage {
	metadata?: {
		agent?: string;
		handoffs?: Array<{ from: string; to: string; reason?: string }>;
		artifacts?: Array<{ id: string; type: string }>;
		suggestions?: string[];
	};
}

/**
 * Create a Stratos-configured chat store
 *
 * @param initialMessages - Optional initial messages
 * @returns Configured chat store
 *
 * @example
 * ```tsx
 * const store = createStratosChatStore();
 *
 * function ChatApp() {
 *   return (
 *     <StratosChatProvider store={store}>
 *       <ChatInterface />
 *     </StratosChatProvider>
 *   );
 * }
 * ```
 */
export function createStratosChatStore(initialMessages?: StratosMessage[]) {
	return createChatStore<StratosMessage>(initialMessages);
}

/**
 * Stratos Chat Provider - wraps components with chat store context
 */
export function StratosChatProvider({
	children,
	initialMessages,
	store,
}: {
	children: ReactNode;
	initialMessages?: StratosMessage[];
	store?: ReturnType<typeof createStratosChatStore>;
}) {
	// Note: ChatStoreProvider accepts generic but JSX syntax doesn't support it
	// The store and initialMessages are already typed as StratosMessage
	return (
		<ChatStoreProvider
			initialMessages={initialMessages}
			store={store}
		>
			{children}
		</ChatStoreProvider>
	);
}

// Re-export hooks with proper typing
export {
	useChatStore,
	useChatMessages,
	useChatStatus,
	useChatError,
	useChatId,
	useChatActions,
	useChatReset,
	useMessageById,
	useMessageIds,
	useMessageCount,
	useVirtualMessages,
	useSelector,
	useDataPart,
	useDataParts,
};

// Re-export types
export type { StoreState, ChatActions };

/**
 * Custom hooks for Stratos-specific data parts
 */

/**
 * Hook to get agent status updates during streaming
 *
 * @returns [agentStatus, clearStatus] - Current status and clear function
 *
 * @example
 * ```tsx
 * function AgentStatusIndicator() {
 *   const [status, clear] = useAgentStatus();
 *
 *   if (!status) return null;
 *
 *   return (
 *     <Badge variant="outline">
 *       {status.agent}: {status.status}
 *     </Badge>
 *   );
 * }
 * ```
 */
export function useAgentStatus() {
	return useDataPart<{
		status: "routing" | "executing" | "completing";
		agent: string;
	}>("agent-status");
}

/**
 * Hook to get agent handoff events
 *
 * @returns [handoff, clearHandoff] - Current handoff and clear function
 *
 * @example
 * ```tsx
 * function HandoffIndicator() {
 *   const [handoff] = useAgentHandoff();
 *
 *   if (!handoff) return null;
 *
 *   return (
 *     <div className="text-muted-foreground text-sm">
 *       Transferring from {handoff.from} to {handoff.to}...
 *     </div>
 *   );
 * }
 * ```
 */
export function useAgentHandoff() {
	return useDataPart<{
		from: string;
		to: string;
		reason?: string;
		routingStrategy?: "programmatic" | "llm";
	}>("agent-handoff");
}

/**
 * Hook to get rate limit information
 *
 * @returns [rateLimit, clearRateLimit] - Current rate limit and clear function
 *
 * @example
 * ```tsx
 * function RateLimitWarning() {
 *   const [rateLimit] = useRateLimit();
 *
 *   if (!rateLimit || rateLimit.remaining > 10) return null;
 *
 *   return (
 *     <Alert variant="warning">
 *       {rateLimit.remaining} requests remaining
 *     </Alert>
 *   );
 * }
 * ```
 */
export function useRateLimit() {
	return useDataPart<{
		limit: number;
		remaining: number;
		reset: string;
		code?: string;
	}>("rate-limit");
}

/**
 * Hook to get suggested prompts
 *
 * @returns [suggestions, clearSuggestions] - Current suggestions and clear function
 *
 * @example
 * ```tsx
 * function SuggestedPrompts() {
 *   const [suggestions] = useSuggestions();
 *
 *   if (!suggestions?.prompts.length) return null;
 *
 *   return (
 *     <div className="flex gap-2 flex-wrap">
 *       {suggestions.prompts.map((prompt, i) => (
 *         <Button key={i} variant="outline" size="sm" onClick={() => send(prompt)}>
 *           {prompt}
 *         </Button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSuggestions() {
	return useDataPart<{
		prompts: string[];
	}>("suggestions");
}

/**
 * Hook to get the last assistant message
 *
 * @returns The last assistant message or undefined
 *
 * @example
 * ```tsx
 * function LastResponse() {
 *   const lastAssistant = useLastAssistantMessage();
 *
 *   if (!lastAssistant) return <p>No responses yet</p>;
 *
 *   return <p>{lastAssistant.content}</p>;
 * }
 * ```
 */
export function useLastAssistantMessage() {
	return useSelector<StratosMessage, StratosMessage | undefined>(
		"last-assistant",
		(messages) =>
			messages.filter((m) => m.role === "assistant").slice(-1)[0],
		[]
	);
}

/**
 * Hook to get message count by role
 *
 * @returns Object with counts by role
 *
 * @example
 * ```tsx
 * function MessageStats() {
 *   const counts = useMessageCountByRole();
 *
 *   return (
 *     <div>
 *       User: {counts.user}, Assistant: {counts.assistant}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMessageCountByRole() {
	return useSelector<
		StratosMessage,
		{ user: number; assistant: number; system: number }
	>(
		"count-by-role",
		(messages) => ({
			user: messages.filter((m) => m.role === "user").length,
			assistant: messages.filter((m) => m.role === "assistant").length,
			system: messages.filter((m) => m.role === "system").length,
		}),
		[]
	);
}

/**
 * Hook to check if a response is currently streaming
 */
export function useIsStreaming() {
	const status = useChatStatus();
	return status === "streaming" || status === "submitted";
}

/**
 * Hook to get all artifacts from messages
 */
export function useArtifacts() {
	return useSelector<
		StratosMessage,
		Array<{ id: string; type: string; messageId: string }>
	>(
		"all-artifacts",
		(messages) =>
			messages.flatMap((m) =>
				(m.metadata?.artifacts || []).map((a) => ({
					...a,
					messageId: m.id,
				}))
			),
		[]
	);
}
