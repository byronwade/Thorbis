/**
 * Memory Provider Tests
 *
 * Tests for Supabase-backed memory provider implementing MemoryProvider interface.
 * Covers working memory, message history, and chat session management.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Create chainable mock helper that properly supports method chaining
function createChainableMock(resolveValue: unknown = { data: null, error: null }) {
	const mock: Record<string, unknown> = {};

	// Make all methods return the same mock object for chaining
	const chainMethods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'lt', 'gt', 'gte', 'lte', 'in', 'ilike', 'order', 'range', 'limit'];
	chainMethods.forEach(method => {
		mock[method] = vi.fn().mockReturnValue(mock);
	});

	// Terminal methods that return promises
	mock.single = vi.fn().mockResolvedValue(resolveValue);
	mock.maybeSingle = vi.fn().mockResolvedValue(resolveValue);

	// Make the mock itself thenable for when chain ends without terminal method
	mock.then = vi.fn((resolve) => Promise.resolve(resolveValue).then(resolve));

	return mock;
}

// Mock Supabase service client
const mockSupabaseClient = {
	from: vi.fn(() => createChainableMock()),
};

vi.mock("@/lib/supabase/service-client", () => ({
	createServiceSupabaseClient: () => mockSupabaseClient,
}));

// Import after mocks
import {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "../memory-provider";

// =============================================================================
// TEST HELPERS
// =============================================================================

const mockCompanyId = "company-123";
const mockUserId = "user-456";
const mockChatId = "chat-abc";

function resetMocks() {
	vi.clearAllMocks();
}

function createMockMemoryProvider() {
	return createSupabaseMemoryProvider(mockCompanyId);
}

// =============================================================================
// WORKING MEMORY TESTS
// =============================================================================

describe("Supabase Memory Provider", () => {
	beforeEach(() => {
		resetMocks();
	});

	describe("Working Memory", () => {
		it("should get working memory for chat scope", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockReturnValue(mockQuery);
			mockQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					content: "# Working Memory\n\nUser prefers morning appointments",
					updated_at: "2024-01-15T10:00:00.000Z",
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			const memory = await provider.getWorkingMemory({
				chatId: mockChatId,
				scope: "chat",
			});

			expect(memory).not.toBeNull();
			expect(memory?.content).toContain("User prefers morning appointments");
			expect(memory?.updatedAt).toBeInstanceOf(Date);
		});

		it("should get working memory for user scope", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockReturnValue(mockQuery);
			mockQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					content: "Global user preferences",
					updated_at: "2024-01-15T10:00:00.000Z",
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			const memory = await provider.getWorkingMemory({
				userId: mockUserId,
				scope: "user",
			});

			expect(memory).not.toBeNull();
			expect(memory?.content).toBe("Global user preferences");
		});

		it("should return null when no working memory exists", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockReturnValue(mockQuery);
			mockQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Not found" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			const memory = await provider.getWorkingMemory({
				chatId: mockChatId,
				scope: "chat",
			});

			expect(memory).toBeNull();
		});

		it("should update existing working memory", async () => {
			// Mock check for existing memory
			const mockCheckQuery: Record<string, unknown> = {};
			mockCheckQuery.select = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.eq = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.single = vi.fn().mockResolvedValueOnce({
				data: { id: "memory-123" },
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockCheckQuery);

			// Mock update
			const mockUpdateQuery: Record<string, unknown> = {};
			mockUpdateQuery.update = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockUpdateQuery);

			const provider = createMockMemoryProvider();
			await provider.updateWorkingMemory({
				chatId: mockChatId,
				scope: "chat",
				content: "Updated working memory content",
			});

			expect(mockUpdateQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					content: "Updated working memory content",
				})
			);
		});

		it("should create new working memory when none exists", async () => {
			// Mock check for existing memory - none found
			const mockCheckQuery: Record<string, unknown> = {};
			mockCheckQuery.select = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.eq = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockCheckQuery);

			// Mock insert
			const mockInsertQuery: Record<string, unknown> = {};
			mockInsertQuery.insert = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const provider = createMockMemoryProvider();
			await provider.updateWorkingMemory({
				chatId: mockChatId,
				userId: mockUserId,
				scope: "chat",
				content: "New working memory content",
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					company_id: mockCompanyId,
					user_id: mockUserId,
					memory_type: "conversation_summary",
					content: "New working memory content",
					source_chat_id: mockChatId,
					is_active: true,
				})
			);
		});
	});

	// =============================================================================
	// MESSAGE HISTORY TESTS
	// =============================================================================

	describe("Message History", () => {
		it("should save message with text content", async () => {
			const mockInsertQuery: Record<string, unknown> = {};
			mockInsertQuery.insert = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const provider = createMockMemoryProvider();
			await provider.saveMessage({
				chatId: mockChatId,
				userId: mockUserId,
				role: "user",
				content: "Hello, how are you?",
				timestamp: new Date("2024-01-15T10:00:00.000Z"),
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					chat_id: mockChatId,
					role: "user",
					parts: [{ type: "text", text: "Hello, how are you?" }],
					attachments: [],
				})
			);
		});

		it("should save message with parts array content", async () => {
			const mockInsertQuery: Record<string, unknown> = {};
			mockInsertQuery.insert = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const parts = [
				{ type: "text", text: "Here is the image:" },
				{ type: "image", url: "https://example.com/image.png" },
			];

			const provider = createMockMemoryProvider();
			await provider.saveMessage({
				chatId: mockChatId,
				userId: mockUserId,
				role: "assistant",
				content: parts,
				timestamp: new Date(),
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					parts,
				})
			);
		});

		it("should get messages in chronological order", async () => {
			const mockMessages = [
				{
					id: "msg-1",
					role: "user",
					parts: [{ type: "text", text: "Hi" }],
					attachments: [],
					created_at: "2024-01-15T10:00:00.000Z",
				},
				{
					id: "msg-2",
					role: "assistant",
					parts: [{ type: "text", text: "Hello! How can I help?" }],
					attachments: [],
					created_at: "2024-01-15T10:00:05.000Z",
				},
			];

			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockResolvedValueOnce({ data: mockMessages, error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			const messages = await provider.getMessages({ chatId: mockChatId });

			expect(messages).toHaveLength(2);
			expect(messages[0].id).toBe("msg-1");
			expect(messages[0].content).toBe("Hi");
			expect(messages[1].content).toBe("Hello! How can I help?");
		});

		it("should respect message limit", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockResolvedValueOnce({ data: [], error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			await provider.getMessages({ chatId: mockChatId, limit: 10 });

			expect(mockQuery.limit).toHaveBeenCalledWith(10);
		});

		it("should return empty array on error", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Query error" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			const messages = await provider.getMessages({ chatId: mockChatId });

			expect(messages).toEqual([]);
		});
	});

	// =============================================================================
	// CHAT SESSION TESTS
	// =============================================================================

	describe("Chat Sessions", () => {
		it("should create new chat session", async () => {
			// Mock check for existing chat - none found
			const mockCheckQuery: Record<string, unknown> = {};
			mockCheckQuery.select = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.eq = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockCheckQuery);

			// Mock insert
			const mockInsertQuery: Record<string, unknown> = {};
			mockInsertQuery.insert = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const provider = createMockMemoryProvider();
			await provider.saveChat({
				chatId: mockChatId,
				userId: mockUserId,
				title: "Customer Support Chat",
				createdAt: new Date("2024-01-15T10:00:00.000Z"),
				updatedAt: new Date("2024-01-15T10:00:00.000Z"),
				messageCount: 0,
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					id: mockChatId,
					user_id: mockUserId,
					company_id: mockCompanyId,
					title: "Customer Support Chat",
					visibility: "private",
				})
			);
		});

		it("should update existing chat session", async () => {
			// Mock check for existing chat
			const mockCheckQuery: Record<string, unknown> = {};
			mockCheckQuery.select = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.eq = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.single = vi.fn().mockResolvedValueOnce({
				data: { id: mockChatId },
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockCheckQuery);

			// Mock update
			const mockUpdateQuery: Record<string, unknown> = {};
			mockUpdateQuery.update = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockUpdateQuery);

			const provider = createMockMemoryProvider();
			await provider.saveChat({
				chatId: mockChatId,
				userId: mockUserId,
				title: "Updated Title",
				createdAt: new Date(),
				updatedAt: new Date(),
				messageCount: 5,
			});

			expect(mockUpdateQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Updated Title",
				})
			);
		});

		it("should get chat sessions for user with search", async () => {
			const mockChats = [
				{
					id: "chat-1",
					user_id: mockUserId,
					title: "HVAC Repair Discussion",
					created_at: "2024-01-15T10:00:00.000Z",
					visibility: "private",
				},
			];

			// Mock chats query - limit returns the mock for continued chaining
			const mockChatsQuery: Record<string, unknown> = {};
			mockChatsQuery.select = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.eq = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.ilike = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.order = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.limit = vi.fn().mockReturnValue(mockChatsQuery);
			// Make thenable so await query works
			mockChatsQuery.then = vi.fn((resolve) => Promise.resolve({ data: mockChats, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockChatsQuery);

			// Mock message counts query
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.in = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({
				data: [{ chat_id: "chat-1" }, { chat_id: "chat-1" }, { chat_id: "chat-1" }],
				error: null,
			}).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			const provider = createMockMemoryProvider();
			const chats = await provider.getChats({
				userId: mockUserId,
				search: "HVAC",
			});

			expect(chats).toHaveLength(1);
			expect(chats[0].title).toBe("HVAC Repair Discussion");
			expect(chats[0].messageCount).toBe(3);
			expect(mockChatsQuery.ilike).toHaveBeenCalledWith("title", "%HVAC%");
		});

		it("should get single chat with message count", async () => {
			// Mock chat query - use thenable pattern for chained eq calls
			const mockChatQuery: Record<string, unknown> = {};
			mockChatQuery.select = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.eq = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockChatId,
					user_id: mockUserId,
					title: "Test Chat",
					created_at: "2024-01-15T10:00:00.000Z",
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockChatQuery);

			// Mock message count query - also needs thenable pattern
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.eq = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({ count: 10, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			const provider = createMockMemoryProvider();
			const chat = await provider.getChat(mockChatId);

			expect(chat).not.toBeNull();
			expect(chat?.chatId).toBe(mockChatId);
			expect(chat?.title).toBe("Test Chat");
			expect(chat?.messageCount).toBe(10);
		});

		it("should return null for non-existent chat", async () => {
			const mockChatQuery: Record<string, unknown> = {};
			mockChatQuery.select = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.eq = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: { message: "Not found" },
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockChatQuery);

			const provider = createMockMemoryProvider();
			const chat = await provider.getChat("non-existent");

			expect(chat).toBeNull();
		});

		it("should update chat title", async () => {
			const mockUpdateQuery: Record<string, unknown> = {};
			mockUpdateQuery.update = vi.fn().mockReturnValue(mockUpdateQuery);
			mockUpdateQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockUpdateQuery);

			const provider = createMockMemoryProvider();
			await provider.updateChatTitle(mockChatId, "New Chat Title");

			expect(mockUpdateQuery.update).toHaveBeenCalledWith({ title: "New Chat Title" });
		});

		it("should delete chat with messages and working memory", async () => {
			// Mock delete messages
			const mockDeleteMsgsQuery: Record<string, unknown> = {};
			mockDeleteMsgsQuery.delete = vi.fn().mockReturnValue(mockDeleteMsgsQuery);
			mockDeleteMsgsQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockDeleteMsgsQuery);

			// Mock deactivate working memory
			const mockDeactivateQuery: Record<string, unknown> = {};
			mockDeactivateQuery.update = vi.fn().mockReturnValue(mockDeactivateQuery);
			mockDeactivateQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockDeactivateQuery);

			// Mock delete chat
			const mockDeleteChatQuery: Record<string, unknown> = {};
			mockDeleteChatQuery.delete = vi.fn().mockReturnValue(mockDeleteChatQuery);
			mockDeleteChatQuery.eq = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockDeleteChatQuery);

			const provider = createMockMemoryProvider();
			await provider.deleteChat(mockChatId);

			// Verify all deletions were called
			expect(mockDeleteMsgsQuery.delete).toHaveBeenCalled();
			expect(mockDeactivateQuery.update).toHaveBeenCalledWith(
				expect.objectContaining({
					is_active: false,
				})
			);
			expect(mockDeleteChatQuery.delete).toHaveBeenCalled();
		});
	});

	// =============================================================================
	// DEFAULT TEMPLATE TESTS
	// =============================================================================

	describe("Default Working Memory Template", () => {
		it("should have required sections", () => {
			expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("# Working Memory");
			expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("## Key Facts");
			expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("## Current Focus");
			expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("## Preferences");
			expect(DEFAULT_WORKING_MEMORY_TEMPLATE).toContain("## Business Context");
		});
	});

	// =============================================================================
	// EDGE CASE TESTS
	// =============================================================================

	describe("Edge Cases", () => {
		it("should handle empty chat list", async () => {
			// Mock chats query - limit returns mock for chaining (.eq/.ilike may follow)
			const mockChatsQuery: Record<string, unknown> = {};
			mockChatsQuery.select = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.eq = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.order = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.limit = vi.fn().mockReturnValue(mockChatsQuery);
			mockChatsQuery.ilike = vi.fn().mockReturnValue(mockChatsQuery);
			// Make thenable so await query works
			mockChatsQuery.then = vi.fn((resolve) => Promise.resolve({ data: [], error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockChatsQuery);

			// Mock message counts query (empty) - in() is followed by await, needs thenable
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.in = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({ data: [], error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			const provider = createMockMemoryProvider();
			const chats = await provider.getChats({ userId: mockUserId });

			expect(chats).toEqual([]);
		});

		it("should handle chat with no messages", async () => {
			// Mock chat query
			const mockChatQuery: Record<string, unknown> = {};
			mockChatQuery.select = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.eq = vi.fn().mockReturnValue(mockChatQuery);
			mockChatQuery.single = vi.fn().mockResolvedValueOnce({
				data: {
					id: mockChatId,
					user_id: mockUserId,
					title: "Empty Chat",
					created_at: "2024-01-15T10:00:00.000Z",
				},
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockChatQuery);

			// Mock message count query - no messages, awaited directly after .eq()
			const mockCountQuery: Record<string, unknown> = {};
			mockCountQuery.select = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.eq = vi.fn().mockReturnValue(mockCountQuery);
			mockCountQuery.then = vi.fn((resolve) => Promise.resolve({ count: 0, error: null }).then(resolve));
			mockSupabaseClient.from.mockReturnValueOnce(mockCountQuery);

			const provider = createMockMemoryProvider();
			const chat = await provider.getChat(mockChatId);

			expect(chat?.messageCount).toBe(0);
		});

		it("should use default title when none provided", async () => {
			// Mock check for existing chat - none found
			const mockCheckQuery: Record<string, unknown> = {};
			mockCheckQuery.select = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.eq = vi.fn().mockReturnValue(mockCheckQuery);
			mockCheckQuery.single = vi.fn().mockResolvedValueOnce({
				data: null,
				error: null,
			});
			mockSupabaseClient.from.mockReturnValueOnce(mockCheckQuery);

			// Mock insert
			const mockInsertQuery: Record<string, unknown> = {};
			mockInsertQuery.insert = vi.fn().mockResolvedValueOnce({ error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockInsertQuery);

			const provider = createMockMemoryProvider();
			await provider.saveChat({
				chatId: mockChatId,
				userId: mockUserId,
				title: undefined as unknown as string, // No title
				createdAt: new Date(),
				updatedAt: new Date(),
				messageCount: 0,
			});

			expect(mockInsertQuery.insert).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "New Chat",
				})
			);
		});

		it("should use default limit for messages", async () => {
			const mockQuery: Record<string, unknown> = {};
			mockQuery.select = vi.fn().mockReturnValue(mockQuery);
			mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
			mockQuery.order = vi.fn().mockReturnValue(mockQuery);
			mockQuery.limit = vi.fn().mockResolvedValueOnce({ data: [], error: null });
			mockSupabaseClient.from.mockReturnValueOnce(mockQuery);

			const provider = createMockMemoryProvider();
			await provider.getMessages({ chatId: mockChatId }); // No limit specified

			expect(mockQuery.limit).toHaveBeenCalledWith(20); // Default limit
		});
	});
});
