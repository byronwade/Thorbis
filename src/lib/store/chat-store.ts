// import type { UIMessage } from "ai";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Constants
const RANDOM_STRING_BASE = 36;
const RANDOM_STRING_LENGTH = 9;

// Types
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Chat = {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
};

export type ChatState = {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
};

export type ChatActions = {
  // Chat management
  createChat: (title?: string) => string;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  cleanupDuplicateChats: () => void;

  // Message management
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  clearMessages: (chatId: string) => void;

  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility
  getActiveChat: () => Chat | null;
  getChatMessages: (chatId: string) => Message[];
  reset: () => void;
};

export type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatStore>()(
  immer((set, get) => ({
    ...initialState,

    // Chat management
    createChat: (title = "New Chat") => {
      let chatId: string;
      const state = get();

      // Ensure unique ID by checking against existing chats
      do {
        chatId = `chat-${Date.now()}-${Math.random().toString(RANDOM_STRING_BASE).substr(2, RANDOM_STRING_LENGTH)}`;
      } while (state.chats.some((chat) => chat.id === chatId));

      set((storeState) => {
        storeState.chats.push({
          id: chatId,
          title,
          createdAt: new Date(),
          messages: [],
        });
        storeState.activeChatId = chatId;
      });
      return chatId;
    },

    deleteChat: (chatId: string) => {
      set((state) => {
        const index = state.chats.findIndex((c) => c.id === chatId);
        if (index !== -1) {
          state.chats.splice(index, 1);
        }
        if (state.activeChatId === chatId) {
          state.activeChatId = state.chats[0]?.id ?? null;
        }
      });
    },

    setActiveChat: (chatId: string | null) => {
      set((state) => {
        state.activeChatId = chatId;
      });
    },

    updateChatTitle: (chatId: string, title: string) => {
      set((state) => {
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          chat.title = title;
        }
      });
    },

    cleanupDuplicateChats: () => {
      set((state) => {
        const seen = new Set<string>();
        const uniqueChats: Chat[] = [];

        // Keep only the first occurrence of each chat ID
        for (const chat of state.chats) {
          if (!seen.has(chat.id)) {
            seen.add(chat.id);
            uniqueChats.push(chat);
          }
        }

        state.chats = uniqueChats;

        // If active chat was removed due to duplication, set to first chat or null
        if (
          state.activeChatId &&
          !uniqueChats.some((chat) => chat.id === state.activeChatId)
        ) {
          state.activeChatId = uniqueChats[0]?.id ?? null;
        }
      });
    },

    // Message management
    addMessage: (chatId: string, message: Message) => {
      set((state) => {
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          chat.messages.push(message);
        }
      });
    },

    updateMessage: (chatId: string, messageId: string, content: string) => {
      set((state) => {
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          const message = chat.messages.find((m) => m.id === messageId);
          if (message) {
            message.content = content;
          }
        }
      });
    },

    deleteMessage: (chatId: string, messageId: string) => {
      set((state) => {
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          const index = chat.messages.findIndex((m) => m.id === messageId);
          if (index !== -1) {
            chat.messages.splice(index, 1);
          }
        }
      });
    },

    clearMessages: (chatId: string) => {
      set((state) => {
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat) {
          chat.messages = [];
        }
      });
    },

    // UI state
    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error;
      });
    },

    // Utility
    getActiveChat: () => {
      const state = get();
      return state.chats.find((c) => c.id === state.activeChatId) ?? null;
    },

    getChatMessages: (chatId: string) => {
      const state = get();
      const chat = state.chats.find((c) => c.id === chatId);
      return chat?.messages ?? [];
    },

    reset: () => {
      set(initialState);
    },
  }))
);

// Selectors
export const chatSelectors = {
  chats: (state: ChatStore) => state.chats,
  activeChat: (state: ChatStore) =>
    state.chats.find((c) => c.id === state.activeChatId) ?? null,
  activeChatId: (state: ChatStore) => state.activeChatId,
  messages: (state: ChatStore) => {
    const activeChat = state.chats.find((c) => c.id === state.activeChatId);
    return activeChat?.messages ?? [];
  },
  isLoading: (state: ChatStore) => state.isLoading,
  error: (state: ChatStore) => state.error,
};
