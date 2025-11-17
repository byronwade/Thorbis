import type { ReactNode } from "react";
import { DetailBackButton } from "@/components/layout/detail-back-button";
import { SectionLayout } from "@/components/layout/section-layout";
import { InvoiceToolbarActions } from "@/components/work/invoice-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Invoice Detail Layout - Server Component
 *
 * This layout applies to /dashboard/work/invoices/[id]
 * Shows full-width detail page with back button, no sidebars
 *
 * Performance: Pure server component, no client JS needed
 */
export default function InvoiceDetailLayout({ children }: { children: ReactNode }) {
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
			back: <DetailBackButton href="/dashboard/work/invoices" label="Invoices" />,
			actions: <InvoiceToolbarActions />,
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/invoices/[id]">
			{children}
		</SectionLayout>
	);
}
