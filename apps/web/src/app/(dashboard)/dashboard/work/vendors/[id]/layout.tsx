import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { VendorDetailToolbarActions } from "@/components/work/vendors/vendor-detail-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Vendors Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/vendors/[id]
 * Shows detail page with back button, toolbar actions, no sidebars
 *
 * Performance: Pure server component with client toolbar actions
 */
export default function VendorsDetailLayout({
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
			back: <DetailBackButton href="/dashboard/work/vendors" label="Vendors" />,
			actions: <VendorDetailToolbarActions />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/vendors/[id]">
			{children}
		</SectionLayout>
	);
}
