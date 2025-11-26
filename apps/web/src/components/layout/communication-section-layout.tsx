"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

type CommunicationSectionLayoutProps = {
	children: ReactNode;
};

/**
 * Communication Section Layout - Client Component
 *
 * Conditionally applies communication section layout based on current pathname.
 * Mobile routes (/mobile) bypass the SectionLayout to avoid rendering the sidebar.
 *
 * This is a client component because we need usePathname() to determine
 * which layout to apply based on the current route.
 */
export function CommunicationSectionLayout({
	children,
}: CommunicationSectionLayoutProps) {
	const pathname = usePathname() ?? "";

	// Mobile routes should NOT get the desktop layout with sidebar
	const isMobileRoute = pathname.includes("/mobile");

	// If it's a mobile route, just render children without layout wrapper
	if (isMobileRoute) {
		return <>{children}</>;
	}

	// Desktop routes: use SectionLayout with sidebar
	const config: UnifiedLayoutConfig = {
		structure: {
			maxWidth: "full",
			padding: "none",
			gap: "none",
			fixedHeight: false,
			variant: "default",
			background: "default",
			insetPadding: "default",
		},
		header: {
			show: true,
		},
		toolbar: {
			show: false,
			title: null,
			actions: null,
		},
		sidebar: {
			show: true,
			variant: "communication",
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/communication">
			{children}
		</SectionLayout>
	);
}
