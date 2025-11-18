"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CustomersToolbarActions } from "@/components/customers/customers-toolbar-actions";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

type CustomersSectionLayoutProps = {
	children: ReactNode;
};

// Define patterns for routes that should NOT have the main customers layout
// These are typically detail pages that have their own specific layouts
const DETAIL_PAGE_PATTERNS = [
	/^\/dashboard\/customers\/[^/]+$/, // Customer detail page
];

/**
 * Customers Section Layout - Client Component
 *
 * Conditionally applies the main customers layout (sidebar + toolbar)
 * only to the list page, and passes through for detail pages.
 *
 * This prevents nested layouts from composing incorrectly.
 */
export function CustomersSectionLayout({
	children,
}: CustomersSectionLayoutProps) {
	const pathname = usePathname() ?? "";

	// Check if the current pathname matches any detail page pattern
	const isDetailPage = DETAIL_PAGE_PATTERNS.some((pattern) =>
		pattern.test(pathname),
	);

	// If it's a detail page, just render children (the specific detail layout will apply)
	if (isDetailPage) {
		return <>{children}</>;
	}

	// Otherwise, apply the main customers section layout
	const config: UnifiedLayoutConfig = {
		structure: {
			maxWidth: "full",
			padding: "none",
			gap: "none",
			fixedHeight: true,
			variant: "default",
			background: "default",
			insetPadding: "none",
		},
		header: {
			show: true,
		},
		toolbar: {
			show: true,
			title: "Customers",
			subtitle: "Manage customer relationships and contacts",
			actions: <CustomersToolbarActions />,
		},
		sidebar: {
			show: true,
			variant: "standard",
		},
	};

	return (
		<SectionLayout config={config} pathname={pathname}>
			{children}
		</SectionLayout>
	);
}
