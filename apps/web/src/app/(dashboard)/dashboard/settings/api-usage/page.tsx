/**
 * API Usage Dashboard Page
 *
 * Displays real-time API usage, costs, and health status.
 * Admin-only access for monitoring external service integrations.
 */

import { Suspense } from "react";
import { ApiUsageData } from "@/components/settings/api-usage/api-usage-data";
import { ApiUsageSkeleton } from "@/components/settings/api-usage/api-usage-skeleton";

// Force dynamic rendering - this page requires authentication and real-time data
export const dynamic = "force-dynamic";

export const metadata = {
	title: "API Usage & Costs | Settings",
	description:
		"Monitor API usage, costs, and service health across all integrations",
};

export default function ApiUsagePage() {
	return (
		<Suspense fallback={<ApiUsageSkeleton />}>
			<ApiUsageData />
		</Suspense>
	);
}
