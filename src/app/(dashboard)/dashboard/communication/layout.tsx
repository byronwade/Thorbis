import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Communication Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/communication/*
 * Uses the unified layout configuration system with a static config
 * for consistent layout across communication routes.
 */
export default function CommunicationLayout({
	children,
}: {
	children: ReactNode;
}) {
	const config: UnifiedLayoutConfig = {
		structure: {
			maxWidth: "full",
			padding: "default",
			gap: "default",
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
