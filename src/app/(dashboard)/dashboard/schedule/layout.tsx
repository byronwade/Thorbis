import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import { ScheduleToolbarActions } from "@/components/schedule/schedule-toolbar-actions";
import { ScheduleToolbarTitle } from "@/components/schedule/schedule-toolbar-title";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Schedule Section Layout - Server Component
 *
 * Applies the unified dashboard chrome (header + toolbar) to the schedule routes
 * while still letting the actual scheduler occupy the full viewport height.
 */
export default function ScheduleLayout({ children }: { children: ReactNode }) {
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
			title: <ScheduleToolbarTitle />,
			actions: <ScheduleToolbarActions />,
		},
		sidebar: {
			show: false,
			variant: "standard",
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/schedule">
			{children}
		</SectionLayout>
	);
}
