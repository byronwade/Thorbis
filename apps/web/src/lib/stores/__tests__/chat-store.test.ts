/**
 * Chat Store Tests
 *
 * Tests for Zustand chat state management.
 * Covers chat CRUD, message management, and UI state.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore, chatSelectors, type Message, type Chat } from "../chat-store";

// =============================================================================
// TEST HELPERS
// =============================================================================

const createTestMessage = (id: string, role: "user" | "assistant" = "user"): Message => ({
	id,
	role,
	content: `Test message ${id}`,
	timestamp: new Date(),
});

const resetStore = () => {
	useChatStore.getState().reset();
};

// =============================================================================
// CHAT MANAGEMENT TESTS
// =============================================================================

describe("Chat Store", () => {
	beforeEach(() => {
		resetStore();
	});

	describe("Chat Creation", () => {
		it("should create a new chat with default title", () => {
			const chatId = useChatStore.getState().createChat();

			expect(chatId).toBeDefined();
			expect(chatId).toContain("chat-");
			expect(useChatStore.getState().chats.length).toBe(1);
			expect(useChatStore.getState().chats[0].title).toBe("New Chat");
		});

		it("should create a chat with custom title", () => {
			const chatId = useChatStore.getState().createChat("Customer Support Chat");

			expect(useChatStore.getState().chats[0].title).toBe("Customer Support Chat");
		});

		it("should set new chat as active", () => {
			const chatId = useChatStore.getState().createChat();

			expect(useChatStore.getState().activeChatId).toBe(chatId);
		});

		it("should generate unique IDs for multiple chats", () => {
			const id1 = useChatStore.getState().createChat("Chat 1");
			const id2 = useChatStore.getState().createChat("Chat 2");
			const id3 = useChatStore.getState().createChat("Chat 3");

			expect(id1).not.toBe(id2);
			expect(id2).not.toBe(id3);
			expect(useChatStore.getState().chats.length).toBe(3);
		});

		it("should initialize chat with empty messages array", () => {
			const chatId = useChatStore.getState().createChat();
			const chat = useChatStore.getState().chats.find((c) => c.id === chatId);

			expect(chat?.messages).toEqual([]);
		});

		it("should set createdAt timestamp on new chat", () => {
			const before = new Date();
			const chatId = useChatStore.getState().createChat();
			const after = new Date();

			const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
			expect(chat?.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
			expect(chat?.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
		});
	});

	describe("Chat Deletion", () => {
		it("should delete a chat by ID", () => {
			const chatId = useChatStore.getState().createChat();
			expect(useChatStore.getState().chats.length).toBe(1);

			useChatStore.getState().deleteChat(chatId);
			expect(useChatStore.getState().chats.length).toBe(0);
		});

		it("should switch active chat to first remaining when active is deleted", () => {
			const id1 = useChatStore.getState().createChat("Chat 1");
			const id2 = useChatStore.getState().createChat("Chat 2");

			// Chat 2 is now active
			expect(useChatStore.getState().activeChatId).toBe(id2);

			// Delete chat 2
			useChatStore.getState().deleteChat(id2);

			// Should switch to chat 1
			expect(useChatStore.getState().activeChatId).toBe(id1);
		});

		it("should set activeChatId to null when last chat is deleted", () => {
			const chatId = useChatStore.getState().createChat();
			useChatStore.getState().deleteChat(chatId);

			expect(useChatStore.getState().activeChatId).toBeNull();
		});

		it("should not affect active chat when deleting inactive chat", () => {
			const id1 = useChatStore.getState().createChat("Chat 1");
			const id2 = useChatStore.getState().createChat("Chat 2");

			// Chat 2 is active, delete chat 1
			useChatStore.getState().deleteChat(id1);

			expect(useChatStore.getState().activeChatId).toBe(id2);
		});

		it("should do nothing when deleting non-existent chat", () => {
			useChatStore.getState().createChat();
			useChatStore.getState().deleteChat("non-existent-id");

			expect(useChatStore.getState().chats.length).toBe(1);
		});
	});

	describe("Active Chat Management", () => {
		it("should set active chat", () => {
			const id1 = useChatStore.getState().createChat("Chat 1");
			const id2 = useChatStore.getState().createChat("Chat 2");

			useChatStore.getState().setActiveChat(id1);
			expect(useChatStore.getState().activeChatId).toBe(id1);
		});

		it("should allow setting active chat to null", () => {
			useChatStore.getState().createChat();
			useChatStore.getState().setActiveChat(null);

			expect(useChatStore.getState().activeChatId).toBeNull();
		});

		it("should get active chat using getActiveChat()", () => {
			const chatId = useChatStore.getState().createChat("My Chat");
			const activeChat = useChatStore.getState().getActiveChat();

			expect(activeChat).not.toBeNull();
			expect(activeChat?.id).toBe(chatId);
			expect(activeChat?.title).toBe("My Chat");
		});

		it("should return null for getActiveChat() when no active chat", () => {
			const activeChat = useChatStore.getState().getActiveChat();
			expect(activeChat).toBeNull();
		});
	});

	describe("Chat Title Updates", () => {
		it("should update chat title", () => {
			const chatId = useChatStore.getState().createChat("Original Title");
			useChatStore.getState().updateChatTitle(chatId, "Updated Title");

			const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
			expect(chat?.title).toBe("Updated Title");
		});

		it("should not update title for non-existent chat", () => {
			const chatId = useChatStore.getState().createChat("Original");
			useChatStore.getState().updateChatTitle("non-existent", "New Title");

			const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
			expect(chat?.title).toBe("Original");
		});
	});

	describe("Duplicate Chat Cleanup", () => {
		it("should remove duplicate chats keeping first occurrence", () => {
			// Manually create duplicate scenario by manipulating state
			const store = useChatStore.getState();
			const chatId = store.createChat("Chat 1");

			// Force duplicate by directly modifying (simulating a bug)
			useChatStore.setState((state) => ({
				...state,
				chats: [
					...state.chats,
					{ id: chatId, title: "Duplicate", createdAt: new Date(), messages: [] },
				],
			}));

			expect(useChatStore.getState().chats.length).toBe(2);

			useChatStore.getState().cleanupDuplicateChats();

			expect(useChatStore.getState().chats.length).toBe(1);
			expect(useChatStore.getState().chats[0].title).toBe("Chat 1");
		});
	});

	// =============================================================================
	// MESSAGE MANAGEMENT TESTS
	// =============================================================================

	describe("Message Management", () => {
		let chatId: string;

		beforeEach(() => {
			chatId = useChatStore.getState().createChat();
		});

		it("should add message to chat", () => {
			const message = createTestMessage("msg-1", "user");
			useChatStore.getState().addMessage(chatId, message);

			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages.length).toBe(1);
			expect(messages[0].content).toBe("Test message msg-1");
		});

		it("should add multiple messages maintaining order", () => {
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1", "user"));
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-2", "assistant"));
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-3", "user"));

			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages.length).toBe(3);
			expect(messages[0].id).toBe("msg-1");
			expect(messages[1].id).toBe("msg-2");
			expect(messages[2].id).toBe("msg-3");
		});

		it("should update message content", () => {
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1"));
			useChatStore.getState().updateMessage(chatId, "msg-1", "Updated content");

			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages[0].content).toBe("Updated content");
		});

		it("should delete message by ID", () => {
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1"));
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-2"));

			useChatStore.getState().deleteMessage(chatId, "msg-1");

			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages.length).toBe(1);
			expect(messages[0].id).toBe("msg-2");
		});

		it("should clear all messages from chat", () => {
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1"));
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-2"));

			useChatStore.getState().clearMessages(chatId);

			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages.length).toBe(0);
		});

		it("should return empty array for getChatMessages with invalid chatId", () => {
			const messages = useChatStore.getState().getChatMessages("invalid-id");
			expect(messages).toEqual([]);
		});

		it("should not add message to non-existent chat", () => {
			useChatStore.getState().addMessage("invalid-id", createTestMessage("msg-1"));

			// Original chat should have no messages
			const messages = useChatStore.getState().getChatMessages(chatId);
			expect(messages.length).toBe(0);
		});
	});

	// =============================================================================
	// UI STATE TESTS
	// =============================================================================

	describe("UI State", () => {
		it("should set loading state", () => {
			expect(useChatStore.getState().isLoading).toBe(false);

			useChatStore.getState().setLoading(true);
			expect(useChatStore.getState().isLoading).toBe(true);

			useChatStore.getState().setLoading(false);
			expect(useChatStore.getState().isLoading).toBe(false);
		});

		it("should set error state", () => {
			expect(useChatStore.getState().error).toBeNull();

			useChatStore.getState().setError("Something went wrong");
			expect(useChatStore.getState().error).toBe("Something went wrong");

			useChatStore.getState().setError(null);
			expect(useChatStore.getState().error).toBeNull();
		});
	});

	// =============================================================================
	// RESET TESTS
	// =============================================================================

	describe("Store Reset", () => {
		it("should reset to initial state", () => {
			// Create some state
			const chatId = useChatStore.getState().createChat();
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1"));
			useChatStore.getState().setLoading(true);
			useChatStore.getState().setError("Error");

			// Reset
			useChatStore.getState().reset();

			const state = useChatStore.getState();
			expect(state.chats).toEqual([]);
			expect(state.activeChatId).toBeNull();
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});
	});

	// =============================================================================
	// SELECTOR TESTS
	// =============================================================================

	describe("Selectors", () => {
		it("should select all chats", () => {
			useChatStore.getState().createChat("Chat 1");
			useChatStore.getState().createChat("Chat 2");

			const chats = chatSelectors.chats(useChatStore.getState());
			expect(chats.length).toBe(2);
		});

		it("should select active chat", () => {
			useChatStore.getState().createChat("My Active Chat");

			const activeChat = chatSelectors.activeChat(useChatStore.getState());
			expect(activeChat?.title).toBe("My Active Chat");
		});

		it("should return null when no active chat", () => {
			const activeChat = chatSelectors.activeChat(useChatStore.getState());
			expect(activeChat).toBeNull();
		});

		it("should select active chat ID", () => {
			const chatId = useChatStore.getState().createChat();

			const activeChatId = chatSelectors.activeChatId(useChatStore.getState());
			expect(activeChatId).toBe(chatId);
		});

		it("should select messages for active chat", () => {
			const chatId = useChatStore.getState().createChat();
			useChatStore.getState().addMessage(chatId, createTestMessage("msg-1"));

			const messages = chatSelectors.messages(useChatStore.getState());
			expect(messages.length).toBe(1);
		});

		it("should return empty array for messages when no active chat", () => {
			const messages = chatSelectors.messages(useChatStore.getState());
			expect(messages).toEqual([]);
		});

		it("should select loading state", () => {
			useChatStore.getState().setLoading(true);

			const isLoading = chatSelectors.isLoading(useChatStore.getState());
			expect(isLoading).toBe(true);
		});

		it("should select error state", () => {
			useChatStore.getState().setError("Test error");

			const error = chatSelectors.error(useChatStore.getState());
			expect(error).toBe("Test error");
		});
	});
});
