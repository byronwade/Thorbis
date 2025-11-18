/**
 * Messages Store - Main state management for messaging feature
 *
 * Manages:
 * - Thread list and conversation data
 * - Selected thread state
 * - Real-time updates
 * - Optimistic UI updates
 */

import { create } from "zustand";
import type { Database } from "@/types/supabase";

type SmsMessage = Database["public"]["Tables"]["communications"]["Row"];
type MessageAssignment =
	Database["public"]["Tables"]["message_assignments"]["Row"];

export interface SmsThread {
	threadId: string;
	remotePhoneNumber: string;
	remoteName: string | null;
	customerId: string | null;
	lastMessage: string;
	lastMessageAt: Date;
	unreadCount: number;
	direction: "inbound" | "outbound";
	status: "open" | "pending" | "resolved" | "snoozed";
	priority: "low" | "normal" | "high" | "urgent";
	assignedTo: string | null; // team_member id
	assignedToName: string | null;
	snoozedUntil: Date | null;
	messages: SmsMessage[];
}

export interface MessagesFilters {
	status: "all" | "open" | "pending" | "resolved" | "snoozed" | "unassigned";
	assignedTo: "all" | "me" | "unassigned" | string; // "all", "me", "unassigned", or team_member id
	priority: "all" | "low" | "normal" | "high" | "urgent";
	search: string;
	hasAttachments: boolean | null;
}

interface MessagesState {
	// Thread data
	threads: SmsThread[];
	selectedThreadId: string | null;

	// Filters and search
	filters: MessagesFilters;

	// Loading states
	isLoadingThreads: boolean;
	isLoadingConversation: boolean;

	// Actions - Thread management
	setThreads: (threads: SmsThread[]) => void;
	updateThread: (threadId: string, updates: Partial<SmsThread>) => void;
	addThread: (thread: SmsThread) => void;
	removeThread: (threadId: string) => void;

	// Actions - Selection
	selectThread: (threadId: string | null) => void;

	// Actions - Messages
	addMessageToThread: (threadId: string, message: SmsMessage) => void;
	updateMessageInThread: (
		threadId: string,
		messageId: string,
		updates: Partial<SmsMessage>,
	) => void;
	removeMessageFromThread: (threadId: string, messageId: string) => void;

	// Actions - Filters
	setFilter: <K extends keyof MessagesFilters>(
		key: K,
		value: MessagesFilters[K],
	) => void;
	resetFilters: () => void;

	// Actions - Loading states
	setLoadingThreads: (loading: boolean) => void;
	setLoadingConversation: (loading: boolean) => void;

	// Computed getters
	getFilteredThreads: () => SmsThread[];
	getSelectedThread: () => SmsThread | null;
	getUnreadCount: () => number;
	getThreadById: (threadId: string) => SmsThread | null;
}

const defaultFilters: MessagesFilters = {
	status: "all",
	assignedTo: "all",
	priority: "all",
	search: "",
	hasAttachments: null,
};

export const useMessagesStore = create<MessagesState>((set, get) => ({
	// Initial state
	threads: [],
	selectedThreadId: null,
	filters: defaultFilters,
	isLoadingThreads: false,
	isLoadingConversation: false,

	// Thread management
	setThreads: (threads) => set({ threads }),

	updateThread: (threadId, updates) =>
		set((state) => ({
			threads: state.threads.map((thread) =>
				thread.threadId === threadId ? { ...thread, ...updates } : thread,
			),
		})),

	addThread: (thread) =>
		set((state) => {
			// Prevent duplicates
			const exists = state.threads.some((t) => t.threadId === thread.threadId);
			if (exists) {
				return {
					threads: state.threads.map((t) =>
						t.threadId === thread.threadId ? thread : t,
					),
				};
			}
			return { threads: [thread, ...state.threads] };
		}),

	removeThread: (threadId) =>
		set((state) => ({
			threads: state.threads.filter((t) => t.threadId !== threadId),
			selectedThreadId:
				state.selectedThreadId === threadId ? null : state.selectedThreadId,
		})),

	// Selection
	selectThread: (threadId) => set({ selectedThreadId: threadId }),

	// Message management within threads
	addMessageToThread: (threadId, message) =>
		set((state) => ({
			threads: state.threads.map((thread) => {
				if (thread.threadId !== threadId) return thread;

				// Prevent duplicates
				const exists = thread.messages.some((m) => m.id === message.id);
				if (exists) return thread;

				return {
					...thread,
					messages: [...thread.messages, message],
					lastMessage: message.body || thread.lastMessage,
					lastMessageAt: new Date(message.created_at),
					unreadCount:
						message.direction === "inbound" && !message.read_at
							? thread.unreadCount + 1
							: thread.unreadCount,
				};
			}),
		})),

	updateMessageInThread: (threadId, messageId, updates) =>
		set((state) => ({
			threads: state.threads.map((thread) => {
				if (thread.threadId !== threadId) return thread;

				return {
					...thread,
					messages: thread.messages.map((msg) =>
						msg.id === messageId ? { ...msg, ...updates } : msg,
					),
				};
			}),
		})),

	removeMessageFromThread: (threadId, messageId) =>
		set((state) => ({
			threads: state.threads.map((thread) => {
				if (thread.threadId !== threadId) return thread;

				return {
					...thread,
					messages: thread.messages.filter((msg) => msg.id !== messageId),
				};
			}),
		})),

	// Filters
	setFilter: (key, value) =>
		set((state) => ({
			filters: { ...state.filters, [key]: value },
		})),

	resetFilters: () => set({ filters: defaultFilters }),

	// Loading states
	setLoadingThreads: (loading) => set({ isLoadingThreads: loading }),
	setLoadingConversation: (loading) => set({ isLoadingConversation: loading }),

	// Computed getters
	getFilteredThreads: () => {
		const { threads, filters } = get();

		return threads.filter((thread) => {
			// Status filter
			if (filters.status !== "all") {
				if (filters.status === "unassigned") {
					if (thread.assignedTo !== null) return false;
				} else if (thread.status !== filters.status) {
					return false;
				}
			}

			// Assigned to filter
			if (filters.assignedTo !== "all") {
				if (filters.assignedTo === "unassigned") {
					if (thread.assignedTo !== null) return false;
				} else if (filters.assignedTo === "me") {
					// This will need current user ID from context
					// For now, just filter by assigned
					if (thread.assignedTo === null) return false;
				} else if (thread.assignedTo !== filters.assignedTo) {
					return false;
				}
			}

			// Priority filter
			if (filters.priority !== "all" && thread.priority !== filters.priority) {
				return false;
			}

			// Search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchesName = thread.remoteName
					?.toLowerCase()
					.includes(searchLower);
				const matchesPhone = thread.remotePhoneNumber.includes(filters.search);
				const matchesMessage = thread.lastMessage
					.toLowerCase()
					.includes(searchLower);

				if (!matchesName && !matchesPhone && !matchesMessage) {
					return false;
				}
			}

			// Has attachments filter
			if (filters.hasAttachments !== null) {
				const hasAttachments = thread.messages.some(
					(msg) => msg.attachment_count && msg.attachment_count > 0,
				);
				if (filters.hasAttachments !== hasAttachments) {
					return false;
				}
			}

			return true;
		});
	},

	getSelectedThread: () => {
		const { threads, selectedThreadId } = get();
		if (!selectedThreadId) return null;
		return threads.find((t) => t.threadId === selectedThreadId) || null;
	},

	getUnreadCount: () => {
		const { threads } = get();
		return threads.reduce((sum, thread) => sum + thread.unreadCount, 0);
	},

	getThreadById: (threadId) => {
		const { threads } = get();
		return threads.find((t) => t.threadId === threadId) || null;
	},
}));
