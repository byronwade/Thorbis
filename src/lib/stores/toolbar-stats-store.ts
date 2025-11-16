/**
 * Toolbar Stats Store
 *
 * Zustand store for managing toolbar statistics across pages
 * Allows pages to dynamically set stats that will be displayed in the toolbar
 */

import { create } from "zustand";
import type { StatCard } from "@/components/ui/stats-cards";

type ToolbarStatsState = {
	stats: Record<string, StatCard[] | undefined>;
	setStats: (pathname: string, stats: StatCard[] | undefined) => void;
	getStats: (pathname: string) => StatCard[] | undefined;
	clearStats: (pathname: string) => void;
};

export const useToolbarStatsStore = create<ToolbarStatsState>((set, get) => ({
	stats: {},
	setStats: (pathname, stats) =>
		set((state) => ({
			stats: { ...state.stats, [pathname]: stats },
		})),
	getStats: (pathname) => get().stats[pathname],
	clearStats: (pathname) =>
		set((state) => {
			const { [pathname]: _, ...rest } = state.stats;
			return { stats: rest };
		}),
}));
