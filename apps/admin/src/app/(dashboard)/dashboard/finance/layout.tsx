"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Finance Section Layout
 *
 * Wraps all /dashboard/finance/* pages with SectionLayout
 */

const pageTitles: Record<string, { title: string; subtitle: string }> = {
	"/dashboard/finance": {
		title: "Dashboard",
		subtitle: "Financial overview",
	},
	"/dashboard/finance/revenue": {
		title: "Revenue",
		subtitle: "Revenue analytics",
	},
	"/dashboard/finance/invoices": {
		title: "Invoices",
		subtitle: "Invoice management",
	},
	"/dashboard/finance/subscriptions": {
		title: "Subscriptions",
		subtitle: "Subscription management",
	},
	"/dashboard/finance/payments": {
		title: "Payments",
		subtitle: "Payment history",
	},
};

export default function FinanceLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "/dashboard/finance";
	const pageInfo = pageTitles[pathname] ?? { title: "Finance", subtitle: "" };

	return (
		<SectionLayout title={pageInfo.title} subtitle={pageInfo.subtitle}>
			{children}
		</SectionLayout>
	);
}
