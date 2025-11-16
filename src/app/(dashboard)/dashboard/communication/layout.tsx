import type { ReactNode } from "react";
import { CommunicationToolbarActions } from "@/components/communication/communication-toolbar-actions";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Communication Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/communication/*
 * Matches the configuration from unified-layout-config.tsx for COMMUNICATION
 *
 * Performance: Pure server component, no client JS needed
 */
export default function CommunicationLayout({
	children,
}: {
	children: ReactNode;
}) {
	// Communication section configuration
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
			title: "Communications",
			actions: <CommunicationToolbarActions />,
		},
		sidebar: {
			show: true,
			variant: "standard",
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/communication">
			{children}
		</SectionLayout>
	);
}
