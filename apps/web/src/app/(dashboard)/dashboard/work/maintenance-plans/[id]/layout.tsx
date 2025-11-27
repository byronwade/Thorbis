import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { MaintenancePlanDetailToolbarActions } from "@/components/work/maintenance-plans/maintenance-plan-detail-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Maintenance Plans Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/maintenance-plans/[id]
 * Shows detail page with back button, toolbar actions, no sidebars
 *
 * Performance: Pure server component with client toolbar actions
 */
export default function MaintenancePlansDetailLayout({
	children,
}: {
	children: ReactNode;
}) {
	const config: UnifiedLayoutConfig = {
		structure: {
			maxWidth: "7xl",
			padding: "lg",
			gap: "none",
			fixedHeight: false,
			variant: "detail",
			background: "default",
			insetPadding: "none",
		},
		header: {
			show: true,
		},
		toolbar: {
			show: true,
			back: (
				<DetailBackButton
					href="/dashboard/work/maintenance-plans"
					label="Maintenance Plans"
				/>
			),
			actions: <MaintenancePlanDetailToolbarActions />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout
			config={config}
			pathname="/dashboard/work/maintenance-plans/[id]"
		>
			{children}
		</SectionLayout>
	);
}
