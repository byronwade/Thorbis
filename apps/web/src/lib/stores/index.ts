/**
 * Central exports for all Zustand stores
 *
 * All stores are consolidated in this directory for better organization.
 * Import stores from this file for consistency.
 */

// Feature stores (already in src/lib/stores/)

export type { ChatStore } from "./chat-store";

// Core stores (moved from src/lib/store/)
export type { PostsStore } from "./posts-store";
// Schedule stores (moved from src/stores/)

export type { RoleStore, UserRole } from "./role-store";
export { useRoleStore } from "./role-store";
export type {
	ExtractState,
	Store,
	StoreActions,
	StoreState,
} from "./store-types";
export type { UIStore } from "./ui-store";
export { useUIStore } from "./ui-store";
export type { UserStore } from "./user-store";

export type { ViewFilters, ZoomLevel } from "./view-store";

/**
 * Reset all stores to initial state
 * Useful for logout or clearing all state
 */
const resetAllStores = () => {
	const stores = [
		require("./user-store").useUserStore,
		require("./ui-store").useUIStore,
		require("./posts-store").usePostsStore,
		require("./chat-store").useChatStore,
	];

	for (const store of stores) {
		store.getState().reset?.();
	}
};
