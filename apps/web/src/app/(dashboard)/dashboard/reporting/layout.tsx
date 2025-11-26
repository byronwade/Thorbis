import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Reporting Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/reporting/*
 * Uses the unified layout configuration system with a static config
 * for consistent layout across reporting routes.
 *
 * Modeled after the communication hub layout.
 */
export default function ReportingLayout({ children }: { children: ReactNode }) {
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
			show: false, // We use a custom toolbar inside the page
			title: null,
			actions: null,
		},
		sidebar: {
			show: true,
			variant: "standard",
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/reporting">
			{children}
		</SectionLayout>
	);
}
