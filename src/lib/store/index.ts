/**
 * Central exports for all Zustand stores
 */

export type { PostsStore } from "./posts-store";
export { postsSelectors, usePostsStore } from "./posts-store";
export type { ExtractState, Store, StoreActions, StoreState } from "./types";
export type { UIStore } from "./ui-store";
export { uiSelectors, useUIStore } from "./ui-store";
// Export types
export type { UserStore } from "./user-store";
// Export stores
export { userSelectors, useUserStore } from "./user-store";

/**
 * Reset all stores to initial state
 * Useful for logout or clearing all state
 */
export const resetAllStores = () => {
  const stores = [
    require("./user-store").useUserStore,
    require("./ui-store").useUIStore,
    require("./posts-store").usePostsStore,
  ];

  for (const store of stores) {
    store.getState().reset?.();
  }
};
