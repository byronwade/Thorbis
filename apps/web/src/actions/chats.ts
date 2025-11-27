"use server";

/**
 * Chat Server Actions
 *
 * Server Actions for managing AI chat sessions and messages.
 * Integrates with Supabase via the memory provider for persistent storage.
 */

import type { ChatSession } from "@ai-sdk-tools/memory";
import type { UIMessage } from "ai";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { createSupabaseMemoryProvider } from "@/lib/ai/memory-provider";
import { createAIProvider } from "@/lib/ai/config";
import { getActiveCompany } from "@/lib/auth/company-context";
import {
	ActionError,
	ERROR_CODES,
	withErrorHandling,
	type ActionResult,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Re-export types for convenience
export type { ChatSession };

/**
 * Chat with messages included
 */
export interface ChatWithMessages extends ChatSession {
	messages: UIMessage[];
}

/**
 * Get User and Company Context
 *
 * Helper to get authenticated user and their active company.
 */
async function getUserContext() {
	const supabase = await createClient();
	if (!supabase) {
		throw new ActionError(
			"Database connection failed",
			ERROR_CODES.DB_CONNECTION_ERROR,
			500
		);
	}

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new ActionError(
			"You must be logged in to perform this action",
			ERROR_CODES.AUTH_UNAUTHORIZED,
			401
		);
	}

	// Prefer active company cookie, but allow a fallback for dev/testing
	const company = await getActiveCompany();
	const fallbackCompanyId = process.env.DEFAULT_COMPANY_ID;

	if (!company && !fallbackCompanyId) {
		throw new ActionError(
			"No active company found. Please select a company.",
			ERROR_CODES.AUTH_FORBIDDEN,
			403
		);
	}

	const companyId = company?.id || fallbackCompanyId!;

	return { user, companyId };
}

/**
 * Get User's Chat Sessions
 *
 * Returns all chat sessions for the authenticated user in their active company.
 *
 * @param params.search - Optional search query to filter chats by title
 * @param params.limit - Maximum number of chats to return (default: 50)
 * @returns ActionResult with array of ChatSession
 */
export async function getChats(params?: {
	search?: string;
	limit?: number;
}): Promise<ActionResult<ChatSession[]>> {
	return withErrorHandling(async () => {
		const { user, companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		const chats = await memory.getChats({
			userId: user.id,
			search: params?.search,
			limit: params?.limit ?? 50,
		});

		return chats;
	});
}

/**
 * Get a Single Chat Session
 *
 * Returns a specific chat session by ID, including message count.
 *
 * @param chatId - The chat ID to retrieve
 * @returns ActionResult with ChatSession or null
 */
export async function getChat(
	chatId: string
): Promise<ActionResult<ChatSession | null>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		const chat = await memory.getChat(chatId);
		return chat;
	});
}

/**
 * Get Chat with Messages
 *
 * Returns a chat session along with its messages.
 *
 * @param chatId - The chat ID to retrieve
 * @param messageLimit - Maximum messages to load (default: 50)
 * @returns ActionResult with ChatWithMessages or null
 */
export async function getChatWithMessages(
	chatId: string,
	messageLimit = 50
): Promise<ActionResult<ChatWithMessages | null>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		const chat = await memory.getChat(chatId);
		if (!chat) {
			return null;
		}

		const messages = await memory.getMessages<UIMessage>({
			chatId,
			limit: messageLimit,
		});

		return {
			...chat,
			messages,
		};
	});
}

/**
 * Create a New Chat Session
 *
 * Creates a new chat session for the authenticated user.
 *
 * @param title - Optional initial title (defaults to "New Chat")
 * @param providedChatId - Optional chat ID to use (for client-server sync)
 * @returns ActionResult with the created ChatSession
 */
export async function createChat(
	title?: string,
	providedChatId?: string
): Promise<ActionResult<ChatSession>> {
	return withErrorHandling(async () => {
		const { user, companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		// Use provided ID if valid UUID, otherwise generate new one
		const chatId = providedChatId && isValidUUID(providedChatId)
			? providedChatId
			: crypto.randomUUID();
		const now = new Date();

		const newChat: ChatSession = {
			chatId,
			userId: user.id,
			title: title || "New Chat",
			createdAt: now,
			updatedAt: now,
			messageCount: 0,
		};

		await memory.saveChat(newChat);

		revalidatePath("/dashboard/ai");

		return newChat;
	});
}

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str: string): boolean {
	return UUID_REGEX.test(str);
}

/**
 * Update Chat Title
 *
 * Updates the title of an existing chat session.
 *
 * @param chatId - The chat ID to update
 * @param title - The new title
 * @returns ActionResult indicating success
 */
export async function updateChatTitle(
	chatId: string,
	title: string
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		// Verify chat exists
		const chat = await memory.getChat(chatId);
		if (!chat) {
			throw new ActionError(
				"Chat not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404
			);
		}

		await memory.updateChatTitle(chatId, title);

		revalidatePath("/dashboard/ai");
	});
}

/**
 * Delete a Chat Session
 *
 * Deletes a chat session and all its associated messages and memory.
 *
 * @param chatId - The chat ID to delete
 * @returns ActionResult indicating success
 */
export async function deleteChat(chatId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		// Verify chat exists
		const chat = await memory.getChat(chatId);
		if (!chat) {
			throw new ActionError(
				"Chat not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404
			);
		}

		await memory.deleteChat(chatId);

		revalidatePath("/dashboard/ai");
	});
}

/**
 * Get Messages for a Chat
 *
 * Returns messages for a specific chat session in UIMessage format.
 *
 * @param chatId - The chat ID to get messages for
 * @param limit - Maximum messages to return (default: 50)
 * @returns ActionResult with array of UIMessage
 */
export async function getChatMessages(
	chatId: string,
	limit = 50
): Promise<ActionResult<UIMessage[]>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		const messages = await memory.getMessages<UIMessage>({
			chatId,
			limit,
		});

		return messages;
	});
}

/**
 * Generate Chat Title from First Message
 *
 * Uses AI to generate a concise title based on the first user message.
 * This is called automatically after the first assistant response.
 *
 * @param chatId - The chat ID to update
 * @param firstMessage - The first user message content
 * @returns ActionResult with the generated title
 */
export async function generateChatTitle(
	chatId: string,
	firstMessage: string
): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const { companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		// Verify chat exists
		const chat = await memory.getChat(chatId);
		if (!chat) {
			throw new ActionError(
				"Chat not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404
			);
		}

		// Generate title using AI
		const title = await generateTitleWithAI(firstMessage);

		await memory.updateChatTitle(chatId, title);

		revalidatePath("/dashboard/ai");

		return title;
	});
}

/**
 * Generate a title using AI
 *
 * Uses Groq (free) to generate a concise, descriptive title.
 * Falls back to simple truncation if Groq API key is unavailable.
 */
async function generateTitleWithAI(message: string): Promise<string> {
	try {
		// Use Groq (free tier with generous limits)
		if (!process.env.GROQ_API_KEY) {
			console.log("[generateChatTitle] No GROQ_API_KEY available, using fallback");
			return generateTitleFallback(message);
		}

		const model = createAIProvider({ provider: "groq", model: "llama-3.3-70b-versatile" });

		const { text: title } = await generateText({
			model,
			prompt: `Generate a very brief, descriptive title (3-6 words max) for a conversation that starts with this message. Return ONLY the title, no quotes or extra text.

Message: "${message.slice(0, 500)}"

Title:`,
			maxTokens: 30,
			temperature: 0.3,
		});

		// Clean up the title
		let cleanTitle = title
			.trim()
			.replace(/^["']|["']$/g, "") // Remove surrounding quotes
			.replace(/^Title:\s*/i, "") // Remove "Title:" prefix if AI added it
			.slice(0, 100); // Ensure max length

		// Capitalize first letter
		if (cleanTitle) {
			cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
		}

		// Fallback if AI returned empty or just "New Chat"
		if (!cleanTitle || cleanTitle === "New Chat") {
			return generateTitleFallback(message);
		}

		console.log("[generateChatTitle] Generated AI title:", cleanTitle);
		return cleanTitle;
	} catch (error) {
		console.error("[generateChatTitle] AI generation failed:", error);
		return generateTitleFallback(message);
	}
}

/**
 * Fallback title generation using simple string truncation
 */
function generateTitleFallback(message: string): string {
	// Remove extra whitespace and limit length
	const cleaned = message.trim().replace(/\s+/g, " ");

	// If message is short enough, use it directly
	if (cleaned.length <= 50) {
		// Capitalize first letter
		return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
	}

	// Otherwise, truncate at word boundary
	const truncated = cleaned.substring(0, 47);
	const lastSpace = truncated.lastIndexOf(" ");

	if (lastSpace > 20) {
		return truncated.substring(0, lastSpace) + "...";
	}

	return truncated + "...";
}

/**
 * Duplicate a Chat Session
 *
 * Creates a copy of an existing chat without messages.
 * Useful for starting a new conversation from an old one.
 *
 * @param chatId - The chat ID to duplicate
 * @returns ActionResult with the new ChatSession
 */
export async function duplicateChat(
	chatId: string
): Promise<ActionResult<ChatSession>> {
	return withErrorHandling(async () => {
		const { user, companyId } = await getUserContext();
		const memory = createSupabaseMemoryProvider(companyId);

		// Get original chat
		const originalChat = await memory.getChat(chatId);
		if (!originalChat) {
			throw new ActionError(
				"Chat not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404
			);
		}

		// Create new chat with same title (prefixed)
		const newChatId = crypto.randomUUID();
		const now = new Date();

		const newChat: ChatSession = {
			chatId: newChatId,
			userId: user.id,
			title: `Copy of ${originalChat.title}`,
			createdAt: now,
			updatedAt: now,
			messageCount: 0,
		};

		await memory.saveChat(newChat);

		revalidatePath("/dashboard/ai");

		return newChat;
	});
}
