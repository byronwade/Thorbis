"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Marketing Section Layout
 *
 * Wraps all /dashboard/marketing/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/marketing": {
		title: "Dashboard",
		subtitle: "Marketing overview",
	},
	"/dashboard/marketing/campaigns": {
		title: "Campaigns",
		subtitle: "Marketing campaigns",
	},
	"/dashboard/marketing/website": {
		title: "Website",
		subtitle: "Website management",
	},
	"/dashboard/marketing/blog": {
		title: "Blog",
		subtitle: "Blog content",
	},
	"/dashboard/marketing/email": {
		title: "Email Campaigns",
		subtitle: "Email marketing",
	},
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/marketing";
	const pageInfo = pageTitles[pathname] ?? { title: "Marketing", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
