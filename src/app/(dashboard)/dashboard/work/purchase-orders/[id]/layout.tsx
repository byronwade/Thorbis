import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Purchase Orders Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/purchase-orders/[id]
 * Shows detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function PurchaseOrdersDetailLayout({
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
					href="/dashboard/work/purchase-orders"
					label="Purchase Orders"
				/>
			),
			// TODO: Create PurchaseOrderDetailToolbar component
			// actions: <PurchaseOrderDetailToolbar />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout
			config={config}
			pathname="/dashboard/work/purchase-orders/[id]"
		>
			{children}
		</SectionLayout>
	);
}
