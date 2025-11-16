"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { shouldRenderHeader } from "@/lib/layout/dashboard-routes";

type ConditionalHeaderProps = {
	children: ReactNode;
};

/**
 * ConditionalHeader - Client Component Wrapper
 *
 * Wraps the AppHeader and conditionally renders it based on the current pathname.
 * Uses usePathname() to detect route changes and update visibility automatically.
 *
 * This ensures the header shows/hides correctly on client-side navigation
 * without requiring a hard refresh.
 */
export function ConditionalHeader({ children }: ConditionalHeaderProps) {
	const pathname = usePathname() ?? "";
	const showHeader = shouldRenderHeader(pathname);

	if (!showHeader) {
		return null;
	}

	return <>{children}</>;
}
