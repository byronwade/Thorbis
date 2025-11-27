/**
 * Supabase Memory Provider for ai-sdk-tools
 *
 * Implements the MemoryProvider interface from @ai-sdk-tools/memory
 * to provide persistent memory storage using existing Supabase tables:
 * - chats: Chat session management
 * - messages_v2: Conversation history
 * - ai_memory: Working memory (facts, preferences, insights)
 */

import type {
	ChatSession,
	ConversationMessage,
	MemoryProvider,
	MemoryScope,
	WorkingMemory,
} from "@ai-sdk-tools/memory";
import type { UIMessage } from "ai";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Creates a Supabase-backed memory provider for AI agents
 *
 * @param companyId - The company ID to scope all memory operations
 * @returns MemoryProvider compatible with ai-sdk-tools
 *
 * @example
 * ```ts
 * import { createSupabaseMemoryProvider } from '@/lib/ai/memory-provider';
 * import { Agent } from '@ai-sdk-tools/agents';
 *
 * const memory = createSupabaseMemoryProvider(companyId);
 *
 * const agent = Agent.create({
 *   name: 'assistant',
 *   model: anthropic('claude-sonnet-4-20250514'),
 *   memory: {
 *     provider: memory,
 *     workingMemory: { enabled: true, scope: 'chat' },
 *     history: { enabled: true, limit: 20 },
 *     chats: { enabled: true, generateTitle: true }
 *   }
 * });
 * ```
 */
export function createSupabaseMemoryProvider(
	companyId: string,
): MemoryProvider {
	// Note: We need to await the client inside each method since the provider
	// interface doesn't support async factory functions
	let supabaseClient: Awaited<ReturnType<typeof createServiceSupabaseClient>> | null = null;

	const getClient = async () => {
		if (!supabaseClient) {
			supabaseClient = await createServiceSupabaseClient();
		}
		if (!supabaseClient) {
			throw new Error("Failed to create Supabase client - missing env vars");
		}
		return supabaseClient;
	};

	return {
		/**
		 * Get persistent working memory for a chat or user
		 */
		async getWorkingMemory(params: {
			chatId?: string;
			userId?: string;
			scope: MemoryScope;
		}): Promise<WorkingMemory | null> {
			const { chatId, userId, scope } = params;
			const supabase = await getClient();

			// Query ai_memory table for working memory content
			let query = supabase
				.from("ai_memory")
				.select("content, updated_at")
				.eq("company_id", companyId)
				.eq("memory_type", "conversation_summary")
				.eq("is_active", true)
				.order("updated_at", { ascending: false })
				.limit(1);

			if (scope === "chat" && chatId) {
				query = query.eq("source_chat_id", chatId);
			} else if (scope === "user" && userId) {
				query = query.eq("user_id", userId);
			}

			const { data, error } = await query.single();

			if (error || !data) {
				return null;
			}

			return {
				content: data.content,
				updatedAt: new Date(data.updated_at),
			};
		},

		/**
		 * Update persistent working memory
		 */
		async updateWorkingMemory(params: {
			chatId?: string;
			userId?: string;
			scope: MemoryScope;
			content: string;
		}): Promise<void> {
			const { chatId, userId, scope, content } = params;
			const supabase = await getClient();

			// Check if working memory exists
			let existingQuery = supabase
				.from("ai_memory")
				.select("id")
				.eq("company_id", companyId)
				.eq("memory_type", "conversation_summary")
				.eq("is_active", true);

			if (scope === "chat" && chatId) {
				existingQuery = existingQuery.eq("source_chat_id", chatId);
			} else if (scope === "user" && userId) {
				existingQuery = existingQuery.eq("user_id", userId);
			}

			const { data: existing } = await existingQuery.single();

			if (existing) {
				// Update existing
				await supabase
					.from("ai_memory")
					.update({
						content,
						updated_at: new Date().toISOString(),
					})
					.eq("id", existing.id);
			} else {
				// Create new
				await supabase.from("ai_memory").insert({
					company_id: companyId,
					user_id: userId || null,
					memory_type: "conversation_summary",
					content,
					source_type: "conversation",
					source_chat_id: chatId || null,
					importance: "normal",
					confidence_score: 1.0,
					is_active: true,
				});
			}
		},

		/**
		 * Save a message to conversation history
		 */
		async saveMessage(message: ConversationMessage): Promise<void> {
			const { chatId, userId, role, content, timestamp } = message;
			const supabase = await getClient();

			// Convert content to parts format expected by messages_v2
			const parts =
				typeof content === "string"
					? [{ type: "text", text: content }]
					: content;

			await supabase.from("messages_v2").insert({
				chat_id: chatId,
				role,
				parts,
				attachments: [],
				created_at: timestamp.toISOString(),
			});
		},

		/**
		 * Get recent messages from conversation history
		 * Returns UIMessage[] format for AI SDK compatibility
		 */
		async getMessages<T = UIMessage>(params: {
			chatId: string;
			userId?: string;
			limit?: number;
		}): Promise<T[]> {
			const { chatId, limit = 20 } = params;
			const supabase = await getClient();

			const { data, error } = await supabase
				.from("messages_v2")
				.select("id, role, parts, attachments, created_at")
				.eq("chat_id", chatId)
				.order("created_at", { ascending: true })
				.limit(limit);

			if (error || !data) {
				return [];
			}

			// Convert to UIMessage format
			return data.map((msg) => ({
				id: msg.id,
				role: msg.role as "user" | "assistant" | "system",
				content: extractTextFromParts(msg.parts),
				parts: msg.parts,
				createdAt: new Date(msg.created_at),
			})) as T[];
		},

		/**
		 * Save or update a chat session
		 */
		async saveChat(chat: ChatSession): Promise<void> {
			const { chatId, userId, title, createdAt, updatedAt, messageCount } =
				chat;
			const supabase = await getClient();

			// Check if chat exists
			const { data: existing } = await supabase
				.from("chats")
				.select("id")
				.eq("id", chatId)
				.single();

			if (existing) {
				await supabase
					.from("chats")
					.update({
						title: title || "New Chat",
						// Note: messages_v2 doesn't track message count, handled separately
					})
					.eq("id", chatId);
			} else {
				await supabase.from("chats").insert({
					id: chatId,
					user_id: userId,
					company_id: companyId,
					title: title || "New Chat",
					visibility: "private",
					created_at: createdAt.toISOString(),
				});
			}
		},

		/**
		 * Get chat sessions for a user
		 */
		async getChats(params: {
			userId?: string;
			search?: string;
			limit?: number;
		}): Promise<ChatSession[]> {
			const { userId, search, limit = 50 } = params;
			const supabase = await getClient();

			let query = supabase
				.from("chats")
				.select(
					`
          id,
          user_id,
          title,
          created_at,
          visibility
        `,
				)
				.eq("company_id", companyId)
				.order("created_at", { ascending: false })
				.limit(limit);

			if (userId) {
				query = query.eq("user_id", userId);
			}

			if (search) {
				query = query.ilike("title", `%${search}%`);
			}

			const { data, error } = await query;

			if (error || !data) {
				return [];
			}

			// Get message counts for each chat
			const chatIds = data.map((c) => c.id);
			const { data: messageCounts } = await supabase
				.from("messages_v2")
				.select("chat_id")
				.in("chat_id", chatIds);

			const countMap = new Map<string, number>();
			messageCounts?.forEach((m) => {
				countMap.set(m.chat_id, (countMap.get(m.chat_id) || 0) + 1);
			});

			return data.map((chat) => ({
				chatId: chat.id,
				userId: chat.user_id,
				title: chat.title,
				createdAt: new Date(chat.created_at),
				updatedAt: new Date(chat.created_at), // chats table doesn't have updated_at
				messageCount: countMap.get(chat.id) || 0,
			}));
		},

		/**
		 * Get a specific chat session
		 */
		async getChat(chatId: string): Promise<ChatSession | null> {
			const supabase = await getClient();

			const { data, error } = await supabase
				.from("chats")
				.select("id, user_id, title, created_at")
				.eq("id", chatId)
				.eq("company_id", companyId)
				.single();

			if (error || !data) {
				return null;
			}

			// Get message count
			const { count } = await supabase
				.from("messages_v2")
				.select("id", { count: "exact", head: true })
				.eq("chat_id", chatId);

			return {
				chatId: data.id,
				userId: data.user_id,
				title: data.title,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.created_at),
				messageCount: count || 0,
			};
		},

		/**
		 * Update chat title
		 */
		async updateChatTitle(chatId: string, title: string): Promise<void> {
			const supabase = await getClient();
			await supabase.from("chats").update({ title }).eq("id", chatId);
		},

		/**
		 * Delete a chat session and its messages
		 */
		async deleteChat(chatId: string): Promise<void> {
			const supabase = await getClient();

			// Delete messages first (foreign key constraint)
			await supabase.from("messages_v2").delete().eq("chat_id", chatId);

			// Delete working memory associated with this chat
			await supabase
				.from("ai_memory")
				.update({ is_active: false, deactivated_at: new Date().toISOString() })
				.eq("source_chat_id", chatId);

			// Delete the chat
			await supabase.from("chats").delete().eq("id", chatId);
		},
	};
}

/**
 * Extract text content from message parts
 */
function extractTextFromParts(parts: unknown): string {
	if (!Array.isArray(parts)) {
		return typeof parts === "string" ? parts : "";
	}

	return parts
		.filter((part: { type?: string }) => part?.type === "text")
		.map((part: { text?: string }) => part?.text || "")
		.join("\n");
}

/**
 * Default working memory template for AI agents
 */
export const DEFAULT_WORKING_MEMORY_TEMPLATE = `# Working Memory

## Key Facts
- [Important information about the customer/context]

## Current Focus
- [What the user is working on or asking about]

## Preferences
- [User preferences and communication style]

## Business Context
- [Relevant business information: jobs, invoices, customers]
`;
