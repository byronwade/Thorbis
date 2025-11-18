/**
 * Team Presence Store - Real-time presence and typing indicators
 *
 * Features:
 * - Track which users are viewing which threads
 * - Typing indicators
 * - User online/offline status
 * - Activity timestamps
 */

import { create } from "zustand";

export interface UserPresence {
	userId: string;
	userName: string;
	userAvatar: string | null;
	threadId: string | null; // Which thread they're currently viewing
	lastSeen: Date;
	isOnline: boolean;
}

export interface TypingIndicator {
	userId: string;
	userName: string;
	threadId: string;
	startedAt: Date;
}

interface TeamPresenceState {
	// Active users and their current threads
	activeUsers: Map<string, UserPresence>;

	// Typing indicators
	typingUsers: Map<string, TypingIndicator>; // Key: userId-threadId

	// Current user's state
	currentUserId: string | null;
	currentThreadId: string | null;

	// Actions - Presence
	updateUserPresence: (presence: UserPresence) => void;
	removeUserPresence: (userId: string) => void;
	setCurrentUser: (
		userId: string,
		userName: string,
		userAvatar: string | null,
	) => void;

	// Actions - Current user thread viewing
	setCurrentThread: (threadId: string | null) => void;
	broadcastPresence: () => void; // To be called by real-time sync

	// Actions - Typing indicators
	setUserTyping: (userId: string, userName: string, threadId: string) => void;
	clearUserTyping: (userId: string, threadId: string) => void;
	clearAllTypingForThread: (threadId: string) => void;

	// Getters - Who's viewing a thread
	getUsersViewingThread: (threadId: string) => UserPresence[];
	isUserViewingThread: (userId: string, threadId: string) => boolean;

	// Getters - Typing indicators
	getTypingUsersForThread: (threadId: string) => TypingIndicator[];
	isAnyoneTypingInThread: (threadId: string) => boolean;

	// Getters - Online status
	getOnlineUsers: () => UserPresence[];
	getOnlineCount: () => number;

	// Cleanup - Remove stale presence
	cleanupStalePresence: (maxAgeMinutes?: number) => void;
}

const TYPING_TIMEOUT_MS = 3000; // Clear typing after 3 seconds of inactivity

export const useTeamPresenceStore = create<TeamPresenceState>((set, get) => ({
	// Initial state
	activeUsers: new Map(),
	typingUsers: new Map(),
	currentUserId: null,
	currentThreadId: null,

	// Presence management
	updateUserPresence: (presence) =>
		set((state) => {
			const newActiveUsers = new Map(state.activeUsers);
			newActiveUsers.set(presence.userId, {
				...presence,
				lastSeen: new Date(),
			});
			return { activeUsers: newActiveUsers };
		}),

	removeUserPresence: (userId) =>
		set((state) => {
			const newActiveUsers = new Map(state.activeUsers);
			newActiveUsers.delete(userId);

			// Also clear any typing indicators for this user
			const newTypingUsers = new Map(state.typingUsers);
			for (const [key, indicator] of newTypingUsers) {
				if (indicator.userId === userId) {
					newTypingUsers.delete(key);
				}
			}

			return {
				activeUsers: newActiveUsers,
				typingUsers: newTypingUsers,
			};
		}),

	setCurrentUser: (userId, userName, userAvatar) =>
		set({
			currentUserId: userId,
			activeUsers: new Map(get().activeUsers).set(userId, {
				userId,
				userName,
				userAvatar,
				threadId: get().currentThreadId,
				lastSeen: new Date(),
				isOnline: true,
			}),
		}),

	// Current user thread
	setCurrentThread: (threadId) =>
		set((state) => {
			const { currentUserId, activeUsers } = state;

			// Update current user's thread in presence
			if (currentUserId) {
				const currentUser = activeUsers.get(currentUserId);
				if (currentUser) {
					const updatedUser = {
						...currentUser,
						threadId,
						lastSeen: new Date(),
					};
					const newActiveUsers = new Map(activeUsers);
					newActiveUsers.set(currentUserId, updatedUser);
					return { currentThreadId: threadId, activeUsers: newActiveUsers };
				}
			}

			return { currentThreadId: threadId };
		}),

	broadcastPresence: () => {
		const { currentUserId, currentThreadId, activeUsers } = get();
		if (!currentUserId) return;

		const currentUser = activeUsers.get(currentUserId);
		if (currentUser) {
			// Update timestamp
			set((state) => {
				const newActiveUsers = new Map(state.activeUsers);
				newActiveUsers.set(currentUserId, {
					...currentUser,
					threadId: currentThreadId,
					lastSeen: new Date(),
				});
				return { activeUsers: newActiveUsers };
			});
		}
	},

	// Typing indicators
	setUserTyping: (userId, userName, threadId) =>
		set((state) => {
			const key = `${userId}-${threadId}`;
			const newTypingUsers = new Map(state.typingUsers);
			newTypingUsers.set(key, {
				userId,
				userName,
				threadId,
				startedAt: new Date(),
			});

			// Auto-clear after timeout
			setTimeout(() => {
				get().clearUserTyping(userId, threadId);
			}, TYPING_TIMEOUT_MS);

			return { typingUsers: newTypingUsers };
		}),

	clearUserTyping: (userId, threadId) =>
		set((state) => {
			const key = `${userId}-${threadId}`;
			const newTypingUsers = new Map(state.typingUsers);
			newTypingUsers.delete(key);
			return { typingUsers: newTypingUsers };
		}),

	clearAllTypingForThread: (threadId) =>
		set((state) => {
			const newTypingUsers = new Map(state.typingUsers);
			for (const [key, indicator] of newTypingUsers) {
				if (indicator.threadId === threadId) {
					newTypingUsers.delete(key);
				}
			}
			return { typingUsers: newTypingUsers };
		}),

	// Getters - Thread viewers
	getUsersViewingThread: (threadId) => {
		const { activeUsers, currentUserId } = get();
		const viewers: UserPresence[] = [];

		for (const [userId, presence] of activeUsers) {
			// Don't include current user
			if (userId === currentUserId) continue;

			if (presence.threadId === threadId && presence.isOnline) {
				viewers.push(presence);
			}
		}

		return viewers;
	},

	isUserViewingThread: (userId, threadId) => {
		const { activeUsers } = get();
		const user = activeUsers.get(userId);
		return user?.threadId === threadId && user?.isOnline === true;
	},

	// Getters - Typing indicators
	getTypingUsersForThread: (threadId) => {
		const { typingUsers, currentUserId } = get();
		const typing: TypingIndicator[] = [];

		for (const indicator of typingUsers.values()) {
			// Don't show current user typing to themselves
			if (indicator.userId === currentUserId) continue;

			if (indicator.threadId === threadId) {
				typing.push(indicator);
			}
		}

		return typing;
	},

	isAnyoneTypingInThread: (threadId) => {
		const typingUsers = get().getTypingUsersForThread(threadId);
		return typingUsers.length > 0;
	},

	// Getters - Online status
	getOnlineUsers: () => {
		const { activeUsers } = get();
		const onlineUsers: UserPresence[] = [];

		for (const presence of activeUsers.values()) {
			if (presence.isOnline) {
				onlineUsers.push(presence);
			}
		}

		return onlineUsers;
	},

	getOnlineCount: () => {
		return get().getOnlineUsers().length;
	},

	// Cleanup stale presence
	cleanupStalePresence: (maxAgeMinutes = 5) =>
		set((state) => {
			const now = new Date();
			const maxAgeMs = maxAgeMinutes * 60 * 1000;
			const newActiveUsers = new Map(state.activeUsers);

			for (const [userId, presence] of newActiveUsers) {
				const lastSeenMs = presence.lastSeen.getTime();
				const ageMs = now.getTime() - lastSeenMs;

				if (ageMs > maxAgeMs) {
					// Mark as offline instead of removing
					newActiveUsers.set(userId, { ...presence, isOnline: false });
				}
			}

			return { activeUsers: newActiveUsers };
		}),
}));

// Auto-cleanup stale presence every minute
if (typeof window !== "undefined") {
	setInterval(() => {
		useTeamPresenceStore.getState().cleanupStalePresence();
	}, 60000);
}
