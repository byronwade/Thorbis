"use client";

/**
 * Category Navigation Sync - Client Component
 *
 * Syncs URL params with Zustand navigation state
 * - Ensures sidebar highlights current category
 * - Keeps Zustand state in sync with URL-based navigation
 * - Enables both URL and sidebar navigation to work together
 *
 * Performance:
 * - Lightweight client component (only handles state sync)
 * - No UI rendering (returns null)
 * - Runs once on mount and when category changes
 */

import { useEffect } from "react";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";

type CategoryNavigationSyncProps = {
	categoryPath: string[];
};

export function CategoryNavigationSync({ categoryPath }: CategoryNavigationSyncProps) {
	const navigateToPath = usePriceBookStore((state) => state.navigateToPath);
	const currentPath = usePriceBookStore((state) => state.navigationPath);

	useEffect(() => {
		// Only update if path is different to avoid unnecessary renders
		const pathsMatch =
			currentPath.length === categoryPath.length && currentPath.every((segment, i) => segment === categoryPath[i]);

		if (!pathsMatch) {
			navigateToPath(categoryPath);
		}
	}, [categoryPath, currentPath, navigateToPath]);

	// This component doesn't render anything
	return null;
}
