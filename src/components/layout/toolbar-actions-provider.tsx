"use client";

/**
 * ToolbarActionsProvider - Client Component
 *
 * Allows server components (pages) to set toolbar actions dynamically
 * Similar to ToolbarStatsProvider but for action buttons
 *
 * Usage: Wrap page content with this component and pass actions
 */

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { useToolbarActionsStore } from "@/lib/stores/toolbar-actions-store";

type ToolbarActionsProviderProps = {
	actions?: React.ReactNode;
	children: React.ReactNode;
};

export function ToolbarActionsProvider({ actions, children }: ToolbarActionsProviderProps) {
	const pathname = usePathname();
	const safePathname = pathname || "/dashboard";
	const setActions = useToolbarActionsStore((state) => state.setActions);
	const clearActions = useToolbarActionsStore((state) => state.clearActions);

	// Use useLayoutEffect to set actions synchronously before paint
	// This ensures actions are available when LayoutWrapper reads them
	useLayoutEffect(() => {
		if (actions) {
			setActions(safePathname, actions);
		} else {
			clearActions(safePathname);
		}

		// Cleanup: clear actions when component unmounts or pathname changes
		return () => {
			clearActions(safePathname);
		};
	}, [safePathname, actions, setActions, clearActions]);

	return <>{children}</>;
}
