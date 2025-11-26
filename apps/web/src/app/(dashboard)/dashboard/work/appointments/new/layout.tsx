import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import { DynamicBackButton } from "@/components/work/appointments/dynamic-back-button";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Appointments New Layout - Server Component
 *
 * This layout applies to /dashboard/work/appointments/new
 * Shows creation page with dynamic back button
 *
 * Performance: Pure server component, no client JS needed
 */
export default function AppointmentsNewLayout({
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
			back: <DynamicBackButton />,
			title: "Create Appointment",
		},
		sidebar: {
			show: false,
		},
	};

	return (
		<SectionLayout config={config} pathname="/dashboard/work/appointments/new">
			{children}
		</SectionLayout>
	);
}
