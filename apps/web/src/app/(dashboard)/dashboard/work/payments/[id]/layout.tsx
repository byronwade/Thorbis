import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { PaymentDetailToolbarActions } from "@/components/work/payments/payment-detail-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Payments Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/payments/[id]
 * Shows detail page with back button, toolbar actions, no sidebars
 *
 * Performance: Pure server component with client toolbar actions
 */
export default function PaymentsDetailLayout({
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
				<DetailBackButton href="/dashboard/work/payments" label="Payments" />
			),
			actions: <PaymentDetailToolbarActions />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/payments/[id]">
			{children}
		</SectionLayout>
	);
}
