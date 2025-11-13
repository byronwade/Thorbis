/**
 * Base store types and utilities for Zustand stores
 */

/**
 * Generic store state with reset functionality
 */
export type StoreState = {
  _hasHydrated?: boolean;
  setHasHydrated?: (hasHydrated: boolean) => void;
};

/**
 * Store actions interface
 */
export type StoreActions = {
  reset?: () => void;
};

/**
 * Complete store with state and actions
 */
export type Store<T extends StoreState> = T & StoreActions;

/**
 * Extract state from store (without actions)
 */
export type ExtractState<S> = Omit<
  S,
  keyof StoreActions | "_hasHydrated" | "setHasHydrated"
>;
