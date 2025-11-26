"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Schedule Section Layout
 *
 * Wraps all /dashboard/schedule/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/schedule": {
		title: "Team Calendar",
		subtitle: "Thorbis team schedule",
	},
	"/dashboard/schedule/team": {
		title: "Team Members",
		subtitle: "Manage team",
	},
	"/dashboard/schedule/time-off": {
		title: "Time Off",
		subtitle: "Manage time off requests",
	},
};

export default function ScheduleLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/schedule";
	const pageInfo = pageTitles[pathname] ?? { title: "Schedule", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
