/**
 * Chats Server Actions Tests
 *
 * Tests for AI chat session server actions.
 * Covers CRUD operations, authentication, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock next/cache
vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

// Mock memory provider
const mockMemoryProvider = {
	getChats: vi.fn(),
	getChat: vi.fn(),
	getMessages: vi.fn(),
	saveChat: vi.fn(),
	updateChatTitle: vi.fn(),
	deleteChat: vi.fn(),
};

vi.mock("@/lib/ai/memory-provider", () => ({
	createSupabaseMemoryProvider: () => mockMemoryProvider,
}));

// Mock auth/company context
const mockUser = { id: "user-123", email: "test@example.com" };
const mockCompany = { id: "company-456", name: "Test Company" };

vi.mock("@/lib/auth/company-context", () => ({
	getActiveCompany: vi.fn(() => Promise.resolve(mockCompany)),
}));

// Mock Supabase client
const mockSupabaseClient = {
	auth: {
		getUser: vi.fn(() => Promise.resolve({ data: { user: mockUser }, error: null })),
	},
};

vi.mock("@/lib/supabase/server", () => ({
	createClient: () => Promise.resolve(mockSupabaseClient),
}));

// Import after mocks
import { revalidatePath } from "next/cache";
import { getActiveCompany } from "@/lib/auth/company-context";
import {
	getChats,
	getChat,
	getChatWithMessages,
	createChat,
	updateChatTitle,
	deleteChat,
	getChatMessages,
	generateChatTitle,
	duplicateChat,
} from "../chats";

// =============================================================================
// TEST HELPERS
// =============================================================================

const mockChatId = "chat-abc-123";
const mockUserId = "user-123";

function createMockChatSession(overrides?: Record<string, unknown>) {
	return {
		chatId: mockChatId,
		userId: mockUserId,
		title: "Test Chat",
		createdAt: new Date("2024-01-15T10:00:00.000Z"),
		updatedAt: new Date("2024-01-15T10:00:00.000Z"),
		messageCount: 5,
		...overrides,
	};
}

function createMockMessage(id: string, role: "user" | "assistant" = "user") {
	return {
		id,
		role,
		content: `Message ${id}`,
		createdAt: new Date(),
	};
}

function resetMocks() {
	vi.clearAllMocks();
	// Reset auth to success by default
	mockSupabaseClient.auth.getUser.mockResolvedValue({
		data: { user: mockUser },
		error: null,
	});
	(getActiveCompany as ReturnType<typeof vi.fn>).mockResolvedValue(mockCompany);
}

// =============================================================================
// GET CHATS TESTS
// =============================================================================

describe("Chat Server Actions", () => {
	beforeEach(() => {
		resetMocks();
	});

	describe("getChats", () => {
		it("should return user chats successfully", async () => {
			const mockChats = [
				createMockChatSession({ chatId: "chat-1", title: "Chat 1" }),
				createMockChatSession({ chatId: "chat-2", title: "Chat 2" }),
			];
			mockMemoryProvider.getChats.mockResolvedValueOnce(mockChats);

			const result = await getChats();

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(2);
			expect(mockMemoryProvider.getChats).toHaveBeenCalledWith({
				userId: mockUserId,
				search: undefined,
				limit: 50,
			});
		});

		it("should support search filter", async () => {
			mockMemoryProvider.getChats.mockResolvedValueOnce([]);

			await getChats({ search: "HVAC" });

			expect(mockMemoryProvider.getChats).toHaveBeenCalledWith(
				expect.objectContaining({ search: "HVAC" })
			);
		});

		it("should support custom limit", async () => {
			mockMemoryProvider.getChats.mockResolvedValueOnce([]);

			await getChats({ limit: 10 });

			expect(mockMemoryProvider.getChats).toHaveBeenCalledWith(
				expect.objectContaining({ limit: 10 })
			);
		});

		it("should handle unauthorized user", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
				data: { user: null },
				error: { message: "Not authenticated" },
			});

			const result = await getChats();

			expect(result.success).toBe(false);
			expect(result.error).toContain("logged in");
		});

		it("should handle missing company", async () => {
			(getActiveCompany as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

			const result = await getChats();

			expect(result.success).toBe(false);
			expect(result.error).toContain("company");
		});
	});

	// =============================================================================
	// GET SINGLE CHAT TESTS
	// =============================================================================

	describe("getChat", () => {
		it("should return chat by ID", async () => {
			const mockChat = createMockChatSession();
			mockMemoryProvider.getChat.mockResolvedValueOnce(mockChat);

			const result = await getChat(mockChatId);

			expect(result.success).toBe(true);
			expect(result.data?.chatId).toBe(mockChatId);
		});

		it("should return null for non-existent chat", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await getChat("non-existent");

			expect(result.success).toBe(true);
			expect(result.data).toBeNull();
		});
	});

	// =============================================================================
	// GET CHAT WITH MESSAGES TESTS
	// =============================================================================

	describe("getChatWithMessages", () => {
		it("should return chat with messages", async () => {
			const mockChat = createMockChatSession();
			const mockMessages = [
				createMockMessage("msg-1", "user"),
				createMockMessage("msg-2", "assistant"),
			];

			mockMemoryProvider.getChat.mockResolvedValueOnce(mockChat);
			mockMemoryProvider.getMessages.mockResolvedValueOnce(mockMessages);

			const result = await getChatWithMessages(mockChatId);

			expect(result.success).toBe(true);
			expect(result.data?.chatId).toBe(mockChatId);
			expect(result.data?.messages).toHaveLength(2);
		});

		it("should return null if chat not found", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await getChatWithMessages("non-existent");

			expect(result.success).toBe(true);
			expect(result.data).toBeNull();
			expect(mockMemoryProvider.getMessages).not.toHaveBeenCalled();
		});

		it("should respect message limit", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.getMessages.mockResolvedValueOnce([]);

			await getChatWithMessages(mockChatId, 10);

			expect(mockMemoryProvider.getMessages).toHaveBeenCalledWith(
				expect.objectContaining({ limit: 10 })
			);
		});
	});

	// =============================================================================
	// CREATE CHAT TESTS
	// =============================================================================

	describe("createChat", () => {
		it("should create new chat with default title", async () => {
			mockMemoryProvider.saveChat.mockResolvedValueOnce(undefined);

			const result = await createChat();

			expect(result.success).toBe(true);
			expect(result.data?.title).toBe("New Chat");
			expect(result.data?.userId).toBe(mockUserId);
			expect(result.data?.messageCount).toBe(0);
			expect(revalidatePath).toHaveBeenCalledWith("/dashboard/ai");
		});

		it("should create chat with custom title", async () => {
			mockMemoryProvider.saveChat.mockResolvedValueOnce(undefined);

			const result = await createChat("Customer Support");

			expect(result.success).toBe(true);
			expect(result.data?.title).toBe("Customer Support");
		});

		it("should generate unique chat ID", async () => {
			mockMemoryProvider.saveChat.mockResolvedValueOnce(undefined);

			const result1 = await createChat();
			const result2 = await createChat();

			expect(result1.data?.chatId).not.toBe(result2.data?.chatId);
		});
	});

	// =============================================================================
	// UPDATE CHAT TITLE TESTS
	// =============================================================================

	describe("updateChatTitle", () => {
		it("should update chat title", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.updateChatTitle.mockResolvedValueOnce(undefined);

			const result = await updateChatTitle(mockChatId, "Updated Title");

			expect(result.success).toBe(true);
			expect(mockMemoryProvider.updateChatTitle).toHaveBeenCalledWith(
				mockChatId,
				"Updated Title"
			);
			expect(revalidatePath).toHaveBeenCalledWith("/dashboard/ai");
		});

		it("should fail if chat not found", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await updateChatTitle("non-existent", "Title");

			expect(result.success).toBe(false);
			expect(result.error).toContain("not found");
			expect(mockMemoryProvider.updateChatTitle).not.toHaveBeenCalled();
		});
	});

	// =============================================================================
	// DELETE CHAT TESTS
	// =============================================================================

	describe("deleteChat", () => {
		it("should delete chat", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.deleteChat.mockResolvedValueOnce(undefined);

			const result = await deleteChat(mockChatId);

			expect(result.success).toBe(true);
			expect(mockMemoryProvider.deleteChat).toHaveBeenCalledWith(mockChatId);
			expect(revalidatePath).toHaveBeenCalledWith("/dashboard/ai");
		});

		it("should fail if chat not found", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await deleteChat("non-existent");

			expect(result.success).toBe(false);
			expect(result.error).toContain("not found");
			expect(mockMemoryProvider.deleteChat).not.toHaveBeenCalled();
		});
	});

	// =============================================================================
	// GET MESSAGES TESTS
	// =============================================================================

	describe("getChatMessages", () => {
		it("should return messages for chat", async () => {
			const mockMessages = [
				createMockMessage("msg-1", "user"),
				createMockMessage("msg-2", "assistant"),
				createMockMessage("msg-3", "user"),
			];
			mockMemoryProvider.getMessages.mockResolvedValueOnce(mockMessages);

			const result = await getChatMessages(mockChatId);

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(3);
		});

		it("should use default limit of 50", async () => {
			mockMemoryProvider.getMessages.mockResolvedValueOnce([]);

			await getChatMessages(mockChatId);

			expect(mockMemoryProvider.getMessages).toHaveBeenCalledWith(
				expect.objectContaining({ limit: 50 })
			);
		});

		it("should support custom limit", async () => {
			mockMemoryProvider.getMessages.mockResolvedValueOnce([]);

			await getChatMessages(mockChatId, 100);

			expect(mockMemoryProvider.getMessages).toHaveBeenCalledWith(
				expect.objectContaining({ limit: 100 })
			);
		});
	});

	// =============================================================================
	// GENERATE TITLE TESTS
	// =============================================================================

	describe("generateChatTitle", () => {
		it("should generate title from short message", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.updateChatTitle.mockResolvedValueOnce(undefined);

			const result = await generateChatTitle(mockChatId, "fix my AC unit");

			expect(result.success).toBe(true);
			expect(result.data).toBe("Fix my AC unit"); // Capitalized
		});

		it("should truncate long messages", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.updateChatTitle.mockResolvedValueOnce(undefined);

			const longMessage = "I need help with my HVAC system because it's been making a weird noise and not cooling properly for the past few weeks";

			const result = await generateChatTitle(mockChatId, longMessage);

			expect(result.success).toBe(true);
			expect(result.data!.length).toBeLessThanOrEqual(50);
			expect(result.data).toContain("...");
		});

		it("should fail if chat not found", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await generateChatTitle("non-existent", "message");

			expect(result.success).toBe(false);
			expect(result.error).toContain("not found");
		});

		it("should clean extra whitespace", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.updateChatTitle.mockResolvedValueOnce(undefined);

			const result = await generateChatTitle(mockChatId, "  fix   my   AC  ");

			expect(result.success).toBe(true);
			expect(result.data).toBe("Fix my AC");
		});
	});

	// =============================================================================
	// DUPLICATE CHAT TESTS
	// =============================================================================

	describe("duplicateChat", () => {
		it("should duplicate chat with prefixed title", async () => {
			const originalChat = createMockChatSession({ title: "Original Chat" });
			mockMemoryProvider.getChat.mockResolvedValueOnce(originalChat);
			mockMemoryProvider.saveChat.mockResolvedValueOnce(undefined);

			const result = await duplicateChat(mockChatId);

			expect(result.success).toBe(true);
			expect(result.data?.title).toBe("Copy of Original Chat");
			expect(result.data?.chatId).not.toBe(mockChatId);
			expect(result.data?.messageCount).toBe(0);
		});

		it("should fail if original chat not found", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(null);

			const result = await duplicateChat("non-existent");

			expect(result.success).toBe(false);
			expect(result.error).toContain("not found");
			expect(mockMemoryProvider.saveChat).not.toHaveBeenCalled();
		});

		it("should create chat for same user", async () => {
			mockMemoryProvider.getChat.mockResolvedValueOnce(createMockChatSession());
			mockMemoryProvider.saveChat.mockResolvedValueOnce(undefined);

			const result = await duplicateChat(mockChatId);

			expect(result.data?.userId).toBe(mockUserId);
		});
	});

	// =============================================================================
	// ERROR HANDLING TESTS
	// =============================================================================

	describe("Error Handling", () => {
		it("should handle memory provider errors", async () => {
			mockMemoryProvider.getChats.mockRejectedValueOnce(new Error("Database error"));

			const result = await getChats();

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});

		it("should handle database connection failure", async () => {
			vi.doMock("@/lib/supabase/server", () => ({
				createClient: () => Promise.resolve(null),
			}));

			// This would require re-importing, which is complex in vitest
			// For now, we test that auth errors are handled
			mockSupabaseClient.auth.getUser.mockRejectedValueOnce(
				new Error("Connection failed")
			);

			const result = await getChats();

			expect(result.success).toBe(false);
		});
	});
});
