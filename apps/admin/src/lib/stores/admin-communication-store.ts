/**
 * Admin Communication Store - Zustand state management
 *
 * Manages communication state for the admin panel:
 * - Active filter (email, sms, call, ticket, all)
 * - Selected message for detail view
 * - Composer state (new message, reply, forward)
 * - Pending messages queue
 */

import { create } from "zustand";

type MessageType = "email" | "sms" | "call" | "voicemail" | "ticket";
type ActiveFilter = MessageType | "all";
type ComposerType = "email" | "sms" | "call";
type ComposerMode = "new" | "reply" | "reply-all" | "forward";
type MessageDirection = "inbound" | "outbound";
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type ComposerContext = {
	companyId?: string;
	companyName?: string;
	userId?: string;
	userName?: string;
	email?: string;
	phone?: string;
	threadId?: string;
	messageId?: string;
	subject?: string;
	originalContent?: string;
};

export type PendingMessage = {
	id: string;
	conversationId: string;
	direction: MessageDirection;
	content: string;
	timestamp: string;
	status: MessageStatus;
	contactName?: string;
	contactEmail?: string;
	contactPhone?: string;
	companyId?: string;
};

type PendingMessageMap = Record<string, PendingMessage[]>;

type AdminCommunicationStore = {
	// Filter state
	activeFilter: ActiveFilter;
	setActiveFilter: (filter: ActiveFilter) => void;

	// Selection state
	selectedMessageId: string | null;
	setSelectedMessageId: (id: string | null) => void;

	// View state
	isDetailView: boolean;
	setIsDetailView: (isDetailView: boolean) => void;
	activeThreadId: string | null;
	setActiveThreadId: (threadId: string | null) => void;

	// Composer state
	composer: {
		isOpen: boolean;
		type: ComposerType | null;
		mode: ComposerMode;
		context?: ComposerContext;
	};
	openComposer: (type: ComposerType, mode?: ComposerMode, context?: ComposerContext) => void;
	closeComposer: () => void;

	// Reply state
	replyMode: ComposerMode | null;
	setReplyMode: (mode: ComposerMode | null) => void;

	// Pending messages (optimistic updates)
	pendingMessages: PendingMessageMap;
	addPendingMessage: (message: PendingMessage) => void;
	resolvePendingMessage: (conversationId: string, messageId: string, replacement?: PendingMessage) => void;
	resetPendingMessages: (conversationId: string) => void;

	// Undo send state
	undoSend: {
		messageId: string | null;
		timeoutId: NodeJS.Timeout | null;
		secondsRemaining: number;
	};
	setUndoSend: (messageId: string | null, timeoutId?: NodeJS.Timeout | null) => void;
	decrementUndoTimer: () => void;
	cancelUndoSend: () => void;
};

export const useAdminCommunicationStore = create<AdminCommunicationStore>((set, get) => ({
	// Filter state
	activeFilter: "all",
	setActiveFilter: (filter) => set({ activeFilter: filter }),

	// Selection state
	selectedMessageId: null,
	setSelectedMessageId: (id) => set({ selectedMessageId: id }),

	// View state
	isDetailView: false,
	setIsDetailView: (isDetailView) => set({ isDetailView }),
	activeThreadId: null,
	setActiveThreadId: (threadId) => set({ activeThreadId: threadId }),

	// Composer state
	composer: {
		isOpen: false,
		type: null,
		mode: "new",
	},
	openComposer: (type, mode = "new", context) => {
		set({
			composer: {
				isOpen: true,
				type,
				mode,
				context,
			},
		});
	},
	closeComposer: () =>
		set({
			composer: {
				isOpen: false,
				type: null,
				mode: "new",
			},
		}),

	// Reply state
	replyMode: null,
	setReplyMode: (mode) => set({ replyMode: mode }),

	// Pending messages
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
					: Object.fromEntries(Object.entries(state.pendingMessages).filter(([key]) => key !== conversationId));
			return {
				pendingMessages: nextPending,
			};
		}),
	resetPendingMessages: (conversationId) =>
		set((state) => {
			if (!state.pendingMessages[conversationId]) {
				return { pendingMessages: state.pendingMessages };
			}
			const nextEntries = Object.entries(state.pendingMessages).filter(([key]) => key !== conversationId);
			return {
				pendingMessages: Object.fromEntries(nextEntries),
			};
		}),

	// Undo send state
	undoSend: {
		messageId: null,
		timeoutId: null,
		secondsRemaining: 5,
	},
	setUndoSend: (messageId, timeoutId = null) =>
		set({
			undoSend: {
				messageId,
				timeoutId,
				secondsRemaining: 5,
			},
		}),
	decrementUndoTimer: () =>
		set((state) => ({
			undoSend: {
				...state.undoSend,
				secondsRemaining: Math.max(0, state.undoSend.secondsRemaining - 1),
			},
		})),
	cancelUndoSend: () => {
		const { undoSend } = get();
		if (undoSend.timeoutId) {
			clearTimeout(undoSend.timeoutId);
		}
		set({
			undoSend: {
				messageId: null,
				timeoutId: null,
				secondsRemaining: 5,
			},
		});
	},
}));
