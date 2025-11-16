/**
 * Toolbar Actions Store
 *
 * Manages dynamic toolbar actions for detail pages
 * Allows server components to pass actions through client components to the toolbar
 */

import type { ReactNode } from "react";
import { create } from "zustand";

type ToolbarActionsState = {
	/** Map of pathname to actions */
	actions: Record<string, ReactNode>;

	/** Set actions for a specific route */
	setActions: (pathname: string, actions: ReactNode) => void;

	/** Clear actions for a specific route */
	clearActions: (pathname: string) => void;

	/** Clear all actions */
	clearAll: () => void;
};

export const useToolbarActionsStore = create<ToolbarActionsState>((set) => ({
	actions: {},

	setActions: (pathname, actions) =>
		set((state) => ({
			actions: {
				...state.actions,
				[pathname]: actions,
			},
		})),

	clearActions: (pathname) =>
		set((state) => {
			const newActions = { ...state.actions };
			delete newActions[pathname];
			return { actions: newActions };
		}),

	clearAll: () => set({ actions: {} }),
}));
