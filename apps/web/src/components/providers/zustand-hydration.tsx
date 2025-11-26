"use client";

/**
 * Zustand Hydration Provider
 *
 * CRITICAL FIX for Next.js 16 + Zustand persist hydration issues.
 *
 * Problem:
 * - Zustand persist was auto-rehydrating during Next.js Server Component hydration
 * - This caused hydration mismatches
 * - Next.js 16's cacheComponents detected mismatches and triggered continuous POST requests
 * - Result: Infinite loop of revalidation (50+ POST requests per page load)
 *
 * Solution:
 * - All Zustand stores now have `skipHydration: true`
 * - This component manually rehydrates AFTER Next.js hydration completes
 * - Prevents hydration mismatches and infinite loops
 *
 * References:
 * - https://github.com/pmndrs/zustand/issues/938
 * - https://docs.pmnd.rs/zustand/integrations/persisting-store-data#hydration-and-asynchronous-storages
 */

import { useEffect, useRef } from "react";
import { useRoleStore } from "@/lib/stores/role-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { useSidebarStateStore } from "@/lib/stores/sidebar-state-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useViewStore } from "@/lib/stores/view-store";
import { useWorkViewStore } from "@/lib/stores/work-view-store";

// Global flag to ensure hydration only happens ONCE per session
let hasHydrated = false;

export function ZustandHydration() {
	const hasRun = useRef(false);

	useEffect(() => {
		// CRITICAL: Only hydrate ONCE globally, never on re-mounts or navigations
		if (hasRun.current || hasHydrated) {
			return;
		}

		hasRun.current = true;
		hasHydrated = true;

		// Manually rehydrate all persisted stores AFTER Next.js hydration completes
		// This happens once on client mount, preventing hydration mismatches

		// View/UI stores
		useWorkViewStore.persist.rehydrate();
		useScheduleViewStore.persist.rehydrate();
		useViewStore.persist.rehydrate();
		useSidebarStateStore.persist.rehydrate();
		useUIStore.persist.rehydrate();
		useUserStore.persist.rehydrate();
		useRoleStore.persist.rehydrate(); // CRITICAL: Dashboard depends on this

		// Filter stores rehydrate automatically (less critical for hydration)
		// Add more stores here if needed
	}, []);

	return null; // This component renders nothing
}
