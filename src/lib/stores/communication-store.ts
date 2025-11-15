/**
 * Communication Store - Zustand state management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic re-renders only for components using this state
 * - Shares active tab state between page and toolbar
 * - Tracks selected message for detail view navigation
 */

import { create } from "zustand";

type MessageType = "email" | "sms" | "phone" | "ticket";
type ActiveFilter = MessageType | "all";
type ComposerType = "email" | "sms" | "call";
type MessageDirection = "sent" | "received";
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type ComposerContext = {
  customerId?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  threadId?: string;
  jobId?: string;
  propertyId?: string;
  invoiceId?: string;
  estimateId?: string;
};

export type PendingMessage = {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  content: string;
  timestamp: string;
  status: MessageStatus;
  contactName?: string;
  contactNumber?: string;
  contactNumberRaw?: string;
  customerId?: string;
};

type PendingMessageMap = Record<string, PendingMessage[]>;

type CommunicationStore = {
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  isDetailView: boolean;
  setIsDetailView: (isDetailView: boolean) => void;
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
  composer: {
    type: ComposerType | null;
    context?: ComposerContext;
  };
  openComposer: (type: ComposerType, context?: ComposerContext) => void;
  closeComposer: () => void;
  pendingMessages: PendingMessageMap;
  addPendingMessage: (message: PendingMessage) => void;
  resolvePendingMessage: (
    conversationId: string,
    messageId: string,
    replacement?: PendingMessage
  ) => void;
  resetPendingMessages: (conversationId: string) => void;
};

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  activeFilter: "all",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  selectedMessageId: null,
  setSelectedMessageId: (id) => set({ selectedMessageId: id }),
  isDetailView: false,
  setIsDetailView: (isDetailView) => set({ isDetailView }),
  activeThreadId: null,
  setActiveThreadId: (threadId) => set({ activeThreadId: threadId }),
  composer: {
    type: null,
  },
  openComposer: (type, context) =>
    set({
      composer: {
        type,
        context,
      },
    }),
  closeComposer: () =>
    set({
      composer: {
        type: null,
      },
    }),
  pendingMessages: {},
  addPendingMessage: (message) =>
    set((state) => {
      const existing = state.pendingMessages[message.conversationId] ?? [];
      return {
        pendingMessages: {
          ...state.pendingMessages,
          [message.conversationId]: [...existing, message],
        },
      };
    }),
  resolvePendingMessage: (conversationId, messageId, replacement) =>
    set((state) => {
      const current = state.pendingMessages[conversationId] ?? [];
      const filtered = current.filter((msg) => msg.id !== messageId);
      if (replacement) {
        filtered.push(replacement);
      }
      const nextPending =
        filtered.length > 0
          ? {
              ...state.pendingMessages,
              [conversationId]: filtered,
            }
          : Object.fromEntries(
              Object.entries(state.pendingMessages).filter(
                ([key]) => key !== conversationId
              )
            );
      return {
        pendingMessages: nextPending,
      };
    }),
  resetPendingMessages: (conversationId) =>
    set((state) => {
      if (!state.pendingMessages[conversationId]) {
        return { pendingMessages: state.pendingMessages };
      }
      const nextEntries = Object.entries(state.pendingMessages).filter(
        ([key]) => key !== conversationId
      );
      return {
        pendingMessages: Object.fromEntries(nextEntries),
      };
    }),
}));
