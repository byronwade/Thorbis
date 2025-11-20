"use client";

import { useEffect, useState } from "react";
import type { StatCard } from "@/components/ui/stats-cards";

/**
 * Hook to fetch stats for work pages
 * Uses optimistic loading - shows skeleton while loading, then updates
 */
export function useWorkPageStats(page: string): {
	stats: StatCard[];
	isLoading: boolean;
} {
	const [stats, setStats] = useState<StatCard[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			setIsLoading(true);
			try {
				const response = await fetch(`/api/work-stats/${page}`);
				if (response.ok) {
					const data = await response.json();
					setStats(data.stats || []);
				}
			} catch (error) {
				console.error(`Failed to fetch stats for ${page}:`, error);
				setStats([]);
			} finally {
				setIsLoading(false);
			}
		}

		fetchStats();
	}, [page]);

	return { stats, isLoading };
}
