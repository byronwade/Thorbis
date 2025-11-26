"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Settings Section Layout
 *
 * Wraps all /dashboard/settings/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/settings": {
		title: "Overview",
		subtitle: "Platform settings",
	},
	"/dashboard/settings/profile": {
		title: "Profile",
		subtitle: "Your profile",
	},
	"/dashboard/settings/security": {
		title: "Security",
		subtitle: "Security settings",
	},
	"/dashboard/settings/general": {
		title: "General",
		subtitle: "General settings",
	},
	"/dashboard/settings/billing": {
		title: "Billing",
		subtitle: "Billing settings",
	},
	"/dashboard/settings/integrations": {
		title: "Integrations",
		subtitle: "Third-party integrations",
	},
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/settings";
	const pageInfo = pageTitles[pathname] ?? { title: "Settings", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
