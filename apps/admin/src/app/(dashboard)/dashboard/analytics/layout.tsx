"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Analytics Section Layout
 *
 * Wraps all /dashboard/analytics/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/analytics": {
		title: "Overview",
		subtitle: "Platform analytics",
	},
	"/dashboard/analytics/usage": {
		title: "Usage Metrics",
		subtitle: "Platform usage",
	},
	"/dashboard/analytics/performance": {
		title: "Performance",
		subtitle: "System performance",
	},
	"/dashboard/analytics/companies": {
		title: "Company Analytics",
		subtitle: "Company insights",
	},
	"/dashboard/analytics/growth": {
		title: "Growth",
		subtitle: "Growth metrics",
	},
	"/dashboard/analytics/retention": {
		title: "Retention",
		subtitle: "Customer retention",
	},
};

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/analytics";
	const pageInfo = pageTitles[pathname] ?? { title: "Analytics", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
