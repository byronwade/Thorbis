import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { ContractDetailToolbarActions } from "@/components/work/contracts/contract-detail-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Contracts Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/contracts/[id]
 * Shows detail page with back button, toolbar actions, no sidebars
 *
 * Performance: Pure server component with client toolbar actions
 */
export default function ContractsDetailLayout({
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
				<DetailBackButton href="/dashboard/work/contracts" label="Contracts" />
			),
			actions: <ContractDetailToolbarActions />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/contracts/[id]">
			{children}
		</SectionLayout>
	);
}
