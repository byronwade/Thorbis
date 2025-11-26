"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Work Section Layout
 *
 * Wraps all /dashboard/work/* pages with SectionLayout
 * providing consistent sidebar and toolbar
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/work": {
		title: "Work",
		subtitle: "Company Management",
	},
	"/dashboard/work/companies": {
		title: "Companies",
		subtitle: "Manage platform companies",
	},
	"/dashboard/work/users": {
		title: "Users",
		subtitle: "Manage platform users",
	},
	"/dashboard/work/subscriptions": {
		title: "Subscriptions",
		subtitle: "Manage company subscriptions",
	},
	"/dashboard/work/support": {
		title: "Support Tickets",
		subtitle: "Manage support requests",
	},
	"/dashboard/work/onboarding": {
		title: "Onboarding",
		subtitle: "Track new company setup",
	},
	"/dashboard/work/help-center": {
		title: "Help Center",
		subtitle: "Manage documentation",
	},
};

export default function WorkLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/work";
	const pageInfo = pageTitles[pathname] ?? { title: "Work", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
