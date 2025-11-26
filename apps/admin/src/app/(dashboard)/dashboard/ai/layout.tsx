"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * AI Section Layout
 *
 * Wraps all /dashboard/ai/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/ai": {
		title: "AI Assistant",
		subtitle: "AI-powered tools",
	},
	"/dashboard/ai/automation": {
		title: "Automation",
		subtitle: "Automated workflows",
	},
};

export default function AILayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/ai";
	const pageInfo = pageTitles[pathname] ?? { title: "AI", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
