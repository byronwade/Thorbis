import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import { InvoicesListToolbarActions } from "@/components/work/invoices-list-toolbar-actions";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Invoices List Layout - Server Component
 *
 * This layout applies to /dashboard/work/invoices (list page)
 * Detail pages (/dashboard/work/invoices/[id]) have their own layout
 *
 * Performance: Pure server component, no client JS needed
 */
export default function InvoicesLayout({ children }: { children: ReactNode }) {
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
			title: "Invoices",
			subtitle: "Create, track, and manage customer invoices",
			actions: <InvoicesListToolbarActions />,
		},
		sidebar: {
			show: true,
			variant: "standard",
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/invoices">
			{children}
		</SectionLayout>
	);
}
